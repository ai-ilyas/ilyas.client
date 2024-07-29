import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserId } from "./auth";
import { checkIfStringIsNotOutOfLimits } from "./validator.helper";
import { Id } from "./_generated/dataModel";
import { APPLICATIONS_TABLE, APPLICATION_TAGS_TABLE, INTERFACES_TABLE } from "./tableNames";
import { getAll, getManyVia } from "convex-helpers/server/relationships";
import { ITag } from "./tags";
import { IInterface } from "./interfaces";

export interface IApplication
{
  _id: Id<"applications">;
  _creationTime: number;
  description?: string;
  name: string;
  userId: Id<"users">;
  editionTime: number;
  tags?: ITag[];
  interfaces?: IInterface[];
  technicalOwner?: string;
  businessOwner?: string;
  numberOfUsers?: string;
  parentApplicationId?: Id<"applications">;
} 

export const list = query({
  args: { },
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    console.log(userId);

    // #010 SERVER Get application only when current userId match with userId in Application Table
    const applications = await ctx.db.query(APPLICATIONS_TABLE).withIndex("byUserId", (q) => q.eq("userId", userId!)).collect();

    return applications.sort((a, b) => b.editionTime - a.editionTime);
  },
});

export const findOne = query({
  args: { id: v.string() },
  handler: async (ctx, { id}) => {
    const userId = await getUserId(ctx);
    console.log(userId);
    const _id = id as Id<"applications">;
    const application = await ctx.db.get(_id);
    
    // #010 SERVER Get application only when current userId match with userId in Application Table
    if (application?.userId !== userId) throw new Error("applications.findOne - Method not allowed.");
    const tags = await getManyVia(ctx.db, APPLICATION_TAGS_TABLE, "tagId", "byApplicationId", _id, "applicationId");

    const interfaces = await ctx.db
      .query(INTERFACES_TABLE)
      .withIndex("byApplicationId", q => q.eq("applicationId", _id).eq("userId", userId!))
      .collect();

    return { ...application, tags, interfaces } as IApplication;
  },
});

export const insert = mutation({
  args: { name: v.string() },
  returns: v.id(APPLICATIONS_TABLE),
  handler: async (ctx, { name }) => {
    const userId = (await getUserId(ctx, true))!;

    // #040 CLIENT SERVER Application name length should be between 3 and 50 characters 
    checkIfStringIsNotOutOfLimits(name, { min: 3, max:50 });

    // #041 CLIENT SERVER the combination Application name/userId must be unique
    const existingApp = await ctx.db.query(APPLICATIONS_TABLE).withIndex("byName", (q) => q.eq("name", name).eq("userId", userId!)).first();
    if (existingApp) throw new Error("applications.insert - Name already used.")

    // #030 SERVER When Insert application current userId is the userId in Application Table
    const appId = await ctx.db.insert(APPLICATIONS_TABLE, { name, userId, editionTime: Date.now() });
    console.log(appId);
    return appId;
  },
});

export const patch = mutation({
  args: { 
    _id: v.id(APPLICATIONS_TABLE), 
    name: v.string(), 
    description: v.optional(v.string()),
    businessOwner: v.optional(v.string()), 
    technicalOwner: v.optional(v.string()), 
    numberOfUsers: v.optional(v.string()) 
  },
  handler: async (ctx, { _id, name, description, businessOwner, technicalOwner, numberOfUsers }) => {    
    // #040 CLIENT SERVER Application name length should be between 3 and 50 characters 
    checkIfStringIsNotOutOfLimits(name, { min: 3, max:50 });
    
    // #070 CLIENT SERVER Fields length for Technical Owner, Business Owner and NumberOfUsers should be 50 characters maximum
    checkIfStringIsNotOutOfLimits(businessOwner, { max:50 });
    checkIfStringIsNotOutOfLimits(technicalOwner, { max:50 });
    checkIfStringIsNotOutOfLimits(numberOfUsers, { max:50 });
    
    // #050 CLIENT SERVER Application description length should be lower than 500 characters 
    checkIfStringIsNotOutOfLimits(description, { max:500 });

    const userId = (await getUserId(ctx, true))!;
    const applicationToUpdate = await ctx.db.get(_id);
    // #020 SERVER Insert or Update application only when current userId match with userId in Application Table
    if (userId !== applicationToUpdate?.userId) throw new Error("applications.patch - Method not allowed.")

    // #041 CLIENT SERVER the combination Application name/userId must be unique
    const existingApp = await ctx.db.query(APPLICATIONS_TABLE).withIndex("byName", (q) => q.eq("name", name).eq("userId", userId!)).filter((q) => q.neq(q.field("_id"), _id)).first();
    if (existingApp) throw new Error("applications.patch - Name already used.")

    await ctx.db.patch(_id, { name, description, editionTime: Date.now(), businessOwner, technicalOwner, numberOfUsers });
  },
});

export const updateParentApplication = mutation({
  args: { 
    _id: v.id(APPLICATIONS_TABLE), 
    parentApplicationId: v.optional(v.string()),
    name: v.optional(v.string()),
    description: v.optional(v.string())
  },
  handler: async (ctx, { _id, parentApplicationId, name, description, }) => {
    // #080 CLIENT SERVER Application cannot be its own parent application
    if (_id === parentApplicationId) throw new Error("applications.updateParentApplication - Application cannot be its own parent application.")
    
      const userId = (await getUserId(ctx, true))!;
    const applicationToUpdate = await ctx.db.get(_id);
    // #020 SERVER Insert or Update application only when current userId match with userId in Application Table
    if (userId !== applicationToUpdate?.userId) throw new Error("applications.updateParentApplication - Method not allowed.")
    let _parentApplicationId;

    if (parentApplicationId)
    {
      _parentApplicationId = parentApplicationId as Id<"applications">;
    } else
    {
      if (!name) throw new Error("applications.updateParentApplication - Name cannot be null.");

      // #040 CLIENT SERVER Application name length should be between 3 and 50 characters 
      checkIfStringIsNotOutOfLimits(name, { min: 3, max:50 });
      
      // #050 CLIENT SERVER Application description length should be lower than 500 characters 
      checkIfStringIsNotOutOfLimits(description, { max:500 });

      // #041 CLIENT SERVER the combination Application name/userId must be unique
      const existingApp = await ctx.db.query(APPLICATIONS_TABLE).withIndex("byName", (q) => q.eq("name", name!).eq("userId", userId!)).first();
      if (existingApp) throw new Error("applications.insert - Name already used.")

      // #030 SERVER When Insert application current userId is the userId in Application Table
      _parentApplicationId = await ctx.db.insert(APPLICATIONS_TABLE, { name: name!, userId, editionTime: Date.now() });

    }
    await ctx.db.patch(_id, { parentApplicationId: _parentApplicationId, editionTime: Date.now() });
  },
});

export const removeParentApplication = mutation({
  args: { _id: v.id(APPLICATIONS_TABLE) },
  handler: async (ctx, { _id }) => {
    const userId = (await getUserId(ctx, true))!;
    const applicationToUpdate = await ctx.db.get(_id);
    // #020 SERVER Insert or Update application only when current userId match with userId in Application Table
    if (userId !== applicationToUpdate?.userId) throw new Error("applications.removeParentApplication - Method not allowed.")

    await ctx.db.patch(_id, { parentApplicationId: undefined, editionTime: Date.now() });
  },
});

export const addChildrenApplications = mutation({
  args: { 
    parentApplicationId: v.id(APPLICATIONS_TABLE), 
    childrenApplicationsIds: v.optional(v.array(v.string())),
    name: v.optional(v.string()),
    description: v.optional(v.string())
  },
  handler: async (ctx, { parentApplicationId, childrenApplicationsIds, name, description, }) => {
    const userId = (await getUserId(ctx, true))!;
    const parentApplication = await ctx.db.get(parentApplicationId);
    // #020 SERVER Insert or Update application only when current userId match with userId in Application Table
    if (userId !== parentApplication?.userId) throw new Error("applications.addChildrenApplications - Method not allowed.")

    if (childrenApplicationsIds){
      // #080 CLIENT SERVER Application cannot be its own parent application
      if (childrenApplicationsIds.some(x => parentApplicationId === x as Id<"applications">)) throw new Error("applications.updateParentApplication - Application cannot be its own parent application.")
    
      const applicationsToUpdate = await getAll(ctx.db, childrenApplicationsIds.map(x => x as Id<"applications">));
      // #020 SERVER Insert or Update application only when current userId match with userId in Application Table
      if (applicationsToUpdate.some(x => x?.userId !== userId)) throw new Error("applications.addChildrenApplications - Method not allowed.")
    }
    if (name)
      {
        // #040 CLIENT SERVER Application name length should be between 3 and 50 characters 
        checkIfStringIsNotOutOfLimits(name, { min: 3, max:50 });
        
        // #050 CLIENT SERVER Application description length should be lower than 500 characters 
        checkIfStringIsNotOutOfLimits(description, { max:500 });
  
        // #041 CLIENT SERVER the combination Application name/userId must be unique
        const existingApp = await ctx.db.query(APPLICATIONS_TABLE).withIndex("byName", (q) => q.eq("name", name!).eq("userId", userId!)).first();
        if (existingApp) throw new Error("applications.insert - Name already used.")
      }

    if (childrenApplicationsIds && childrenApplicationsIds.length > 0){
      childrenApplicationsIds.map(async x => await ctx.db.patch(x as Id<"applications">, { parentApplicationId, editionTime: Date.now() }));
    }
    if (name){
      // #030 SERVER When Insert application current userId is the userId in Application Table
      await ctx.db.insert(APPLICATIONS_TABLE, { name: name!, userId, parentApplicationId, editionTime: Date.now() });
    }    
  },
});
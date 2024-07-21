import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserId } from "./auth";
import { checkIfStringIsNotOutOfLimits } from "./validator.helper";
import { Id } from "./_generated/dataModel";
import { APPLICATIONS_TABLE, APPLICATION_TAGS_TABLE, TAGS_TABLE } from "./tableNames";
import { getManyVia } from "convex-helpers/server/relationships";
import { ITag } from "./tags";

export interface IApplication
{
  _id: Id<"applications">;
  _creationTime: number;
  description?: string | undefined;
  name: string;
  userId: Id<"users">;
  editionTime: number;
  tags?: ITag[];
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
    return { ...application, tags } as IApplication;
  },
});

export const insert = mutation({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    const userId = (await getUserId(ctx, true))!;

    // #040 CLIENT SERVER Application name length should be between 3 and 50 characters 
    checkIfStringIsNotOutOfLimits(name, { min: 3, max:50 });
    
    // #030 SERVER When Insert application current userId is the userId in Application Table
    const appId = await ctx.db.insert(APPLICATIONS_TABLE, { name, userId, editionTime: Date.now() });
    console.log(appId);
    return appId;
  },
});

export const patch = mutation({
  args: { _id: v.id(APPLICATIONS_TABLE), name: v.string(), description: v.optional(v.string()) },
  handler: async (ctx, { _id, name, description }) => {    
    // #040 CLIENT SERVER Application name length should be between 3 and 50 characters 
    checkIfStringIsNotOutOfLimits(name, { min: 3, max:50 })
    
    // #050 CLIENT SERVER Application description length should be lower than 500 characters 
    checkIfStringIsNotOutOfLimits(description, { max:500 });
    const userId = (await getUserId(ctx, true))!;
    const applicationToUpdate = await ctx.db.get(_id);
    // #020 SERVER Insert or Update application only when current userId match with userId in Application Table
    if (userId !== applicationToUpdate?.userId) throw new Error("applications.patch - Method not allowed.")
    await ctx.db.patch(_id, { name, description, editionTime: Date.now() });
  },
});
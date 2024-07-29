import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserId } from "./auth";
import { checkIfStringIsNotOutOfLimits, checkUserIdsMatch } from "./validator.helper";
import { DataModel, Id } from "./_generated/dataModel";
import { APPLICATIONS_TABLE, INTERFACES_TABLE, TAGS_TABLE } from "./tableNames";
import { GenericMutationCtx } from "convex/server";

export interface IInterface
{
    _id: Id<"interfaces">;
    _creationTime: number;
    editionTime: number;
    name: string,
    description?: string,
    direction: "outgoing" | "incoming" | "bi-directional",
    itComponentId?: Id<"tags">,
    dataObjectId?: Id<"tags">,
    volumetry?: string,
    userId: string,
    applicationId: Id<"applications">,
    frequence?: "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "on demand" | "real-time"
} 

export const list = query({
  args: { },
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    console.log(userId);

    // #010 SERVER Get interface only when current userId match with userId in Application Table
    const interfaces = await ctx.db.query(INTERFACES_TABLE).withIndex("byUserId", (q) => q.eq("userId", userId!)).collect();

    return interfaces.sort((a, b) => b.editionTime - a.editionTime);
  },
});

export const findOne = query({
  args: { id: v.string() },
  handler: async (ctx, { id}) => {
    const userId = await getUserId(ctx);
    console.log(userId);
    const _id = id as Id<"interfaces">;
    const interface_ = await ctx.db.get(_id);
    
    // #010 SERVER Get interface only when current userId match with userId in Application Table
    if (interface_?.userId !== userId) throw new Error("interfaces.findOne - Method not allowed.");
    return { ...interface_ } as IInterface;
  },
});

export const insert = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    direction: v.union(
      v.literal("outgoing"),
      v.literal("incoming"),
      v.literal("bi-directional"),
    ),
    itComponentId: v.optional(v.string()),
    dataObjectId: v.optional(v.string()),
    volumetry: v.optional(v.string()),
    applicationId: v.id(APPLICATIONS_TABLE),
    frequence: v.optional(v.union(
      v.literal("hourly"),
      v.literal("daily"),
      v.literal("weekly"),
      v.literal("monthly"),
      v.literal("yearly"),
      v.literal("on demand"),
      v.literal("real-time"),
    ))},
  returns: v.id(INTERFACES_TABLE),
  handler: async (ctx, { name, description, direction, itComponentId, dataObjectId, volumetry, applicationId, frequence }) => {
    const userId = (await getUserId(ctx, true))!;

    await validateInterface(ctx, name, description, userId, applicationId, itComponentId as Id<"tags">, dataObjectId as Id<"tags">);       

    // #030 SERVER When Insert interface current userId is the userId in Interface Table
    const interfaceId = await ctx.db.insert(INTERFACES_TABLE, 
        { name, description, direction, itComponentId: itComponentId as Id<"tags">, dataObjectId: dataObjectId as Id<"tags">, volumetry, applicationId, frequence, userId, editionTime: Date.now() });
    console.log(interfaceId);
    return interfaceId;
  },
});

export const patch = mutation({
  args: {
    _id: v.id(INTERFACES_TABLE),
    name: v.string(),
    description: v.optional(v.string()),
    direction: v.union(
      v.literal("outgoing"),
      v.literal("incoming"),
      v.literal("bi-directional"),
    ),
    itComponentId: v.optional(v.id(TAGS_TABLE)),
    dataObjectId: v.optional(v.id(TAGS_TABLE)),
    volumetry: v.optional(v.string()),
    applicationId: v.id(APPLICATIONS_TABLE),
    frequence: v.union(
      v.literal("hourly"),
      v.literal("daily"),
      v.literal("weekly"),
      v.literal("monthly"),
      v.literal("yearly"),
      v.literal("on demand"),
      v.literal("real-time"),
    )
  },
  handler: async (ctx, { _id, name, description, direction, itComponentId, dataObjectId, volumetry, applicationId, frequence }) => {    
    const userId = (await getUserId(ctx, true))!;
    await validateInterface( ctx, name, description, userId, applicationId, itComponentId, dataObjectId);
    await ctx.db.patch(_id, { name, description, direction, itComponentId, dataObjectId, volumetry, applicationId, frequence, userId, editionTime: Date.now() });
  },
});

export const removeInterface = mutation({
  args: { _id: v.id(INTERFACES_TABLE) },
  handler: async (ctx, { _id }) => {
    const userId = (await getUserId(ctx, true))!;
    const interfaceToRemove = await ctx.db.get(_id);
    // #020 SERVER Insert or Update application only when current userId match with userId in Application Table
    if (userId !== interfaceToRemove?.userId) throw new Error("interfaces.removeInterface - Method not allowed.")

    await ctx.db.delete(_id);
  },
});

async function validateInterface(
    ctx: GenericMutationCtx<DataModel>,
    name: string,
    description: string | undefined,
    userId: Id<"users">, 
    applicationId: Id<"applications">, 
    itComponentId?: Id<"tags">, 
    dataObjectId?: Id<"tags">) {
    // #040 CLIENT SERVER Interface name length should be between 3 and 50 characters 
    checkIfStringIsNotOutOfLimits(name, { min: 3, max: 50 });

    // #100 CLIENT SERVER Interface description length should be lower than 1000 characters
    checkIfStringIsNotOutOfLimits(description, { max: 1000 });

    // #070 CLIENT SERVER Application's userId must be the same than the current user
    const app = await ctx.db.get(applicationId);
    checkUserIdsMatch(app!.userId, userId, "interfaces.insert application");

    // #050 CLIENT SERVER the combination Interface/ApplicationId/userId must be unique
    const existingInterface = await ctx.db.query(INTERFACES_TABLE)
    .withIndex("byNameApplicationId", (q) => q.eq("name", name).eq("applicationId", applicationId).eq("userId", userId!))
    .first();
    if (existingInterface) throw new Error("interfaces.insert - Name already used.");

    if (itComponentId) {
        // #080 CLIENT SERVER IT Component's userId must be the same than the current user 
        const itComponent = await ctx.db.get(itComponentId);
        checkUserIdsMatch(itComponent!.userId, userId, "interfaces.insert itComponent");
    }

    if (dataObjectId) {
        // #090 CLIENT SERVER Data object's userId must be the same than the current user 
        const dataObject = await ctx.db.get(dataObjectId);
        checkUserIdsMatch(dataObject!.userId, userId, "interfaces.insert dataObject");
    }
}

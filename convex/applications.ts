import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserId } from "./auth";
import { checkIfStringIsNotOutOfLimits } from "./validator.helper";
import { Id } from "./_generated/dataModel";

const TABLENAME = "applications";

export interface IApplication
{
  _id: Id<"applications">;
  _creationTime: number;
  description?: string | undefined;
  name: string;
  userId: Id<"users">;
  editionTime: number;
} 

export const list = query({
  args: { },
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    console.log(userId);
    const applications = await ctx.db.query(TABLENAME).withIndex("byUserId", (q) => q.eq("userId", userId!)).collect();

    return applications.sort((a, b) => b.editionTime - a.editionTime);
  },
});

export const findOne = query({
  args: { _id: v.id(TABLENAME)},
  handler: async (ctx, { _id}) => {
    const userId = await getUserId(ctx);
    console.log(userId);
    const application = await ctx.db.get(_id);
    if (application?.userId !== userId) throw new Error("applications.findOne - Method not allowed.");
    return application;
  },
});

export const insert = mutation({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    const userId = (await getUserId(ctx, true))!;
    
    checkIfStringIsNotOutOfLimits(name, { min: 3, max:50 });

    const appId = await ctx.db.insert(TABLENAME, { name, userId, editionTime: Date.now() });
    console.log(appId);
    return appId;
  },
});

export const patch = mutation({
  args: { _id: v.id(TABLENAME), name: v.string(), description: v.optional(v.string()) },
  handler: async (ctx, { _id, name, description }) => {
    checkIfStringIsNotOutOfLimits(name, { min: 3, max:50 })
    checkIfStringIsNotOutOfLimits(description, { max:500 });
    const userId = (await getUserId(ctx, true))!;
    const applicationToUpdate = await ctx.db.get(_id);
    if (userId !== applicationToUpdate?.userId) throw new Error("applications.patch - Method not allowed.")
    await ctx.db.patch(_id, { name, description, editionTime: Date.now() });
  },
});
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserId } from "./auth";
import { Id } from "./_generated/dataModel";
import { APPLICATIONS_TABLE, APPLICATION_TAGS_TABLE, TAGS_TABLE } from "./tableNames";
import { isValidHtmlColor } from "@/src/lib/utils";

export interface ITag
{
  _id: Id<"tags">;
  _creationTime: number;
  value: string;
  color?: string;
  icon?: string;
  type: number; // 0: Application
  userId: Id<"users">;
} 

export const list = query({
    args: { type: v.number() },
    handler: async (ctx, { type }) => {
      const userId = await getUserId(ctx);
      console.log(userId);
      const tags = await ctx.db.query(TAGS_TABLE).withIndex("byType", (q) => q.eq("userId", userId!).eq("type", type)).collect();
  
      return tags.sort((a, b) => a.value.localeCompare(b.value));
    },
  });

export const insert = mutation({
  args: { 
    value: v.string(), 
    type: v.number(),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
    applicationId: v.optional(v.id(APPLICATIONS_TABLE))
   },
  handler: async (ctx, { value, type, color, icon, applicationId }) => {
    if (value.trim() === "") throw new Error("Impossible to add a tag with no value.");    
    if (color && !isValidHtmlColor(color)) throw new Error("Impossible to add a tag with this color.");
    const userId = (await getUserId(ctx, true))!;
    const tagId = await ctx.db.insert(TAGS_TABLE, { value: value.trim(), type, color, userId, icon });
    if (applicationId) {
        const applicationToUpdate = await ctx.db.get(applicationId);
        if (userId !== applicationToUpdate?.userId) throw new Error("tags.insert - Method not allowed.")
        await ctx.db.insert(APPLICATION_TAGS_TABLE, { tagId, applicationId });
    }
    return tagId;
  },
});

export const patch = mutation({
  args: { _id: v.id(TAGS_TABLE), value: v.string(), color: v.optional(v.string()), icon: v.optional(v.string()) },
  handler: async (ctx, { _id, value, color, icon }) => {
    if (value.trim() === "") throw new Error("Impossible to add a tag with no value.");
    const userId = (await getUserId(ctx, true))!;
    const tagToUpdate = await ctx.db.get(_id);
    if (userId !== tagToUpdate?.userId) throw new Error("tags.patch - Method not allowed.")
    await ctx.db.patch(_id,  { value, color, icon });
  },
});

export const linkToApplication = mutation({
    args: { tagId: v.string(), applicationId: v.id(APPLICATIONS_TABLE) },
    handler: async (ctx, { tagId, applicationId }) => {
        const userId = (await getUserId(ctx, true))!;
        const tagToAdd = await ctx.db.get(tagId as Id<"tags">);
        if (userId !== tagToAdd?.userId) throw new Error("tags.linkToApplication - Method not allowed.")
        const applicationToUpdate = await ctx.db.get(applicationId);
        if (userId !== applicationToUpdate?.userId) throw new Error("tags.linkToApplication - Method not allowed.")
        await ctx.db.insert(APPLICATION_TAGS_TABLE, { tagId: tagId as Id<"tags">, applicationId });
    },
});

export const deleteTag = mutation({
    args: { id: v.id(TAGS_TABLE) },
    handler: async (ctx, { id }) => {
        const userId = (await getUserId(ctx, true))!;
        const tagToDelete = await ctx.db.get(id);
        if (userId !== tagToDelete?.userId) throw new Error("tags.deleteTag - Method not allowed.")
        await ctx.db.delete(id);
    },
});

export const removeLindToApplication = mutation({
    args: { tagId: v.id(TAGS_TABLE), applicationId: v.id(APPLICATIONS_TABLE) },
    handler: async (ctx, { tagId, applicationId }) => {
        const userId = (await getUserId(ctx, true));
        const application = await ctx.db.get(applicationId);
        if (userId !== application?.userId) throw new Error("tags.deleteTag - Method not allowed.")
        const appTag = await ctx.db.query(APPLICATION_TAGS_TABLE)
        .withIndex("byApplicationId", (q) => q.eq("applicationId", applicationId)).filter((q) => q.eq(q.field("tagId"), tagId)).unique()
        if (!appTag) throw new Error("Application Tag link doesn't exist.")
        await ctx.db.delete(appTag._id);
    },
});
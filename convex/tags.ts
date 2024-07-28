import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserId } from "./auth";
import { DataModel, Id } from "./_generated/dataModel";
import { APPLICATIONS_TABLE, APPLICATION_TAGS_TABLE, TAGS_TABLE } from "./tableNames";
import { isValidHtmlColor } from "@/src/lib/utils";
import { GenericMutationCtx } from "convex/server";
import { getManyVia } from "convex-helpers/server/relationships";

export interface ITag
{
  _id: Id<"tags">;
  _creationTime: number;
  value: string;
  color?: string;
  icon?: string;
  type: number; // 0: Application, 1: Business Capabilities
  description?: string;
  userId: Id<"users">;
} 

const MAX_TAG_NUMBER = 10;

export const list = query({
    args: { type: v.number() },
    handler: async (ctx, { type }) => {
      const userId = await getUserId(ctx);
      console.log(userId);
      // #010 SERVER Get tag only when current userId match with userId in Tag Table
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
    description: v.optional(v.string()),
    applicationId: v.optional(v.id(APPLICATIONS_TABLE))
   },
  handler: async (ctx, { value, type, color, icon, description, applicationId }) => {
    await validateTag(value, description, color);
    const userId = (await getUserId(ctx, true))!;
    // #050 SERVER When Insert tag current userId is the userId in Tag Table
    const tagId = await ctx.db.insert(TAGS_TABLE, { value: value.trim(), type, color, userId, icon, description });
    if (applicationId) {
        await validateAndLinkToApplication(ctx, applicationId, userId, tagId, type);
    }
    return tagId;
  },
});

export const patch = mutation({
  args: { _id: v.id(TAGS_TABLE), value: v.string(), color: v.optional(v.string()), icon: v.optional(v.string()), description: v.optional(v.string()) },
  handler: async (ctx, { _id, value, color, icon, description }) => {
    await validateTag(value, description, color);
    const userId = (await getUserId(ctx, true))!;
    const tagToUpdate = await ctx.db.get(_id);
    // #020 SERVER Update tag only when current userId match with userId in Tag Table
    if (userId !== tagToUpdate?.userId) throw new Error("tags.patch - Method not allowed.")
    await ctx.db.patch(_id,  { value, color, icon });
  },
});

export const linkToApplication = mutation({
    args: { tagId: v.string(), applicationId: v.id(APPLICATIONS_TABLE) },
    handler: async (ctx, { tagId, applicationId }) => {
      const userId = (await getUserId(ctx, true))!;

      const tagToAdd = await ctx.db.get(tagId as Id<"tags">);
      // #020 SERVER Update tag only when current userId match with userId in Tag Table
      if (userId !== tagToAdd?.userId) throw new Error("tags.linkToApplication - Method not allowed.")
 
      const tagToUpdate = await ctx.db.get(tagId as Id<"tags">);       
      validateAndLinkToApplication(ctx, applicationId, userId, tagId as Id<"tags">, tagToUpdate!.type)
    },
});

export const deleteTag = mutation({
    args: { id: v.id(TAGS_TABLE) },
    handler: async (ctx, { id }) => {
        const userId = (await getUserId(ctx, true))!;
        const tagToDelete = await ctx.db.get(id);
        // #060 SERVER Tag can be delete only when current userId match with userId in Tag Table
        if (userId !== tagToDelete?.userId) throw new Error("tags.deleteTag - Method not allowed.")
        await ctx.db.delete(id);
    },
});

export const removeLindToApplication = mutation({
    args: { tagId: v.id(TAGS_TABLE), applicationId: v.id(APPLICATIONS_TABLE) },
    handler: async (ctx, { tagId, applicationId }) => {
        const userId = (await getUserId(ctx, true));
        const application = await ctx.db.get(applicationId);

        // #040 SERVER Link tag to application can be remove only when current userId match with userId in Application Table
        if (userId !== application?.userId) throw new Error("tags.deleteTag - Method not allowed.")
        const appTag = await ctx.db.query(APPLICATION_TAGS_TABLE)
          .withIndex("byApplicationId", (q) => q.eq("applicationId", applicationId)).filter((q) => q.eq(q.field("tagId"), tagId)).unique();
        if (!appTag) throw new Error("Application Tag link doesn't exist.")
        await ctx.db.delete(appTag._id);
    },
});

async function validateAndLinkToApplication(ctx: GenericMutationCtx<DataModel>, applicationId: Id<"applications">, userId: Id<"users">, tagId: Id<"tags">, type: number) {
  const applicationToUpdate = await ctx.db.get(applicationId);
  
  // #030 SERVER Link tag to application only when current userId match with userId in Application Table
  if (userId !== applicationToUpdate?.userId) throw new Error("tags.insert - Method not allowed.");
  const appTags = await ctx.db.query(APPLICATION_TAGS_TABLE).withIndex("byApplicationId", (q) => q.eq("applicationId", applicationId)).collect();

  // #090 CLIENT SERVER The combination Tag Name/Tag color should be unique per application
  // #100 CLIENT SERVER Maximum tag per application is 10  
  const tags = await getManyVia(ctx.db, APPLICATION_TAGS_TABLE, "tagId", "byApplicationId", applicationId, "applicationId");
  if (appTags.filter(x => tags.find(y => y?._id === x.tagId)?.type === type).length >= MAX_TAG_NUMBER) throw new Error("tags.linkToApplication - Too many tags already added.");
  if (appTags.some(x => x.tagId === tagId as Id<"tags">)) throw new Error("tags.linkToApplication - Tag already exists with this application.");
  await ctx.db.insert(APPLICATION_TAGS_TABLE, { tagId, applicationId });
}

function validateTag(value: string, description: string | undefined, color: string | undefined) { 
  // #070 CLIENT SERVER Tag name should not be empty
  if (value.trim() === "") throw new Error("Impossible to add a tag with no value.");
  // #060 CLIENT SERVER Tag name length should be 50 characters maximum   
  if (value.length > 50) throw new Error("Impossible to add a tag with more than 15 characters.");
  // #0110 CLIENT SERVER Tag description length should be 500 characters maximum
  if (description && description.length > 500) throw new Error("Impossible to add a tag with more than 500 characters.");
  // #080 CLIENT SERVER Tag color should be a valid HTML hexadecimal color
  if (color && !isValidHtmlColor(color)) throw new Error("Impossible to add a tag with this color.");
}


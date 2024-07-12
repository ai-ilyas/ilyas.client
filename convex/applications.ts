import { query } from "./_generated/server";
import { getUserId } from "./auth";

export const list = query({
  args: { },
  handler: async (ctx) => {
    const user = await getUserId(ctx);
    console.log(user);
    const applications = await ctx.db.query("applications").withIndex("byUserId", (q) => q.eq("userId", user!)).collect();
    console.log(applications);

    return applications.sort((a, b) => b.editionTime - a.editionTime);
  },
});
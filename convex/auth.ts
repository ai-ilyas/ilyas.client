import { Auth } from "convex/server";
import { Id } from "./_generated/dataModel";

export async function getUserId(ctx: { auth: Auth }) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  const userId = identity.subject;
  return userId as Id<"users">;
}

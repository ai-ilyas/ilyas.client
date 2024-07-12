import { Auth } from "convex/server";
import { Id } from "./_generated/dataModel";
import { checkIfUserIdIsNotEmpty } from "./validator.helper";

export async function getUserId(ctx: { auth: Auth }, errorIfNull = false) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return errorIfNull 
      ? checkIfUserIdIsNotEmpty(identity)
      : null;
  }
  const userId = identity.subject;
  return userId as Id<"users">;
}

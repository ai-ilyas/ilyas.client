import { defineSchema, defineTable } from "convex/server";
import { Validator, v } from "convex/values";
import { APPLICATIONS_TABLE, TAGS_TABLE } from "./tableNames";

// The users, accounts, sessions and verificationTokens tables are modeled
// from https://authjs.dev/getting-started/adapters#models

export const userSchema = {
  email: v.string(),
  name: v.optional(v.string()),
  emailVerified: v.optional(v.number()),
  image: v.optional(v.string()),
};

export const sessionSchema = {
  userId: v.id("users"),
  expires: v.number(),
  sessionToken: v.string(),
};

export const accountSchema = {
  userId: v.id("users"),
  type: v.union(
    v.literal("email"),
    v.literal("oidc"),
    v.literal("oauth"),
    v.literal("webauthn"),
  ),
  provider: v.string(),
  providerAccountId: v.string(),
  refresh_token: v.optional(v.string()),
  access_token: v.optional(v.string()),
  expires_at: v.optional(v.number()),
  token_type: v.optional(v.string() as Validator<Lowercase<string>>),
  scope: v.optional(v.string()),
  id_token: v.optional(v.string()),
  session_state: v.optional(v.string()),
};

export const verificationTokenSchema = {
  identifier: v.string(),
  token: v.string(),
  expires: v.number(),
};

export const authenticatorSchema = {
  credentialID: v.string(),
  userId: v.id("users"),
  providerAccountId: v.string(),
  credentialPublicKey: v.string(),
  counter: v.number(),
  credentialDeviceType: v.string(),
  credentialBackedUp: v.boolean(),
  transports: v.optional(v.string()),
};

const authTables = {
  users: defineTable(userSchema).index("email", ["email"]),
  sessions: defineTable(sessionSchema)
    .index("sessionToken", ["sessionToken"])
    .index("userId", ["userId"]),
  accounts: defineTable(accountSchema)
    .index("providerAndAccountId", ["provider", "providerAccountId"])
    .index("userId", ["userId"]),
  verificationTokens: defineTable(verificationTokenSchema).index(
    "identifierToken",
    ["identifier", "token"],
  ),
  authenticators: defineTable(authenticatorSchema)
    .index("userId", ["userId"])
    .index("credentialID", ["credentialID"]),
};


export default defineSchema({
  ...authTables,

  applications: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    userId: v.id("users"),
    editionTime: v.number(),
    technicalOwner: v.optional(v.string()),
    businessOwner: v.optional(v.string()),
    numberOfUsers: v.optional(v.string()),
  }).index("byUserId", ["userId"]),

  tags: defineTable({
    value: v.string(),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
    type: v.number(),
    userId: v.id("users"),    
  }).index("byType", ["userId", "type"]).searchIndex("byValue", { searchField: "value", filterFields: ["userId", "type"] }),

  applicationTags: defineTable({ 
    tagId: v.id(TAGS_TABLE),
    applicationId: v.id(APPLICATIONS_TABLE),
  }).index("byApplicationId", ["applicationId"]),
});

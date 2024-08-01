import { v } from "convex/values";
import { DataModel, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { getUserId } from "./auth";
import { APPLICATIONS_TABLE, INTERFACE_CONSUMERS_TABLE, INTERFACES_TABLE } from "./tableNames";
import { GenericMutationCtx } from "convex/server";

export interface IInterfaceConsumer
{
    _id: Id<"interfaceConsumers">;
    _creationTime: number;
    editionTime: number;
    direction: "outgoing" | "incoming" | "bi-directional",
    volumetry?: string,
    applicationId: Id<"applications">,
    interfaceId: Id<"interfaces">,
    frequence?: "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "on demand" | "real-time"
}

export const list = query({
    args: { applicationId: v.id(APPLICATIONS_TABLE) },
    handler: async (ctx, { applicationId }) => {
      const userId = await getUserId(ctx);
      console.log(userId);
      
      const application = await ctx.db.get(applicationId);
      
      // #020 SERVER Retrieve, Insert, Update and Remove interface consumer only when current userId match with userId link to the application
      if (application?.userId !== userId) throw new Error("InterfaceConsumers.list - Method not allowed.");
  
      const interfaceConsumers = await ctx.db.query(INTERFACE_CONSUMERS_TABLE).withIndex("byApplicationId", (q) => q.eq("applicationId", applicationId)).collect();
      
      return interfaceConsumers
      .sort((a, b) => b.editionTime - a.editionTime);
    },
  });
  
export const insert = mutation({
    args: {
        interfaceId: v.id(INTERFACES_TABLE),
        direction: v.union(
        v.literal("outgoing"),
        v.literal("incoming"),
        v.literal("bi-directional"),
        ),
        applicationId: v.id(APPLICATIONS_TABLE),
        volumetry: v.optional(v.string()),
        frequence: v.optional(v.union(
        v.literal("hourly"),
        v.literal("daily"),
        v.literal("weekly"),
        v.literal("monthly"),
        v.literal("yearly"),
        v.literal("on demand"),
        v.literal("real-time"),
        ))},
    returns: v.id(INTERFACE_CONSUMERS_TABLE),
    handler: async (ctx, { direction, volumetry, applicationId, frequence, interfaceId }) => {
        const userId = (await getUserId(ctx, true))!;
        const application = (await ctx.db.get(applicationId))!;
        
        // #020 SERVER Insert, Update and Remove interface consumer only when current userId match with userId link to the application
        if (application.userId !== userId) throw new Error("InterfaceConsumers.insert - Method not allowed.");
        await validateInterfaceConsumer(ctx, direction, interfaceId);
        const interfaceConsumerId = await ctx.db.insert(INTERFACE_CONSUMERS_TABLE, 
            {
                direction, volumetry, applicationId, frequence, userId, editionTime: Date.now(), interfaceId
            });
        return interfaceConsumerId;
    },
});

export const patch = mutation({
    args: {
        _id: v.id(INTERFACE_CONSUMERS_TABLE),
        direction: v.union(
        v.literal("outgoing"),
        v.literal("incoming"),
        v.literal("bi-directional"),
        ),
        volumetry: v.optional(v.string()),
        frequence: v.optional(v.union(
        v.literal("hourly"),
        v.literal("daily"),
        v.literal("weekly"),
        v.literal("monthly"),
        v.literal("yearly"),
        v.literal("on demand"),
        v.literal("real-time"),
        ))
    },
    handler: async (ctx, { _id, direction, volumetry, frequence }) => {    
        const userId = (await getUserId(ctx, true))!;
        
        const _interfaceConsumer = (await ctx.db.get(_id))!;
        const application = (await ctx.db.get(_interfaceConsumer.applicationId))!;
        // #020 SERVER Insert, Update and Remove interface consumer only when current userId match with userId link to the application
        if (application.userId !== userId) throw new Error("InterfaceConsumers.insert - Method not allowed.");

        await validateInterfaceConsumer(ctx, direction, _interfaceConsumer.interfaceId);
        await ctx.db.patch(_id, { direction, volumetry, frequence, userId, editionTime: Date.now() });
    },
});

export const removeInterfaceConsumer = mutation({
args: { _id: v.id(INTERFACE_CONSUMERS_TABLE) },
handler: async (ctx, { _id }) => {
    const userId = (await getUserId(ctx, true))!;
    const interfaceToRemove = await ctx.db.get(_id);
    // #020 SERVER Insert or Update application only when current userId match with userId in Application Table
    if (userId !== interfaceToRemove?.userId) throw new Error("interfaces.removeInterface - Method not allowed.")

    await ctx.db.delete(_id);
},
});
  
async function validateInterfaceConsumer(
    ctx: GenericMutationCtx<DataModel>,
    direction:  "outgoing" | "incoming" | "bi-directional",
    interfaceId: Id<"interfaces">) {
    
    const _interface = await ctx.db.get(interfaceId);
    // #010 When Interface direction is not Bi-Directional and consumer direction should be different then interface direction 
    if (_interface!.direction !== "bi-directional" && _interface!.direction === direction ) throw new Error("interfacesConsumers.insert - Direction doesn't match.")
}
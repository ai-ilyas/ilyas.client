import { IApplication } from "@/src/lib/domain/entities/application.interface";
import { getUnitOfWork } from "@/src/lib/infrastructure/persistence/repositories/unit-of-work";

export async function insertApplication(application: IApplication, user_id: string): Promise<IApplication>
{
    if (user_id.trim().length === 0)
    {
        throw new Error('Not allowed to insert application.');
    }
    if (application.name == undefined || application.name.length < 3 || application.name.length > 50 )
    {
        throw new Error('Application name: not conformed.');
    }
    application.name = application.name.trim();
    let uof;
    try{
        uof = (await getUnitOfWork());
        const duplicateApplications = await uof.applicationRepository!.find({ name: application.name }, user_id);
        if (duplicateApplications.length > 0)
        {
            throw new Error('Duplicate name: Application name already exists.');
        }

        await uof.startTransaction();
        const id = await uof.applicationRepository!.insertOne(application, user_id);
        await uof.commitTransaction(false);
        const app = (await uof.applicationRepository!.findById(id, user_id))!;
        await uof.closeSession()
        return app;
    }
    catch(error){        
        uof?.abortTransaction();
        throw error;
    }
}
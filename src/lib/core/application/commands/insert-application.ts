import { IApplication } from "@/src/lib/domain/entities/application.interface";
import { getUnitOfWork } from "@/src/lib/infrastructure/persistence/repositories/unit-of-work";

export async function insertApplication(application: IApplication, user_id: string): Promise<string>
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
        const duplicateApplications = uof.applicationRepository!.find({ name: application.name }, user_id);
        if ((await duplicateApplications).length > 0)
        {
            throw new Error('Duplicate name: Application name already exists.');
        }

        uof.startTransaction();
        const id = uof.applicationRepository!.insertOne(application, user_id);
        uof.commitTransaction();
        return id;
    }
    catch(error){        
        uof?.abortTransaction();
        throw error;
    }
}
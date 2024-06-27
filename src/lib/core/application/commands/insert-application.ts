import { IApplication } from "@/src/lib/domain/entities/application.interface";
import { getUnitOfWork } from "@/src/lib/infrastructure/persistence/repositories/unit-of-work";

export async function insertApplication(application: IApplication, user_id: string): Promise<string>
{
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
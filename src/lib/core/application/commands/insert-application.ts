import { IApplication } from "@/src/lib/domain/entities/application.interface";
import { getUnitOfWork } from "@/src/lib/infrastructure/persistence/repositories/unit-of-work";

export async function insertApplication(application: IApplication, user_id: string): Promise<string>
{
    let uof;
    try{
        uof = (await getUnitOfWork());
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
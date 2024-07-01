import { IApplication } from "@/src/lib/domain/entities/application.interface";
import { getUnitOfWork } from "@/src/lib/infrastructure/persistence/repositories/unit-of-work";

export async function updateApplication(id: string, applicationNewValues: Partial<IApplication>, user_id: string): Promise<string>
{
    let uof;
    try{
        uof = (await getUnitOfWork());
        const applicationToBeUpdated = await uof.applicationRepository!.findById(id,user_id) ;
        //Check if application exists.
        
        if(!applicationToBeUpdated){
            throw new Error('Application not found: Modified application not found.');
        }
        //Check for naming conflicts.
        if((applicationNewValues?.name) && (applicationNewValues?.name !== applicationToBeUpdated?.name)){
            const duplicateApplications = await uof.applicationRepository!.find({ name: applicationNewValues?.name }, user_id);
            if ((await duplicateApplications).length > 0)
                {
                    throw new Error('Duplicate name: Application name already exists.');
                }
        }

        if(applicationNewValues?.name){

        }
        if(applicationNewValues?.description){

        }
        uof.startTransaction();
        const result = uof.applicationRepository?.updateOneById(id,applicationNewValues,user_id);
        uof.commitTransaction();
        if (!result) {
            throw new Error('Undefined result. Failed to update the application.');
        }
        return result;
    }
    catch(error){        
        uof?.abortTransaction();
        throw error;
    }
}
import { IApplication } from "@/src/lib/domain/entities/application.interface";
import { getUnitOfWork } from "@/src/lib/infrastructure/persistence/repositories/unit-of-work";

export async function updateApplication(applicationPartial: Partial<IApplication>, user_id: string): Promise<IApplication | null | undefined>
{
    let uof;
    try{
        uof = (await getUnitOfWork());
        const applicationToBeUpdated = await uof.applicationRepository!.findById(applicationPartial._id, user_id) ;        
        if(!applicationToBeUpdated) throw new Error('Not allowed to update this application.');
        
        if(applicationPartial?.name!.length > 50 || applicationPartial?.name!.length < 3){
            throw new Error('Application Name should between 3 and 50 characters.');
        }

        if(applicationPartial?.description && applicationPartial?.description!.length > 500){
            throw new Error('Application Description should not exceed 500 characters.');
        }

        if((applicationPartial?.name) && (applicationPartial?.name !== applicationToBeUpdated?.name)){
            const duplicateApplications = await uof.applicationRepository!.find({ name: applicationPartial?.name }, user_id);
            if ((await duplicateApplications).length > 0)
            {
                throw new Error('Duplicate name: Application name already exists.');
            }
        }

        uof.startTransaction();
        const updatedApp = await uof.applicationRepository?.updateOneById(applicationPartial._id, applicationPartial,user_id);
        uof.commitTransaction();
        return updatedApp;
    }
    catch(error){        
        uof?.abortTransaction();
        throw error;
    }
}
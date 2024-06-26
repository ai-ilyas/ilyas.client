import { IApplication } from "@/src/lib/domain/entities/application.interface";
import { getUnitOfWork } from "@/src/lib/infrastructure/persistence/repositories/unit-of-work";

export async function getAllApplications(partial: boolean, user_id: string): Promise<IApplication[]>
{
    return (await getUnitOfWork()).applicationRepository!.getAll(partial, user_id);      
}
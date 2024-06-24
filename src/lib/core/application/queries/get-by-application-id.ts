import { IApplication } from "@/src/lib/domain/entities/application.interface";
import { getUnitOfWork } from "@/src/lib/infrastructure/persistence/repositories/unit-of-work";

export async function getByApplicationId(id: string , user_id: string): Promise<IApplication | null>
{
    return (await getUnitOfWork()).applicationRepository!.find(id, user_id);       
}
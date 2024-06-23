import { IApplication } from "@/src/lib/domain/entities/application.interface";
import { UnitOfWork } from "@/src/lib/infrastructure/persistence/repositories/unit-of-work";

export async function getByApplicationId(id: string , user_id: string): Promise<IApplication | null>
{
    const uof = new UnitOfWork();
    return uof.applicationRepository.find(id, user_id);       
}
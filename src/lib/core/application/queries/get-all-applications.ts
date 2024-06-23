import { IApplication } from "@/src/lib/domain/entities/application.interface";
import { UnitOfWork } from "@/src/lib/infrastructure/persistence/repositories/unit-of-work";

export function getAllApplications(user_id: string): IApplication[]
{
    const uof = new UnitOfWork();
    return uof.applicationRepository.getAll(user_id);       
}
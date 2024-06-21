import { Application } from "@/src/lib/domain/entities/application";
import { UnitOfWork } from "@/src/lib/infrastructure/persistence/repositories/unit-of-work";

export function getAllApplications(user_id: string): Application[]
{
    const uof = new UnitOfWork();
    return uof.applicationRepository.getAll(user_id);       
}
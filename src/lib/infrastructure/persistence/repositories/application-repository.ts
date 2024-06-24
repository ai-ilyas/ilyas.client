import { IApplication } from "@/src/lib/domain/entities/application.interface";
import { IApplicationRepository } from "@/src/lib/domain/repositories/application-repository.interface";
import { Db } from "mongodb";
import { Repository } from "./repository";

export class ApplicationRepository extends Repository<IApplication> implements IApplicationRepository {
    constructor(_db: Db){
        super(_db, "application");
    }
}
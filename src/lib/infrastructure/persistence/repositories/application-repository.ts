import { Application } from "@/src/lib/domain/entities/application";
import { IApplicationRepository } from "@/src/lib/domain/repositories/application-repository.interface";
import { Db } from "mongodb";
import { Repository } from "./repository";

export class ApplicationRepository extends Repository implements IApplicationRepository {
    constructor(_db: Db){
        super(_db);
    }

    getAll(user_id: string): Application[] {
        return [{ id: "1234", name: "Mon App"} as Application]
    }

    find(key: any, user_id: string): Application {
        throw new Error("Method not implemented.");
    }

    save(value: Application, user_id: string): void {
        throw new Error("Method not implemented.");
    }
}
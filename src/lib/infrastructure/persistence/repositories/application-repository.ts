import { IApplication } from "@/src/lib/domain/entities/application.interface";
import { IApplicationRepository } from "@/src/lib/domain/repositories/application-repository.interface";
import { Db, ObjectId } from "mongodb";
import { Repository } from "./repository";

export class ApplicationRepository extends Repository implements IApplicationRepository {
    constructor(_db: Db){
        super(_db);
    }

    getAll(user_id: string): IApplication[] {
        return [{ id: "1234", name: "Mon App"} as IApplication]
    }

    async find(key: string, user_id: string): Promise<IApplication | null> {
        const result = await this._db.collection<IApplication>("application").findOne(new ObjectId(key))
        return result;
    }

    save(value: IApplication, user_id: string): void {
        throw new Error("Method not implemented.");
    }
}
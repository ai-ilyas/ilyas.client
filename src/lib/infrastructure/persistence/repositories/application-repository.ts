import { IApplication } from "@/src/lib/domain/entities/application.interface";
import { IApplicationRepository } from "@/src/lib/domain/repositories/application-repository.interface";
import { Db, ObjectId } from "mongodb";
import { Repository } from "./repository";
import { CommonRepositoryValidator } from "./common-repository.validator";
import { assert } from "@/src/lib/utils";

export class ApplicationRepository extends Repository implements IApplicationRepository {
    constructor(_db: Db){
        super(_db);
    }

    getAll(partial: boolean, user_id: string): IApplication[] {
        return [{ id: "1234", name: "Mon App"} as IApplication]
    }

    async find(key: string, user_id: string): Promise<IApplication | null> {
        // UserId must not be empty
        assert(CommonRepositoryValidator.checkIfUserIdIsNotEmpty(user_id), CommonRepositoryValidator.checkIfUserIdIsEmptyMessage);
        const result = await this._db.collection<IApplication>("application").findOne({
            _id: new ObjectId(key),
            user_id: user_id
          });
        return result;
    }

    save(value: IApplication, user_id: string): void {
        throw new Error("Method not implemented.");
    }
}
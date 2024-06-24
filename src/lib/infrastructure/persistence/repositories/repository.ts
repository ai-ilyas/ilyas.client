import { Db, ObjectId } from "mongodb";
import { CommonRepositoryValidator } from "./common-repository.validator";
import assert from "assert";

export abstract  class Repository<T extends Document>  {
    constructor(protected _db: Db, private _collectionName: string){
    }

    getAll(partial: boolean, user_id: string): T[] {
        throw new Error("Method not implemented.");
    }

    async find(key: string, user_id: string): Promise<T | null> {
        // UserId must not be empty
        assert(CommonRepositoryValidator.checkIfUserIdIsNotEmpty(user_id), CommonRepositoryValidator.checkIfUserIdIsEmptyMessage);
        const result = await this._db.collection(this._collectionName).findOne<T>({
            _id: new ObjectId(key),
            user_id: user_id
          });
        return result;
    }

    save(value: T, user_id: string): void {
        throw new Error("Method not implemented.");
    }
}
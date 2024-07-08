import { Db, ObjectId, ReturnDocument } from "mongodb";
import { CommonRepositoryValidator } from "./common-repository.validator";
import assert from "assert";
import { IEntity } from "@/src/lib/domain/entities/IEntity.interface";
import { IRepository } from "@/src/lib/domain/repositories/repository.interface";
import { IApplication } from "@/src/lib/domain/entities/application.interface";

export abstract  class Repository<T extends IEntity> implements IRepository<T>  {
  constructor(protected _db: Db, private _collectionName: string){    
  }

  async find(filters: any, user_id: string, projection: any = null): Promise<T[]> {    
    const _filters = { ...filters, user_id: user_id};
    let _projection = projection;
    if (projection != null) _projection = { _id: 1, name: 1 }

    const result = await this._db.collection(this._collectionName).find<T>(
      _filters,
      {
        projection: _projection
      }).toArray();
    return result;
  }

  async getAll(user_id: string, partial = true): Promise<T[]> {
    const result = await this._db.collection(this._collectionName).find<T>({
        user_id: user_id
      },
      {
        projection: {
          _id: 1,
          name: 1,
          creationDate:1,
          editionDate:1
        }
      }).toArray();
    return result;
  }

  async findById(key: string, user_id: string): Promise<T | null> {
    // UserId must not be empty
    assert(CommonRepositoryValidator.checkIfUserIdIsNotEmpty(user_id), CommonRepositoryValidator.checkIfUserIdIsEmptyMessage);
    const result = await this._db.collection(this._collectionName).findOne<T>({
        _id: new ObjectId(key),
        user_id: user_id
      });
    return result;
  }

  async insertOne(value: T, user_id: string): Promise<string> {
    value.user_id = user_id;
    value.creationDate = value.editionDate = new Date();
    const { _id, ...valueToInsert} = value;
    const result = await this._db.collection(this._collectionName).insertOne(valueToInsert);
    return result.insertedId.toString();
  }

  async updateOneById(key: string, value: Partial<T>, user_id: string): Promise<T | null> {
    assert(CommonRepositoryValidator.checkIfUserIdIsNotEmpty(key), CommonRepositoryValidator.checkIfUserIdIsEmptyMessage);
    assert(CommonRepositoryValidator.checkIfIdIsNotEmpty(user_id), CommonRepositoryValidator.checkIfIdEmptyMessage);
    const _filters = {
      _id: new ObjectId(key),
      user_id: user_id
    };
    const {_id, ...valuesToUpdate} = value;
    const _updateFilter = { $set: valuesToUpdate };
    const _updateOption = {upsert: false, returnDocument: ReturnDocument.AFTER};
    const updatedObject = await this._db.collection(this._collectionName).findOneAndUpdate(_filters, _updateFilter, _updateOption);
    return  updatedObject as T | null;
  }
}
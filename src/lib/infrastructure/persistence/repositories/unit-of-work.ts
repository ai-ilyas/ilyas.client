// mongoUnitOfWork.ts
import { ClientSession, Db, MongoClient } from 'mongodb';
import { IUnitOfWork } from '@/src/lib/domain/repositories/unit-of-work.interface';
import clientPromise from "@/src/lib/infrastructure/persistence/mongodb";
import { ApplicationRepository } from './application-repository';
import { IApplicationRepository } from '@/src/lib/domain/repositories/application-repository.interface';

export class UnitOfWork implements IUnitOfWork {
    public applicationRepository: IApplicationRepository;
    private _mongoClient: MongoClient;
    private _session: ClientSession;
    private _db: Db;

  constructor() {
    this._mongoClient = clientPromise;
    this._session = this._mongoClient.startSession();
    this._db = this._mongoClient.db("this.COLLECTION_NAME");
    this.applicationRepository = new ApplicationRepository(this._db);
  }

  private DB_NAME = "application";

  initializeClient(client: MongoClient){
  }

  async startTransaction(): Promise<void> {
    this._session.startTransaction();
  }

  async commitTransaction(): Promise<void> {
    await this._session.commitTransaction();
    this._session.endSession();
  }

  async abortTransaction(): Promise<void> {
    await this._session.abortTransaction();
    this._session.endSession();
  }
}

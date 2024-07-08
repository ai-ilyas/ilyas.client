// mongoUnitOfWork.ts
import { ClientSession, Db, MongoClient } from 'mongodb';
import { IUnitOfWork } from '@/src/lib/domain/repositories/unit-of-work.interface';
import clientPromise from "@/src/mongodb";
import { ApplicationRepository } from './application-repository';
import { IApplicationRepository } from '@/src/lib/domain/repositories/application-repository.interface';

class UnitOfWork implements IUnitOfWork {
    public applicationRepository: IApplicationRepository | undefined;
    private _mongoClient: MongoClient | undefined;
    private _session: ClientSession | undefined;
    private _db: Db | undefined;

  async setup() {
    this._mongoClient = (await clientPromise);
    this._session = this._mongoClient.startSession();
    this._db = this._mongoClient.db(process.env.MONGODB_DB);
    this.applicationRepository = new ApplicationRepository(this._db);
  }
  
  async startTransaction(): Promise<void> {
    this._session!.startTransaction();
  }

  async commitTransaction(closeSession = true): Promise<void> {
    await this._session!.commitTransaction();
    if (closeSession) this._session!.endSession();
  }

  async closeSession(): Promise<void> {
    this._session!.endSession();
  }

  async abortTransaction(): Promise<void> {
    if (this._session)
    {
      if (this._session.inTransaction()) await this._session!.abortTransaction();
      this._session!.endSession();
    }
  }
}

export async function getUnitOfWork(): Promise<IUnitOfWork> 
{
  let uof = new UnitOfWork();
  await uof.setup();
  return uof as IUnitOfWork;
}

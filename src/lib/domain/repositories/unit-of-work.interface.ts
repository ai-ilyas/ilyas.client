import { IApplicationRepository } from "./application-repository.interface";

export interface IUnitOfWork {
  startTransaction(): Promise<void>;
  commitTransaction(closeSession: boolean): Promise<void>;
  closeSession(): Promise<void>;
  abortTransaction(): Promise<void>;
  applicationRepository: IApplicationRepository | undefined;
}
  
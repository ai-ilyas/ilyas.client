import { IApplicationRepository } from "./application-repository.interface";

export interface IUnitOfWork {
    startTransaction(): Promise<void>;
    commitTransaction(): Promise<void>;
    abortTransaction(): Promise<void>;
    applicationRepository: IApplicationRepository;
  }
  
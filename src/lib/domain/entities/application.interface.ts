import { IEntity } from "./IEntity.interface";

export interface IApplication extends IEntity {
    name: string;
    description?: string;
  }
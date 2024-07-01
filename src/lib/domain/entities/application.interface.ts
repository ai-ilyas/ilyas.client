import { IEntity } from "./IEntity.interface";

export interface IApplication extends IEntity {
    _id: string;
    name: string;
  }
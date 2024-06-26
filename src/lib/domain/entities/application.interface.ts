import { IUserId } from "./user-id.interface";

export interface IApplication extends Document, IUserId {
    id: string;
    name: string;
  }
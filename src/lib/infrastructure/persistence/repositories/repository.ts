import { Db } from "mongodb";

export abstract  class Repository  {
    constructor(protected _db: Db){
    }
}
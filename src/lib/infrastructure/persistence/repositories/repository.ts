import { Db } from "mongodb";

export abstract  class Repository  {
    constructor(private _db: Db){
    }
}
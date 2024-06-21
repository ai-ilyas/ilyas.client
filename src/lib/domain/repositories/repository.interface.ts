import { MongoClient } from "mongodb";

export interface RepositoryInterface<T>
{
    getAll(user_id: string): T[];
    find(key: any, user_id: string): T;
    save(value: T, user_id: string): void;     
}
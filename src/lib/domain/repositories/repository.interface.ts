export interface IRepository<T>
{
    getAll(partial: boolean, user_id: string): Promise<T[]>;
    findById(key: any, user_id: string): Promise<T | null>;
    find(filters: any, user_id: string): Promise<T[]>;
    insertOne(value: T, user_id: string): Promise<string>;     
}
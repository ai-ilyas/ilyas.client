export interface IRepository<T>
{
    getAll(user_id: string, partial?: boolean): Promise<T[]>;
    findById(key: any, user_id: string, projection?: any): Promise<T | null>;
    find(filters: any, user_id: string, projection?: any): Promise<T[]>;
    insertOne(values: T, user_id: string): Promise<string>;  
    updateOneById(filters: any, values: Partial<T>, user_id: string): Promise<T | null>; 
}
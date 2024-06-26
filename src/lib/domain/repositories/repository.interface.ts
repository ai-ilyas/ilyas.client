export interface RepositoryInterface<T>
{
    getAll(partial: boolean, user_id: string): Promise<T[]>;
    find(key: any, user_id: string): Promise<T | null>
    insertOne(value: T, user_id: string): Promise<string>;     
}
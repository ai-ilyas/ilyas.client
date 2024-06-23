export interface RepositoryInterface<T>
{
    getAll(user_id: string): T[];
    find(key: any, user_id: string): Promise<T | null>
    save(value: T, user_id: string): void;     
}
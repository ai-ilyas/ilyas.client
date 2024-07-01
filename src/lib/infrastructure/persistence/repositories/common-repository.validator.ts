export class CommonRepositoryValidator {
    static checkIfUserIdIsNotEmpty = (userId: string): boolean => userId.trim().length > 0;
    static checkIfUserIdIsEmptyMessage = "userId is empty.";
    static checkIfIdIsNotEmpty = (id: string): boolean => id.trim().length > 0;
    static checkIfIdEmptyMessage = "Id key is empty.";
}
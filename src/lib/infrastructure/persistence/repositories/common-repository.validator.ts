export class CommonRepositoryValidator {
    static checkIfUserIdIsNotEmpty = (userId: string): boolean => userId.trim().length > 0;
    static checkIfUserIdIsEmptyMessage = "userId is empty.";
}
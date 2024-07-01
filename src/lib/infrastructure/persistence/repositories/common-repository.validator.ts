export class CommonRepositoryValidator {
    static checkIfUserIdIsNotEmpty = (userId: string): boolean => userId.trim().length > 0;
    static checkIfUserIdIsEmptyMessage = "userId is empty.";
    static checkIfIdIsNotEmpty = (id: string): boolean => id.trim().length > 0;
    static checkIfIdEmptyMessage = "Id key is empty.";
    static checkStringNotOversized = (stringToTest: string, limit: number): boolean => stringToTest.length <= limit;
    static checkStringNotOversizedMessage = "String has exceed the characters limit.";
}
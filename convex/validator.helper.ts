export const checkIfUserIdIsNotEmpty = (userId: string | null) => {
    if (userId == null || userId.trim().length === 0) throw new Error("userId is empty.");
}

export const  checkIfIdIsNotEmpty = (id: string) => {
    if (id == null || id.trim().length === 0) throw new Error("Id key is empty.");
}

interface CheckStringOptions {
    min?: number;
    max?: number;
}
export const  checkIfStringIsNotOutOfLimits = (stringToTest?: string, { min, max }: CheckStringOptions = {}) =>
    {
        if (min === undefined && max === undefined) {
            throw new Error("checkStringNotOversized no parameter given");
        } 
        const checkStringNotOutOfLimitsMessage = "String is out of limit."   
        const length = stringToTest?.length ?? 0;    
        if (min !== undefined && length < min || max !== undefined && length > max) {
            throw new Error(checkStringNotOutOfLimitsMessage);
        }
    }

export const checkUserIdsMatch = (userId: string, userId2: string, fromMethod?: string) => {
    if (userId !== userId2) throw new Error((fromMethod + " - " ?? " ") + "userId doesn't match.");
}
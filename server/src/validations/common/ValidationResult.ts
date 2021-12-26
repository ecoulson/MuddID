import IValidationResult from "./IValidationResult";

export default class ValidationResult implements IValidationResult {
    public condition: boolean;
    public message: string;

    constructor(condition: boolean, message: string) {
        this.condition = condition;
        this.message = message;
    }
}
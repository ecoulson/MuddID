import IValidationResult from "./IValidationResult";

export type Rule = (...any: any[]) => IValidationResult;

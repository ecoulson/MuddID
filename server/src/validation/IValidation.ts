import IValidationResult from "./IValidationResult";

export default interface IValidation {
	parameter: string;
	rule: IValidationResult;
}

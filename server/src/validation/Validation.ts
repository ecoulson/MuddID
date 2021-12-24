import IValidation from "./IValidation";
import IValidationResult from "./IValidationResult";

export default class Validation implements IValidation {
	public parameter: string;
	public rule: IValidationResult;

	constructor(parameter: string, rule: IValidationResult) {
		this.parameter = parameter;
		this.rule = rule;
	}
}

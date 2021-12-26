import Exception from "../../models/common/exception/Exception";
import IValidator from "./IValidator";
import IValidation from "./IValidation";

export default abstract class Validator<T> implements IValidator<T> {
	abstract validate(model: T): void;

	protected executeValidation(exception: Exception, ...validations: IValidation[]): void {
        validations.forEach(({rule, parameter}) => {
            if (rule.condition) {
                exception.upsertDataList(parameter, rule.message)
            }
        })
	}
}

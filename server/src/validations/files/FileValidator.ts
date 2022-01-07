import File from "../../models/common/files/File";
import IValidation from "../common/IValidation";
import IValidationResult from "../common/IValidationResult";
import Validation from "../common/Validation";
import ValidationResult from "../common/ValidationResult";
import Validator from "../common/Validator";
import { validate as validateUUID } from "uuid";
import IllegalFileException from "../../models/common/files/exceptions/IllegalFileException";

export default abstract class FileValidator<T extends File<any>> extends Validator<T> {
	private readonly legalExtensions = [".png", ".jpg", ".jpeg"];
	private readonly nameParameter = "name";
	private readonly extensionParameter = "extension";

	private readonly invalidNameMessage = "Name is an invalid UUID";
	private readonly invalidExtensionMessage = "Image extension must be a .jpg, .jpeg, or .png";

	validate(stream: T): void {
		const exception = new IllegalFileException();
		this.executeValidations(
			exception,
			this.validateName(stream),
			this.validateExtension(stream),
			...this.validateContent(stream),
		);
		exception.throwIfContainsErrors();
	}

	private validateName(stream: T): IValidation {
		return new Validation(this.nameParameter, this.ensureValidFileName(stream));
	}

	private ensureValidFileName(stream: T): IValidationResult {
		return new ValidationResult(!validateUUID(stream.name), this.invalidNameMessage);
	}

	private validateExtension(stream: T): IValidation {
		return new Validation(this.extensionParameter, this.ensureValidFileExtension(stream));
	}

	private ensureValidFileExtension(stream: T): IValidationResult {
		return new ValidationResult(
			!this.legalExtensions.includes(stream.extension),
			this.invalidExtensionMessage,
		);
	}

	protected abstract validateContent(stream: T): IValidation[];
}

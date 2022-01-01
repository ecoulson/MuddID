import { validate as validateUUID } from "uuid";
import FileStream from "../../models/common/files/FileStream";
import IllegalFileStreamException from "../../models/image-extractors/exceptions/IllegalFileStreamException";
import IValidation from "../common/IValidation";
import IValidationResult from "../common/IValidationResult";
import Validation from "../common/Validation";
import ValidationResult from "../common/ValidationResult";
import Validator from "../common/Validator";

export default class ImageExtractorFileStreamValidator extends Validator<FileStream> {
	validate(stream: FileStream): void {
		const exception = new IllegalFileStreamException();
		this.executeValidations(exception, this.validateName(stream));
		exception.throwIfContainsErrors();
	}

	private validateName(stream: FileStream): IValidation {
		return new Validation("name", this.ensureValidFileName(stream));
	}

	private ensureValidFileName(stream: FileStream): IValidationResult {
		return new ValidationResult(!validateUUID(stream.name), "Name is an invalid UUID");
	}
}

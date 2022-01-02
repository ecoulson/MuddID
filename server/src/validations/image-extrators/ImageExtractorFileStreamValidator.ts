import { validate as validateUUID } from "uuid";
import FileStream from "../../models/common/files/FileStream";
import IllegalFileStreamException from "../../models/image-extractors/exceptions/IllegalFileStreamException";
import IValidation from "../common/IValidation";
import IValidationResult from "../common/IValidationResult";
import Validation from "../common/Validation";
import ValidationResult from "../common/ValidationResult";
import Validator from "../common/Validator";

export default class ImageExtractorFileStreamValidator extends Validator<FileStream> {
	private readonly legalExtensions = [".png", ".jpg", ".jpeg"];

	validate(stream: FileStream): void {
		const exception = new IllegalFileStreamException();
		this.executeValidations(
			exception,
			this.validateName(stream),
			this.validateExtension(stream),
		);
		exception.throwIfContainsErrors();
	}

	private validateName(stream: FileStream): IValidation {
		return new Validation("name", this.ensureValidFileName(stream));
	}

	private ensureValidFileName(stream: FileStream): IValidationResult {
		return new ValidationResult(!validateUUID(stream.name), "Name is an invalid UUID");
	}

	private validateExtension(stream: FileStream): IValidation {
		return new Validation("extension", this.ensureValidFileExtension(stream));
	}

	private ensureValidFileExtension(stream: FileStream): IValidationResult {
		return new ValidationResult(
			!this.legalExtensions.includes(stream.extension),
			"Image extension must be a .jpg, .jpeg, or .png",
		);
	}
}

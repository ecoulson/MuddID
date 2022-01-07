import BufferedFile from "../../models/common/files/BufferedFile";
import IValidation from "../common/IValidation";
import IValidationResult from "../common/IValidationResult";
import Validation from "../common/Validation";
import ValidationResult from "../common/ValidationResult";
import FileValidator from "../files/FileValidator";

export default class ImageValidator extends FileValidator<BufferedFile> {
	private readonly contentParameter = "content";
	private readonly emptyContentErrorMessage = "File content can not be an empty buffer";

	protected validateContent(file: BufferedFile): IValidation[] {
		return [new Validation(this.contentParameter, this.ensureContentIsNotEmpty(file.content))];
	}

	private ensureContentIsNotEmpty(content: Buffer): IValidationResult {
		return new ValidationResult(this.isContentEmpty(content), this.emptyContentErrorMessage);
	}

	private isContentEmpty(content: Buffer): boolean {
		return content.byteLength === 0;
	}
}

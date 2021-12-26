import { validate as validateUUID } from "uuid";
import BufferedFile from "../../models/common/files/BufferedFile";
import IllegalBufferedAnnotationImage from "../../models/image-annotations/exceptions/IllegalBufferedAnnotationImage";
import IValidation from "../common/IValidation";
import IValidationResult from "../common/IValidationResult";
import Validation from "../common/Validation";
import ValidationResult from "../common/ValidationResult";
import Validator from "../common/Validator";

export default class ImageValidator extends Validator<BufferedFile> {
	private readonly legalExtensions = [".jpg", ".jpeg", ".png"];

	private readonly contentParameter = "content";
	private readonly extensionParameter = "extension";
	private readonly nameParameter = "name";

	private readonly emptyContentErrorMessage = "File content can not be an empty buffer";
	private readonly illegalExtensionMessage =
		"Extension must be one of the following types: .jpg, .jpeg, .png";
	private readonly illegalUUIDNameMessage = "Name must be a valid UUID";

	validate(file: BufferedFile): void {
		const exception = new IllegalBufferedAnnotationImage();
		this.executeValidation(
			exception,
			...this.validateContent(file.content),
			...this.validateExtension(file.extension),
			...this.validateName(file.name),
		);
		exception.throwIfContainsErrors();
	}

	private validateContent(content: Buffer): IValidation[] {
		return [new Validation(this.contentParameter, this.ensureContentIsNotEmpty(content))];
	}

	private ensureContentIsNotEmpty(content: Buffer): IValidationResult {
		return new ValidationResult(this.isContentEmpty(content), this.emptyContentErrorMessage);
	}

	private isContentEmpty(content: Buffer): boolean {
		return content.byteLength === 0;
	}

	private validateExtension(extension: string): IValidation[] {
		return [new Validation(this.extensionParameter, this.ensureExtensionIsLegal(extension))];
	}

	private ensureExtensionIsLegal(extension: string): IValidationResult {
		return new ValidationResult(
			this.isExtensionIllegal(extension),
			this.illegalExtensionMessage,
		);
	}

	private isExtensionIllegal(extension: string) {
		return !this.legalExtensions.includes(extension);
	}

	private validateName(name: string): IValidation[] {
		return [new Validation(this.nameParameter, this.ensureNameIsValidUUID(name))];
	}

	private ensureNameIsValidUUID(name: string): IValidationResult {
		return new ValidationResult(this.isIllegalUUID(name), this.illegalUUIDNameMessage);
	}

	private isIllegalUUID(name: string) {
		return !validateUUID(name);
	}
}

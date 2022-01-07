import FileStream from "../../models/common/files/FileStream";
import IValidation from "../common/IValidation";
import IValidationResult from "../common/IValidationResult";
import Validation from "../common/Validation";
import ValidationResult from "../common/ValidationResult";
import FileValidator from "../files/FileValidator";

export default class ImageExtractorFileStreamValidator extends FileValidator<FileStream> {
	private readonly contentParameter = "content";

	private readonly unreadableStreamMessage = "Content stream must not be closed";
	private readonly streamHasBeenReadMessage =
		"Content stream must not have emitted a data event or been read";
	private readonly streamAbortedMessage =
		"Content stream errored during reading and before the stream closed";

	protected validateContent(stream: FileStream): IValidation[] {
		return [
			new Validation(this.contentParameter, this.ensureStreamIsReadable(stream)),
			new Validation(this.contentParameter, this.ensureStreamHasNotBeenRead(stream)),
			new Validation(this.contentParameter, this.ensureStreamHasNotAborted(stream)),
		];
	}

	private ensureStreamIsReadable(stream: FileStream): IValidationResult {
		return new ValidationResult(!stream.content.readable, this.unreadableStreamMessage);
	}

	private ensureStreamHasNotBeenRead(stream: FileStream): IValidationResult {
		return new ValidationResult(stream.content.readableDidRead, this.streamHasBeenReadMessage);
	}

	private ensureStreamHasNotAborted(stream: FileStream): IValidationResult {
		return new ValidationResult(stream.content.readableAborted, this.streamAbortedMessage);
	}
}

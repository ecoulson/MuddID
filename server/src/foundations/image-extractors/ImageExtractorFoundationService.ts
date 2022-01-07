import { Readable } from "stream";
import SharpImageExtractor from "../../brokers/image-extractors/SharpImageExtractorBroker";
import IllegalFileException from "../../models/common/files/exceptions/IllegalFileException";
import FileStream from "../../models/common/files/FileStream";
import IBoundingBox from "../../models/common/geometry/IBoundingBox";
import ImageExtractorDependencyException from "../../models/image-extractors/exceptions/ImageExtractorDependencyException";
import ImageExtractorDependencyValidationException from "../../models/image-extractors/exceptions/ImageExtractorDependencyValidationException";
import ImageExtractorValidationException from "../../models/image-extractors/exceptions/ImageExtractorValidationException";
import ImageExtractorFileStreamValidator from "../../validations/image-extrators/ImageExtractorFileStreamValidator";
import IImageExtractorFoundationService from "./IImageExtractorFoundationService";

export default class ImageExtractorFoundationService implements IImageExtractorFoundationService {
	private imageExtractorBroker: SharpImageExtractor;
	private fileStreamValidator: ImageExtractorFileStreamValidator;

	constructor(imageExtractorBroker: SharpImageExtractor) {
		this.imageExtractorBroker = imageExtractorBroker;
		this.fileStreamValidator = new ImageExtractorFileStreamValidator();
	}

	async extract(file: FileStream, boundingBox: IBoundingBox): Promise<FileStream> {
		this.validateInputStream(file);
		const extractedFileStream = await this.extractRegion(file, boundingBox);
		this.validateExtractedImageStream(extractedFileStream);
		return extractedFileStream;
	}

	private validateInputStream(file: FileStream) {
		try {
			this.fileStreamValidator.validate(file);
		} catch (error) {
			throw new ImageExtractorValidationException(error);
		}
	}

	private async extractRegion(file: FileStream, boundingBox: IBoundingBox): Promise<FileStream> {
		try {
			const contentStream = await this.imageExtractorBroker.extract(file, boundingBox);
			return new FileStream(file.baseName(), contentStream);
		} catch (error) {
			throw new ImageExtractorDependencyException(error);
		}
	}

	private validateExtractedImageStream(file: FileStream) {
		try {
			return this.fileStreamValidator.validate(file);
		} catch (error) {
			throw new ImageExtractorDependencyValidationException(error);
		}
	}
}

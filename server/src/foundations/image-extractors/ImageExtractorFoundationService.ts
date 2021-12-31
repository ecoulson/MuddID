import { Readable } from "stream";
import SharpImageExtractor from "../../brokers/image-extractors/SharpImageExtractorBroker";
import FileStream from "../../models/common/files/FileStream";
import IBoundingBox from "../../models/common/geometry/IBoundingBox";
import IllegalFileStreamException from "../../models/image-extractors/exceptions/IllegalFileStreamException";
import ImageExtractorDependencyException from "../../models/image-extractors/exceptions/ImageExtractorDependencyException";
import ImageExtractorDependencyValidationException from "../../models/image-extractors/exceptions/ImageExtractorDependencyValidationException";
import ImageExtractorValidationException from "../../models/image-extractors/exceptions/ImageExtractorValidationException";
import IImageExtractorFoundationService from "./IImageExtractorFoundationService";

export default class ImageExtractorFoundationService implements IImageExtractorFoundationService {
	private imageExtractorBroker: SharpImageExtractor;

	constructor(imageExtractorBroker: SharpImageExtractor) {
		this.imageExtractorBroker = imageExtractorBroker;
	}

	async extract(file: FileStream, boundingBox: IBoundingBox): Promise<FileStream> {
		this.validateInputStream(file);
		const extractedReadableStream = await this.extractRegion(file, boundingBox);
		this.validateExtractedImageStream(extractedReadableStream);
		return new FileStream(file.baseName(), extractedReadableStream);
	}

	private validateInputStream(file: FileStream) {
		if (!file.content.readable) {
			throw new ImageExtractorValidationException(
				new IllegalFileStreamException(
					new Map([["content", ["Stream must not be closed"]]]),
				),
			);
		}
	}

	private async extractRegion(file: FileStream, boundingBox: IBoundingBox): Promise<Readable> {
		try {
			return await this.imageExtractorBroker.extract(file, boundingBox);
		} catch (error) {
			throw new ImageExtractorDependencyException(error);
		}
	}

	private validateExtractedImageStream(stream: Readable) {
		if (!stream.readable) {
			throw new ImageExtractorDependencyValidationException(
				new IllegalFileStreamException(
					new Map([["content", ["Stream must not be closed"]]]),
				),
			);
		}
	}
}

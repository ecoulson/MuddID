import sharp from "sharp";
import { Readable } from "stream";
import FileStream from "../../models/common/files/FileStream";
import IBoundingBox from "../../models/common/geometry/IBoundingBox";
import IImageExtractorBroker from "./IImageExtractorBroker";

export default class SharpImageExtractor implements IImageExtractorBroker {
	async extract(file: FileStream, boundingBox: IBoundingBox): Promise<Readable> {
		return file.content.pipe(sharp().extract(boundingBox));
	}
}

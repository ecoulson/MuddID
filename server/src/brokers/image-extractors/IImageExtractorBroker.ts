import { Readable } from "stream";
import FileStream from "../../models/common/files/FileStream";
import IBoundingBox from "../../models/common/geometry/IBoundingBox";

export default interface IImageExtractorBroker {
	extract(file: FileStream, region: IBoundingBox): Promise<Readable>;
}

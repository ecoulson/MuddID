import FileStream from "../../models/common/files/FileStream";
import IBoundingBox from "../../models/common/geometry/IBoundingBox";

export default interface IImageExtractorFoundationService {
	extract(file: FileStream, boundingBox: IBoundingBox): Promise<FileStream>;
}

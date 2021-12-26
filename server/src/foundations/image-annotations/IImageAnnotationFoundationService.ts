import BufferedFile from "../../models/common/files/BufferedFile";
import AnnotatedImage from "../../models/image-annotations/AnnotatedImage";

export default interface IImageAnnotationFoundationService {
	annotateImage(file: BufferedFile): Promise<AnnotatedImage>;
}

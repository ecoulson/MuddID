import BufferedFile from "../../models/common/files/BufferedFile";

export default interface IImageAnnotationBroker<Response> {
	annotateImage(file: BufferedFile): Promise<Response>;
}

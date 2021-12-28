import FileStream from "../../models/common/files/FileStream";

export default interface IImageExtractor<Response> {
	extract(file: FileStream): Response;
}

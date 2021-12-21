export default interface IImageAnnotationBroker<Response> {
	annotateImage(file: Buffer): Promise<Response>;
}

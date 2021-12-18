export default interface IImageAnnotationBroker<Response> {
	annotateImageWithFeatures(file: Buffer): Promise<Response>;
}

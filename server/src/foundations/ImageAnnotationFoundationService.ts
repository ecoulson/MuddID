import GoogleCloudImageAnnotationBroker from "../brokers/GoogleCloudImageAnnotationBroker";
import ImageAnnotationDependencyException from "../models/Exceptions/ImageAnnotationDependencyException";
import ImageAnnotationDependencyValidationException from "../models/Exceptions/ImageAnnotationDependencyValidationException";
import ImageAnnotationValidationException from "../models/Exceptions/ImageAnnotationValidationException";
import AnnotatedImage from "../models/AnnotatedImage";
import IImageAnnotationFoundationService from "./IImageAnnotationFoundationService";
import NullImageAnnotationResponseException from "../models/Exceptions/NullImageAnnotationResponseException";
import EmptyAnnotationImageException from "../models/Exceptions/EmptyAnnotationImageException";
import GoogleCloudAnnotationResponseMapper from "../mappers/GoogleCloudAnnotationResponseMapper";
import { GoogleCloudAnnotationResponse } from "../brokers/GoogleCloudTypes";

export default class ImageAnnotationFoundationService implements IImageAnnotationFoundationService {
	private imageAnnotationBroker: GoogleCloudImageAnnotationBroker;
	private googleCloudAnnotationResponseMapper: GoogleCloudAnnotationResponseMapper;

	constructor(imageAnnotationBroker: GoogleCloudImageAnnotationBroker) {
		this.imageAnnotationBroker = imageAnnotationBroker;
		this.googleCloudAnnotationResponseMapper = new GoogleCloudAnnotationResponseMapper();
	}

	async annotateImage(file: Buffer): Promise<AnnotatedImage> {
		this.validateFile(file);
		const response = await this.makeAnnotationRequest(file);
		this.validateResponse(response);
		return this.googleCloudAnnotationResponseMapper.mapToAnnotatedImage(file, response);
	}

	private async makeAnnotationRequest(file: Buffer) {
		try {
			return await this.imageAnnotationBroker.annotateImage(file);
		} catch (error) {
			throw new ImageAnnotationDependencyException(error);
		}
	}

	private validateFile(file: Buffer) {
		if (file.byteLength === 0) {
			throw new ImageAnnotationValidationException(new EmptyAnnotationImageException());
		}
	}

	private validateResponse(response: GoogleCloudAnnotationResponse) {
		if (!response) {
			throw new ImageAnnotationDependencyValidationException(
				new NullImageAnnotationResponseException(),
			);
		}
	}
}

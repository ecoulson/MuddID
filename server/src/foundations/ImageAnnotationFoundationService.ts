import GoogleCloudImageAnnotationBroker from "../brokers/GoogleCloudImageAnnotationBroker";
import ImageAnnotationDependencyException from "../models/Exceptions/ImageAnnotationDependencyException";
import ImageAnnotationDependencyValidationException from "../models/Exceptions/ImageAnnotationDependencyValidationException";
import ImageAnnotationValidationException from "../models/Exceptions/ImageAnnotationValidationException";
import AnnotatedImage from "../models/AnnotatedImage";
import IImageAnnotationFoundationService from "./IImageAnnotationFoundationService";
import EmptyAnnotationImageException from "../models/Exceptions/EmptyAnnotationImageException";
import GoogleCloudAnnotationResponseMapper from "../mappers/GoogleCloudAnnotationResponseMapper";
import GoogleCloudAnnotationResponseValidator from "../validation/GoogleCloudAnnotationResponseValidator";
import { GoogleCloudAnnotationResponse } from "../brokers/GoogleCloudTypes";

export default class ImageAnnotationFoundationService implements IImageAnnotationFoundationService {
	private imageAnnotationBroker: GoogleCloudImageAnnotationBroker;
	private googleCloudAnnotationResponseMapper: GoogleCloudAnnotationResponseMapper;
	private googleCloudResponseValidator: GoogleCloudAnnotationResponseValidator;

	constructor(imageAnnotationBroker: GoogleCloudImageAnnotationBroker) {
		this.imageAnnotationBroker = imageAnnotationBroker;
		this.googleCloudResponseValidator = new GoogleCloudAnnotationResponseValidator();
		this.googleCloudAnnotationResponseMapper = new GoogleCloudAnnotationResponseMapper();
	}

	async annotateImage(file: Buffer): Promise<AnnotatedImage> {
		this.validateFile(file);
		const response = await this.makeAnnotationRequest(file);
		this.validateResponse(response);
		return this.googleCloudAnnotationResponseMapper.mapToAnnotatedImage(file, response);
	}

	private validateFile(file: Buffer) {
		if (file.byteLength === 0) {
			throw new ImageAnnotationValidationException(new EmptyAnnotationImageException());
		}
	}

	private async makeAnnotationRequest(file: Buffer) {
		try {
			return await this.imageAnnotationBroker.annotateImage(file);
		} catch (error) {
			throw new ImageAnnotationDependencyException(error);
		}
	}

	private validateResponse(response: GoogleCloudAnnotationResponse) {
		try {
			this.googleCloudResponseValidator.validate(response);
		} catch (error) {
			throw new ImageAnnotationDependencyValidationException(error);
		}
	}
}

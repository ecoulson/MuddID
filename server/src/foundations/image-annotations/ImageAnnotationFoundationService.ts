import GoogleCloudImageAnnotationBroker from "../../brokers/image-annotations/GoogleCloudImageAnnotationBroker";
import ImageAnnotationDependencyException from "../../models/image-annotations/exceptions/ImageAnnotationDependencyException";
import ImageAnnotationDependencyValidationException from "../../models/image-annotations/exceptions/ImageAnnotationDependencyValidationException";
import ImageAnnotationValidationException from "../../models/image-annotations/exceptions/ImageAnnotationValidationException";
import AnnotatedImage from "../../models/image-annotations/AnnotatedImage";
import IImageAnnotationFoundationService from "./IImageAnnotationFoundationService";
import GoogleCloudAnnotationResponseMapper from "../../mappers/image-annotations/GoogleCloudAnnotationResponseMapper";
import GoogleCloudAnnotationResponseValidator from "../../validations/image-annotations/GoogleCloudAnnotationResponseValidator";
import { GoogleCloudAnnotationResponse } from "../../types/GoogleCloudTypes";
import BufferedFile from "../../models/common/files/BufferedFile";
import ImageValidator from "../../validations/image-annotations/ImageValidator";

export default class ImageAnnotationFoundationService implements IImageAnnotationFoundationService {
	private imageAnnotationBroker: GoogleCloudImageAnnotationBroker;
	private googleCloudAnnotationResponseMapper: GoogleCloudAnnotationResponseMapper;
	private googleCloudResponseValidator: GoogleCloudAnnotationResponseValidator;
	private imageValidator: ImageValidator;

	constructor(imageAnnotationBroker: GoogleCloudImageAnnotationBroker) {
		this.imageAnnotationBroker = imageAnnotationBroker;
		this.googleCloudResponseValidator = new GoogleCloudAnnotationResponseValidator();
		this.googleCloudAnnotationResponseMapper = new GoogleCloudAnnotationResponseMapper();
		this.imageValidator = new ImageValidator();
	}

	async annotateImage(file: BufferedFile): Promise<AnnotatedImage> {
		this.validateFile(file);
		const response = await this.makeAnnotationRequest(file);
		this.validateResponse(response);
		return this.googleCloudAnnotationResponseMapper.mapToAnnotatedImage(file, response);
	}
			
	private validateFile(file: BufferedFile) {
		try {
			this.imageValidator.validate(file);
		} catch (error) {
			throw new ImageAnnotationValidationException(error);
		}
	}

	private async makeAnnotationRequest(file: BufferedFile) {
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

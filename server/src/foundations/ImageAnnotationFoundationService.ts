import { google } from "@google-cloud/vision/build/protos/protos";
import GoogleCloudImageAnnotationBroker from "../brokers/GoogleCloudImageAnnotationBroker";
import ImageAnnotationDependencyException from "../models/Exceptions/ImageAnnotationDependencyException";
import ImageAnnotationDependencyValidationException from "../models/Exceptions/ImageAnnotationDependencyValidationException";
import ImageAnnotationValidationException from "../models/Exceptions/ImageAnnotationValidationException";
import AnnotatedImage from "../models/AnnotatedImage";
import FaceAnnotation from "../models/FaceAnnotation";
import LogoAnnotation from "../models/LogoAnnotation";
import TextAnnotation from "../models/TextAnnotation";
import Vertex from "../models/Vertex";
import { IImageAnnotationFoundationService } from "./IImageAnnotationFoundationService";
import NullImageAnnotationResponseException from "../models/Exceptions/NullImageAnnotationResponseException";
import EmptyAnnotationImageException from "../models/Exceptions/EmptyAnnotationImageException";

type GoogleCloudAnnotationResponse =
	google.cloud.vision.v1.IAnnotateImageResponse;

export default class ImageAnnotationFoundationService
	implements IImageAnnotationFoundationService
{
	private imageAnnotationBroker: GoogleCloudImageAnnotationBroker;

	constructor(imageAnnotationBroker: GoogleCloudImageAnnotationBroker) {
		this.imageAnnotationBroker = imageAnnotationBroker;
	}

	async annotateImage(file: Buffer): Promise<AnnotatedImage> {
		this.validateFile(file);
		const response = await this.makeAnnotationRequest(file);
		this.validateResponse(response);
		return this.mapToAnnotatedImage(file, response);
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
			throw new ImageAnnotationValidationException(
				new EmptyAnnotationImageException()
			);
		}
	}

	private validateResponse(response: GoogleCloudAnnotationResponse) {
		if (!response) {
			throw new ImageAnnotationDependencyValidationException(
				new NullImageAnnotationResponseException()
			);
		}
	}

	private mapToAnnotatedImage(
		file: Buffer,
		response: GoogleCloudAnnotationResponse
	) {
		return new AnnotatedImage(
			file,
			[
				new FaceAnnotation(
					response.faceAnnotations![0].boundingPoly!.vertices!.map(
						({ x, y }) => new Vertex(x!, y!)
					)
				),
			],
			[
				new LogoAnnotation(
					response.logoAnnotations![0].boundingPoly!.vertices!.map(
						({ x, y }) => new Vertex(x!, y!)
					)
				),
			],
			[new TextAnnotation(response.textAnnotations![0].description!)]
		);
	}
}

import {
	GoogleCloudAnnotation,
	GoogleCloudAnnotationResponse,
	GoogleCloudBoundingPolygon,
	GoogleCloudEntityAnnotation,
	GoogleCloudVertex,
} from "../../brokers/GoogleCloudTypes";
import IllegalGoogleCloudAnnotationResponseException from "../../models/image-annotations/exceptions/IllegalGoogleCloudAnnotationResponseException";
import NullImageAnnotationResponseException from "../../models/image-annotations/exceptions/NullImageAnnotationResponseException";
import { isNil } from "../common/Conditions";
import IValidation from "../common/IValidation";
import IValidationResult from "../common/IValidationResult";
import Validation from "../common/Validation";
import ValidationResult from "../common/ValidationResult";
import Validator from "../common/Validator";

export default class GoogleCloudAnnotationResponseValidator extends Validator<GoogleCloudAnnotationResponse> {
	private readonly faceAnnotationParameter = "faceAnnotations";
	private readonly logoAnnotationParameter = "logoAnnotations";
	private readonly textAnnotationParameter = "textAnnotations";
	private readonly boundingPolygonParameter = "boundingPoly";
	private readonly verticesParameter = "vertices";
	private readonly descriptionParameter = "description";

	private readonly annotationExistsMessage = "Must exist on the response body";
	private readonly boundingBoxExistsMessage = "Must exist on the annotation";
	private readonly verticesExistsMessage = "Must exist on the bounding polygon";
	private readonly invalidVertexMessage = "Vertex must have an x and a y value";
	private readonly descriptionExistsMessage = "Must exist on the text annotation";

	public validate(response: GoogleCloudAnnotationResponse | null | undefined): void {
		if (isNil(response)) {
			throw new NullImageAnnotationResponseException();
		}
		const exception = new IllegalGoogleCloudAnnotationResponseException();
		this.executeValidation(
			exception,
			...this.ensureAnnotationsExist(response),
			...this.validateAnnotation(this.faceAnnotationParameter, response.faceAnnotations),
			...this.validateAnnotation(this.logoAnnotationParameter, response.logoAnnotations),
			...this.validateDescriptionExists(response.textAnnotations),
		);
		exception.throwIfContainsErrors();
	}

	private ensureAnnotationsExist(response: GoogleCloudAnnotationResponse) {
		return [
			new Validation(
				this.faceAnnotationParameter,
				this.hasProperty(response.faceAnnotations, this.annotationExistsMessage),
			),
			new Validation(
				this.logoAnnotationParameter,
				this.hasProperty(response.logoAnnotations, this.annotationExistsMessage),
			),
			new Validation(
				this.textAnnotationParameter,
				this.hasProperty(response.textAnnotations, this.annotationExistsMessage),
			),
		];
	}

	private hasProperty(property: any, message: string): IValidationResult {
		return new ValidationResult(isNil(property), message);
	}

	private validateAnnotation(
		parameter: string,
		annotations: GoogleCloudAnnotation[] | null | undefined,
	): IValidation[] {
		if (!annotations) {
			return [];
		}
		return this.validateBoundingBoxes(parameter, annotations);
	}

	private validateBoundingBoxes(parameter: string, annotations: GoogleCloudAnnotation[]) {
		return annotations.reduce<IValidation[]>(
			(validations, annotation, i) => [
				...validations,
				...this.validateBoundingBox(parameter, annotation, i),
			],
			[],
		);
	}

	private validateBoundingBox(parameter: string, annotation: GoogleCloudAnnotation, i: number) {
		const boundingPolygonParameter = this.calculateIndexParameter(
			parameter,
			i,
			this.boundingPolygonParameter,
		);
		const verticesParameter = this.calculateNestedParameter(
			boundingPolygonParameter,
			this.verticesParameter,
		);
		return [
			new Validation(
				boundingPolygonParameter,
				this.hasProperty(annotation.boundingPoly, this.boundingBoxExistsMessage),
			),
			...this.validateVertices(verticesParameter, annotation.boundingPoly),
		];
	}

	private calculateIndexParameter(parameter: string, i: number, suffix: string) {
		return `${parameter}[${i}].${suffix}`;
	}

	private calculateNestedParameter(parameter: string, suffix: string) {
		return `${parameter}.${suffix}`;
	}

	private validateVertices(
		parameter: string,
		polygon: GoogleCloudBoundingPolygon | null | undefined,
	): IValidation[] {
		if (!polygon) {
			return [];
		}
		return [
			this.ensureVerticesExist(parameter, polygon),
			...this.ensureVerticesAreWellFormatted(parameter, polygon),
		];
	}

	private ensureVerticesAreWellFormatted(parameter: string, polygon: GoogleCloudBoundingPolygon) {
		return (
			polygon.vertices?.map(
				(vertex, i) => new Validation(`${parameter}[${i}]`, this.isValidVertex(vertex)),
			) ?? []
		);
	}

	private ensureVerticesExist(parameter: string, polygon: GoogleCloudBoundingPolygon) {
		return new Validation(
			parameter,
			this.hasProperty(polygon.vertices, this.verticesExistsMessage),
		);
	}

	private isValidVertex(vertex: GoogleCloudVertex): IValidationResult {
		return new ValidationResult(isNil(vertex.x) || isNil(vertex.y), this.invalidVertexMessage);
	}

	private validateDescriptionExists(
		annotations: GoogleCloudEntityAnnotation[] | null | undefined,
	): IValidation[] {
		if (!annotations) {
			return [];
		}
		return annotations.map((annotation, i) => {
			const parameter = this.calculateIndexParameter(
				this.textAnnotationParameter,
				i,
				this.descriptionParameter,
			);
			return new Validation(
				parameter,
				this.hasProperty(annotation.description, this.descriptionExistsMessage),
			);
		});
	}
}

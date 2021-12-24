import {
	GoogleCloudAnnotation,
	GoogleCloudAnnotationResponse,
	GoogleCloudBoundingPolygon,
	GoogleCloudEntityAnnotation,
	GoogleCloudVertex,
} from "../brokers/GoogleCloudTypes";
import IllegalGoogleCloudAnnotationResponseException from "../models/Exceptions/IllegalGoogleCloudAnnotationResponseException";
import IValidation from "./IValidation";
import IValidationResult from "./IValidationResult";
import Validator from "./Validator";

export default class GoogleCloudAnnotationResponseValidator extends Validator<GoogleCloudAnnotationResponse> {
	public validate(response: GoogleCloudAnnotationResponse): void {
		const exception = new IllegalGoogleCloudAnnotationResponseException();
		this.executeValidation(
			exception,
			{
				parameter: "faceAnnotations",
				rule: this.isNotNull(response.faceAnnotations),
			},
			{
				parameter: "logoAnnotations",
				rule: this.isNotNull(response.logoAnnotations),
			},
			{
				parameter: "textAnnotations",
				rule: this.isNotNull(response.textAnnotations),
			},
			...this.validateAnnotation("faceAnnotations", response.faceAnnotations),
			...this.validateAnnotation("logoAnnotations", response.logoAnnotations),
			...this.validateDescriptionExists(response.textAnnotations),
		);
		exception.throwIfContainsErrors();
	}

	private isNotNull(property: any): IValidationResult {
		return {
			condition: property === null || property === undefined,
			message: "Must exist on the response body",
		};
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
		return annotations.reduce<IValidation[]>((validations, annotation, i) => {
			return [
				...validations,
				...this.validateVertices(
					`${parameter}[${i}].boundingPoly.vertices`,
					annotation.boundingPoly,
				),
				{
					rule: this.isNotNull(annotation.boundingPoly),
					parameter: `${parameter}[${i}].boundingPoly`,
				},
			];
		}, []);
	}

	private validateVertices(
		parameter: string,
		polygon: GoogleCloudBoundingPolygon | null | undefined,
	): IValidation[] {
		if (!polygon) {
			return [];
		}
		if (!polygon.vertices) {
			return [
				{
					rule: this.isNotNull(polygon.vertices),
					parameter: parameter,
				},
			];
		}
		return polygon.vertices.map((vertex, i) => {
			return {
				rule: this.isValidVertex(vertex),
				parameter: `${parameter}[${i}]`,
			};
		});
	}

	private isValidVertex(vertex: GoogleCloudVertex): IValidationResult {
		return {
			condition:
				vertex.x === null ||
				vertex.x === undefined ||
				vertex.y === null ||
				vertex.y === undefined,
			message: "Vertex must have an x and a y value",
		};
	}

	private validateDescriptionExists(
		annotations: GoogleCloudEntityAnnotation[] | null | undefined,
	): IValidation[] {
		if (!annotations) {
			return [];
		}
		return annotations.map((annotation, i) => {
			return {
				rule: this.isNotNull(annotation.description),
				parameter: `textAnnotations[${i}].description`,
			};
		});
	}
}

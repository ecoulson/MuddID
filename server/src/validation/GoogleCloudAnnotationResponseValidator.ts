import { GoogleCloudAnnotationResponse } from "../brokers/GoogleCloudTypes";
import IllegalGoogleCloudAnnotationResponseException from "../models/Exceptions/IllegalGoogleCloudAnnotationResponseException";
import IValidationResult from "./IValidationResult";
import Validator from "./Validator";

export default class GoogleCloudAnnotationResponseValidator extends Validator<GoogleCloudAnnotationResponse> {
	public validate(response: GoogleCloudAnnotationResponse): void {
		const exception = new IllegalGoogleCloudAnnotationResponseException();
		this.executeValidation(
			exception,
			{
				parameter: this.nameOf<GoogleCloudAnnotationResponse>("faceAnnotations"),
				rule: this.isDefined(response.faceAnnotations),
			},
			{
				parameter: this.nameOf<GoogleCloudAnnotationResponse>("logoAnnotations"),
				rule: this.isDefined(response.logoAnnotations),
			},
			{
				parameter: this.nameOf<GoogleCloudAnnotationResponse>("textAnnotations"),
				rule: this.isDefined(response.textAnnotations),
			},
		);
		exception.throwIfContainsErrors();
	}

	private isDefined(property: any): IValidationResult {
		return {
			condition: property === null || property === undefined,
			message: "Must exist on the response body",
		};
	}

	private nameOf<T>(key: keyof T): keyof T {
		return key;
	}
}

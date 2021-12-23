import IllegalGoogleCloudAnnotationResponseException from "../../src/models/Exceptions/IllegalGoogleCloudAnnotationResponseException";
import GoogleCloudAnnotationResponseValidator from "../../src/validation/GoogleCloudAnnotationResponseValidator";

describe("Google Cloud Annotation Response Validator Suite", () => {
	const validator = new GoogleCloudAnnotationResponseValidator();

	test("Should throw an exception when the response has no annotations", () => {
		const expectedError = new IllegalGoogleCloudAnnotationResponseException(
			new Map([
				["faceAnnotations", ["Must exist on the response body"]],
				["logoAnnotations", ["Must exist on the response body"]],
				["textAnnotations", ["Must exist on the response body"]],
			]),
		);

		expect.assertions(1);
		try {
			validator.validate({});
		} catch (error) {
			expect(error.data).toEqual(expectedError.data);
		}
	});
});

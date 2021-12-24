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

	test("Should throw an exception when the annotation has no bounding poly", () => {
		const expectedError = new IllegalGoogleCloudAnnotationResponseException(
			new Map([
				["faceAnnotations[0].boundingPoly", ["Must exist on the response body"]],
				["logoAnnotations[0].boundingPoly", ["Must exist on the response body"]],
				["textAnnotations", ["Must exist on the response body"]],
			]),
		);

		expect.assertions(1);
		try {
			validator.validate({
				faceAnnotations: [{}],
				logoAnnotations: [{}],
			});
		} catch (error) {
			expect(error.data).toEqual(expectedError.data);
		}
	});

	test("Should throw an exception when the text annotation has no description", () => {
		const expectedError = new IllegalGoogleCloudAnnotationResponseException(
			new Map([
				["faceAnnotations[0].boundingPoly", ["Must exist on the response body"]],
				["logoAnnotations[0].boundingPoly", ["Must exist on the response body"]],
				["textAnnotations[0].description", ["Must exist on the response body"]],
			]),
		);

		expect.assertions(1);
		try {
			validator.validate({
				faceAnnotations: [{}],
				logoAnnotations: [{}],
				textAnnotations: [{}],
			});
		} catch (error) {
			expect(error.data).toEqual(expectedError.data);
		}
	});

	test("Should throw an exception when the annotations have no vertices", () => {
		const expectedError = new IllegalGoogleCloudAnnotationResponseException(
			new Map([
				["faceAnnotations[0].boundingPoly.vertices", ["Must exist on the response body"]],
				["logoAnnotations[0].boundingPoly.vertices", ["Must exist on the response body"]],
				["textAnnotations[0].description", ["Must exist on the response body"]],
			]),
		);

		expect.assertions(1);
		try {
			validator.validate({
				faceAnnotations: [
					{
						boundingPoly: {},
					},
				],
				logoAnnotations: [
					{
						boundingPoly: {},
					},
				],
				textAnnotations: [{}],
			});
		} catch (error) {
			expect(error.data).toEqual(expectedError.data);
		}
	});
});

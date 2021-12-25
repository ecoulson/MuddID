import IllegalGoogleCloudAnnotationResponseException from "../../src/models/Exceptions/IllegalGoogleCloudAnnotationResponseException";
import NullImageAnnotationResponseException from "../../src/models/Exceptions/NullImageAnnotationResponseException";
import GoogleCloudAnnotationResponseValidator from "../../src/validation/GoogleCloudAnnotationResponseValidator";

describe("Google Cloud Annotation Response Validator Suite", () => {
	const validator = new GoogleCloudAnnotationResponseValidator();

	test("Should throw an exception when the response is undefined or null", () => {
		const expectedError = new NullImageAnnotationResponseException();

		expect.assertions(1);
		try {
			validator.validate(null);
		} catch (error) {
			expect(error).toEqual(expectedError);
		}
	});

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
				["faceAnnotations[0].boundingPoly", ["Must exist on the annotation"]],
				["logoAnnotations[0].boundingPoly", ["Must exist on the annotation"]],
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
				["faceAnnotations[0].boundingPoly", ["Must exist on the annotation"]],
				["logoAnnotations[0].boundingPoly", ["Must exist on the annotation"]],
				["textAnnotations[0].description", ["Must exist on the text annotation"]],
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
				[
					"faceAnnotations[0].boundingPoly.vertices",
					["Must exist on the bounding polygon"],
				],
				[
					"logoAnnotations[0].boundingPoly.vertices",
					["Must exist on the bounding polygon"],
				],
				["textAnnotations[0].description", ["Must exist on the text annotation"]],
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

	test("Should throw an exception when there exist illegal vertices", () => {
		const expectedError = new IllegalGoogleCloudAnnotationResponseException(
			new Map([
				[
					"faceAnnotations[0].boundingPoly.vertices[0]",
					["Vertex must have an x and a y value"],
				],
				[
					"logoAnnotations[0].boundingPoly.vertices[0]",
					["Vertex must have an x and a y value"],
				],
				["textAnnotations[0].description", ["Must exist on the text annotation"]],
			]),
		);

		expect.assertions(1);
		try {
			validator.validate({
				faceAnnotations: [
					{
						boundingPoly: {
							vertices: [
								{
									x: 0,
								},
							],
						},
					},
				],
				logoAnnotations: [
					{
						boundingPoly: {
							vertices: [
								{
									y: 0,
								},
							],
						},
					},
				],
				textAnnotations: [{}],
			});
		} catch (error) {
			expect(error.data).toEqual(expectedError.data);
		}
	});
});

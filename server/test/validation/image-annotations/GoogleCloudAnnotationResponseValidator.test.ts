import IllegalGoogleCloudAnnotationResponseException from "../../../src/models/image-annotations/exceptions/IllegalGoogleCloudAnnotationResponseException";
import NullImageAnnotationResponseException from "../../../src/models/image-annotations/exceptions/NullImageAnnotationResponseException";
import GoogleCloudAnnotationResponseValidator from "../../../src/validations/image-annotations/GoogleCloudAnnotationResponseValidator";

describe("Google Cloud Annotation Response Validator Suite", () => {
	const validator = new GoogleCloudAnnotationResponseValidator();

	test("Should throw an exception when the response is undefined or null", () => {
		const expectedError = new NullImageAnnotationResponseException();

		expect(() => {
			validator.validate(null);
		}).toBeSameException(expectedError);
	});

	test("Should throw an exception when the response has no annotations", () => {
		const expectedException = new IllegalGoogleCloudAnnotationResponseException(
			new Map([
				["faceAnnotations", ["Must exist on the response body"]],
				["logoAnnotations", ["Must exist on the response body"]],
				["textAnnotations", ["Must exist on the response body"]],
			]),
		);

		expect(() => {
			validator.validate({});
		}).toBeSameException(expectedException);
	});

	test("Should throw an exception when the annotation has no bounding poly", () => {
		const expectedException = new IllegalGoogleCloudAnnotationResponseException(
			new Map([
				["faceAnnotations[0].boundingPoly", ["Must exist on the annotation"]],
				["logoAnnotations[0].boundingPoly", ["Must exist on the annotation"]],
				["textAnnotations", ["Must exist on the response body"]],
			]),
		);

		expect(() => {
			validator.validate({
				faceAnnotations: [{}],
				logoAnnotations: [{}],
			});
		}).toBeSameException(expectedException);
	});

	test("Should throw an exception when the text annotation has no description", () => {
		const expectedException = new IllegalGoogleCloudAnnotationResponseException(
			new Map([
				["faceAnnotations[0].boundingPoly", ["Must exist on the annotation"]],
				["logoAnnotations[0].boundingPoly", ["Must exist on the annotation"]],
				["textAnnotations[0].description", ["Must exist on the text annotation"]],
			]),
		);

		expect(() => {
			validator.validate({
				faceAnnotations: [{}],
				logoAnnotations: [{}],
				textAnnotations: [{}],
			});
		}).toBeSameException(expectedException);
	});

	test("Should throw an exception when the annotations have no vertices", () => {
		const expectedException = new IllegalGoogleCloudAnnotationResponseException(
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

		expect(() => {
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
		}).toBeSameException(expectedException);
	});

	test("Should throw an exception when there exist illegal vertices", () => {
		const expectedException = new IllegalGoogleCloudAnnotationResponseException(
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

		expect(() => {
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
		}).toBeSameException(expectedException);
	});
});

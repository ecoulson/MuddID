import { Readable } from "typeorm/platform/PlatformTools";
import FileStream from "../../../src/models/common/files/FileStream";
import IllegalFileStreamException from "../../../src/models/image-extractors/exceptions/IllegalFileStreamException";
import ImageExtractorFileStreamValidator from "../../../src/validations/image-extrators/ImageExtractorFileStreamValidator";

test("Image Extractor File Stream Validator", () => {
	const validator = new ImageExtractorFileStreamValidator();

	describe("When validating an illegal file name it should throw an illegal file stream exception", () => {
		const inputStream = Readable.from("");
		const inputFileStream = new FileStream("image.png", inputStream);
		const expectedValidationErrors = new Map([["name", ["Name is an invalid UUID"]]]);
		const expectedException = new IllegalFileStreamException(expectedValidationErrors);

		try {
			expect.assertions(1);
			validator.validate(inputFileStream);
		} catch (error) {
			expect(error).toEqual(expectedException);
		}
	});
});

import dotenv from "dotenv";
import vision from "@google-cloud/vision";

dotenv.config();

const annotateImage = async (fileName: string) => {
	const client = new vision.ImageAnnotatorClient();

	const [result] = await client.annotateImage({
		features: [
			{ type: "FACE_DETECTION" },
			{ type: "LOGO_DETECTION" },
			{ type: "DOCUMENT_TEXT_DETECTION" },
			{ type: "CROP_HINTS" },
		],
		image: {
			source: {
				filename: fileName,
			},
		},
	});
	return result;
};

export default annotateImage;

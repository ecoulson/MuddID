import { ReadStream } from "fs";
import { ImageAnnotatorClient } from "../constants";
import { streamToBuffer } from "./stream-to-buffer";

const annotateImage = async (fileStream: ReadStream) => {
	const [result] = await ImageAnnotatorClient.annotateImage({
		features: [
			{ type: "FACE_DETECTION" },
			{ type: "LOGO_DETECTION" },
			{ type: "DOCUMENT_TEXT_DETECTION" },
			{ type: "CROP_HINTS" },
		],
		image: {
			content: await streamToBuffer(fileStream),
		},
	});
	return result;
};

export default annotateImage;

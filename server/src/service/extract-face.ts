import { google } from "@google-cloud/vision/build/protos/protos";
import { createReadStream } from "fs";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { S3Client } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { AWS_REGION, VERIFICATION_IMAGES_BUCKET } from "../constants";

const s3Client = new S3Client({
	region: AWS_REGION,
});

type GoogleImageAnnotation = google.cloud.vision.v1.IAnnotateImageResponse;

type BoundingBox = {
	left: number;
	top: number;
	width: number;
	height: number;
};

async function extractFace(
	fileName: string,
	annotations: GoogleImageAnnotation
): Promise<string> {
	if (!annotations.faceAnnotations) {
		throw new Error("Face not found in image");
	}
	const boundingBox: BoundingBox = getFaceBoundingBox(
		annotations.faceAnnotations
	);
	const path = fileName.split(".")[0] + "_logo.jpg";
	await sharp(fileName).extract(boundingBox).toFile(path);
	await uploadImage(path);
	return path;
}

function getFaceBoundingBox(
	faceAnnotations: google.cloud.vision.v1.IFaceAnnotation[]
) {
	let right = 0;
	let bottom = 0;
	const boundingBox: BoundingBox = {
		top: Infinity,
		left: Infinity,
		width: 0,
		height: 0,
	};

	faceAnnotations[0].fdBoundingPoly?.vertices?.forEach((vertex) => {
		boundingBox.top = Math.min(boundingBox.top, vertex.y!);
		boundingBox.left = Math.min(boundingBox.left, vertex.x!);
		right = Math.max(right, vertex.x!);
		bottom = Math.max(bottom, vertex.y!);
		boundingBox.width = Math.max(
			boundingBox.width,
			right - boundingBox.left
		);
		boundingBox.height = Math.max(
			boundingBox.height,
			bottom - boundingBox.top
		);
	});
	return boundingBox;
}

async function uploadImage(path: string) {	
	return await s3Client.send(
		new PutObjectCommand({
			Bucket: VERIFICATION_IMAGES_BUCKET,
			Key: "test",
			Body: createReadStream(path),
		})
	);
}

export { extractFace };

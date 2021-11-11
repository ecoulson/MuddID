import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { PassThrough } from "stream";
import { S3 } from "../constants";

export function uploadImage(bucket: string, key: string, readStream: Buffer) {
	return S3.send(
		new PutObjectCommand({
			Bucket: bucket,
			Key: key,
			Body: readStream,
		})
	);
}

export function uploadImageStream(bucket: string, key: string) {
	const passThrough = new PassThrough();
	const upload = new Upload({
		client: S3,
		params: {
			Bucket: bucket,
			Key: key,
			Body: passThrough,
		},
	});
	return {
		passThrough,
		upload,
	};
}

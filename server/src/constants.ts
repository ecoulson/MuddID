import { S3Client } from "@aws-sdk/client-s3";
import vision from "@google-cloud/vision";
import { getEnvironmentValue, Environment } from "./environment";

export const __prod__ = process.env.NODE_ENV === "production";

export const S3 = new S3Client({
	region: getEnvironmentValue(Environment.AWS_REGION),
});

export const ImageAnnotatorClient = new vision.ImageAnnotatorClient();

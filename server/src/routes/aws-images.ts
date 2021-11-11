import { GetObjectCommand } from "@aws-sdk/client-s3";
import { Router } from "express";
import internal from "stream";
import { S3 } from "../constants";

const router = Router();

router.get("/:bucket", async (req, res) => {
	try {
		const result = await S3.send(
			new GetObjectCommand({
				Key: req.query.key as string,
				Bucket: req.params.bucket,
				ResponseContentType: "application/octet-stream",
			})
		);
		if (!isReadable(result.Body)) {
			throw new Error("body must be readable object");
		}
		const stream = result.Body as internal.Readable;
		stream.pipe(res);
	} catch (error) {
		console.error(error);
		throw new Error(
			`Failed to get image in bucket ${req.params.bucket} at key ${req.query.key}`
		);
	}
});

function isReadable(x: any): x is internal.Readable {
	return x instanceof internal.Readable;
}
export default router;

import { useDropzone } from "react-dropzone";
import React, { useCallback } from "react";
import { useUploadIdMutation } from "../generated/graphql";

interface UploadIdProps {}

const UploadId: React.FC<UploadIdProps> = ({}) => {
	const [, uploadId] = useUploadIdMutation();
	const onDrop = useCallback(async (acceptedFiles: File[]) => {
		const idResponse = await uploadId({
			file: acceptedFiles[0],
		});
		console.log(idResponse);
	}, []);
	const { getInputProps, getRootProps, isDragActive } = useDropzone({
		onDrop,
	});

	return (
		<div {...getRootProps()}>
			<input {...getInputProps()} />
			{isDragActive ? (
				<p>Drop here</p>
			) : (
				<p>Drop here or click to select</p>
			)}
		</div>
	);
};

export default UploadId;

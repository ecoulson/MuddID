import { useDropzone } from "react-dropzone";
import React, { useCallback, useState } from "react";
import { useUploadIdMutation } from "../generated/graphql";
import { Box } from "@chakra-ui/layout";
import { Layout } from "../components/Layout";
import { Button, Flex } from "@chakra-ui/react";
import { ImagePreview } from "../components/ImagePreview";
import { useRouter } from "next/router";

interface UploadIdProps {}

const UploadId: React.FC<UploadIdProps> = ({}) => {
	const router = useRouter();
	const [{ fetching }, uploadId] = useUploadIdMutation();
	const [file, setUploadedFile] = useState<File | null>(null);

	const onDrop = useCallback((acceptedFiles: File[]) => {
		setUploadedFile(acceptedFiles[0]);
	}, []);

	const onVerify = async () => {
		const result = await uploadId({
			file,
		});
		console.log(result);
		router.push(`/verify-id/${result.data.uploadId.id}`);
	};

	const { getInputProps, getRootProps } = useDropzone({
		onDrop,
		accept: "image/jpeg, image/png",
	});

	return (
		<Layout>
			<Flex
				mt="25px"
				flexDir="column"
				alignItems="center"
				justifyContent="center"
			>
				<ImagePreview file={file} />
				<Box mt="25px" w="250px" {...getRootProps()}>
					<input {...getInputProps()} />
					<Button w="inherit">Upload Id</Button>
				</Box>
				<Button
					onClick={onVerify}
					isLoading={fetching}
					mt="25px"
					w="250px"
					colorScheme="blue"
				>
					Verify
				</Button>
			</Flex>
		</Layout>
	);
};

export default UploadId;

import { Flex, Text } from "@chakra-ui/layout";
import React, { useEffect, useState } from "react";

interface ImagePreviewProps {
	file: File | null;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ file }) => {
	const [preview, setPreview] = useState("");

	useEffect(() => {
		if (file) {
			setPreview(URL.createObjectURL(file));
		}
	}, [file]);

	return (
		<Flex flexDir="column">
			<Flex
				w="600px"
				h="400px"
				border={!file ? "2px dotted black" : null}
				justifyContent="center"
				alignItems="Center"
				overflow="hidden"
			>
				{file ? (
					<img width="600px" height="400px" src={preview} />
				) : (
					<Text>Preview Uploaded Id</Text>
				)}
			</Flex>
		</Flex>
	);
};

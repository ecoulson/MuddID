import { Flex, Text, Image } from "@chakra-ui/react";
import React from "react";
import ImageVerificationDTO from "../data/image-verification-dto";

export interface ImageVerificationProps {
	verificationDto: ImageVerificationDTO;
}

export const ImageVerification: React.FC<ImageVerificationProps> = ({
	verificationDto,
}) => {
	return (
		<Flex flexDir="column" alignItems="center">
			<Image
				width={verificationDto.width}
				height={verificationDto.height}
				src={verificationDto.url()}
			/>
			<Text>{prompt}</Text>
		</Flex>
	);
};

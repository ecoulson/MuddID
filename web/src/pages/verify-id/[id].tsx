import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { Heading } from "@chakra-ui/layout";
import { Button, Flex, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { ImageVerification } from "../../components/ImageVerification";
import { Layout } from "../../components/Layout";
import { TextVerification } from "../../components/TextVerification";
import FieldDTO from "../../data/field-dto";
import ImageVerificationDTO from "../../data/image-verification-dto";
import { FACE_PROMPT, IMAGE_PROMPT, LOGO_PROMPT } from "../../data/prompt";
import TextVerificationDTO from "../../data/text-verification-dto";
import { useIdQuery } from "../../generated/graphql";

interface VerifyIdProps {}

const VerifyId: React.FC<VerifyIdProps> = () => {
	const router = useRouter();
	const [{ data, fetching }] = useIdQuery({
		variables: {
			id: router.query.id as string,
		},
	});
	const [stageIndex, setStageIndex] = useState(0);

	const stages = [
		new ImageVerificationDTO("uploads", [600, 400], IMAGE_PROMPT, data),
		new ImageVerificationDTO("face", [150, 150], FACE_PROMPT, data),
		new ImageVerificationDTO("logo", [150, 150], LOGO_PROMPT, data),
		new TextVerificationDTO([
			new FieldDTO("ID", "id", data),
			new FieldDTO("Name", "name", data),
			new FieldDTO("Date Of Birth", "dateOfBirth", data),
			new FieldDTO("Type", "type", data),
		]),
	];
	const stage = stages[stageIndex];

	return (
		<Layout>
			<Heading my="25px" textAlign="center">
				Verify Extracted Information
			</Heading>
			<Flex w="100%" justifyContent="center">
				{fetching ? (
					<Spinner />
				) : (
					<Flex flexDir="column" alignItems="center">
						{stage.type === "IMAGE_VERIFICATION" ? (
							<ImageVerification
								verificationDto={stage as ImageVerificationDTO}
							/>
						) : (
							<TextVerification
								verificationDTO={stage as TextVerificationDTO}
							/>
						)}
						{stageIndex === stages.length - 1 ? (
							<Button
								type="submit"
								onClick={() =>
									router.push(
										`/issue-credential/${router.query.id}`
									)
								}
							>
								Confirm Verification
							</Button>
						) : (
							<Flex mt="25px">
								<Button
									onClick={() =>
										setStageIndex(stageIndex + 1)
									}
									width={50}
									mx={5}
									colorScheme="green"
								>
									<CheckIcon color="white" />
								</Button>
								<Button
									width={50}
									mx={5}
									onClick={() => router.push("/upload-id")}
									colorScheme="red"
								>
									<CloseIcon color="white" />
								</Button>
							</Flex>
						)}
					</Flex>
				)}
			</Flex>
		</Layout>
	);
};

export default VerifyId;

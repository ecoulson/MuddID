import { Center, Heading, Text, VStack } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import {
	useIssuanceStateMutation,
	useIssueCredentialQuery,
} from "../../generated/graphql";

interface IssueCredentialProps {}

const IssueCredential: React.FC<IssueCredentialProps> = () => {
	const [status, setStatus] = useState<{ message: string; code: string }>({
		message: "",
		code: "0",
	});
	const router = useRouter();
	const [
		{ data: issuanceState, fetching: fetchingIssuanceState },
		getIssuanceState,
	] = useIssuanceStateMutation();
	const [{ data: issuedCredential, fetching: fetchingIssuedCredential }] =
		useIssueCredentialQuery({
			variables: {
				idNumber: router.query.id as string,
			},
		});

	useEffect(() => {
		getIssuanceState();
		setInterval(() => {
			getIssuanceState();
		}, 10 * 1000);
	}, []);

	useEffect(() => {
		if (issuanceState) {
			setStatus({
				code: issuanceState.state.status,
				message: issuanceState.state.message,
			});
		}
	}, [fetchingIssuanceState]);

	if (fetchingIssuedCredential) {
		return (
			<Layout>
				<Spinner />
			</Layout>
		);
	}
	return (
		<Layout>
			<Center>
				<VStack my="25px">
					<Heading>Scan the QR Code to get your credential</Heading>
					{status.code === "0" && (
						<img src={issuedCredential.issue.qrCode} />
					)}
					<Text>{status.message}</Text>
					<Text>Pin: {issuedCredential.issue.pin}</Text>
				</VStack>
			</Center>
		</Layout>
	);
};

export default IssueCredential;

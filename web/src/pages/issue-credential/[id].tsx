import { Center, Heading, VStack } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Layout } from "../../components/Layout";
import {
	useIssuanceStateMutation,
	useIssueCredentialQuery,
} from "../../generated/graphql";

interface IssueCredentialProps {}

const IssueCredential: React.FC<IssueCredentialProps> = () => {
	const router = useRouter();
	const [{}, getIssuanceState] = useIssuanceStateMutation();
	const [{ data, fetching }] = useIssueCredentialQuery({
		variables: {
			idNumber: router.query.id as string,
		},
	});

	useEffect(() => {
		if (!fetching) {
			getIssuanceState({
				sessionId: data.issue.sessionId,
			});
		}
	}, [fetching]);

	if (fetching) {
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
					<img src={data.issue.qrCode} />
				</VStack>
			</Center>
		</Layout>
	);
};

export default IssueCredential;

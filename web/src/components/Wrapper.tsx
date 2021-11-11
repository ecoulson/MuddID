import { Box } from "@chakra-ui/layout";
import React from "react";

interface WrapperProps {}

export const Wrapper: React.FC<WrapperProps> = ({ children }) => {
	return (
		<Box mx="auto" width="100%" maxWidth="1200px">
			{children}
		</Box>
	);
};

import { Flex } from "@chakra-ui/react";
import React from "react";
import Image from "next/image";

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = () => {
	return (
		<Flex justifyContent="center" backgroundColor="black">
			<Image width={75} height={75} src="/logo.png" />
		</Flex>
	);
};

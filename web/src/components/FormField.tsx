import { Flex } from "@chakra-ui/layout";
import { Field } from "formik";
import React from "react";

interface FormFieldProps {
	name: string;
	label: string;
	type?: string;
	placeholder?: string;
	value?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
	name,
	label,
	...props
}) => {
	return (
		<Flex justifyDir="column" width="300px" justifyContent="space-between">
			<label htmlFor={name}>{label}</label>
			<Field id={name} name={name} {...props} />
		</Flex>
	);
};

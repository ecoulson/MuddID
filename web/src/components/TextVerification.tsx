import { Formik } from "formik";
import React from "react";
import TextVerificationDTO from "../data/text-verification-dto";
import { FormField } from "./FormField";

interface TextVerificationProps {
	verificationDTO: TextVerificationDTO;
}

export const TextVerification: React.FC<TextVerificationProps> = ({
	verificationDTO,
}) => {
	function getInitialValues() {
		return verificationDTO.fields.reduce<any>((values, field) => {
			values[field.name] = field.value();
			return values;
		}, {});
	}

	function handleSubmit() {}

	return (
		<Formik initialValues={getInitialValues()} onSubmit={handleSubmit}>
			<>
				{verificationDTO.fields.map((field) => (
					<FormField
						label={field.label}
						name={field.name}
						value={field.value()}
					/>
				))}
			</>
		</Formik>
	);
};

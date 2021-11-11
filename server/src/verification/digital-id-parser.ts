import { DigitalId } from "../entities/DigitalId";
import { Environment, getEnvironmentValue } from "../environment";

const NAME_PATTERN = /(?![Student])(?:[A-Z]{1}[a-z]+( )*)+/gm;
const ID_PATTERN = /[0-9]{9}(?:-[0-9]+)|[0-9]{9}(?!-)/gm;
const DATE_OF_BIRTH_PATTERN = /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}/gm;

export function parseDigitalId(fileName: string, text: string) {
	return new DigitalId(
		parseRegex(ID_PATTERN, text),
		getAWSObjectUrl(`logo/${fileName}`),
		getAWSObjectUrl(`face/${fileName}`),
		parseRegex(NAME_PATTERN, text),
		"STUDENT",
		new Date(parseRegex(DATE_OF_BIRTH_PATTERN, text))
	);
}

function parseRegex(regex: RegExp, input: string) {
	const result = regex.exec(input);
	if (!result || result.length == 0) {
		return "";
	}
	return result[0].trim();
}

function getAWSObjectUrl(key: string) {
	return `https://${getEnvironmentValue(
		Environment.VERIFICATION_IMAGES_BUCKET
	)}.s3.${getEnvironmentValue(Environment.AWS_REGION)}.amazonaws.com/${key}`;
}

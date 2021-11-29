import { DigitalId } from "../entities/DigitalId";

const NAME_PATTERN = /(?![Student])(?:[A-Z]{1}[a-z]+( )*)+/gm;
const ID_PATTERN = /[0-9]{9}(?:-[0-9]+)|[0-9]{9}(?!-)/gm;
const DATE_OF_BIRTH_PATTERN = /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}/gm;

export function parseDigitalId(fileName: string, text: string) {
	const dateOfBirth = parseRegex(DATE_OF_BIRTH_PATTERN, text);
	return new DigitalId(
		parseRegex(ID_PATTERN, text),
		fileName,
		parseRegex(NAME_PATTERN, text),
		"STUDENT",
		dateOfBirth ? new Date(dateOfBirth) : new Date()
	);
}

function parseRegex(regex: RegExp, input: string) {
	const result = regex.exec(input);
	if (!result || result.length == 0) {
		return "";
	}
	return result[0].trim();
}

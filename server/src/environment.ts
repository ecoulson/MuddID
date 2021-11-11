export enum Environment {
	AWS_REGION = "AWS_REGION",
	VERIFICATION_IMAGES_BUCKET = "VERIFICATION_IMAGES_BUCKET",
}

export function getEnvironmentValue(key: Environment) {
	if (!process.env[key]) {
		throw new Error(`Environment variable ${key} is not set`);
	}
	return process.env[key] as string;
}

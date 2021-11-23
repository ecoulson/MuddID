export enum Environment {
	AWS_REGION = "AWS_REGION",
	VERIFICATION_IMAGES_BUCKET = "VERIFICATION_IMAGES_BUCKET",
	SESSION_SECRET = "SESSION_SECRET",
	AZURE_CLIENT_ID = "AZURE_CLIENT_ID",
	AZURE_TENANT_ID = "AZURE_TENANT_ID",
	AZURE_CLIENT_SECRET = "AZURE_CLIENT_SECRET",
	ISSUANCE_AUTHORITY = "ISSUANCE_AUTHORITY",
	CREDENTIAL_MANIFEST = "CREDENTIAL_MANIFEST",
	CALLBACK_HOST = "CALLBACK_HOST",
}

export function getEnvironmentValue(key: Environment) {
	if (!process.env[key]) {
		throw new Error(`Environment variable ${key} is not set`);
	}
	return process.env[key] as string;
}

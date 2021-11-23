import { Environment, getEnvironmentValue } from "./environment";
import { ConfidentialClientApplication } from "@azure/msal-node";
import { __prod__ } from "./constants";

const msalConfig = {
	auth: {
		clientId: getEnvironmentValue(Environment.AZURE_CLIENT_ID),
		authority: `https://login.microsoftonline.com/${getEnvironmentValue(
			Environment.AZURE_TENANT_ID
		)}`,
		clientSecret: getEnvironmentValue(Environment.AZURE_CLIENT_SECRET),
	},
	system: {
		loggerOptions: {
			loggerCallback(
				_logLevel: any,
				message: string,
				containsPii: boolean
			) {
				if (!containsPii && __prod__) {
					console.log(message);
				}
			},
			piiLoggingEnabled: false,
			logLevel: 3,
		},
	},
};

export const MSALConfidentialClientApplication =
	new ConfidentialClientApplication(msalConfig);

export const MSALClientCredentialRequest = {
	scopes: ["bbb94529-53a3-4be5-a069-7eaf2712b826/.default"],
	skipCache: false,
};

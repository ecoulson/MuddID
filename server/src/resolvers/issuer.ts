import { Arg, Ctx, Query } from "type-graphql";
import axios from "axios";
import { DigitalId } from "../entities/DigitalId";
import { IssuanceResponse } from "../entities/IssuanceResponse";
import {
	MSALClientCredentialRequest,
	MSALConfidentialClientApplication,
} from "../msal";
import { AppContext } from "../types";
import { Environment, getEnvironmentValue } from "../environment";
import QRCode from "qrcode";
import { getSession, hasSession, setSession } from "../session";

export type IssuanceAPIResponse = {
	data: {
		requestId: string;
		url: string;
		expiry: number;
		qrCode: string;
	};
};

type IssuanceBody = {
	authority: string;
	includeQRCode: boolean;
	registration: {
		clientName: string;
	};
	callback: {
		url: string;
		state: string;
	};
	issuance: {
		type: string;
		manifest: string;
		pin: {
			value: string;
			length: number;
		};
		claims: {
			family_name: string;
			given_name: string;
			id: string;
			student_photo: string;
			date_of_birth: string;
			type: string;
		};
	};
};

export class IssuerResolver {
	@Query(() => IssuanceResponse)
	async issue(
		@Arg("idNumber", () => String) idNumber: string,
		@Ctx() { req }: AppContext
	): Promise<IssuanceResponse> {
		try {
			const studentId = await DigitalId.findOne(idNumber);
			if (!studentId) {
				throw new Error("Not student with id: " + idNumber);
			}
			const sessionId = req.session.id;
			this.intializeSession(sessionId);
			const accessToken = await this.getAccessToken();
			const payload = this.getIssuanceConfig(sessionId);
			this.setClaims(studentId, payload);
			const issuanceResponse = await this.makeIssuanceRequest(
				payload,
				accessToken
			);
			const requestURLCode = await this.getQRCode(
				issuanceResponse.data.url
			);
			return new IssuanceResponse(
				issuanceResponse,
				payload.issuance.pin.value,
				sessionId,
				requestURLCode
			);
		} catch (e) {
			throw new Error(
				"Could not acquire credentials to access your Azure Key Vault"
			);
		}
	}

	private async intializeSession(sessionId: string) {
		if (await hasSession(sessionId)) {
			const session = await getSession(sessionId);
			session.sessionData = {
				status: 0,
				message: "Waiting for QR code to be scanned",
			};
			await setSession(sessionId, session);
		}
	}

	private async getAccessToken() {
		const result =
			await MSALConfidentialClientApplication.acquireTokenByClientCredential(
				MSALClientCredentialRequest
			);
		if (result) {
			return result.accessToken;
		}
		return "";
	}

	private makeIssuanceRequest(payload: any, accessToken: string) {
		return axios.post<IssuanceBody, IssuanceAPIResponse>(
			`https://beta.did.msidentity.com/v1.0/${getEnvironmentValue(
				Environment.AZURE_TENANT_ID
			)}/verifiablecredentials/request`,
			payload,
			{
				headers: {
					"Content-Length": JSON.stringify(payload).length.toString(),
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
			}
		);
	}

	private setClaims(studentId: DigitalId, payload: IssuanceBody) {
		const nameParts = studentId.name.split(" ");
		payload.issuance.claims = {
			given_name: nameParts[0],
			family_name:
				nameParts.length === 1 ? "" : nameParts[nameParts.length - 1],
			id: studentId.id,
			date_of_birth: studentId.dateOfBirth.toUTCString(),
			student_photo: studentId.uploadFilename,
			type: studentId.type,
		};
	}

	private getIssuanceConfig(id: string): IssuanceBody {
		return {
			authority: getEnvironmentValue(Environment.ISSUANCE_AUTHORITY),
			includeQRCode: false,
			registration: {
				clientName: "Harvey Mudd College Id Verification",
			},
			callback: {
				url: `https://${getEnvironmentValue(
					Environment.CALLBACK_HOST
				)}/api/issuer/issuance-request-callback`,
				state: id,
			},
			issuance: {
				type: "HMCId",
				manifest: getEnvironmentValue(Environment.CREDENTIAL_MANIFEST),
				pin: {
					value: "1234",
					length: 4,
				},
				claims: {
					family_name: "",
					given_name: "",
					date_of_birth: "",
					id: "",
					type: "",
					student_photo: "",
				},
			},
		};
	}

	private getQRCode(url: string) {
		return new Promise<string>((resolve, reject) => {
			QRCode.toDataURL(url, (error, qrCodeDataURL) => {
				if (error) {
					return reject(error);
				}
				return resolve(qrCodeDataURL);
			});
		});
	}
}

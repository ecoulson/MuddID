import { Field, InputType, ObjectType } from "type-graphql";
import { IssuanceAPIResponse } from "../resolvers/issuer";

@InputType()
export class IssuanceRequest {}

@ObjectType()
export class IssuanceResponse {
	@Field()
	requestId: string;
	@Field()
	url: string;
	@Field()
	expiry: number;
	@Field()
	qrCode: string;
	@Field()
	pin: string;
	@Field()
	sessionId: string;

	constructor(
		response: IssuanceAPIResponse,
		pin: string,
		sessionId: string,
		qrCode: string
	) {
		this.requestId = response.data.requestId;
		this.url = response.data.url;
		this.expiry = response.data.expiry;
		this.qrCode = qrCode;
		this.pin = pin;
		this.sessionId = sessionId;
	}
}

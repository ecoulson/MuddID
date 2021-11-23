import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class IssuanceState {
	@Field()
	status: string;
	@Field()
	message: string;

	constructor(status: number | string, message: string) {
		this.status = status.toString();
		this.message = message;
	}
}

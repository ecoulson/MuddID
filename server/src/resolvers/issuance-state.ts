import { Ctx, Mutation } from "type-graphql";
import { IssuanceState } from "../entities/IssuanceState";
import { getSession } from "../session";
import { AppContext } from "../types";

export class IssuanceStateResolver {
	@Mutation(() => IssuanceState)
	async state(@Ctx() { req }: AppContext) {
		const { sessionData } = await getSession(req.sessionID);
		if (!sessionData) {
			throw new Error("Failed to retrieve session");
		}
		const { message, status } = sessionData;
		return new IssuanceState(status, message);
	}
}

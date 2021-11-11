import { Arg, Query } from "type-graphql";
import { DigitalId } from "../entities/DigitalId";

export class IdResolver {
	@Query(() => DigitalId, { nullable: true })
	async id(@Arg("id") id: string): Promise<DigitalId | undefined> {
		return DigitalId.findOne(id);
	}

	
}

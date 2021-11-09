import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class DigitalId {
	@Field()
	public id: string;

	@Field()
	public logoText: string;

	@Field()
	public logoPhotoUrl: string;

	@Field()
	public name: string;

	@Field()
	public type: "STUDENT";

	@Field()
	public dateOfBirth: Date;

	constructor(
		id: string,
		logoText: string,
		logoPhotoUrl: string,
		name: string,
		type: "STUDENT",
		dateOfBirth: Date
	) {
		this.id = id;
		this.logoText = logoText;
		this.logoPhotoUrl = logoPhotoUrl;
		this.name = name;
		this.type = type;
		this.dateOfBirth = dateOfBirth;
	}
}

import { DigitalId, IdQuery } from "../generated/graphql";

export default class FieldDTO {
	public name: keyof DigitalId;
	public label: string;
	private data: IdQuery;

	constructor(label: string, name: keyof DigitalId, data: IdQuery) {
		(this.name = name), (this.label = label);
		this.data = data;
	}

	value() {
		return this.data.id[this.name];
	}
}

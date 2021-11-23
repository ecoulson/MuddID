import FieldDTO from "./field-dto";

export default class TextVerificationDTO {
	public type: string;
	public fields: FieldDTO[];

	constructor(field: FieldDTO[]) {
		this.type = "TEXT_VERIFICATION";
		this.fields = field;
	}
}

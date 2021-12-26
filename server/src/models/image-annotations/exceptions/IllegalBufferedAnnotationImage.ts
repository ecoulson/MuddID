import Exception from "../../common/exception/Exception";

export default class IllegalBufferedAnnotationImage extends Exception {
	constructor(data?: Map<string, string[]>) {
		super(IllegalBufferedAnnotationImage.name);
		this.addData(data ?? new Map<string, string[]>());
	}
}

import Vertex from "./Vertex";

export default class LogoAnnotation {
	public readonly boundingPolygon: Vertex[];

	constructor(boundingPolygon: Vertex[]) {
		this.boundingPolygon = boundingPolygon;
	}
}

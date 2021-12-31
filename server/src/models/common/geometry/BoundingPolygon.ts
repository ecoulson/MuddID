import Vertex from "./Vertex";

export default class BoundingPolygon {
	public readonly boundingPolygon: Vertex[];

	constructor(boundingPolygon: Vertex[]) {
		this.boundingPolygon = boundingPolygon;
	}
}

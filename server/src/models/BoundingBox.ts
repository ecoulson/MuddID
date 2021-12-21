import Vertex from "./Vertex";

export default class BoundingBox {
	public readonly boundingPolygon: Vertex[];

	constructor(boundingPolygon: Vertex[]) {
		this.boundingPolygon = boundingPolygon;
	}
}

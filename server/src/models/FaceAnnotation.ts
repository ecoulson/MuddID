import Vertex from "./Vertex";

export default class FaceAnnotation {
	public readonly boundingPolygon: Vertex[];

	constructor(boundingPolygon: Vertex[]) {
		this.boundingPolygon = boundingPolygon;
	}
}

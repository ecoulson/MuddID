import { google } from "@google-cloud/vision/build/protos/protos";

export interface BoundingBox {
	left: number;
	top: number;
	width: number;
	height: number;
}

export class BoundingBoxBuilder {
	private boundingBox: BoundingBox;
	private right: number;
	private bottom: number;

	constructor() {
		this.reset();
	}

	private reset() {
		this.right = 0;
		this.bottom = 0;
		this.boundingBox = {
			left: Infinity,
			top: Infinity,
			width: 0,
			height: 0,
		};
	}

	public addVertex(vertex: google.cloud.vision.v1.IVertex) {
		this.boundingBox.top = Math.min(this.boundingBox.top, vertex.y!);
		this.boundingBox.left = Math.min(this.boundingBox.left, vertex.x!);
		this.right = Math.max(this.right, vertex.x!);
		this.bottom = Math.max(this.bottom, vertex.y!);
		this.boundingBox.width = Math.max(
			this.boundingBox.width,
			this.right - this.boundingBox.left
		);
		this.boundingBox.height = Math.max(
			this.boundingBox.height,
			this.bottom - this.boundingBox.top
		);
	}

	public build(): BoundingBox {
		const boundingBox = this.boundingBox;
		this.reset();
		return boundingBox;
	}
}

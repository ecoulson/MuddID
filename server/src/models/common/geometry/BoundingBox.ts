import IBoundingBox from "./IBoundingBox";

export default class BoundingBox implements IBoundingBox {
	private _top: number;
	private _left: number;
	private _bottom: number;
	private _right: number;

	constructor(top: number, left: number, bottom: number, right: number) {
		this._top = top;
		this._left = left;
		this._bottom = bottom;
		this._right = right;
	}

	get top(): number {
		return this._top;
	}

	get left(): number {
		return this._left;
	}

	get right(): number {
		return this._right;
	}

	get bottom(): number {
		return this._bottom;
	}

	get width(): number {
		return Math.abs(this._right - this._left);
	}

	get height(): number {
		return Math.abs(this._bottom - this._top);
	}
}

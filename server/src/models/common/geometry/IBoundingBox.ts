export default interface IBoundingBox {
	get top(): number;
	get left(): number;
	get right(): number;
	get bottom(): number;
	get width(): number;
	get height(): number;
}

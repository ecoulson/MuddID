import FileStream from "../common/files/FileStream";
import TextPatternLookup from "../text-extractors/TextPatternLookup";

export default class DigitalFeatures {
	public readonly logoFileStream: FileStream;
	public readonly faceFileStream: FileStream;
	public readonly sourceFileStream: FileStream;
	public readonly parsedTextPatterns: TextPatternLookup;
}

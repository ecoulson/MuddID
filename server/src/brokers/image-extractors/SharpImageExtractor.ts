import { Sharp } from "sharp";
import FileStream from "../../models/common/files/FileStream";
import IImageExtractor from "./IImageExtractor";

export default class SharpImageExtractor implements IImageExtractor<Sharp> {
    extract(file: FileStream): Sharp {
        throw new Error("Method not implemented.");
    }
}
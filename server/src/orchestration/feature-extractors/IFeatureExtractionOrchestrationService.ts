import FileStream from "../../models/common/files/FileStream";

export default interface IFeatureExtractionOrchestrationService {
    extractFeatures(image: FileStream): Promise<k>;
}
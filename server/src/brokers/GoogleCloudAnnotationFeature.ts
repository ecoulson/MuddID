type GoogleCloudAnnotationFeature = {
    type: GoogleCloudAnnotationFeatureType
}

enum GoogleCloudAnnotationFeatureType {
    FACE_DETECTION = "FACE_DETECTION",
    LOGO_DETECTION = "LOGO_DETECTION",
    DOCUMENT_TEXT_DETECTION = "DOCUMENT_TEXT_DETECTION",
    CROP_HINTS = "CROP_HINTS"
}

export {
    GoogleCloudAnnotationFeature,
    GoogleCloudAnnotationFeatureType
}
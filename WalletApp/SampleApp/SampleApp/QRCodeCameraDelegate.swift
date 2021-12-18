//
//  QRCodeCameraDelegate.swift
//  SampleApp
//
//  Created by Evan Coulson on 12/6/21.
//

import Foundation
import AVFoundation

class QRCodeCameraDelegate: NSObject, AVCaptureMetadataOutputObjectsDelegate {
    var scanInterval: Double = 1.0
    var lastTime = Date(timeIntervalSince1970: 0)
    
    var onResult: (String) -> Void = { _ in }
    var mockData: String?
    
    func metadataOutput(_ output: AVCaptureMetadataOutput, didOutput metadataObjects: [AVMetadataObject], from connection: AVCaptureConnection) {
        print(metadataObjects)
        if let metadataObject = metadataObjects.first {
            guard let readableObject = metadataObject as? AVMetadataMachineReadableCodeObject else { return }
            guard let stringValue = readableObject.stringValue else { return }
            foundQRCode(stringValue)
        }
    }
    
    @objc func onSimulateScanning() {
        foundQRCode(mockData ?? "Simulated QR-code result")
    }
    
    func foundQRCode(_ stringValue: String) {
        let now = Date()
        if now.timeIntervalSince(lastTime) >= scanInterval {
             lastTime = now
            self.onResult(stringValue)
        }
    }
}

//
//  QRCodeScannerView.swift
//  SampleApp
//
//  Created by Evan Coulson on 12/7/21.
//

import UIKit
import AVFoundation
import SwiftUI

struct QRCodeScannerView: UIViewRepresentable {
    var supportedBarcodeTypes: [AVMetadataObject.ObjectType] = [.qr]
    typealias UIViewType = CameraPreview
    
    private let session = AVCaptureSession()
    private let delegate = QRCodeCameraDelegate()
    private let metadataOutput = AVCaptureMetadataOutput()
    
    func torchLight(isOn: Bool) -> QRCodeScannerView {
        if let backCamera = AVCaptureDevice.default(for: AVMediaType.video) {
            if backCamera.hasTorch {
                try? backCamera.lockForConfiguration()
                if isOn {
                    backCamera.torchMode = .on
                } else {
                    backCamera.torchMode = .off
                }
                backCamera.unlockForConfiguration()
            }
        }
        return self
    }
    
    func interval(delay: Double) -> QRCodeScannerView {
        delegate.scanInterval = delay
        return self
    }
    
    func found(r: @escaping (String) -> Void) -> QRCodeScannerView {
        delegate.onResult = r
        return self
    }
    
    func simulator(mockBarCode: String) -> QRCodeScannerView {
        delegate.mockData = mockBarCode
        return self
    }
    
    func setupCamera(_ uiView: CameraPreview) {
        if let backCamera = AVCaptureDevice.default(for: AVMediaType.video) {
            if let input = try? AVCaptureDeviceInput(device: backCamera) {
                session.sessionPreset = .photo
                
                if session.canAddInput(input) {
                    session.addInput(input)
                }
                
                if (session.canAddOutput(metadataOutput)) {
                    session.addOutput(metadataOutput)
                    
                    metadataOutput.metadataObjectTypes = supportedBarcodeTypes
                    metadataOutput.setMetadataObjectsDelegate(delegate, queue: DispatchQueue.main)
                }
                let previewLayer = AVCaptureVideoPreviewLayer(session: session)
                
                uiView.backgroundColor = UIColor.gray
                previewLayer.videoGravity = .resizeAspectFill
                uiView.layer.addSublayer(previewLayer)
                uiView.previewLayer = previewLayer
                
                session.startRunning()
            }
        }
    }
    
    func makeUIView(context: UIViewRepresentableContext<QRCodeScannerView>) -> QRCodeScannerView.UIViewType {
        let cameraView = CameraPreview(session: session)
        
        #if targetEnvironment(simulator)
            cameraView.createSimulatorView(delegate: self.delegate)
        #else
            checkCameraAuthorizationStatus(cameraView)
        #endif
        
        return cameraView
    }
    
    private func checkCameraAuthorizationStatus(_ uiView: CameraPreview) {
        let cameraAuthorizationStatus = AVCaptureDevice.authorizationStatus(for: .video)
        if cameraAuthorizationStatus == .authorized {
            setupCamera(uiView)
        } else {
            AVCaptureDevice.requestAccess(for: .video) { granted in
                DispatchQueue.main.sync {
                    if granted {
                        self.setupCamera(uiView)
                    }
                }
            }
        }
    }
    
    static func dismantleUIView(_ uiView: CameraPreview, coordinator: ()) {
        uiView.session.stopRunning()
    }
    
    func updateUIView(_ uiView: CameraPreview, context: UIViewRepresentableContext<QRCodeScannerView>) {
        uiView.setContentHuggingPriority(.defaultHigh, for: .vertical)
        uiView.setContentHuggingPriority(.defaultLow, for: .horizontal)
    }
}

//
//  ScannerViewModel.swift
//  SampleApp
//
//  Created by Evan Coulson on 12/6/21.
//

import Foundation
import VCServices

class ScannerViewModel: ObservableObject {
    let scanInterval: Double = 1.0
    
    @Published
    var torchIsOn: Bool = false
    @Published
    var lastQRCode: String = ""
    @Published
    var scanned: Bool = false
    
    func onFoundQRCode(_ code: String) {
        if !scanned {
            self.lastQRCode = code
            let issuance = Issuance()
            print(code.components(separatedBy: "="))
            issuance.issuanceSample(presentationUrl: code.components(separatedBy: "=")[1])
            scanned = true
            lastQRCode = ""
        }
    }
}

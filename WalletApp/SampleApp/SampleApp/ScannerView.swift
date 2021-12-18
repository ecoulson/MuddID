//
//  ScannerView.swift
//  SampleApp
//
//  Created by Evan Coulson on 12/6/21.
//

import SwiftUI

struct ScannerView: View {
    @ObservedObject
    var viewModel = ScannerViewModel()
    
    var body: some View {
        ZStack {
            QRCodeScannerView()
                .found(r: self.viewModel.onFoundQRCode)
                .torchLight(isOn: self.viewModel.torchIsOn)
                .interval(delay: self.viewModel.scanInterval)
            
            NavigationLink(destination: ContentView(), isActive: $viewModel.scanned) {
            }
            
            VStack {
                VStack {
                    Text("Keep scanning for QR Codes")
                        .font(.subheadline)
                    Text(self.viewModel.lastQRCode)
                        .bold()
                        .lineLimit(5)
                        .padding()
                }
                .padding(.vertical, 20)
                
                Spacer()
                HStack {
                    Button(action: {
                        self.viewModel.torchIsOn.toggle()
                    }, label: {
                        Image(systemName: self.viewModel.torchIsOn ? "bolt.fill" : "bolt.slash.fill")
                            .imageScale(.large)
                            .foregroundColor(self.viewModel.torchIsOn ? Color.yellow : Color.blue)
                            .padding()
                    })
                }
                .background(Color.white)
                .cornerRadius(10)
            }
        }
    }
}

struct ScannerView_Previews: PreviewProvider {
    static var previews: some View {
        ScannerView()
    }
}

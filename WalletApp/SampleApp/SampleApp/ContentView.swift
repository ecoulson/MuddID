//
//  ContentView.swift
//  SampleApp
//
//  Created by Evan Coulson on 11/23/21.
//
import VCServices
import VCEntities
import SwiftUI

struct ContentView: View {
    @State private var navigateToScanner = false
    
    func handleIssuance() {
        navigateToScanner = true
        do {
            let result = try VerifiableCredentialSDK.initialize(logConsumer: DefaultVCLogConsumer(), userAgentInfo: "Wallet App")
            print(result)
        } catch {
            fatalError("Failed to initialize sdk")
        }
    }
    
    var body: some View {
        NavigationView {
            VStack {
                NavigationLink("View Credentials", destination: IDListView())
                .navigationBarHidden(true)
                .navigationTitle("")
                .navigationBarBackButtonHidden(true)
                .padding()
                NavigationLink(destination: ScannerView(), isActive: $navigateToScanner) {
                    Button(action: handleIssuance) {
                        Text("Scan Credential")
                    }
                }
                .navigationBarHidden(true)
                .navigationTitle("")
                .navigationBarBackButtonHidden(true)
                .padding()
            }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}

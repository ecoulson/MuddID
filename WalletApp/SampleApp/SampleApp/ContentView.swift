//
//  ContentView.swift
//  SampleApp
//
//  Created by Evan Coulson on 11/23/21.
//
import VCServices
import SwiftUI

struct ContentView: View {
    @State private var requestId: String
    private var result: Bool
    
    init() {
        requestId = ""
        do {
            self.result = try VerifiableCredentialSDK.initialize()
        } catch {
            self.result = true
        }
    }
    
    func handleIssuance() {
        let sample = IssuanceSample()
        sample.issuanceSample()
    }
    
    var body: some View {
        VStack {
            Text("Hello, world!")
                .padding()
            Text(!result ? "Initialized" : "Failed")
                .padding()
            TextField("Request Id", text: $requestId)
            Button(action: handleIssuance) {
                Text("Issue").padding()
            }.padding()
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}

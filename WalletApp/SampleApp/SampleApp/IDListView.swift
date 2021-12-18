//
//  IDListView.swift
//  SampleApp
//
//  Created by Evan Coulson on 12/15/21.
//

import SwiftUI

struct IDListView: View {
    @StateObject private var store = VerifiableCredentialStore()
    
    var body: some View {
        VStack {
            ForEach(store.credentials) { credential in
                IDView(verifiableCredential: credential.verifiableCredentialDescriptor)
            }
        }.onAppear {
            VerifiableCredentialStore.load { result in
                switch result {
                case .failure(let error):
                    fatalError(error.localizedDescription)
                case .success(let verifiableCredentials):
                    print(verifiableCredentials)
                    store.credentials = verifiableCredentials
                }
            }
        }
    }
}

struct IDListView_Previews: PreviewProvider {
    static var previews: some View {
        IDListView()
    }
}

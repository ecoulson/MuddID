//
//  VerifiableCredential.swift
//  SampleApp
//
//  Created by Evan Coulson on 12/15/21.
//

import Foundation
import VCEntities

class StorableVerifiableCredential: Identifiable, Codable {
    let id: String
    let verifiableCredentialDescriptor: VerifiableCredentialDescriptor
    
    init(verifiableCredentialDescriptor: VerifiableCredentialDescriptor) {
        self.id = UUID().uuidString
        self.verifiableCredentialDescriptor = verifiableCredentialDescriptor
    }
}

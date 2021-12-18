//
//  VerifiableCredentialStore.swift
//  SampleApp
//
//  Created by Evan Coulson on 12/14/21.
//

import Foundation
import VCEntities

class VerifiableCredentialStore: ObservableObject {
    @Published var credentials: [StorableVerifiableCredential] = []
    
    private static func fileURL() throws -> URL {
        try FileManager.default.url(
            for: .documentDirectory,
            in: .userDomainMask,
            appropriateFor: nil,
            create: false)
        .appendingPathComponent("credentials.data")
    }
    
    static func load(completion: @escaping (Result<[StorableVerifiableCredential], Error>) -> Void) {
        DispatchQueue.global(qos: .background).async {
            do {
                let fileURL = try fileURL()
                guard let file = try? FileHandle(forReadingFrom: fileURL) else {
                    DispatchQueue.main.async {
                        completion(.success([]))
                    }
                    return
                }
                let verifiableCredentials = try JSONDecoder().decode([StorableVerifiableCredential].self, from: file.availableData)
                DispatchQueue.main.async {
                    completion(.success(verifiableCredentials))
                }
            } catch {
                DispatchQueue.main.async {
                    completion(.failure(error))
                }
            }
        }
    }
    
    static func save(verifiableCredentials: [StorableVerifiableCredential], completion: @escaping (Result<Int, Error>) -> Void) {
        DispatchQueue.global(qos: .background).async {
            do {
                let data = try JSONEncoder().encode(verifiableCredentials)
                let outfile = try fileURL()
                try data.write(to: outfile)
                DispatchQueue.main.async {
                    completion(.success(verifiableCredentials.count))
                }
            } catch {
                DispatchQueue.main.async {
                    completion(.failure(error))
                }
            }
        }
    }
}

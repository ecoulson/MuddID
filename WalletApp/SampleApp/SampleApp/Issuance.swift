import VCServices
import VCEntities
import PromiseKit

class Issuance {
    private var presentationRequest: PresentationRequestToken?
    
    func issuanceSample(presentationUrl: String) {
        /// set up issuance service through dependency injection if you like.
        let issuanceService = IssuanceService()
        
        issuanceService.getPresentationRequest(usingUrl: presentationUrl).done { presentationRequest in
            self.presentationRequest = presentationRequest
            issuanceService.getRequest(usingUrl: "https://beta.did.msidentity.com/v1.0/bdb30691-2d97-4c55-9d16-76ee0ae951c2/verifiableCredential/contracts/HarveyMuddId").done { issuanceRequest in
                self.handle(successfulRequest: issuanceRequest, with: issuanceService)
            }.catch { error in
                self.handle(failedRequest: error)
            }
        }.catch { error in
            self.handle(failedRequest: error)
        }
    }
    
    private func handle(successfulRequest request: IssuanceRequest, with service: IssuanceService) {
        
        var response: IssuanceResponseContainer
        
        do {
            response = try IssuanceResponseContainer(from: request.content, contractUri: "https://beta.did.msidentity.com/v1.0/bdb30691-2d97-4c55-9d16-76ee0ae951c2/verifiableCredential/contracts/HarveyMuddId")
        } catch {
            VCSDKLog.sharedInstance.logError(message: "Unable to create IssuanceResponseContainer.")
            return
        }
        response = addRequestedData(unfilledResponse: response)
        service.send(response: response).done { verifiableCredential in
            self.handle(successfulResponse: verifiableCredential, with: service)
        }.catch { error in
            self.handle(failedResponse: error)
        }
    }
    
    private func addRequestedData(unfilledResponse: IssuanceResponseContainer) -> IssuanceResponseContainer {
        var response: IssuanceResponseContainer = unfilledResponse
        response.requestedIdTokenMap["https://self-issued.me"] = self.presentationRequest?.content.idTokenHint?.raw
        return response
    }
    
    private func handle(successfulResponse response: VerifiableCredential, with issuanceService: IssuanceService) {
        issuanceService.sendCompletionResponse(for: IssuanceCompletionResponse(wasSuccessful: true, withState: (self.presentationRequest?.content.state)!), to: "https://beta.did.msidentity.com/v1.0/bdb30691-2d97-4c55-9d16-76ee0ae951c2/verifiablecredentials/issuance").done { completionResponse in
            print(response.content.vc.credentialSubject)
            VerifiableCredentialStore.save(verifiableCredentials: [StorableVerifiableCredential(verifiableCredentialDescriptor: response.content.vc)]) { result in
                if case .failure(let error) = result {
                    fatalError(error.localizedDescription)
                }
            }
        }.catch { error in
            self.handle(failedResponse: error)
        }
    }
    
    private func handle(failedRequest error: Error) {
        VCSDKLog.sharedInstance.logError(message: "Unable to fetch request.")
    }
    
    private func handle(failedResponse error: Error) {
        VCSDKLog.sharedInstance.logError(message: "Unable to get verifiable credential.")
    }
}

//
//  IDView.swift
//  SampleApp
//
//  Created by Evan Coulson on 12/14/21.
//

import SwiftUI
import VCEntities

struct IDView: View {
    let verifiableCredential: VerifiableCredentialDescriptor?
    
    init(verifiableCredential: VerifiableCredentialDescriptor?) {
        self.verifiableCredential = verifiableCredential
    }
    
    func getCredentialProperty(property: String) -> String {
        if (verifiableCredential == nil) {
            return ""
        }
        return verifiableCredential?.credentialSubject[property] as! String
    }
    
    func getBirthDate(dateOfBirth: String) -> String {
        let rfcDateFormatter = DateFormatter()
        rfcDateFormatter.dateFormat = "E, dd MMM yyyy HH:mm:ss"
        let date = rfcDateFormatter.date(from: dateOfBirth)
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "MM/dd/yyyy"
        print(date)
        print(dateOfBirth)
        return dateFormatter.string(from: date ?? Date())
    }
    
    var body: some View {
        VStack {
            HStack {
                AsyncImage(
                    url: URL(string: "https://www.hmc.edu/communications/wp-content/uploads/sites/19/2013/11/HMC-BGW-RGB-150dpi-300x300.png"),
                    content: { image in
                        image.resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width: 50, height: 50, alignment: .top)
                    },
                    placeholder: {
                        ProgressView()
                    }
                )
                Spacer()
                AsyncImage(
                    url: URL(string: "https://51b5-134-173-192-64.ngrok.io/aws/mudd-id-verification-images?key=face/" + getCredentialProperty(property: "studentPhoto")),
                    content: { image in
                        image.resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width: 100, height: 100, alignment: .top)
                    },
                    placeholder: {
                        ProgressView()
                    }
                )
            }
            Spacer()
            HStack {
                VStack {
                    Text(getCredentialProperty(property: "firstName") + " " + getCredentialProperty(property: "lastName"))
                    Text(getCredentialProperty(property: "id"))
                }
                Spacer()
                VStack {
                    Text(getCredentialProperty(property: "type"))
                    Text(getBirthDate(dateOfBirth: getCredentialProperty(property: "dateOfBirth").replacingOccurrences(of: " GMT", with: "")))
                }
            }
            .padding(5)
            .background(.white)
            .cornerRadius(5)
        }
        .padding()
        .background(Color(red: 234/255, green: 170/255, blue: 0))
        .cornerRadius(5)
        .frame(width: 350, height: 200, alignment: .top)
        .shadow(radius: 10
        )
    }
}

struct IDView_Previews: PreviewProvider {
    static var previews: some View {
        IDView(verifiableCredential: nil)
    }
}

import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type DigitalId = {
  __typename?: 'DigitalId';
  createdAt: Scalars['DateTime'];
  dateOfBirth: Scalars['DateTime'];
  id: Scalars['String'];
  name: Scalars['String'];
  type: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  uploadFilename: Scalars['String'];
};

export type IssuanceResponse = {
  __typename?: 'IssuanceResponse';
  expiry: Scalars['Float'];
  pin: Scalars['String'];
  qrCode: Scalars['String'];
  requestId: Scalars['String'];
  sessionId: Scalars['String'];
  url: Scalars['String'];
};

export type IssuanceState = {
  __typename?: 'IssuanceState';
  message: Scalars['String'];
  status: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  state: IssuanceState;
  uploadId: DigitalId;
};


export type MutationUploadIdArgs = {
  file: Scalars['Upload'];
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String'];
  id?: Maybe<DigitalId>;
  issue: IssuanceResponse;
};


export type QueryIdArgs = {
  id: Scalars['String'];
};


export type QueryIssueArgs = {
  idNumber: Scalars['String'];
};

export type IssuanceStateMutationVariables = Exact<{ [key: string]: never; }>;


export type IssuanceStateMutation = { __typename?: 'Mutation', state: { __typename?: 'IssuanceState', status: string, message: string } };

export type UploadIdMutationVariables = Exact<{
  file: Scalars['Upload'];
}>;


export type UploadIdMutation = { __typename?: 'Mutation', uploadId: { __typename?: 'DigitalId', id: string, name: string, uploadFilename: string, type: string, dateOfBirth: any } };

export type IdQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type IdQuery = { __typename?: 'Query', id?: { __typename?: 'DigitalId', id: string, name: string, uploadFilename: string, type: string, dateOfBirth: any, createdAt: any, updatedAt: any } | null | undefined };

export type IssueCredentialQueryVariables = Exact<{
  idNumber: Scalars['String'];
}>;


export type IssueCredentialQuery = { __typename?: 'Query', issue: { __typename?: 'IssuanceResponse', requestId: string, url: string, expiry: number, qrCode: string, pin: string, sessionId: string } };


export const IssuanceStateDocument = gql`
    mutation IssuanceState {
  state {
    status
    message
  }
}
    `;

export function useIssuanceStateMutation() {
  return Urql.useMutation<IssuanceStateMutation, IssuanceStateMutationVariables>(IssuanceStateDocument);
};
export const UploadIdDocument = gql`
    mutation UploadId($file: Upload!) {
  uploadId(file: $file) {
    id
    name
    uploadFilename
    type
    dateOfBirth
  }
}
    `;

export function useUploadIdMutation() {
  return Urql.useMutation<UploadIdMutation, UploadIdMutationVariables>(UploadIdDocument);
};
export const IdDocument = gql`
    query Id($id: String!) {
  id(id: $id) {
    id
    name
    uploadFilename
    type
    dateOfBirth
    createdAt
    updatedAt
  }
}
    `;

export function useIdQuery(options: Omit<Urql.UseQueryArgs<IdQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<IdQuery>({ query: IdDocument, ...options });
};
export const IssueCredentialDocument = gql`
    query IssueCredential($idNumber: String!) {
  issue(idNumber: $idNumber) {
    requestId
    url
    expiry
    qrCode
    pin
    sessionId
  }
}
    `;

export function useIssueCredentialQuery(options: Omit<Urql.UseQueryArgs<IssueCredentialQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<IssueCredentialQuery>({ query: IssueCredentialDocument, ...options });
};
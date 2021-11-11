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
  dateOfBirth: Scalars['DateTime'];
  facePhotoUrl: Scalars['String'];
  id: Scalars['String'];
  logoPhotoUrl: Scalars['String'];
  name: Scalars['String'];
  type: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  uploadId: DigitalId;
};


export type MutationUploadIdArgs = {
  file: Scalars['Upload'];
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String'];
};

export type UploadIdMutationVariables = Exact<{
  file: Scalars['Upload'];
}>;


export type UploadIdMutation = { __typename?: 'Mutation', uploadId: { __typename?: 'DigitalId', id: string, logoPhotoUrl: string, facePhotoUrl: string, name: string, type: string, dateOfBirth: any } };


export const UploadIdDocument = gql`
    mutation UploadId($file: Upload!) {
  uploadId(file: $file) {
    id
    logoPhotoUrl
    facePhotoUrl
    name
    type
    dateOfBirth
  }
}
    `;

export function useUploadIdMutation() {
  return Urql.useMutation<UploadIdMutation, UploadIdMutationVariables>(UploadIdDocument);
};
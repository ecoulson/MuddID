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
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type FileResult = {
  __typename?: 'FileResult';
  encoding: Scalars['String'];
  filename: Scalars['String'];
  mimetype: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  uploadId: FileResult;
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


export type UploadIdMutation = { __typename?: 'Mutation', uploadId: { __typename?: 'FileResult', filename: string, mimetype: string, encoding: string } };


export const UploadIdDocument = gql`
    mutation UploadId($file: Upload!) {
  uploadId(file: $file) {
    filename
    mimetype
    encoding
  }
}
    `;

export function useUploadIdMutation() {
  return Urql.useMutation<UploadIdMutation, UploadIdMutationVariables>(UploadIdDocument);
};
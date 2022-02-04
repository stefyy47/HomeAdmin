import { gql } from '@apollo/client'
export const CREATE_FAMILY_MEMBER = gql`
  mutation createUser($input: UserCreateInputType!) {
    createUser(input: $input)
  }
`

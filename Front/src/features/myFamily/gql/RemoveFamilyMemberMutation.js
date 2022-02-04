import { gql } from '@apollo/client'
export const REMOVE_FAMILY_MEMBER = gql`
  mutation removeMember($id: Int!) {
    removeMember(id: $id)
  }
`

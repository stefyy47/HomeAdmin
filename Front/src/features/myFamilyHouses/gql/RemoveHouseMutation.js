import { gql } from '@apollo/client'
export const REMOVE_FAMILY_HOUSE = gql`
  mutation removeHouse($id: Int!) {
    removeFamilyHouse(id: $id)
  }
`

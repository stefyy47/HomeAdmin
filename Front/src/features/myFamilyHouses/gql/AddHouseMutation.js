import { gql } from '@apollo/client'
export const ADD_FAMILY_HOUSE = gql`
  mutation addHouse($address: String!) {
    addFamilyHouse(address: $address)
  }
`

import { gql } from '@apollo/client'

export const MY_FAMILY_HOUSES_QUERY = gql`
  query myFamilyHouses {
    familyHouses {
      id
      address
      isPopulated
    }
    isFamilyCreator
  }
`

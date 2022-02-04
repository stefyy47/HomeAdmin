import { gql } from '@apollo/client'

export const MY_FAMILY_QUERY = gql`
  query myFamily {
    familyMembers {
      id
      firstName
      lastName
    }
    isFamilyCreator
  }
`

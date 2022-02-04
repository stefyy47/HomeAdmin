import { gql } from '@apollo/client'

const Fragments = {
  taskStatus: gql`
    fragment taskStatus on Status {
      id
      name
    }
  `,
  familyMember: gql`
    fragment familyMember on FamilyMember {
      id
      name
    }
  `
}

export { Fragments }

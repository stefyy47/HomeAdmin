import { gql } from '@apollo/client'

export const TASKS_QUERY = gql`
  query taskList {
    taskList {
      id
      title
      description
      deadline
      createdAt
      familyMember {
        id
        firstName
        lastName
      }
      status {
        id
        name
      }
    }
  }
`

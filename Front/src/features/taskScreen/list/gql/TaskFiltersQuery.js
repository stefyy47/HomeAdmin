import { gql } from '@apollo/client'

export const TASK_FILTERS_QUERY = gql`
  query taskFilters {
    statusList {
      id
      name
    }
    familyMembers {
      id
      name
    }
  }
`

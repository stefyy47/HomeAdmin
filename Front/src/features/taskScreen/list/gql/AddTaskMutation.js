import { gql } from '@apollo/client'
export const CREATE_TASK = gql`
  mutation addTask($input: TaskInput!) {
    addTask(input: $input)
  }
`

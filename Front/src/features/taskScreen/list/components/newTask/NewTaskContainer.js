import React from 'react'
import { emptyArray, emptyFunction } from 'utils/constants'
import { Grid } from '@material-ui/core'
import DateTime from '@bit/totalsoft_oss.react-mui.date-time'
import Autocomplete from '@bit/totalsoft_oss.react-mui.autocomplete'
import IconCard from '@bit/totalsoft_oss.react-mui.icon-card'
import Button from '@bit/totalsoft_oss.react-mui.button'
import NewTask from './NewTask'
import { useQueryWithErrorHandling } from 'hooks/errorHandling'
import { TASK_FILTERS_QUERY } from '../../gql/TaskFiltersQuery'

const NewTaskContainer = () => {
  const { loading, data } = useQueryWithErrorHandling(TASK_FILTERS_QUERY)

  return (
    <>
      <NewTask statusList={data?.statusList ?? emptyArray} familyMembers={data?.familyMembers ?? emptyArray}></NewTask>
    </>
  )
}

export default NewTaskContainer

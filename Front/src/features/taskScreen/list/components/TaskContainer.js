import { LoadingFakeText } from '@bit/totalsoft_oss.react-mui.kit.core'
import { useQueryWithErrorHandling } from 'hooks/errorHandling'
import React, { useCallback } from 'react'
import { emptyArray } from 'utils/constants'
import { TASK_FILTERS_QUERY } from '../gql/TaskFiltersQuery'
import TaskFilters from './TaskFilters'
import TaskList from './TaskList'
import { useHistory } from 'react-router-dom'
import { TASKS_QUERY } from '../gql/TasksQuery'

const TaskContainer = () => {
  const { loading, data } = useQueryWithErrorHandling(TASK_FILTERS_QUERY)
  const { loadingTasks, data: dataTasks } = useQueryWithErrorHandling(TASKS_QUERY)
  console.log(dataTasks)
  const history = useHistory()

  const handleAddTask = useCallback(() => {
    history.push('/tasks/new')
  }, [history])

  if (loading) {
    return <LoadingFakeText lines={5} />
  }

  return (
    <>
      <TaskFilters statusList={data?.statusList ?? emptyArray} familyMembers={data?.familyMembers ?? emptyArray} />
      <TaskList tasks={dataTasks?.taskList} onAdd={handleAddTask}></TaskList>
    </>
  )
}

export default TaskContainer

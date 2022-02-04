import React from 'react'
import { Grid, makeStyles } from '@material-ui/core'
import { IconButton, DownloadButton, IconCard, CardTitle, AddButton } from '@bit/totalsoft_oss.react-mui.kit.core'
import { Table, Thead, Tbody, Tr, Th } from 'react-super-responsive-table'
import { useTranslation } from 'react-i18next'
import { emptyFunction, rowsPerPageOptions } from 'utils/constants'
import tableStyle from 'assets/jss/components/tableStyle'
import PropTypes from 'prop-types'
import { Assessment, DoneAll, LibraryAdd } from '@material-ui/icons'
import TaskListItem from './TaskListItem'
const useStyles = makeStyles(tableStyle)

const TaskList = ({ tasks, onAdd }) => {
  const { t } = useTranslation()
  const { table, tableHeader, enableScrollX } = useStyles()
  return (
    <IconCard
      icon={Assessment}
      iconColor='themeWithGradient'
      title={
        <CardTitle
          title={t('TaskScreen.TaskList.Title')}
          actions={[
            <AddButton
              key='CreateNewTask'
              title={t('TaskScreen.TaskList.CreateNewTask')}
              fontSize='medium'
              color='themeWithGradient'
              onClick={onAdd}
            />
          ]}
        />
      }
      content={
        <>
          <Grid className={enableScrollX}>
            <Table className={table}>
              <Thead>
                <Tr>
                  <Th className={tableHeader}></Th>
                  <Th className={tableHeader}>{t('TaskScreen.TaskList.AssignedTo')}</Th>
                  <Th className={tableHeader}>{t('TaskScreen.TaskList.Title')}</Th>
                  <Th className={tableHeader}>{t('TaskScreen.TaskList.Description')}</Th>
                  <Th className={tableHeader}>{t('TaskScreen.TaskList.Status')}</Th>
                  <Th className={tableHeader}>{t('TaskScreen.TaskList.CreatedAt')}</Th>
                  <Th className={tableHeader}>{t('TaskScreen.TaskList.Deadline')}</Th>
                  <Th className={tableHeader}></Th>
                </Tr>
              </Thead>
              <Tbody>
                {tasks?.map(task => (
                  <TaskListItem key={task?.id} task={task} />
                ))}
              </Tbody>
            </Table>
          </Grid>
        </>
      }
    />
  )
}

TaskList.propTypes = {
  tasks: PropTypes.array.isRequired,
  onAdd: PropTypes.func.isRequired
}

export default TaskList

import React, { useCallback, useState } from 'react'
import { emptyFunction, emptyObject, emptyString } from 'utils/constants'
import { Checkbox, FormControlLabel, Grid, TextField } from '@material-ui/core'
import DateTime from '@bit/totalsoft_oss.react-mui.date-time'
import Autocomplete from '@bit/totalsoft_oss.react-mui.autocomplete'
import IconCard from '@bit/totalsoft_oss.react-mui.icon-card'
import Button from '@bit/totalsoft_oss.react-mui.button'
import SendIcon from '@material-ui/icons/Send'
import { useTranslation } from 'react-i18next'
import { defaultTo } from 'ramda'
import PropTypes from 'prop-types'
import { useChangeTrackingLens } from '@totalsoft/change-tracking-react'
import { onCheckBoxChange, onTextBoxChange } from 'utils/propertyChangeAdapters'
import { get, set } from '@totalsoft/react-state-lens'
import { CustomTextField, useToast } from '@bit/totalsoft_oss.react-mui.kit.core'
import { useMutation } from '@apollo/client'
import { CREATE_TASK } from '../../gql/AddTaskMutation'

const NewTask = ({ familyMembers, statusList }) => {
  const { t } = useTranslation()
  const [taskLens, dirtyInfo, resetTask] = useChangeTrackingLens({ isKidFriendly: false, isElderFriendly: false })
  const { isKidFriendly, isElderFriendly, asigneeId, taskName, taskDescription, statusId } = taskLens
  const addToast = useToast()
  const [addTask] = useMutation(CREATE_TASK, {
    onCompleted: () => {
      resetTask()
      addToast('Success', 'success')
    }
  })
  const handleAddTask = useCallback(() => {
    addTask({
      variables: {
        input: taskLens |> get
      }
    })
  }, [taskLens, addTask])
  console.log(taskLens |> get)
  return (
    <>
      <IconCard
        icon={SendIcon}
        iconColor='themeWithGradient'
        content={
          <Grid container spacing={2} alignItems='flex-end' onKeyDown={emptyFunction}>
            <Grid item xs={4} md={4} lg={4}>
              <Autocomplete
                label={t('TaskScreen.Filters.Assignee')}
                options={familyMembers}
                simpleValue
                fullWidth
                isClearable
                value={asigneeId |> get |> defaultTo(emptyString)}
                onChange={asigneeId |> set}
              />
            </Grid>
            <Grid item xs={4} md={4} lg={4}>
              <Autocomplete
                label={t('TaskScreen.Filters.Status')}
                options={statusList}
                simpleValue
                fullWidth
                isClearable
                value={statusId |> get |> defaultTo(emptyString)}
                onChange={statusId |> set}
              />
            </Grid>
            <Grid item xs={6} md={4} lg={2}>
              <CustomTextField
                fullWidth
                label={t('General.TaskName')}
                value={taskName |> get |> defaultTo(emptyString)}
                onChange={taskName |> set |> onTextBoxChange}
              />
            </Grid>
            <Grid item xs={6} md={4} lg={2}>
              <CustomTextField
                fullWidth
                label={t('General.TaskDescription')}
                value={taskDescription |> get |> defaultTo(emptyString)}
                onChange={taskDescription |> set |> onTextBoxChange}
              />
            </Grid>

            <Grid container spacing={2} alignItems='flex-end'>
              <Grid item xs={6} md={6} lg={2}>
                <FormControlLabel
                  control={
                    <Checkbox value={isKidFriendly |> get |> defaultTo(false)} onChange={isKidFriendly |> set |> onCheckBoxChange} />
                  }
                  label={t('TaskScreen.Filters.KidFriendly')}
                />
              </Grid>
              <Grid item xs={6} md={6} lg={2}>
                <FormControlLabel
                  control={
                    <Checkbox value={isElderFriendly |> get |> defaultTo(false)} onChange={isElderFriendly |> set |> onCheckBoxChange} />
                  }
                  label={t('TaskScreen.Filters.ElderFriendly')}
                />
              </Grid>
            </Grid>
            <Button onClick={handleAddTask} size={'sm'} color={'themeWithGradient'} right={true} startIcon={<SendIcon />}>
              {t('General.SaveTask')}
            </Button>
          </Grid>
        }
      />
    </>
  )
}

NewTask.propTypes = {
  familyMembers: PropTypes.array.isRequired,
  statusList: PropTypes.array.isRequired
}

export default NewTask

import React, { useState, useCallback } from 'react'
import { Tr, Td } from 'react-super-responsive-table'
import { EditButton, IconButton, Typography, useToast } from '@bit/totalsoft_oss.react-mui.kit.core'
import { CircularProgress, makeStyles } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import taskStyle from '../styles'
import { KeyboardArrowDown, KeyboardArrowUp, Done, Cancel, GetApp } from '@material-ui/icons'
import { useHistory } from 'react-router-dom'
import { any, find, includes, isNil, toPairs } from 'ramda'
import { useMutation } from '@apollo/client'
import { emptyObject } from 'utils/constants'

const useStyles = makeStyles(taskStyle)

const TaskListItem = ({ task }) => {
  const { tableContent } = useStyles()
  const history = useHistory()
  const addToast = useToast()
  const { id, title, description, createdAt, deadline, status, familyMember } = task ?? emptyObject
  const { lastName, firstName } = familyMember ?? emptyObject
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const handleOpen = useCallback(() => setOpen(!open), [open])

  return (
    <>
      <Tr onClick={handleOpen}>
        <Td>
          <IconButton aria-label='expand row' color={'defaultNoBackground'} size='small' onClick={handleOpen}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </Td>
        <Td className={tableContent}> {`${lastName} ${firstName}`} </Td>
        <Td className={tableContent}> {status?.name} </Td>
        <Td className={tableContent}> {title} </Td>
        <Td className={tableContent}> {description} </Td>
        <Td className={tableContent}> {t('DATE_FORMAT', { date: { value: createdAt, format: 'DD-MM-YYYY' } })}</Td>
        <Td className={tableContent}> {t('DATE_FORMAT', { date: { value: deadline, format: 'DD-MM-YYYY' } })} </Td>
        <Td className={tableContent}></Td>
      </Tr>
    </>
  )
}

TaskListItem.propTypes = {
  task: PropTypes.object
}

export default TaskListItem

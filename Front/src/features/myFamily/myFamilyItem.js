import React, { useCallback } from 'react'
import { Button, makeStyles } from '@material-ui/core'
import PropTypes from 'prop-types'
import { Td, Tr } from 'react-super-responsive-table'
import myFamilyStyle from './styles'
import DeleteIcon from '@material-ui/icons/Delete'

const useStyles = makeStyles(myFamilyStyle)

function MyFamilyItem({ id, firstName, lastName, isFamilyCreator, onRemoveMember }) {
  const { tableContent } = useStyles()
  const handleRemoveMember = useCallback(() => onRemoveMember(id), [id, onRemoveMember])
  return (
    <Tr>
      <Td className={tableContent}>{firstName}</Td>
      <Td className={tableContent}>{lastName}</Td>
      {isFamilyCreator ? (
        <Td className={tableContent}>
          {<Button onClick={handleRemoveMember} size={'sm'} color={'themeWithGradient'} startIcon={<DeleteIcon />}></Button>}
        </Td>
      ) : null}
    </Tr>
  )
}

MyFamilyItem.propTypes = {
  id: PropTypes.number.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  isFamilyCreator: PropTypes.bool.isRequired,
  onRemoveMember: PropTypes.func.isRequired
}

export default MyFamilyItem

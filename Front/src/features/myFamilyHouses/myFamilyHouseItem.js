import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { emptyFunction } from 'utils/constants'
import DeleteIcon from '@material-ui/icons/Delete'
import { Td, Tr } from 'react-super-responsive-table'
import myFamilyStyle from 'features/myFamily/styles'
import { makeStyles, Button } from '@material-ui/core'

const useStyles = makeStyles(myFamilyStyle)

function MyFamilyHouseItem({ id, address, isFamilyCreator, onRemoveHouse }) {
  const { tableContent } = useStyles()
  const handleRemoveHouse = useCallback(() => onRemoveHouse(id), [id, onRemoveHouse])
  return (
    <Tr>
      <Td className={tableContent}>{address}</Td>
      {isFamilyCreator ? (
        <Td className={tableContent}>
          {<Button onClick={handleRemoveHouse} size={'sm'} color={'themeWithGradient'} startIcon={<DeleteIcon />}></Button>}
        </Td>
      ) : null}
    </Tr>
  )
}

MyFamilyHouseItem.propTypes = {
  id: PropTypes.number.isRequired,
  address: PropTypes.string.isRequired,
  isPopulated: PropTypes.bool.isRequired,
  isFamilyCreator: PropTypes.bool.isRequired,
  onRemoveHouse: PropTypes.func.isRequired
}

export default MyFamilyHouseItem

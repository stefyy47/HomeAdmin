import { useMutation } from '@apollo/client'
import { CardTitle, CustomTextField, IconCard, SaveButton, useToast } from '@bit/totalsoft_oss.react-mui.kit.core'
import { House } from '@material-ui/icons'
import { useChangeTrackingLens } from '@totalsoft/change-tracking-react'
import { defaultTo } from 'ramda'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { emptyObject, emptyString } from 'utils/constants'
import { ADD_FAMILY_HOUSE } from './gql/AddHouseMutation'
import { get, set } from '@totalsoft/react-state-lens'
import { useError } from 'hooks/errorHandling'
import { isDirty } from '@totalsoft/change-tracking'
import { Grid } from '@material-ui/core'
import { onTextBoxChange } from 'utils/propertyChangeAdapters'

const NewHouse = () => {
  const [houseLens, dirtyInfo, resetHouse] = useChangeTrackingLens(emptyObject)
  const { t } = useTranslation()
  const addToast = useToast()
  const showError = useError()
  const { address } = houseLens
  const [addHouse] = useMutation(ADD_FAMILY_HOUSE, {
    onCompleted: () => {
      resetHouse()
      addToast(t('FamilyHousesScreen.AddedSuccess'), 'success')
    },
    onError: showError
  })
  const handleAddHouse = useCallback(() => {
    addHouse({
      variables: {
        address: address |> get
      }
    })
  }, [addHouse, address])
  return (
    <IconCard
      icon={House}
      iconColor='themeWithGradient'
      title={
        <CardTitle
          title={t('FamilyHousesScreen.AddHouse')}
          actions={[
            <SaveButton
              key='Save'
              title={t('FamilyHousesScreen.AddHouse')}
              fontSize='medium'
              onClick={handleAddHouse}
              disabled={!isDirty(dirtyInfo)}
              color={'themeWithGradient'}
            />
          ]}
        />
      }
      content={
        <Grid container spacing={2} alignItems='flex-end'>
          <Grid item xs={12} md={6} lg={3}>
            <CustomTextField
              label={t('NewHouse.Address')}
              fullWidth
              value={address |> get |> defaultTo(emptyString)}
              onChange={address |> set |> onTextBoxChange}
            />
          </Grid>
        </Grid>
      }
    />
  )
}

export default NewHouse

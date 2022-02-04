import { useReactOidc } from '@axa-fr/react-oidc-context'
import { CardTitle, CustomTextField, IconCard, SaveButton, useToast } from '@bit/totalsoft_oss.react-mui.kit.core'
import { Grid } from '@material-ui/core'
import { AccountBox } from '@material-ui/icons'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { emptyObject, emptyString } from 'utils/constants'
import { useChangeTrackingLens } from '@totalsoft/change-tracking-react'
import { get, set } from '@totalsoft/react-state-lens'
import { onTextBoxChange } from 'utils/propertyChangeAdapters'
import { useMutation } from '@apollo/client'
import { CREATE_FAMILY_MEMBER } from './gql/CreateFamilyMemberMutation'
import { useError } from 'hooks/errorHandling'
import { isDirty } from '@totalsoft/change-tracking'
import { defaultTo } from 'ramda'

const NewMember = () => {
  const { t } = useTranslation()
  const { oidcUser } = useReactOidc()
  const [userLens, dirtyInfo, resetUser] = useChangeTrackingLens(emptyObject)
  const addToast = useToast()
  const showError = useError()
  const [addMember] = useMutation(CREATE_FAMILY_MEMBER, {
    onCompleted: () => {
      resetUser()
      addToast(t('FamilyScreen.AddedSuccess'), 'success')
    },
    onError: showError
  })
  const { username, password, email, firstName, lastName, age } = userLens
  const handleAddMember = useCallback(() => {
    addMember({
      variables: {
        input: {
          userName: username |> get,
          password: password |> get,
          email: email |> get,
          firstName: firstName |> get,
          lastName: lastName |> get,
          age: parseInt(age |> get)
        }
      }
    })
  }, [addMember, email, firstName, lastName, password, username, age])

  return (
    <IconCard
      icon={AccountBox}
      iconColor='themeWithGradient'
      title={
        <CardTitle
          title={oidcUser ? t('FamilyScreen.NewMember') : t('FamilyScreen.NewFamily')}
          actions={[
            <SaveButton
              key='Save'
              title={oidcUser ? t('FamilyScreen.NewMember') : t('FamilyScreen.NewFamily')}
              fontSize='medium'
              onClick={handleAddMember}
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
              label={t('NewAccount.Username')}
              fullWidth
              value={username |> get |> defaultTo(emptyString)}
              onChange={username |> set |> onTextBoxChange}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <CustomTextField
              label={t('NewAccount.Password')}
              fullWidth
              value={password |> get |> defaultTo(emptyString)}
              onChange={password |> set |> onTextBoxChange}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <CustomTextField
              label={t('NewAccount.Email')}
              fullWidth
              value={email |> get |> defaultTo(emptyString)}
              onChange={email |> set |> onTextBoxChange}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <CustomTextField
              label={t('NewAccount.FirstName')}
              fullWidth
              value={firstName |> get |> defaultTo(emptyString)}
              onChange={firstName |> set |> onTextBoxChange}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <CustomTextField
              label={t('NewAccount.LastName')}
              fullWidth
              value={lastName |> get |> defaultTo(emptyString)}
              onChange={lastName |> set |> onTextBoxChange}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <CustomTextField
              label={t('NewAccount.Age')}
              fullWidth
              value={age |> get |> defaultTo(emptyString)}
              onChange={age |> set |> onTextBoxChange}
            />
          </Grid>
        </Grid>
      }
    />
  )
}

export default NewMember

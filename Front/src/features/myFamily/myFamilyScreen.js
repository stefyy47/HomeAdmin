import React, { useCallback } from 'react'
import { AddButton, CardTitle, IconCard, LoadingFakeText, useToast } from '@bit/totalsoft_oss.react-mui.kit.core'
import { Grid, makeStyles } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount'
import { useError, useQueryWithErrorHandling } from 'hooks/errorHandling'
import { MY_FAMILY_QUERY } from './gql/MyFamilyQuery'
import { Table, Thead, Tr, Th, Tbody } from 'react-super-responsive-table'
import MyFamilyItem from './myFamilyItem'
import tableStyles from 'assets/jss/components/tableStyle'
import { useMutation } from '@apollo/client'
import { REMOVE_FAMILY_MEMBER } from './gql/RemoveFamilyMemberMutation'
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles(tableStyles)

function MyFamilyScreen() {
  const { t } = useTranslation()
  const history = useHistory()
  const handleAddMember = useCallback(() => {
    history.push('/myFamily/newMember')
  }, [history])
  const { loading, data, refetch } = useQueryWithErrorHandling(MY_FAMILY_QUERY)
  const { table, tableHeader, enableScrollX } = useStyles()
  const addToast = useToast()
  const showError = useError()

  const [removeMember] = useMutation(REMOVE_FAMILY_MEMBER, {
    onCompleted: () => {
      refetch()
      addToast(t('FamilyScreen.RemovedSuccess'), 'success')
    },
    onError: showError
  })
  const handleRemoveMember = useCallback(
    id => {
      removeMember({ variables: { id } })
    },
    [removeMember]
  )
  if (loading) return <LoadingFakeText lines={5} />
  return (
    <IconCard
      icon={SupervisorAccountIcon}
      iconColor='themeWithGradient'
      title={
        <CardTitle
          title={t('FamilyScreen.Title')}
          actions={
            data?.isFamilyCreator && data?.isFamilyCreator
              ? [
                  <AddButton
                    key='AddNewMember'
                    title={t('FamilyScreen.AddMember')}
                    fontSize='medium'
                    color='themeWithGradient'
                    onClick={handleAddMember}
                  />
                ]
              : null
          }
        />
      }
      content={
        <>
          <Grid className={enableScrollX}>
            <Table className={table}>
              <Thead>
                <Tr>
                  <Th className={tableHeader}>{t('FamilyScreen.FirstName')}</Th>
                  <Th className={tableHeader}>{t('FamilyScreen.LastName')}</Th>
                  {data?.isFamilyCreator ? <Th className={tableHeader}>{t('FamilyScreen.Remove')}</Th> : null}
                </Tr>
              </Thead>
              <Tbody>
                {data?.familyMembers?.map(fm => (
                  <MyFamilyItem
                    key={fm?.id}
                    id={fm?.id}
                    firstName={fm?.firstName}
                    lastName={fm?.lastName}
                    isFamilyCreator={data?.isFamilyCreator}
                    onRemoveMember={handleRemoveMember}
                  />
                ))}
              </Tbody>
            </Table>
          </Grid>
        </>
      }
    />
  )
}

export default MyFamilyScreen

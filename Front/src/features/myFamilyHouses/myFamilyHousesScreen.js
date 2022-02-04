import React, { useCallback } from 'react'
import { AddButton, CardTitle, IconCard, LoadingFakeText, useToast } from '@bit/totalsoft_oss.react-mui.kit.core'
import { useError, useQueryWithErrorHandling } from 'hooks/errorHandling'
import { MY_FAMILY_HOUSES_QUERY } from './gql/MyFamilyHousesQuery'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { Grid, makeStyles } from '@material-ui/core'
import tableStyles from 'assets/jss/components/tableStyle'
import MyFamilyHouseItem from './myFamilyHouseItem'
import { Table, Thead, Tr, Th, Tbody } from 'react-super-responsive-table'
import { House } from '@material-ui/icons'
import { REMOVE_FAMILY_HOUSE } from './gql/RemoveHouseMutation'
import { useMutation } from '@apollo/client'
const useStyles = makeStyles(tableStyles)

function MyFamilyHousesScreen() {
  const { loading, data, refetch } = useQueryWithErrorHandling(MY_FAMILY_HOUSES_QUERY)
  console.log(data)
  const { t } = useTranslation()
  const history = useHistory()
  const { table, tableHeader, enableScrollX } = useStyles()
  const handleAddHouse = useCallback(() => {
    history.push('/myHouses/newHouse')
  }, [history])
  const addToast = useToast()
  const showError = useError()
  const [removeHouse] = useMutation(REMOVE_FAMILY_HOUSE, {
    onCompleted: () => {
      refetch()
      addToast(t('FamilyHousesScreen.RemovedSuccess'), 'success')
    },
    onError: showError
  })
  const handleRemoveHouse = useCallback(
    id => {
      removeHouse({ variables: { id } })
    },
    [removeHouse]
  )
  if (loading) return <LoadingFakeText lines={5} />
  return (
    <IconCard
      icon={House}
      iconColor='themeWithGradient'
      title={
        <CardTitle
          title={t('FamilyHousesScreen.Title')}
          actions={
            data?.isFamilyCreator && data?.isFamilyCreator
              ? [
                  <AddButton
                    key='AddNewHouse'
                    title={t('FamilyHousesScreen.AddHouse')}
                    fontSize='medium'
                    color='themeWithGradient'
                    onClick={handleAddHouse}
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
                  <Th className={tableHeader}>{t('FamilyHousesScreen.Address')}</Th>
                  {data?.isFamilyCreator ? <Th className={tableHeader}>{t('FamilyHousesScreen.RemoveHouse')}</Th> : null}
                </Tr>
              </Thead>
              <Tbody>
                {data?.familyHouses?.map(fm => (
                  <MyFamilyHouseItem
                    key={fm?.id}
                    id={fm?.id}
                    address={fm?.address}
                    isFamilyCreator={data?.isFamilyCreator}
                    onRemoveHouse={handleRemoveHouse}
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

export default MyFamilyHousesScreen

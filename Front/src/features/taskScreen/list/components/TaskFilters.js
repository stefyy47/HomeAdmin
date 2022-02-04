import { Autocomplete, DateTime, IconCard, Button } from '@bit/totalsoft_oss.react-mui.kit.core'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { emptyFunction, emptyObject, emptyString } from 'utils/constants'
import SearchIcon from '@material-ui/icons/Search'
import { Checkbox, FormControlLabel, Grid } from '@material-ui/core'
import PropTypes from 'prop-types'
import SendIcon from '@material-ui/icons/Send'
import DeleteIcon from '@material-ui/icons/Delete'
import { curry, defaultTo } from 'ramda'

const TaskFilters = ({ statusList, familyMembers, onApplyFilters, onResetFilters, filters, isKid, isElder }) => {
  const { t } = useTranslation()
  const [localFilters, setLocalFilters] = useState(filters)

  const handleFilterPropertyChange = curry((prop, value) => setLocalFilters(prevFilters => ({ ...prevFilters, [prop]: value })))

  const handleResetFilters = useCallback(() => {
    setLocalFilters(emptyObject)
    onResetFilters()
  }, [onResetFilters])

  const handleApplyFilters = useCallback(() => {
    onApplyFilters(localFilters)
  }, [localFilters, onApplyFilters])
  const handleEnterPressed = useCallback(
    event => {
      if (event.keyCode === 13) {
        onApplyFilters(localFilters)
      }
    },
    [localFilters, onApplyFilters]
  )

  return (
    <>
      <IconCard
        icon={SearchIcon}
        iconColor='themeWithGradient'
        content={
          <Grid container spacing={2} alignItems='flex-end' onKeyDown={emptyFunction}>
            <Grid item xs={4} md={4} lg={4}>
              <Autocomplete
                label={t('TaskScreen.Filters.Status')}
                options={statusList}
                simpleValue
                fullWidth
                isClearable
                value={localFilters?.statusId || emptyString}
                onChange={handleFilterPropertyChange('statusId')}
              />
            </Grid>
            <Grid item xs={4} md={4} lg={4}>
              <Autocomplete
                label={t('TaskScreen.Filters.Reporter')}
                options={familyMembers}
                simpleValue
                fullWidth
                isClearable
                value={localFilters?.familyMemberId || emptyString}
                onChange={handleFilterPropertyChange('familyMemberId')}
              />
            </Grid>
            <Grid item xs={4} md={4} lg={4}>
              <Autocomplete
                label={t('TaskScreen.Filters.Assignee')}
                options={familyMembers}
                simpleValue
                fullWidth
                isClearable
                value={localFilters?.assignedToId || emptyString}
                onChange={handleFilterPropertyChange('assignedToId')}
              />
            </Grid>
            <Grid item xs={6} md={6} lg={4}>
              <DateTime
                fullWidth
                clearable
                label={t('TaskScreen.Filters.CreatedFrom')}
                value={localFilters?.createdFrom}
                onChange={handleFilterPropertyChange('createdFrom')}
              />
            </Grid>
            <Grid item xs={6} md={6} lg={4}>
              <DateTime
                fullWidth
                clearable
                label={t('TaskScreen.Filters.CreatedUntil')}
                minDate={localFilters?.createdFrom ? localFilters?.createdFrom : undefined}
                value={localFilters?.createdUntil}
                onChange={handleFilterPropertyChange('createdUntil')}
              />
            </Grid>
            <Grid container spacing={2} alignItems='flex-end'>
              <Grid item xs={6} md={6} lg={2}>
                <FormControlLabel
                  control={<Checkbox value={isKid |> defaultTo(false)} onChange={handleFilterPropertyChange('isKidFriendly')} />}
                  label={t('TaskScreen.Filters.KidFriendly')}
                />
              </Grid>
              <Grid item xs={6} md={6} lg={2}>
                <FormControlLabel
                  control={<Checkbox value={isElder |> defaultTo(false)} onChange={handleFilterPropertyChange('isElderFriendly')} />}
                  label={t('TaskScreen.Filters.ElderFriendly')}
                />
              </Grid>
            </Grid>
            <Button onClick={handleResetFilters} size={'sm'} color={'themeWithGradient'} right={true} startIcon={<DeleteIcon />}>
              {t('General.Buttons.ResetFilters')}
            </Button>
            <Button onClick={handleApplyFilters} size={'sm'} color={'themeWithGradient'} right={true} startIcon={<SendIcon />}>
              {t('General.Buttons.ApplyFilters')}
            </Button>
          </Grid>
        }
      />
    </>
  )
}

TaskFilters.propTypes = {
  statusList: PropTypes.array.isRequired,
  familyMembers: PropTypes.array.isRequired,
  onApplyFilters: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  isKid: PropTypes.bool,
  isElder: PropTypes.bool
}

export default TaskFilters

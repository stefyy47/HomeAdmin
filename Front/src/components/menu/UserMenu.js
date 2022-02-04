import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

import { List, ListItem, Collapse, ListItemText, ListItemIcon, makeStyles, Tooltip } from '@material-ui/core'

import userMenuStyle from 'assets/jss/components/userMenuStyle'
import cx from 'classnames'
import LanguageSelector from './LanguageSelector'
import avatar_default from 'assets/img/default-avatar.png'
import { useTranslation } from 'react-i18next'
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew'
import { useReactOidc } from '@axa-fr/react-oidc-context'
import userMenuConfig from 'constants/userMenuConfig'
import UserMenuItem from './UserMenuItem'
import { useLocation } from 'react-router-dom'
import { ArrowDropDown, ArrowDropUp } from '@material-ui/icons'

import { isEmpty } from 'ramda'
import { emptyArray } from 'utils/constants'
import { useUserData } from 'hooks/rights'
import { intersect } from 'utils/functions'

const useStyles = makeStyles(userMenuStyle)

function UserMenu({ drawerOpen, avatar, language, changeLanguage, withGradient }) {
  const [openAvatar, setOpenAvatar] = useState(false)
  const classes = useStyles()
  const { t } = useTranslation()
  const location = useLocation()
  const { oidcUser, logout } = useReactOidc()

  const userRoles = oidcUser?.profile?.role || emptyArray
  const activeRoute = useCallback(routeName => location.pathname.indexOf(routeName) > -1, [location.pathname])
  const { userData } = useUserData()
  const userRights = userData?.rights || emptyArray
  const userMenuItems = userMenuConfig.filter(item =>
    isEmpty(item.rights)
      ? intersect(userRoles, item.roles) || isEmpty(item.roles)
      : (intersect(userRoles, item.roles) && intersect(userRights, item.rights)) || isEmpty(item.roles)
  )
  const openCollapseAvatar = useCallback(
    e => {
      setOpenAvatar(!openAvatar)
      e.preventDefault()
    },
    [openAvatar]
  )

  const logoutAction = useCallback(
    e => {
      e.preventDefault()
      logout()
    },
    [logout]
  )

  const userName = oidcUser?.profile?.firstName
    ? `${oidcUser.profile.name} ${oidcUser.profile.lastName}`
    : oidcUser?.profile
    ? oidcUser.profile.name.split('@')[0]
    : 'User'
  const itemText =
    classes.itemText +
    ' ' +
    cx({
      [classes.itemTextMini]: !drawerOpen
    })

  const displayName = userName
  return (
    <List className={classes.userMenuContainer}>
      <ListItem className={classes.item + ' ' + classes.userItem}>
        <NavLink to={'/'} className={classes.itemLink} onClick={openCollapseAvatar}>
          <ListItemIcon className={classes.itemIcon}>
            <img src={avatar ? avatar : avatar_default} className={classes.photo} alt='...' />
          </ListItemIcon>
          <ListItemText
            primary={displayName}
            secondary={openAvatar ? <ArrowDropUp className={classes.caret} /> : <ArrowDropDown className={classes.caret} />}
            disableTypography={true}
            className={itemText}
          />
        </NavLink>
        <Collapse in={openAvatar} unmountOnExit classes={{ wrapper: classes.collapseWrapper }}>
          <List className={classes.list + classes.collapseList}>
            {userMenuItems.map((userMenu, key) => {
              return (
                <UserMenuItem
                  key={key}
                  userMenu={userMenu}
                  drawerOpen={drawerOpen}
                  activeRoute={activeRoute}
                  withGradient={withGradient}
                />
              )
            })}
            {oidcUser && (
              <Tooltip disableHoverListener={drawerOpen} title={t('Tooltips.Logout')}>
                <ListItem className={classes.collapseItem}>
                  <NavLink to={'/'} className={classes.itemLink} onClick={logoutAction}>
                    <ListItemIcon className={classes.itemIcon}>
                      <PowerSettingsNew />
                    </ListItemIcon>
                    <ListItemText primary={t('Tooltips.Logout')} disableTypography={true} className={itemText} />
                  </NavLink>
                </ListItem>
              </Tooltip>
            )}
            <ListItem className={classes.selectorItem}>
              <LanguageSelector language={language} changeLanguage={changeLanguage} drawerOpen={drawerOpen} />
            </ListItem>
          </List>
        </Collapse>
      </ListItem>
    </List>
  )
}

UserMenu.propTypes = {
  avatar: PropTypes.string,
  drawerOpen: PropTypes.bool.isRequired,
  changeLanguage: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  withGradient: PropTypes.bool.isRequired
}

export default UserMenu

import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { List, makeStyles } from '@material-ui/core'
import { useLocation } from 'react-router-dom'
import menuConfig from 'constants/menuConfig'
import menuStyle from 'assets/jss/components/menuStyle'
import MenuItem from './MenuItem'
import CollapsibleMenuItem from './CollapsibleMenuItem'
import { isEmpty } from 'ramda'
import { emptyArray } from 'utils/constants'
import { useReactOidc } from '@axa-fr/react-oidc-context'
import { useUserData } from 'hooks/rights'
import { intersect } from 'utils/functions'

const useStyles = makeStyles(menuStyle)

function Menu({ drawerOpen, withGradient }) {
  const classes = useStyles()
  const location = useLocation()
  const { oidcUser } = useReactOidc()
  const userRoles = oidcUser?.profile?.role || emptyArray
  const activeRoute = useCallback(routeName => location.pathname.indexOf(routeName) > -1, [location.pathname])
  const { userData, loading } = useUserData()
  const userRights = userData?.rights || emptyArray

  if (loading) {
    return null
  }
  const menuItems = menuConfig.filter(item =>
    isEmpty(item.rights)
      ? intersect(userRoles, item.roles) || isEmpty(item.roles)
      : (intersect(userRoles, item.roles) && intersect(userRights, item.rights)) || isEmpty(item.roles)
  )
  return (
    menuItems && (
      <nav>
        <List className={classes.menuList}>
          {menuItems.map((menu, key) => {
            const menuItemProps = { key, menu, drawerOpen, activeRoute, withGradient }
            return menu.children ? <CollapsibleMenuItem {...menuItemProps} /> : <MenuItem {...menuItemProps} />
          })}
        </List>
      </nav>
    )
  )
}

Menu.propTypes = {
  drawerOpen: PropTypes.bool.isRequired,
  withGradient: PropTypes.bool.isRequired
}

export default Menu

import React from 'react'
import { Dashboard, Settings, Security, Lock, SupervisorAccount, House, Assignment } from '@material-ui/icons'
import identityUserRoles from 'constants/identityUserRoles'
import permissions from 'constants/permissions'
const { admin, user } = identityUserRoles
const { viewSettings } = permissions

const menuItems = [
  { icon: <SupervisorAccount />, text: 'NavBar.MyFamily', path: '/myFamily', name: 'MyFamily', roles: [], rights: [] },
  { icon: <House />, text: 'NavBar.MyHouses', path: '/myHouses', name: 'MyHouses', roles: [], rights: [] },
  { icon: <Assignment />, text: 'NavBar.Tasks', path: '/tasks', name: 'Assignment', roles: [], rights: [] },
  {
    icon: <Settings />,
    text: 'NavBar.Settings',
    name: 'Settings',
    roles: [admin, user],
    rights: [viewSettings],
    children: [
      { icon: <Security />, text: 'NavBar.Security', path: '/settings/security', name: 'Security' },
      {
        icon: <Lock />,
        text: 'NavBar.Privacy',
        path: '/settings/privacy',
        name: 'Privacy'
      }
    ]
  }
]

export default menuItems

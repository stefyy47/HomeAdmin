/* eslint-disable react/jsx-no-bind */
import React from 'react'
import { Switch, Redirect } from 'react-router-dom'

import CustomRoute from '../components/routing/CustomRoute'

import Dashboard from 'features/dashboard/Dashboard'
import SecuritySettings from 'features/settings/SecuritySettings'
import PrivacySettings from 'features/settings/PrivacySettings'
import { Forbidden, NotFound } from '@bit/totalsoft_oss.react-mui.kit.core'
import identityUserRoles from 'constants/identityUserRoles'
import permissions from 'constants/permissions'
import TaskContainer from 'features/taskScreen/list/components/TaskContainer'
import MyFamilyScreen from 'features/myFamily/myFamilyScreen'
import NewMember from 'features/myFamily/newMember'
import MyFamilyHousesScreen from 'features/myFamilyHouses/myFamilyHousesScreen'
import NewHouse from 'features/myFamilyHouses/newHouse'
import NewTaskContainer from 'features/taskScreen/list/components/newTask/NewTaskContainer'
const { admin, user } = identityUserRoles
const { viewSettings } = permissions

export default function AppRoutes() {
  return (
    <Switch>
      <CustomRoute isPrivate={false} exact path='/dashboard' component={Dashboard} />
      <CustomRoute isPrivate={true} exact path='/myFamily' component={MyFamilyScreen} />
      <CustomRoute isPrivate={false} exact path='/myFamily/newMember' component={NewMember} />
      <CustomRoute isPrivate={true} exact path='/myHouses' component={MyFamilyHousesScreen} />
      <CustomRoute isPrivate={true} exact path='/myHouses/newHouse' component={NewHouse} />
      <CustomRoute isPrivate={true} exact path='/tasks' component={TaskContainer} />
      <CustomRoute isPrivate={true} exact path='/tasks/new' component={NewTaskContainer} />
      <CustomRoute exact path='/settings/security' component={SecuritySettings} roles={[admin, user]} rights={[viewSettings]} />
      <CustomRoute exact path='/settings/privacy' component={PrivacySettings} roles={[admin, user]} rights={[viewSettings]} />
      <Redirect exact from='/' to='/dashboard' />
      <CustomRoute isPrivate={false} exact path='/forbidden' component={Forbidden} />
      <CustomRoute isPrivate={false} render={() => <NotFound title='PageNotFound'></NotFound>} />
    </Switch>
  )
}

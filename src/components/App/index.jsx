// @flow

import qs from 'querystring'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import Loadable from 'react-loadable'
import { push } from 'react-router-redux'
import { withRouter, Switch, Route, NavLink } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import { autobind } from 'core-decorators'
import { compose, partial, trimCharsStart } from 'lodash/fp'

import { cookies } from 'store'

import { getApiUrl } from 'utils/api'

import AppPerformance from 'components/AppPerformance'
import LoadingStatus from 'components/LoadingStatus'
import PrivateRoute from 'components/PrivateRoute'

import './styles.css'


type Props = {
  location: { search: string }, // eslint-disable-line react/no-unused-prop-types
  goToLoginPage: () => Promise<*>,
}


const NotFoundView = Loadable({
  loader: () => import('views/NotFound'),
  loading: LoadingStatus,
})

const LoginView = Loadable({
  loader: () => import('views/Login'),
  loading: LoadingStatus,
})

const HomeView = Loadable({
  loader: () => import('views/Home'),
  loading: LoadingStatus,
})

const UserProfileView = Loadable({
  loader: () => import('views/UserProfile'),
  loading: LoadingStatus,
})

const mapDispatchToProps = (dispatch) => ({
  goToLoginPage: compose(dispatch, partial(push, ['/login'])),
})

// @withRouter is needed to prevent render blocking in child components
// e.g. without it the login redirect renders `null` instead of the login page.
@withRouter
@connect(null, mapDispatchToProps)
@autobind
export default class App extends PureComponent {

  props: Props

  async handleLogout(event: MouseEvent) {
    event.preventDefault()

    const { goToLoginPage } = this.props

    const logoutUrl = `${getApiUrl()}/login/clear`

    await window.fetch(logoutUrl, {
      method: 'POST',
      credentials: 'include',
    })

    cookies.remove('client.sid')
    cookies.remove('userId')

    if (goToLoginPage) {
      goToLoginPage()
    }
  }

  render() {
    const { location } = this.props
    const queryString = trimCharsStart('?', location.search)
    const queryParams = qs.parse(queryString)
    const { sessionId, userId } = queryParams

    if (sessionId) {
      cookies.set('client.sid', sessionId, {
        path: '/',
      })
    }

    if (userId) {
      cookies.set('userId', userId, {
        path: '/',
      })
    }

    return (
      <div className="App">
        <header className="App-header">
          <Menu floated="right">
            <Menu.Item>
              <NavLink to="/profile">
                Profile
              </NavLink>
            </Menu.Item>
            <Menu.Item>
              <NavLink to="/friends">
                Friends
              </NavLink>
            </Menu.Item>
            <Menu.Item>
              <NavLink to="/team">
                Team
              </NavLink>
            </Menu.Item>
            <Menu.Item>
              <NavLink to="/rewards">
                Rewards
              </NavLink>
            </Menu.Item>
            <Menu.Item>
              <a href="/logout" onClick={this.handleLogout}>
                Sign Out
              </a>
            </Menu.Item>
          </Menu>
        </header>

        <main className="App-main">
          <Switch>
            <Route path="/login" component={LoginView} />
            <PrivateRoute exact path="/" component={HomeView} />
            <PrivateRoute path="/profile" component={UserProfileView} />
            <Route component={NotFoundView} />
          </Switch>
        </main>

        <footer className="App-footer">
          {/* Add content here */}
        </footer>

        <AppPerformance />
      </div>
    )
  }
}

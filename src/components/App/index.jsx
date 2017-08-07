// @flow

import qs from 'querystring'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { withApollo } from 'react-apollo'
import Loadable from 'react-loadable'
import { push } from 'react-router-redux'
import { withRouter, Switch, Route, NavLink } from 'react-router-dom'
import { Segment, Menu } from 'semantic-ui-react'
import { autobind } from 'core-decorators'
import { compose, partial, trimCharsStart } from 'lodash/fp'

import type { Client } from 'react-apollo'

import { getApiUrl } from 'utils/api'

import AppPerformance from 'components/AppPerformance'
import LoadingStatus from 'components/LoadingStatus'
import PrivateRoute from 'components/PrivateRoute'
import Logo from 'components/Logo'
import FriendsList from 'components/FriendsList'

import './styles.css'


type Props = {
  client: Client,
  location: {
    search: string, // eslint-disable-line react/no-unused-prop-types
    pathname: string, // eslint-disable-line react/no-unused-prop-types
  },
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
@withApollo
@connect(null, mapDispatchToProps)
@autobind
export default class App extends PureComponent {

  props: Props

  async handleLogout(event: MouseEvent) {
    event.preventDefault()

    const { client, goToLoginPage } = this.props
    const { fetch, localStorage } = window

    const logoutUrl = `${getApiUrl()}/login/clear`

    await fetch(logoutUrl, {
      method: 'POST',
      credentials: 'include',
    })

    localStorage.removeItem('sessionId')
    localStorage.removeItem('userId')

    client.resetStore()

    if (goToLoginPage) {
      goToLoginPage()
    }
  }

  render() {
    const { location } = this.props
    const queryString = trimCharsStart('?', location.search)
    const queryParams = qs.parse(queryString)
    const { sessionId, userId } = queryParams
    const { localStorage } = window

    if (sessionId) {
      localStorage.setItem('sessionId', sessionId)
    }

    if (userId) {
      localStorage.setItem('userId', userId)
    }

    const menuItems = [
      {
        url: '/',
        text: 'Home',
      },
      {
        url: '/profile',
        text: 'Profile',
      },
      {
        url: '/friends',
        text: 'Friends',
      },
      {
        url: '/team',
        text: 'Team',
      },
      {
        url: '/rewards',
        text: 'Rewards',
      },
    ]

    const renderMenuItem = ({ url, text }) => (
      <Menu.Item key={url} active={url === location.pathname}>
        <NavLink to={url}>
          {text}
        </NavLink>
      </Menu.Item>
    )

    return (
      <div className="App">
        <Segment as="header" className="App-header" basic clearing>
          <Logo floated="left" />
          <Menu floated="right" size="huge" pointing secondary>
            {menuItems.map(renderMenuItem)}
            <Menu.Item>
              <a href="/logout" onClick={this.handleLogout}>
                Sign Out
              </a>
            </Menu.Item>
          </Menu>
        </Segment>

        <Segment as="main" className="App-main" basic>
          <Switch>
            <Route
              path="/login"
              component={LoginView}
            />

            <PrivateRoute
              exact
              path="/"
              component={HomeView}
            />

            <PrivateRoute
              path="/profile/:userId"
              component={UserProfileView}
            />

            <PrivateRoute
              path="/profile"
              component={UserProfileView}
            />

            <Route component={NotFoundView} />
          </Switch>
        </Segment>

        <Segment as="footer" className="App-footer" basic>
          {/* Add content here */}
        </Segment>

        <FriendsList />
        <AppPerformance />
      </div>
    )
  }
}

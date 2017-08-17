// @flow

import qs from 'querystring'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { withApollo } from 'react-apollo'
import Loadable from 'react-loadable'
import { push } from 'react-router-redux'
import { withRouter, Switch, Route, NavLink } from 'react-router-dom'
import { Grid, Segment, Menu } from 'semantic-ui-react'

import { autobind } from 'core-decorators'
import { compose, partial, trimCharsStart } from 'lodash/fp'

import type { Client } from 'react-apollo'

import { getCurrentUserId, getIsAuthenticated } from 'store/selectors'
import actions from 'store/actions'

import { getApiUrl } from 'utils/api'

import AppPerformance from 'components/AppPerformance'

import LoggedInRoute from 'components/Route/LoggedIn'
import LoggedOutRoute from 'components/Route/LoggedOut'
import LoadingStatus from 'components/LoadingStatus'

import Logo from 'components/Logo'
import FriendsList from 'components/FriendsList'

import './styles.css'


type ApolloProps = {
  client: Client,
}

type RouterProps = {
  location: {
    search: string, // eslint-disable-line react/no-unused-prop-types
    pathname: string, // eslint-disable-line react/no-unused-prop-types
  },
}

type StateProps = {
  currentUserId: ?string,
  isAuthenticated: boolean,
}

type DispatchProps = {
  doLogin: (userId: string) => Promise<*>,
  doLogout: () => Promise<*>,
  goToLoginPage: () => Promise<*>,
}

type OwnProps = {}

type Props =
  & ApolloProps
  & RouterProps
  & StateProps
  & DispatchProps
  & OwnProps


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


const mapStateToProps = (state) => ({
  currentUserId: getCurrentUserId(state),
  isAuthenticated: getIsAuthenticated(state),
})

const mapDispatchToProps = (dispatch) => {
  const { currentUser } = actions
  const { login, logout } = currentUser

  return {
    doLogin: compose(dispatch, login),
    doLogout: compose(dispatch, logout),
    goToLoginPage: compose(dispatch, partial(push, ['/login'])),
  }
}

// @withRouter is needed to prevent render blocking in child components
// e.g. without it the login redirect renders `null` instead of the login page.
@withRouter
@withApollo
@connect(mapStateToProps, mapDispatchToProps)
@autobind
export default class App extends PureComponent {

  props: Props

  async handleLogout(event: MouseEvent) {
    event.preventDefault()

    const { client, doLogout, goToLoginPage } = this.props
    const { fetch } = window

    const logoutUrl = `${getApiUrl()}/login/clear`

    await fetch(logoutUrl, {
      method: 'POST',
      credentials: 'include',
    })

    if (doLogout) {
      doLogout()
    }

    client.resetStore()

    if (goToLoginPage) {
      goToLoginPage()
    }
  }

  componentWillMount() {
    const { location, doLogin } = this.props
    const queryString = trimCharsStart('?', location.search)
    const queryParams = qs.parse(queryString)
    const { userId } = queryParams

    if (doLogin && userId) {
      doLogin(userId)
    }
  }

  renderHeader() {
    const { isAuthenticated, location } = this.props

    if (!isAuthenticated) {
      return (
        <Segment as="header" className="app-header" basic clearing />
      )
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
      <Segment as="header" className="app-header" basic clearing>
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
    )
  }

  renderMain() {
    return (
      <Segment as="main" className="app-main" basic>
        <Switch>
          <LoggedInRoute
            exact
            path="/"
            component={HomeView}
          />

          <LoggedInRoute
            path="/profile/:userId"
            component={UserProfileView}
          />

          <LoggedInRoute
            path="/profile"
            component={UserProfileView}
          />

          <LoggedOutRoute
            path="/login"
            component={LoginView}
          />

          <Route component={NotFoundView} />
        </Switch>
      </Segment>
    )
  }

  renderFooter() {
    return (
      <Segment as="footer" basic>
        {/* Add content here */}
      </Segment>
    )
  }

  render() {
    const { isAuthenticated } = this.props
    const columnStyle = { height: '100vh' }

    return (
      <Grid className="app" celled="internally">
        <Grid.Row stretched={!isAuthenticated}>
          <Grid.Column width={isAuthenticated ? 13 : 16} style={columnStyle}>
            {this.renderHeader()}
            {this.renderMain()}
            {this.renderFooter()}
          </Grid.Column>

          {isAuthenticated && (
            <Grid.Column width={3} style={columnStyle}>
              <FriendsList />
            </Grid.Column>
          )}

          <AppPerformance />
        </Grid.Row>
      </Grid>
    )
  }
}

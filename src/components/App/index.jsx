
import { parse as parseQuery } from 'querystring'

import React, { PureComponent } from 'react'
import Loadable from 'react-loadable'
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  NavLink,
} from 'react-router-dom'
import { Menu, Image } from 'semantic-ui-react'
import Cookies from 'universal-cookie'
import { autobind } from 'core-decorators'
import { trimCharsStart } from 'lodash/fp'

import { getApiUrl } from 'utils/api'

// import logo1x from 'assets/logo-secondary.png'
import logo2x from 'assets/logo-secondary@2x.png'

import AppPerformance from 'components/AppPerformance'
import LoadingStatus from 'components/LoadingStatus'

import './styles.css'

const cookies = new Cookies()

function PrivateRoute(props: *) {
  const { component: Component, ...rest } = props

  const render = (_props: *) => {
    const { location } = _props
    const queryString = trimCharsStart('?', location.search)
    const queryParams = parseQuery(queryString)
    const sessionId = queryParams.sessionID

    if (sessionId) {
      cookies.set('session-id', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
    }

    if (sessionId || cookies.get('session-id')) {
      return (
        <Component {..._props} />
      )
    }

    return (
      <Redirect
        to={{
          pathname: '/login',
          state: { from: location },
        }}
      />
    )
  }

  return (
    <Route
      {...rest}
      render={render}
    />
  )
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

@autobind
export default class App extends PureComponent {

  async handleLogout() {
    const logoutUrl = `${getApiUrl()}/login/clear`

    await window.fetch(logoutUrl, {
      method: 'POST',
      credentials: 'include',
    })

    cookies.remove('session-id')

    window.location.replace('/login')
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <header className="App-header">
            <Image src={logo2x} floated="left" />
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
      </BrowserRouter>
    )
  }
}


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

// import logo1x from 'assets/logo-secondary.png'
import logo2x from 'assets/logo-secondary@2x.png'

import LoadingStatus from 'components/LoadingStatus'

import './styles.css'

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true
    setTimeout(cb, 100) // fake async
  },
  signout(cb) {
    this.isAuthenticated = false
    setTimeout(cb, 100)
  },
}


function PrivateRoute(props: *) {
  const { component: Component, ...rest } = props

  const render = (_props: *) => {
    if (fakeAuth.isAuthenticated) {
      return (
        <Component {..._props} />
      )
    }

    const { location } = _props

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

export default class App extends PureComponent {
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
                <NavLink to="/logout">
                  Sign Out
                </NavLink>
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
        </div>
      </BrowserRouter>
    )
  }
}

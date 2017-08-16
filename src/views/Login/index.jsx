// @flow

import React, { Component } from 'react'
import { Container, Header, Button, Icon } from 'semantic-ui-react'

import { getApiUrl } from 'utils/api'

import Logo from 'components/Logo'


type StateProps = {
  isAuthenticated: boolean,
}

type OwnProps = {}

type Props =
  & StateProps
  & OwnProps


export default class LoginView extends Component {

  props: Props

  getLoginUrl(): string {
    const { encodeURIComponent, location } = window

    const returnUrl = encodeURIComponent(location.origin)

    return `${getApiUrl()}/login/facebook?return=${returnUrl}`
  }

  render() {
    const loginUrl = this.getLoginUrl()

    return (
      <Container text textAlign="center">
        <Logo centered />

        <Header>
          A Better Gaming Community
        </Header>

        <Button color="facebook" as="a" href={loginUrl}>
          <Icon name="facebook" /> Continue with Facebook
        </Button>
      </Container>
    )
  }
}

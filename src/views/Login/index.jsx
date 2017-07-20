// @flow

import React, { Component } from 'react'
import { Container, Header, Image, Button, Icon } from 'semantic-ui-react'

// import logo1x from 'assets/logo-secondary.png'
import logo2x from 'assets/logo-secondary@2x.png'

import { getApiUrl } from 'utils/api'

type Props = {}

export default class LoginView extends Component {

  props: Props

  getLoginUrl(): string {
    const returnUrl = window.encodeURIComponent(window.location.origin)

    return `${getApiUrl()}/login/facebook?return=${returnUrl}`
  }

  render() {
    const loginUrl = this.getLoginUrl()

    return (
      <Container text textAlign="center">
        <Image src={logo2x} centered />

        <Header>
          A Better Gaming Community
        </Header>
        <p>
          <Button color="facebook" as="a" href={loginUrl}>
            <Icon name="facebook" /> Register with Facebook
          </Button>
        </p>
        <p>
          <Button primary as="a" href={loginUrl}>
            Sign In
          </Button>
        </p>
      </Container>
    )
  }
}

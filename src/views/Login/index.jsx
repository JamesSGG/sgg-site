// @flow

import React, { PureComponent } from 'react'
import { Container, Header, Button, Icon } from 'semantic-ui-react'

import { getApiUrl } from 'utils/api'

type Props = {}

export default class LoginView extends PureComponent {

  props: Props

  get loginUrl(): string {
    const returnUrl = window.encodeURIComponent(window.location.origin)

    return `${getApiUrl()}/login/facebook?return=${returnUrl}`
  }

  render() {
    const loginUrl = this.loginUrl

    return (
      <Container text textAlign="center">
        <Header>
          Life is too short to play with idiots and assholes.
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

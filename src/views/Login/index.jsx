// @flow

import React, { PureComponent } from 'react'
import { Container, Header, Button, Icon } from 'semantic-ui-react'

type Props = {}

export default class LoginView extends PureComponent {

  props: Props

  get loginUrl(): string {
    const { SGG_API_APP_NAME } = process.env

    const apiUrl = `https://${SGG_API_APP_NAME}.herokuapp.com`
    const returnUrl = window.encodeURIComponent(window.location.origin)

    return `${apiUrl}/login/facebook?return=${returnUrl}`
  }

  render() {
    const loginUrl = this.loginUrl

    return (
      <Container text>
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

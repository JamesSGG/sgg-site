// @flow

import React, { PureComponent } from 'react'
import { Image } from 'semantic-ui-react'

import logo from 'assets/logo-secondary.svg'


type Props = {}


export default class Logo extends PureComponent<Props> {
  props: Props

  render() {
    return (
      <Image
        src={logo}
        width="100"
        height="83"
        {...this.props}
      />
    )
  }
}

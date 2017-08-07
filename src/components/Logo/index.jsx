
import React, { PureComponent } from 'react'
import { Image } from 'semantic-ui-react'

import logo1x from 'assets/logo-secondary.png'
import logo2x from 'assets/logo-secondary@2x.png'


type Props = {}


export default class Logo extends PureComponent {

  props: Props

  render() {
    const srcSet = `${logo1x}, ${logo2x} 2x`

    return (
      <Image
        src={logo1x}
        srcSet={srcSet}
        width="100"
        height="83"
        {...this.props}
      />
    )
  }
}

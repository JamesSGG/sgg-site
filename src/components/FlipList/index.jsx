
import React, { PureComponent } from 'react'
import { findDOMNode } from 'react-dom'
import { List } from 'semantic-ui-react'
import { autobind } from 'core-decorators'

import type { Children } from 'react'


type Props = {
  children: Children,
};


@autobind
export default class FlipList extends PureComponent {

  props: Props

  getBoundingClientRect(): HTMLElement {
    const node = findDOMNode(this)

    if (!node) {
      return null
    }

    return node.getBoundingClientRect()
  }

  render() {
    const { children, ...props } = this.props

    return (
      <List {...props}>
        {children}
      </List>
    )
  }
}

// @flow

import React, { PureComponent } from 'react'
import { findDOMNode } from 'react-dom'
import { List } from 'semantic-ui-react'
import { autobind } from 'core-decorators'
import { omit } from 'lodash/fp'

import type { Node } from 'react'


type Props = {
  children: Node,
}


@autobind
export default class FlipList extends PureComponent<Props> {
  props: Props

  getBoundingClientRect(): ?ClientRect {
    // eslint-disable-next-line react/no-find-dom-node
    const node = findDOMNode(this)

    if (node && node instanceof Element) {
      return node.getBoundingClientRect()
    }

    return null
  }

  render() {
    const { children, ...props } = this.props
    const restProps = omit(['active'], props)

    return (
      <List {...restProps}>
        {children}
      </List>
    )
  }
}

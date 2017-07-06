// @flow

import React, { PureComponent } from 'react'
import classNames from 'classnames'
import { autobind } from 'core-decorators'
import { omit, toNumber } from 'lodash/fp'

import type { Children } from 'react'

import transformProps from 'utils/transform-props'


type RequiredProps = {
  alt: string,
  source: string,
}

type OptionalProps = {
  source2x: string,
  width: number | string,
  height: number | string,
}

type OwnProps = RequiredProps & OptionalProps

type Props = BaseProps & OwnProps

@transformProps({ width: toNumber, height: toNumber })
@autobind
export default class Image extends PureComponent {

  props: Props

  getClassNames(): string {
    const { className } = this.props

    return classNames(className, 'o-media-container')
  }

  renderSources(): Children {
    const { source, source2x } = this.props

    if (!source2x) {
      return null
    }

    return (
      <source srcSet={`${source2x} 2x, ${source} 1x`} />
    )
  }

  render(): Children {
    const {
      alt,
      source,
      width,
      height,
    } = this.props

    const filterImageProps = omit([
      'className',
      'alt',
      'source',
      'source2x',
      'width',
      'height',
    ])

    const imageProps = filterImageProps(this.props)

    return (
      <picture className={this.getClassNames()}>
        {this.renderSources()}
        <img
          className="o-media-fluid"
          src={source}
          alt={alt}
          width={width}
          height={height}
          {...imageProps}
        />
      </picture>
    )
  }
}

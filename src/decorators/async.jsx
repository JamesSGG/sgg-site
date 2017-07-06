// @flow

import React, { Component } from 'react'

import type { Children } from 'react'

type Options = {
  name?: string,
  resolve: () => Promise<Children>,
  renderLoading?: () => Children,
  renderError?: () => Children,
}

type State = {
  ChildComponent: Children,
}

export default function asyncComponent(options: Options) {
  const {
    name,
    resolve,
    renderLoading = () => 'Loading...',
    renderError = () => 'Error loading component!',
  } = options

  return class AsyncComponent extends Component {
    static displayName = name ? `Async(${name})` : 'AsyncComponent'
    static Component = null

    state: State = {
      ChildComponent: this.constructor.Component,
    }

    setComponent(ChildComponent) {
      this.constructor.Component = ChildComponent

      this.setState({
        ChildComponent,
      })
    }

    componentWillMount() {
      const { ChildComponent } = this.state

      if (!ChildComponent) {
        this.resolveModule(this.props)
      }
    }

    resolveModule(props) {
      this.setComponent(renderLoading)

      resolve()
        .then((result) => {
          this.setComponent(result.default || result)
        })
        .catch((error) => {
          this.setComponent(renderError)
        })
    }

    render() {
      const { ChildComponent } = this.state

      if (ChildComponent) {
        return (
          <ChildComponent {...this.props} />
        )
      }

      return null
    }
  }
}

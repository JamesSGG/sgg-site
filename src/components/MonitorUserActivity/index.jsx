// @flow

import { Component } from 'react'
import { autobind, decorate } from 'core-decorators'
import { noop, throttle } from 'lodash/fp'

import type { Node } from 'react'

import { MINUTE_IN_MS } from 'utils/date-time'

type OnChangeArgs = {
  isActive: boolean,
}

type RenderArgs = {
  isActive: boolean,
}

type OptionalProps = {
  render: (RenderArgs) => Node,
  onChange: (OnChangeArgs) => *,
  timeout: number,
  events: Array<string>,
}

type Props = OptionalProps

type ComponentState = {
  isActive: boolean,
}

@autobind
export default class MonitorUserActivity extends Component<Props, ComponentState> {
  static defaultProps: OptionalProps = {
    render: () => null,
    onChange: noop,
    timeout: 1 * MINUTE_IN_MS,
    events: ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'],
  }

  state: ComponentState = {
    isActive: false,
  }

  _timeout = null

  componentDidMount() {
    const { events } = this.props

    events.forEach((event) => {
      window.addEventListener(event, this.handleEvent)
    })
  }

  componentWillUnmount() {
    const { events } = this.props

    events.forEach((event) => {
      window.removeEventListener(event, this.handleEvent)
    })
  }

  handleChange(isActive: boolean) {
    const { onChange } = this.props

    onChange({ isActive })

    this.setState({ isActive })
  }

  @decorate(throttle(500))
  @autobind
  handleEvent() {
    const { timeout } = this.props

    const { isActive } = this.state

    if (!isActive) {
      this.handleChange(true)
      return
    }

    clearTimeout(this._timeout)

    this._timeout = setTimeout(() => {
      this.handleChange(false)
    }, timeout)
  }

  render() {
    const { isActive } = this.state
    const { render } = this.props

    return render({ isActive })
  }
}

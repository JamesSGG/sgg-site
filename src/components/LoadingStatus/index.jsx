// @flow

import React, { PureComponent } from 'react'
import { Message, Icon } from 'semantic-ui-react'

type Props = {
  isLoading: boolean,
  timedOut: boolean,
  pastDelay: boolean,
  error: boolean,
}

export default class LoadingStatus extends PureComponent<Props> {
  props: Props

  getMessage() {
    const {
      error,
      isLoading,
      timedOut,
      pastDelay,
    } = this.props

    if (isLoading) {
      if (timedOut) {
        return 'Loader timed out!'
      }

      if (pastDelay) {
        return 'Loading...'
      }

      return null
    }

    if (error) {
      return 'Error! Component failed to load!'
    }

    return null
  }

  render() {
    const { isLoading } = this.props

    const message = this.getMessage()
    const iconName = isLoading ? 'circle notched' : 'circle exclamation'

    return (
      <Message icon>
        <Icon name={iconName} loading={isLoading} />
        <Message.Content>
          {message}
        </Message.Content>
      </Message>
    )
  }
}

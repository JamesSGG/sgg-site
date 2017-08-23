// @flow

import React from 'react'
import { Icon, Popup } from 'semantic-ui-react'

type Props = {
  content: string,
}

export default function InfoTooltip(props: Props) {
  const trigger = (
    <Icon name="question" />
  )

  return (
    <Popup
      trigger={trigger}
      position="top center"
      {...props}
    />
  )
}

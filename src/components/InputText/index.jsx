// @flow

import React from 'react'
import { Form } from 'semantic-ui-react'

import type { FieldProps } from 'redux-form'


type OwnProps = {
  type: string,
}

type Props =
  & FieldProps
  & OwnProps


export default function InputSelect(props: Props) {
  const {
    input = {},
    meta = {},
    type = 'text',
  } = props

  const { value, onChange } = input
  const { error, touched } = meta

  const handleChange = (event, data) => onChange(data.value)

  return (
    <Form.Input
      type={type}
      value={value}
      error={error && touched}
      onChange={handleChange}
    />
  )
}

// @flow

import React from 'react'
import { Form } from 'semantic-ui-react'

import type { FieldProps } from 'redux-form'


type OwnProps = {
  options: Array<{ text: string, value: string }>,
}

type Props =
  & FieldProps
  & OwnProps


export default function InputSelect(props: Props) {
  const {
    input = {},
    meta = {},
    options,
  } = props

  const { value, onChange } = input
  const { error, touched } = meta

  const handleChange = (event, data) => onChange(data.value)

  return (
    <Form.Select
      options={options}
      value={value}
      error={error && touched}
      onChange={handleChange}
    />
  )
}

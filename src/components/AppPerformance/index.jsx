// @flow

import React from 'react'
import Loadable from 'react-loadable'

import { getIsProd } from 'utils/env'

const { PERF_CHECK } = process.env


type Props = {}

export default function AppPerformance(props: Props) {
  if (getIsProd() || !PERF_CHECK) {
    return null
  }

  import('react-perf-tool/lib/styles.css')

  const extractDefault = (module) => module.default || module

  const ReactPerfTool = Loadable.Map({
    loader: {
      perf: () => import('react-addons-perf').then(extractDefault),
      Component: () => import('react-perf-tool').then(extractDefault),
    },
    loading: () => null,
    render(loaded, _props) {
      const { Component, perf } = loaded

      return (
        <Component {..._props} perf={perf} />
      )
    },
  })

  return (
    <ReactPerfTool {...props} />
  )
}

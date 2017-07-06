/* eslint-disable no-console */

const chalk = require('chalk')
const {
  compose,
  mapValues,
} = require('lodash/fp')


const styles = {
  ok: chalk.green,
  info: chalk.cyan,
  warn: chalk.yellow,
  error: chalk.red.underline,
  debug: chalk.cyan.underline,
  message: chalk.reset,
}

function getLogger(applyStyle) {
  return compose(console.log, applyStyle)
}

module.exports = mapValues(getLogger, styles)

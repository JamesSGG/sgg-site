/* eslint-disable global-require, import/no-dynamic-require */

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production'
process.env.NODE_ENV = 'production'

const path = require('path')
const chalk = require('chalk')
const fs = require('fs-extra')
const webpack = require('webpack')
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles')
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')
const printHostingInstructions = require('react-dev-utils/printHostingInstructions')
const FileSizeReporter = require('react-dev-utils/FileSizeReporter')

const {
  negate,
  isEqual,
  isString,
  toLower,
} = require('lodash/fp')

// Ensure environment variables are read.
require('../config/env')

const config = require('../config/webpack.config.prod')
const paths = require('../config/paths')

const logger = require('./utils/logger')

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err
})

const {
  measureFileSizesBeforeBuild,
  printFileSizesAfterBuild,
} = FileSizeReporter

const useYarn = fs.existsSync(paths.yarnLockFile)

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1)
}

// Create the production build and print the deployment instructions.
function build(previousFileSizes) {
  logger.message('Creating an optimized production build...')

  const compiler = webpack(config)

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err)
      }

      const messages = formatWebpackMessages(stats.toJson({}, true))
      const { warnings, errors } = messages

      if (errors.length) {
        return reject(new Error(errors.join('\n\n')))
      }

      const { CI } = process.env

      const isCI = CI && isString(CI) && isEqual('true', toLower(CI))

      if (isCI && warnings.length) {
        logger.warn('Treating warnings as errors because process.env.CI = true.')
        logger.warn('Most CI servers set it automatically.')

        return reject(new Error(warnings.join('\n\n')))
      }

      return resolve({
        stats,
        previousFileSizes,
        warnings,
      })
    })
  })
}

function copyPublicFolder() {
  const { appPublic, appBuild, appHtml } = paths

  fs.copySync(appPublic, appBuild, {
    dereference: true,
    filter: negate(isEqual(appHtml)),
  })
}

// First, read the current file sizes in build directory.
// This lets us display how much they changed later.
measureFileSizesBeforeBuild(paths.appBuild)
  .then((previousFileSizes) => {
    // Remove all content but keep the directory so that
    // if you're in it, you don't end up in Trash
    fs.emptyDirSync(paths.appBuild)

    // Merge with the public folder
    copyPublicFolder()

    // Start the webpack build
    return build(previousFileSizes)
  })
  .then(
    (result) => {
      const { stats, previousFileSizes, warnings } = result

      if (warnings.length) {
        logger.warn('Compiled with warnings.\n')
        logger.message(warnings.join('\n\n'))

        const keywordsText = chalk.yellow.underline('keywords')
        const eslintDisableText = chalk.cyan('// eslint-disable-next-line')
        const logText = [
          '',
          `Search for the ${keywordsText} to learn more about each warning.`,
          `To ignore, add ${eslintDisableText} to the line before.`,
          '',
        ].join('\n')

        logger.message(logText)
      }
      else {
        logger.ok('Compiled successfully.\n')
      }

      logger.message('File sizes after gzip:\n')
      printFileSizesAfterBuild(
        stats,
        previousFileSizes,
        paths.appBuild,
        WARN_AFTER_BUNDLE_GZIP_SIZE,
        WARN_AFTER_CHUNK_GZIP_SIZE
      )
      logger.message()

      const appPackage = require(paths.appPackageJson)
      const publicUrl = paths.publicUrl
      const publicPath = config.output.publicPath
      const buildFolder = path.relative(process.cwd(), paths.appBuild)
      printHostingInstructions(
        appPackage,
        publicUrl,
        publicPath,
        buildFolder,
        useYarn
      )
    },
    (err) => {
      logger.error('Failed to compile.\n')
      logger.message(`${err.message || err}\n`)
      process.exit(1)
    }
  )

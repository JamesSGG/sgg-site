
const path = require('path')
const fs = require('fs')
const url = require('url')
const { partial } = require('lodash/fp')

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = partial(path.resolve, [appDirectory])

const { PUBLIC_URL } = process.env

function ensureSlash(_path, needsSlash) {
  const hasSlash = _path.endsWith('/')

  if (hasSlash && !needsSlash) {
    return path.substr(_path, _path.length - 1)
  }

  if (!hasSlash && needsSlash) {
    return `${_path}/`
  }

  return _path
}

const getPublicUrl = (appPackageJson) => (
  // eslint-disable-next-line global-require, import/no-dynamic-require
  PUBLIC_URL || require(appPackageJson).homepage
)

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson)
  const servedUrl = PUBLIC_URL || (publicUrl ? url.parse(publicUrl).pathname : '/')
  return ensureSlash(servedUrl, true)
}

// config after eject: we're in ./config/
module.exports = {
  appRoot: resolveApp(),
  dotenv: resolveApp('.env'),
  appBuild: resolveApp('build'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appIndexJs: resolveApp('src/index.jsx'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveApp('src/setupTests.js'),
  appNodeModules: resolveApp('node_modules'),
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json')),
}

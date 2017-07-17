/* eslint-disable no-console, global-require */

const path = require('path')
const webpack = require('webpack')
const ManifestPlugin = require('webpack-manifest-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')

const paths = require('./paths')
const baseConfig = require('./webpack.config.base')
const { merge } = require('./webpack.utils')

const buildDir = path.relative(paths.appRoot, paths.appBuild)

const { NODE_ENV } = process.env


// Assert this just to be safe.
// Development builds of React are slow and not intended for production.
if (NODE_ENV !== 'production') {
  throw new Error('Production builds must have NODE_ENV=production.')
}

// This is the production configuration.
// It compiles slowly and is focused on producing a fast and minimal bundle.
// The development configuration is different and lives in a separate file.
module.exports = merge(baseConfig, {
  // Don't attempt to continue if there are any errors.
  bail: true,

  // We generate sourcemaps in production. This is slow but gives good results.
  // You can exclude the *.map files from the build during deployment.
  devtool: 'source-map',

  plugins: [
    // Minify the code.
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        // Disabled because of an issue with Uglify breaking seemingly valid code:
        // https://github.com/facebookincubator/create-react-app/issues/2376
        // Pending further investigation:
        // https://github.com/mishoo/UglifyJS2/issues/2011
        comparisons: false,
      },
      output: {
        comments: false,
        // Turned on because emoji and regex is not minified properly using default
        // https://github.com/facebookincubator/create-react-app/issues/2488
        ascii_only: true,
      },
      sourceMap: true,
    }),
    // Generate a manifest file which contains a mapping of all asset filenames
    // to their corresponding output file so that tools can pick it up without
    // having to parse `index.html`.
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
    }),
    // Generate a service worker script that will precache, and keep up to date,
    // the HTML & assets that are part of the Webpack build.
    new WorkboxPlugin({
      globDirectory: buildDir,
      globPatterns: ['**/*.{html,js,css}'],
      globIgnores: ['/.map$/', '/asset-manifest.json$/'],
      swDest: path.join(buildDir, 'service-worker.js'),
    }),
  ],
})

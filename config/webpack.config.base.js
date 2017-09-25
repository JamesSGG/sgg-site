/* eslint-disable global-require */

const path = require('path')
// const glob = require('glob')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// const PurifyCssPlugin = require('purifycss-webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin')
const eslintFormatter = require('react-dev-utils/eslintFormatter')
const getClientEnvironment = require('./env')
const paths = require('./paths')

const { NODE_ENV, WEBPACK_ANALYZE } = process.env

const isDev = NODE_ENV !== 'production'
const isProd = !isDev

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
const publicPath = isDev ? '/' : paths.servedPath

// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
const publicUrl = isDev ? '' : publicPath.slice(0, -1)

// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl)

const fileSlug = isDev ? '[name]' : '[name].[chunkhash:8]'
const chunkFileSlug = isDev ? '[name].chunk' : '[name].[chunkhash:8].chunk'
const cssModulePrefix = `local__${isDev ? '[path][name]__' : ''}`
const cssModuleName = `${cssModulePrefix}[local]--[hash:base64:5]`

// This is the base configuration.
module.exports = {
  // These are the "entry points" to our application.
  entry: [
    require.resolve('./polyfills'),
    paths.appIndexJs,
  ],

  output: {
    // The build folder.
    path: paths.appBuild,

    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: isDev,

    // This does not produce a real file. It's just the virtual path that is
    // served by WebpackDevServer in development. This is the JS bundle
    // containing code from all our entry points, and the Webpack runtime.
    filename: `static/js/${fileSlug}.js`,

    // There are also additional JS chunk files if you use code splitting.
    chunkFilename: `static/js/${chunkFileSlug}.js`,

    // This is the URL that app is served from. We use "/" in development.
    publicPath,

    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate(info) {
      const fullPath = path.resolve(info.absoluteResourcePath)

      return fullPath.replace(/\\/g, '/')
    },
  },

  resolve: {
    modules: [
      'node_modules',
      paths.appSrc,
    ],

    // These are the reasonable defaults supported by the Node ecosystem.
    // We also include JSX as a common component filename extension to support
    // some tools, although we do not recommend using it, see:
    // https://github.com/facebookincubator/create-react-app/issues/290
    // `web` extension prefixes have been added for better support
    // for React Native Web.
    extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx'],

    alias: {
      $: paths.appSrc,

      // Support React Native Web
      // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
      'react-native': 'react-native-web',
    },
    plugins: [
      // Prevents users from importing files from outside of src/ (or node_modules/).
      // This often causes confusion because we only process files within src/ with babel.
      // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
      // please link the files into your node_modules/ and let module-resolution kick in.
      // Make sure your source files are compiled, as they will not be processed in any way.
      new ModuleScopePlugin(paths.appSrc),
    ],
  },

  module: {
    strictExportPresence: true,

    rules: [
      // Disable require.ensure as it's not a standard language feature.
      { parser: { requireEnsure: false } },

      // First, run the linter.
      // It's important to do this before Babel processes the JS.
      {
        test: /\.(js|jsx)$/,
        enforce: 'pre',
        use: [
          {
            options: {
              formatter: eslintFormatter,

            },
            loader: 'eslint-loader',
          },
        ],
        include: paths.appSrc,
      },

      // The "file" loader handles all assets unless explicitly excluded.
      // The `exclude` list *must* be updated with every change to loader extensions.
      // When adding a new loader, you must add its `test`
      // as a new entry in the `exclude` list for "file" loader.
      // "file" loader makes sure those assets get served by WebpackDevServer.
      // When you `import` an asset, you get its (virtual) filename.
      // In production, they would get copied to the `build` folder.
      {
        exclude: [
          /\.html$/,
          /\.(js|jsx)$/,
          /\.css$/,
          /\.json$/,
          /\.bmp$/,
          /\.gif$/,
          /\.jpe?g$/,
          /\.png$/,
          /\.svg$/,
          /\.(graphql|gql)$/,
        ],
        loader: 'file-loader',
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },

      // "url" loader works like "file" loader except that it embeds assets
      // smaller than specified limit in bytes as data URLs to avoid requests.
      // A missing `test` is equivalent to a match.
      {
        test: [
          /\.bmp$/,
          /\.gif$/,
          /\.jpe?g$/,
          /\.png$/,
          /\.svg$/,
        ],
        loaders: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
              },
              optipng: {
                optimizationLevel: 4,
              },
              svgo: {
                plugins: [
                  { cleanupAttrs: true },
                  { removeEditorsNSData: true },
                  { removeEmptyAttrs: true },
                  { removeEmptyContainers: true },
                  { cleanUpEnableBackground: true },
                  { convertStyleToAttrs: true },
                  { convertPathData: true },
                  { convertTransform: true },
                  { removeUnknownsAndDefaults: true },
                  { removeNonInheritableGroupAttrs: true },
                  { removeUselessStrokeAndFill: true },
                  { removeUnusedNS: true },
                  { cleanupNumericValues: true },
                  { mergePaths: true },
                  { convertShapeToPath: true },
                  { transformsWithOnePath: false },
                ],
              },
            },
          },
        ],
      },

      // Process JS with Babel.
      {
        test: /\.(js|jsx)$/,
        include: paths.appSrc,
        loader: 'babel-loader',
        options: {
          // This is a feature of `babel-loader` for webpack (not Babel itself).
          // It enables caching results in ./node_modules/.cache/babel-loader/
          // directory for faster rebuilds.
          cacheDirectory: isDev,
          compact: isProd,
        },
      },

      // "postcss" loader applies autoprefixer to our CSS.
      // "css" loader resolves paths in CSS and adds assets as dependencies.
      // "style" loader turns CSS into JS modules that inject <style> tags.
      // In production, we use a plugin to extract that CSS to a file, but
      // in development "style" loader enables hot editing of CSS.
      // {
      //   test: /\.css$/,
      //   use: [
      //     'style-loader',
      //     {
      //       loader: 'css-loader',
      //       options: {
      //         importLoaders: 1,
      //       },
      //     },
      //     {
      //       loader: 'postcss-loader',
      //     },
      //   ],
      // },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          disable: isProd,
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                minimize: true,
                sourceMap: true,
                // modules: true,
                localIdentName: cssModuleName,
              },
            },
            {
              loader: 'postcss-loader',
            },
          ],
        }),
      },

      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
      // ** STOP ** Are you adding a new loader?
      // Remember to add the new extension(s) to the "file" loader exclusion list.
    ],
  },

  plugins: [
    // Makes some environment variables available in index.html.
    // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In development, this will be an empty string.
    new InterpolateHtmlPlugin(env.raw),

    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd,
        removeRedundantAttributes: isProd,
        useShortDoctype: isProd,
        removeEmptyAttributes: isProd,
        removeStyleLinkTypeAttributes: isProd,
        keepClosingSlash: isProd,
        minifyJS: isProd,
        minifyCSS: isProd,
        minifyURLs: isProd,
      },
    }),

    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
    new webpack.DefinePlugin(env.stringified),

    // Extract CSS out into separate file for production builds.
    new ExtractTextPlugin({
      filename(getPath) {
        const filePath = getPath('static/css/[name].[contenthash:8].css')

        return filePath.replace('css/js', 'css')
      },
    }),

    // Remove unused CSS.
    // new PurifyCssPlugin({
    //   paths: glob.sync(`${paths.appSrc}/**/*.jsx`, { nodir: true }),
    // }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      minChunks: 2,
    }),

    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how Webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

    // Analyze the Webpack bundle & chunks and show dependency sizes.
    WEBPACK_ANALYZE && new BundleAnalyzerPlugin(),
  ].filter(Boolean),

  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },

  // Turn off performance hints during development because we don't do any
  // splitting or minification in interest of speed. These warnings become
  // cumbersome.
  performance: {
    hints: isProd ? 'warning' : false,
  },
}

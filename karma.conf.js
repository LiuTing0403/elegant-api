var webpackConfig = require('./webpack.config');
delete webpackConfig.entry;

webpackConfig.devtool = 'inline-source-map';
webpackConfig.module.postLoaders = [{
  test: /\.jsx$/,
  exclude: /test|node_modules/,
  loader: 'istanbul-instrumenter'
}];
webpackConfig.module.loaders = [{
  test: /\.jsx$/,
  exclude: /node_modules/,
  loader: 'babel-loader',
  query: {
    plugins: ['transform-runtime'] // 此 runtime 会增加文件尺寸，所以只在测试时候用，可以增加代码覆盖率
  }
}];

var plugins = Object.keys(require('./package').devDependencies).filter(function (k) {
  return k.indexOf('karma-') === 0;
});
plugins.push({'middleware:custom': ['factory', require('./test/server/karma-middleware')]});

module.exports = function (config) {

  config.set({
    // logLevel: 'LOG_DEBUG',

    reporters: ['spec', 'coverage'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: process.env.CI ? true : false,
    autoWatch: process.env.CI ? false : true,

    middleware: ['custom'],
    plugins: plugins,

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    port: 9876,

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [
      'mocha'
    ],

    files: [
      'node_modules/es6-promise/dist/es6-promise.js',
      'test/test*.jsx'
    ],

    // list of files to exclude
    exclude: [],

    preprocessors: {
      'test/**/test*.jsx': ['webpack', 'sourcemap'],
      'src/**/*.jsx': ['coverage', 'sourcemap'],
      'plugins/*.js': ['coverage', 'sourcemap']
    },

    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },

    coverageReporter: {
      reporters: [
        { type: 'text-summary' },
        // { type: 'lcovonly' },
        { type: 'lcov' },
        { type: 'html' }
      ]
    },

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
      // 'Firefox',
      'PhantomJS'
    ].concat(require('os').platform() === 'win32' ? 'IE' : [])

  });
};

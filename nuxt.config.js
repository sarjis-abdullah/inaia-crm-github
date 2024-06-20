/*!

=========================================================
* Nuxt Argon Dashboard PRO - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nuxt-argon-dashboard-pro
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by www.creative-tim.com and www.binarcode.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

const pkg = require('./package')
const appEnv  = process.env.NODE_ENV || 'development';
import appNames from './appNames';
const appName  = process.env.CURRENT_APP || appNames.inaiaEu
const appCurrency = process.env.APP_CURRENCY || 'EUR'
const depoloymentEnv = process.env.DEPLOYMENT_ENV || 'production';
import EnvKeys from './config';

import gggEnvKeys from './gggConfig';
import inaiaUKEnvKeys from './inaiaUkConfig';
let selectedConfig = EnvKeys;
let favIcon = '/favicon.ico';
let pageTitle = "Adminpanel - INAIA Cloud";
let css =[
  'assets/css/nucleo/css/nucleo.css',
  'assets/css/LineIconsPro/Pro-Regular/css/LineIconsPro-Regular.css',
  //'assets/css/LineIconsPro/Pro-Light/css/LineIconsPro-Light.css',
  'assets/css/icomoon/style.css',
  'assets/sass/argon.scss',
]
switch (appName) {
  case appNames.inaiaEu:
    selectedConfig = EnvKeys;
    pageTitle = "Adminpanel - INAIA Cloud"
    favIcon = '/favicon.ico'
    css =[
      'assets/css/nucleo/css/nucleo.css',
      'assets/css/LineIconsPro/Pro-Regular/css/LineIconsPro-Regular.css',
      //'assets/css/LineIconsPro/Pro-Light/css/LineIconsPro-Light.css',
      'assets/css/icomoon/style.css',
      'assets/sass/argon.scss',
    ]
    break;
    case appNames.inaiaUk:
      selectedConfig = inaiaUKEnvKeys;
      pageTitle = "Adminpanel - INAIA UK Cloud"
      favIcon = '/favicon.ico'
      css =[
        'assets/css/nucleo/css/nucleo.css',
        'assets/css/LineIconsPro/Pro-Regular/css/LineIconsPro-Regular.css',
        //'assets/css/LineIconsPro/Pro-Light/css/LineIconsPro-Light.css',
        'assets/css/icomoon/style.css',
        'assets/sass/argon.scss',
      ]
    break;
    case appNames.getGreenGold:
      selectedConfig = gggEnvKeys;
      pageTitle = "CRM - Get Green Gold Cloud";
      favIcon = '/ggg-favicon.ico';
      css =[
        'assets/css/nucleo/css/nucleo.css',
        'assets/css/LineIconsPro/Pro-Regular/css/LineIconsPro-Regular.css',
        //'assets/css/LineIconsPro/Pro-Light/css/LineIconsPro-Light.css',
        'assets/css/icomoon/style.css',
        'assets/sass/ggg-argon.scss',
      ]
      break;
  default:
    selectedConfig = EnvKeys;
    break;
}
module.exports = {
  mode: 'spa',
//   mode: 'universal',
//   router: {
//     base: '/',
//     linkExactActiveClass: 'active'
//   },
  /*
  ** Headers of the page
  */
  head: {
    title: pageTitle,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: favIcon },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700'},
      { rel: 'stylesheet', href: 'https://use.fontawesome.com/releases/v5.6.3/css/all.css', integrity: "sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/", crossorigin: "anonymous"}
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: css,

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/axios',
    '~/plugins/i18n',
    '~/plugins/dashboard/dashboard-plugin',
    '~/plugins/dashboard/full-calendar',
    '~/plugins/dashboard/world-map',
    '~/plugins/slickCarousel'
    // {src: '~/plugins/dashboard/full-calendar', ssr: false },
    // {src: '~/plugins/dashboard/world-map', ssr: false },
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    'vue2-editor/nuxt'
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    ...selectedConfig[appEnv].axios
    // See https://github.com/nuxt-community/axios-module#options
  },

  /**
   * settings for port and
   * access from devices in the same network
   */
  server: {
    ...selectedConfig[appEnv].server
  },

  /**
   * Environment configurations
   */
  env: {
    ...selectedConfig[appEnv].env,
    CURRENT_APP:appName,
    APP_CURRENCY:appCurrency,
    DEPLOYMENT_ENV:depoloymentEnv
  },

  /*
  ** Build configuration
  */
  build: {
    transpile: [
      'vee-validate/dist/rules'
    ],
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {

    },
    extractCSS: appEnv === 'production',
    babel: {
      plugins: [
        [
          "component",
          {
            "libraryName": "element-ui",
            "styleLibraryName": "theme-chalk"
          }
        ]
      ]
    }
  }
}

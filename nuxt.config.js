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
const appEnv  = process.env.NODE_ENV || 'development'
import EnvKeys from './config'

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
    title: 'CRM - INAIA Cloud',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
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
  css: [
    'assets/css/nucleo/css/nucleo.css',
    'assets/css/LineIconsPro/Pro-Regular/css/LineIconsPro-Regular.css',
    //'assets/css/LineIconsPro/Pro-Light/css/LineIconsPro-Light.css',
    'assets/css/icomoon/style.css',
    'assets/sass/argon.scss',
  ],

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
    ...EnvKeys[appEnv].axios
    // See https://github.com/nuxt-community/axios-module#options
  },

  /**
   * settings for port and
   * access from devices in the same network
   */
  server: {
    ...EnvKeys[appEnv].server
  },

  /**
   * Environment configurations
   */
  env: {
    ...EnvKeys[appEnv].env
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

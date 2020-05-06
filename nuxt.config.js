
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
console.log('ENV', process.env.NODE_ENV)
const isDevelopment = process.env.NODE_ENV !== 'production'

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
    title: 'CRM Golddinar',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt Argon Dashboard PRO - Premium Nuxt.js & Bootstrap 4 Dashboard' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' },
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
    'assets/sass/argon.scss'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/axios',
    '~/plugins/dashboard/dashboard-plugin',
    '~/plugins/dashboard/full-calendar',
    '~/plugins/dashboard/world-map',
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
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    baseURL: isDevelopment ? 'https://auth-staging.inaia.cloud/api/v1' : 'https://auth-staging.inaia.cloud/api/v1'
    // baseURL: isDevelopment ? 'https://auth-staging.inaia.de/api/v1' : 'https://auth-staging.inaia.de/api/v1'
    // baseURL: isDevelopment ? 'http://inaia-api-auth/api/v1' : 'https://auth-staging.inaia.cloud/api/v1'
    // baseURL: isDevelopment ? 'http://inaia-api-auth/api/v1' : 'https://auth-staging.inaia.de/api/v1'
    // See https://github.com/nuxt-community/axios-module#options
  },

  /**
   * settings for port and
   * access from devices in the same network
   */
  server: {
    // for check in mbl device
    port: 3001, // default: 3000
    host: '0.0.0.0', // default: localhost
  },

  /**
   * Environment configurations
   */
  env: {
    universalLogin: isDevelopment ? 'http://localhost:3000' : 'https://login-staging.inaia.cloud',
    // universalLogin: isDevelopment ? 'http://localhost:3000' : 'https://login-staging.inaia.de',
    dashboardPath: '/dashboard',
    entryPoints: {
      crm: isDevelopment ? 'http://localhost:3001' : 'https://crm-staging.inaia.cloud',
      admin: isDevelopment ? 'http://localhost:3002' : 'https://admin-staging.inaia.cloud',
      golddinar: isDevelopment ? 'http://localhost:3003' : 'https://golddinar-admin-staging.inaia.cloud'
    }
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
    extractCSS: process.env.NODE_ENV === 'production',
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

const isDevelopment = process.env.NODE_ENV !== 'production'

export default {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
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
    // '@/assets/scss/style.scss',
    'vue-form-wizard/dist/vue-form-wizard.min.css',
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/axios',
    '~/plugins/global',
    '~/plugins/vee-validate',
    '~/plugins/i18n',
    '~/plugins/vuesax'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    // '@nuxtjs/eslint-module'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    // baseURL: isDevelopment ? 'https://auth-staging.inaia.de/api/v1' : 'https://auth-staging.inaia.de/api/v1'
    baseURL: isDevelopment ? 'http://inaia-api-auth/api/v1' : 'https://auth-staging.inaia.de/api/v1'
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  },
  server: {
    // for check in mbl device
    port: 3001, // default: 3000
    host: '0.0.0.0', // default: localhost
  },
  /**
   * Environment configurations
   */
  env: {
    universalLogin: isDevelopment ? 'http://localhost:3000' : 'https://login-staging.inaia.de',
    dashboardPath: '/dashboards/classic'
  }
}

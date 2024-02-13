import Vue from 'vue'
import VueI18n from 'vue-i18n'
import de from '../lang/de-DE.js'
import en from '../lang/en-UK.js'
import es from '../lang/es-ES.js'
import fr from '../lang/fr-FR.js'

Vue.use(VueI18n)

export default ({ app, store }, inject) => {
  // Set i18n instance on app
  // This way we can use it in middleware and pages asyncData/fetch
  app.i18n = new VueI18n({
    locale: store.getters['auth/locale'],
    locales: [
        {
            name: 'German',
            code: 'de',
            iso: 'de-DE',
            file: 'de-DE.js'
        },
        {
            name: 'English',
            code: 'en',
            iso: 'en-UK',
            file: 'en-UK.js'
        }
        // 'de', 'en', 'fr'
    ],
    defaultLocale: 'en',
    fallbackLocale: 'en',
    numberFormats: {
        de: {
            style: 'currency',
            currency: 'EUR'
        },
        en: {
            style: 'currency',
            currency: 'USD'
        }
    },
    dateTimeFormats: {
        de: {
            narrow: {
                year: 'numeric', month: 'numeric', day: 'numeric'
            },
            short: {
                year: 'numeric', month: 'short', day: 'numeric'
            },
            long: {
                year: 'numeric', month: 'short', day: 'numeric',
                weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false
            },
        },
        en: {
            narrow: {
                year: 'numeric', month: 'numeric', day: 'numeric'
            },
            short: {
                year: 'numeric', month: 'short', day: 'numeric'
            },
            long: {
                year: 'numeric', month: 'short', day: 'numeric',
                weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false
            },
        }
    },
    strategy: 'no_prefix',
    // lazy: true,
    // langDir: 'lang/',
    vuex: {
        module: 'auth',
        syncLocale: true
    },
    detectBrowserLanguage: {
        fallbackLocale: 'en'
    },
    messages: { de, en, es, fr },
    beforeLanguageSwitch: (o, n) => {
        console.error('switching locale from', o, 'to', n)
    },
    onLanguageSwitch: (o, n) => {
        console.error('switched locale from', o, 'to', n)
    }
  })
  inject('localize', app.i18n)
}

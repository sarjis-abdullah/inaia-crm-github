import Vue from 'vue'
import VueI18n from 'vue-i18n'
import de from '../lang/de-DE.js'
import en from '../lang/en-UK.js'
import es from '../lang/es-ES.js'
import fr from '../lang/fr-FR.js'
import gggde from '../lang/ggg-de-DE.js'
import gggen from '../lang/ggg-en-UK.js'
import ggges from '../lang/ggg-es-ES.js'
import gggfr from '../lang/ggg-fr-FR.js'
import appNames from '../appNames';
const appName  = process.env.CURRENT_APP || appNames.inaiaEu
let selectedGerman = de;
let selectedFrench = fr;
let selectedEnglish = en;
let selectedSpanish = es;
switch (appName) {
    case appNames.inaiaEu:
        selectedGerman = de;
        selectedFrench = fr;
        selectedEnglish = en;
        selectedSpanish = es;
        break;
    case appNames.getGreenGold:
        selectedGerman = gggde;
        selectedFrench = gggfr;
        selectedEnglish = gggen;
        selectedSpanish = ggges;
        break;
    default:
        selectedGerman = de;
        selectedFrench = fr;
        selectedEnglish = en;
        selectedSpanish = es;
        break;
}
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
    messages: { de:selectedGerman, en:selectedEnglish, es:selectedSpanish, fr:selectedFrench },
    beforeLanguageSwitch: (o, n) => {
        console.error('switching locale from', o, 'to', n)
    },
    onLanguageSwitch: (o, n) => {
        console.error('switched locale from', o, 'to', n)
    }
  })
  inject('localize', app.i18n)
}

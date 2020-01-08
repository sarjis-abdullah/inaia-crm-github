import Vue from 'vue'
import Vuesax from 'vuesax'

import 'vuesax/dist/vuesax.css' //vuesax styles
import 'material-icons/iconfont/material-icons.css' //material icons

if (process.browser) {
    Vue.use(Vuesax, {
        // server:true,
        theme: {
            colors: {
                primary:'#5b3cc4',
                success:'rgb(23, 201, 100)',
                danger:'rgb(242, 19, 93)',
                warning:'rgb(255, 130, 0)',
                dark:'rgb(36, 33, 69)'
              }
        }
    })
}

import '@/assets/scss/style.scss'
  
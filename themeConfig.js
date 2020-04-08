// import Vue from 'vue'
// import Vuesax from 'vuesax'
// Vue.use(Vuesax, {
//   theme:{
//     colors:{
//       primary:'#2962FF',
//       success:'#36bea6',
//       danger:'#f62d51',
//       warning:'#ffbc34',
//       dark:'#212529'
//     }
//   }
// })

import Vue from 'vue'
import Vuesax from 'vuesax'
Vue.use(Vuesax, {
  theme:{
    colors:{
      primary:'#007bff',
      success:'#36bea6',
      danger:'#f62d51',
      warning:'#ffbc34',
      dark:'#212529'
    }
  }
})


// CONFIGS
const themeConfig = {
    theme: 'light',             // options: dark and light theme
    logotitle: "CRM",
    sidebarCollapsed: false,    // options: true (mini-sidebar), false(default)
    topbarColor: "#007bff",     // options: anycolor you can use
    themeColor:"#007bff"        // options: anycolor you can use
    // topbarColor: "#2962ff",     // options: anycolor you can use
    // themeColor:"#2962ff"        // options: anycolor you can use
}

export default themeConfig
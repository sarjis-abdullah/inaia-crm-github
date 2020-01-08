import Vue from 'vue'
import Vuebar from 'vuebar'

Vue.use(Vuebar)
// Theme Configurations
import 'prismjs'
import 'prismjs/themes/prism.css'
import VsPrism from '@/components/prism/VsPrism.vue';
Vue.component(VsPrism.name, VsPrism);
import VsSidebarGroup from '@/components/vs-sidebar-group/Sidebar-Group.vue';
Vue.component(VsSidebarGroup.name, VsSidebarGroup);
// Vue Router
// import router from './router'

// const GlobalComponents = {
//     install(Vue) {
//     //    Vue.component('appCard', AppCard);
//     //    Vue.component('sectionTooltip', SectionTooltip);
//     //    Vue.component('statsCard', StatsCard);
//     //    Vue.component('statsCardV2', StatsCardV2);
//     //    Vue.component('deleteConfirmationDialog', DeleteConfirmationDialog);
//     //    Vue.component('vuePerfectScrollbar', VuePerfectScrollbar);
//     //    Vue.component('appSectionLoader', AppSectionLoader);
//     //    Vue.component('pageTitleBar', PageTitleBar);
//     //    Vue.component('rotateSquare2', RotateSquare2);
//     //    Vue.component('VueElementLoading', VueElementLoading)
//     }
//  }
 
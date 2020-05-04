<template>
  <div class="wrapper">
    <notifications></notifications>
    <side-bar>
      <template slot-scope="props" slot="links">

        <sidebar-item
          :link="{
            name: 'Dashboard',
            path: '/dashboard',
            icon: 'fas fa-chart-pie text-primary',
          }"
        >
        </sidebar-item>

        <sidebar-item
                :link="{
            name: 'Customers',
            icon: 'fas fa-user-friends text-primary',
            path: '/contacts'
          }"
        >
        </sidebar-item>

        <sidebar-item
                :link="{
            name: 'Leads',
            icon: 'fas fa-user-tag text-muted',
            path: '/leads'
          }"
        >
        </sidebar-item>

        <sidebar-item
                :link="{
            name: 'Sales Partners',
            icon: 'fas fa-user-tie text-muted',
            path: '/sales-partners'
          }"
        >
        </sidebar-item>

        <sidebar-item
                :link="{
            name: 'Support',
            icon: 'fas fa-comment-alt text-muted',
            path: '/support'
          }"
        >
        </sidebar-item>

        <sidebar-item
                :link="{
            name: 'Tasks',
            icon: 'fas fa-tasks text-muted',
            path: '/tasks'
          }"
        >
        </sidebar-item>

        <sidebar-item
                :link="{
            name: 'Calendar',
            icon: 'fas fa-calendar-alt text-muted',
            path: '/calendar'
          }"
        >
        </sidebar-item>

        <sidebar-item
                :link="{
            name: 'Reports',
            icon: 'fas fa-chart-line text-muted',
            path: '/reports'
          }"
        >
        </sidebar-item>

      </template>

      <template slot="links-after">
        <hr class="my-3">
        <h6 class="navbar-heading p-0 text-muted">Links</h6>

        <ul class="navbar-nav mb-md-3">
          <li class="nav-item">
            <a href="#" class="nav-link" rel="noopener">
              <i class="fas fa-external-link-square-alt"></i>
              <span class="nav-link-text">Gold Dinar</span>
            </a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link" rel="noopener">
              <i class="fas fa-external-link-square-alt"></i>
              <span class="nav-link-text">Admin Panel</span>
            </a>
          </li>
        </ul>
      </template>

    </side-bar>
    <div class="main-content">
      <dashboard-navbar :type="$route.name === 'alternative' ? 'light': 'default'"></dashboard-navbar>

      <div @click="$sidebar.displaySidebar(false)">
        <nuxt></nuxt>
      </div>
      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>
<script>
  /* eslint-disable no-new */
  import PerfectScrollbar from 'perfect-scrollbar';
  import 'perfect-scrollbar/css/perfect-scrollbar.css';

  function hasElement(className) {
    return document.getElementsByClassName(className).length > 0;
  }

  function initScrollbar(className) {
    if (hasElement(className)) {
      new PerfectScrollbar(`.${className}`);
    } else {
      // try to init it later in case this component is loaded async
      setTimeout(() => {
        initScrollbar(className);
      }, 100);
    }
  }

  import DashboardNavbar from '~/components/layouts/argon/DashboardNavbar.vue';
  import ContentFooter from '~/components/layouts/argon/ContentFooter.vue';
  import DashboardContent from '~/components/layouts/argon/Content.vue';

  export default {
    components: {
      DashboardNavbar,
      ContentFooter,
      DashboardContent
    },
    middleware: ['auth'],
    methods: {
      initScrollbar() {
        let isWindows = navigator.platform.startsWith('Win');
        if (isWindows) {
          initScrollbar('scrollbar-inner');
        }
      }
    },
    mounted() {
      this.initScrollbar()
    }
  };
</script>
<style lang="scss">
</style>

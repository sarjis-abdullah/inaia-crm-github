<template>
  <div class="wrapper">
    <notifications></notifications>
<!--
    <side-bar :title="'CRM'">
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
            path: '/customers'
          }"
        >
        </sidebar-item>

        <sidebar-item
                :link="{
            name: 'Leads',
            icon: 'fas fa-user-tag text-primary',
            path: '/leads'
          }"
        >
        </sidebar-item>

        <sidebar-item
                :link="{
            name: 'Sales Partners',
            icon: 'fas fa-user-tie text-primary',
            path: '/sales-partners'
          }"
        >
        </sidebar-item>

        <sidebar-item
                :link="{
            name: 'News Feeds',
            icon: 'fas fa-user-tie text-primary',
            path: '/news-feeds'
          }"
        >
        </sidebar-item>

        <sidebar-item
                :link="{
            name: 'Support (coming soon)',
            icon: 'fas fa-comment-alt text-muted',
            path: '/support'
          }"
        >
        </sidebar-item>

        <sidebar-item
                :link="{
            name: 'Tasks (coming soon)',
            icon: 'fas fa-tasks text-muted',
            path: '/tasks'
          }"
        >
        </sidebar-item>

        <sidebar-item
                :link="{
            name: 'Calendar (coming soon)',
            icon: 'fas fa-calendar-alt text-muted',
            path: '/calendar'
          }"
        >
        </sidebar-item>

        <sidebar-item
                :link="{
            name: 'Reports (coming soon)',
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
          <li v-if="accountingAccess" class="nav-item">
            <a :href="accounting" class="nav-link" rel="noopener">
              <i class="fas fa-external-link-square-alt"></i>
              <span class="nav-link-text">Accounting</span>
            </a>
          </li>
          <li v-if="goldAdminAccess" class="nav-item">
            <a :href="goldAdmin" class="nav-link" rel="noopener">
              <i class="fas fa-external-link-square-alt"></i>
              <span class="nav-link-text">Gold Dinar</span>
            </a>
          </li>
          <li v-if="adminAccess" class="nav-item">
            <a :href="admin" class="nav-link" rel="noopener">
              <i class="fas fa-external-link-square-alt"></i>
              <span class="nav-link-text">Admin Panel</span>
            </a>
          </li>
        </ul>
      </template>

    </side-bar>
 -->

    <side-bar :title="''">
      <template slot-scope="props" slot="links">

        <sidebar-item
          :link="{
            name: 'Dashboard',
            path: '/dashboard',
            icon: 'lnir lnir-pie-chart text-primary',
          }"
        />

        <sidebar-item
          v-if="accountingAccess"
          :link="{
            name: 'CRM',
            icon: 'lnir lnir-users text-primary',
            collapsed: true
          }"
        >
          <sidebar-item :link="{ name: $t('customers'), path: '/customers' }"/>
          <sidebar-item :link="{ name: $t('support_ticket'), path: '/support-tickets' }"/>
        </sidebar-item>

        <sidebar-item
          v-if="accountingAccess"
          :link="{
            name: 'PPS',
            icon: 'lnir lnir-credit-cards text-primary',
            collapsed: true
          }"
        >
          <sidebar-item :link="{ name: 'Master', path: '/banking-master' }"/>
          <sidebar-item :link="{ name: 'Accounts', path: '/banking-accounts' }"/>
        </sidebar-item>

        <sidebar-item
          v-if="accountingAccess"
          :link="{
            name: 'Assets',
            icon: 'lnir lnir-gold-bar text-primary',
            collapsed: true
          }"
        >
          <sidebar-item :link="{ name: $t('depots'), path: '/depots' }"/>
          <sidebar-item :link="{ name: $t('orders'), path: '/orders' }"/>
          <sidebar-item :link="{ name: $t('batch_processing'), path: '/orders/batch-processing' }"/>
          <sidebar-item :link="{ name: $t('stocks'), path: '/stocks' }"/>
        </sidebar-item>

        <sidebar-item
          v-if="accountingAccess"
          :link="{
            name: 'Accounting',
            icon: 'lnir lnir-calculator text-primary',
            collapsed: true
          }"
        >
        <sidebar-item :link="{ name: $t('inaia_banking_account'), path: '/accounting/inaia-account' }"/>
          <sidebar-item :link="{ name: 'Claims', path: '/accounting/claims' }"/>
        </sidebar-item>
        <sidebar-item
          v-if="hasSalesCommissionAccess"
          :link="{
            name: $t('sales_commission'),
            icon: 'lnir lnir-calculator text-primary',
            path:'/sales-commission'
          }"
        >
        </sidebar-item>

        <sidebar-item
          :link="{
            name: 'Marketing',
            icon: 'lnir lnir-bullhorn text-primary',
            collapsed: true
          }"
        >
          <sidebar-item :link="{ name: 'Newsfeed', path: '/news-feeds' }"/>
        </sidebar-item>

        <sidebar-item
          v-if="adminAccess"
          :link="{
            name: 'Admin',
            icon: 'lnir lnir-cog text-primary',
            collapsed: true
          }"
        >
          <sidebar-item :link="{ name: 'Users', path: '/users' }"/>
          <sidebar-item :link="{ name: 'Roles', path: '/roles' }"/>
          <!--
          <sidebar-item :link="{ name: 'Permissions', icon: 'ni ni-circle-08 text-primary', path: '/permissions' }"/>
          -->

          <!--
          <sidebar-item :link="{ name: 'Products', icon: 'ni ni-ungroup text-orange', collapsed: true }">
            <sidebar-item :link="{ name: 'Prodcuts', path: '/products' }"/>
            <sidebar-item :link="{ name: 'Product Classes', path: '/product-classes' }"/>
            <sidebar-item :link="{ name: 'Product Specs', path: '/product-specs' }"/>
          </sidebar-item>
          -->
        </sidebar-item>

        <!--
        <sidebar-item
                :link="{
            name: 'Support (coming soon)',
            icon: 'fas fa-comment-alt text-muted',
            path: '/support'
          }"
        >
        </sidebar-item>

        <sidebar-item
                :link="{
            name: 'Tasks (coming soon)',
            icon: 'fas fa-tasks text-muted',
            path: '/tasks'
          }"
        >
        </sidebar-item>

        <sidebar-item
                :link="{
            name: 'Calendar (coming soon)',
            icon: 'fas fa-calendar-alt text-muted',
            path: '/calendar'
          }"
        >
        </sidebar-item>

        <sidebar-item
                :link="{
            name: 'Reports (coming soon)',
            icon: 'fas fa-chart-line text-muted',
            path: '/reports'
          }"
        >
        </sidebar-item>
        -->



      </template>


      <!--
      <hr class="my-3">
      <template slot="links-after">
        <h6 class="navbar-heading p-0 text-muted">Links</h6>

        <ul class="navbar-nav mb-md-3">
          <li v-if="accountingAccess" class="nav-item">
            <a href="" class="nav-link" rel="noopener">
              <i class="fas fa-external-link-square-alt"></i>
              <span class="nav-link-text">Link</span>
            </a>
          </li>
        </ul>
      </template>
      -->

    </side-bar>


    <div class="main-content">
      <dashboard-navbar :type="$route.name === 'alternative' ? 'light': 'default'"></dashboard-navbar>

      <div @click="$sidebar.displaySidebar(false)">
        <nuxt></nuxt>
      </div>

      <!-- <content-footer v-if="!$route.meta.hideFooter"></content-footer> -->
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
  import { hasMaxAccess, getAppsAccess,isSalesAdvisor } from '~/helpers/auth';
  import { mapGetters } from "vuex"

  export default {
    components: {
      DashboardNavbar,
      ContentFooter,
      DashboardContent
    },
    middleware: ['auth'],
    computed: {
      ...mapGetters({
        token: "auth/auth",
        user: "auth/user"
      }),
      apps() {
        return this.user && getAppsAccess(this.user.account)
      },
      hasMaxAccess() {
        return this.user && hasMaxAccess(this.user.account)
      },
      accounting() {
        return process.env.entryPoints.accounting + '?token=' + this.token
      },
      accountingAccess() {
        return this.hasMaxAccess || (this.apps && this.apps.accounting_access)
      },
      goldAdmin() {
        return process.env.entryPoints.golddinar + '?token=' + this.token
      },
      goldAdminAccess() {
        return this.hasMaxAccess || (this.apps && this.apps.goldadmin_access)
      },
      admin() {
        return process.env.entryPoints.admin + '?token=' + this.token
      },
      adminAccess() {
        return this.hasMaxAccess || (this.apps && this.apps.adminpanel_access)
      },
      hasSalesCommissionAccess(){
        return this.user && (hasMaxAccess(this.user.account) || isSalesAdvisor(this.user.account));
      }
    },
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

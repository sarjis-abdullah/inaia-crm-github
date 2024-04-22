<template>
  <base-nav
    container-classes="container-fluid"
    class="navbar-top border-bottom navbar-expand"
    :class="navVarBackground"
  >

    <!-- Search form -->
    <!--
    <form class="navbar-search form-inline mr-sm-3"
          :class="{'navbar-search-light': type === 'default', 'navbar-search-dark': type === 'light'}"
          id="navbar-search-main">
      <div class="form-group mb-0">
        <div class="input-group input-group-alternative input-group-merge">
          <div class="input-group-prepend">
            <span class="input-group-text"><i class="fas fa-search"></i></span>
          </div>
          <input class="form-control" placeholder="Search" type="text">
        </div>
      </div>
      <button type="button" class="close" data-action="search-close" data-target="#navbar-search-main"
              aria-label="Close">
        <span aria-hidden="true">×</span>
      </button>
    </form>
    -->


    <!-- Navbar links -->
    <ul class="navbar-nav align-items-center ml-md-auto">
      <li class="nav-item d-xl-none">
        <!-- Sidenav toggler -->
        <div class="pr-3 sidenav-toggler"
             :class="{active: $sidebar.showSidebar, 'sidenav-toggler-dark': type === 'default', 'sidenav-toggler-light': type === 'light'}"
             @click="toggleSidebar">
          <div class="sidenav-toggler-inner">
            <i class="sidenav-toggler-line"></i>
            <i class="sidenav-toggler-line"></i>
            <i class="sidenav-toggler-line"></i>
          </div>
        </div>
      </li>

      <!--
      <li class="nav-item d-sm-none">
        <a class="nav-link" href="#" data-action="search-show" data-target="#navbar-search-main">
          <i class="ni ni-zoom-split-in"></i>
        </a>
      </li>
      -->


      <!--
      <base-dropdown menu-classes="dropdown-menu-lg dropdown-menu-dark bg-default dropdown-menu-right"
                     class="nav-item"
                     tag="li"
                     title-tag="a"
                     title-classes="nav-link"
                     icon="ni ni-ungroup"
                     :hasToggle="false">
        <template>
          <div class="row shortcuts px-4">
            <a v-if="accountingAccess" :href="accounting" class="col-4 shortcut-item">
              <span class="shortcut-media avatar rounded-circle">
                <i class="fas fa-calculator"></i>
              </span>
              <small>Accounting</small>
            </a>
            <a href="#!" class="col-4 shortcut-item" @click.prevent.stop="">
              <span class="shortcut-media avatar rounded-circle">
                <i class="fas fa-users"></i>
              </span>
              <small>CRM</small>
            </a>
            <a v-if="goldAdminAccess" :href="goldAdmin" class="col-4 shortcut-item">
              <span class="shortcut-media avatar rounded-circle bg-gradient-info">
                <i class="fas fa-coins"></i>
              </span>
              <small>Gold Dinar</small>
            </a>
            <a v-if="adminAccess" :href="admin" class="col-4 shortcut-item">
              <span class="shortcut-media avatar rounded-circle bg-gradient-info">
                <i class="fas fa-cog"></i>
              </span>
              <small>Admin Panel</small>
            </a>
          </div>
        </template>
      </base-dropdown>
      -->

    </ul>


    <ul class="navbar-nav align-items-center ml-auto ml-md-0">
      <base-dropdown menu-on-right
                     class="nav-item"
                     tag="li"
                     title-tag="a"
                     title-classes="nav-link pr-0">
        <a href="#" class="nav-link pr-0" @click.prevent slot="title-container">
          <div class="media align-items-center">
                  <span class="">
                    <img alt="Im" class="avatar avatar-sm rounded-circle" :src="avatar">
                  </span>
            <div class="media-body ml-2 d-none d-lg-block">
              <span class="mb-0 text-sm  font-weight-bold">{{ userName }}</span>
            </div>
          </div>
        </a>

        <template>

          <!--
          <div class="dropdown-header noti-title">
            <h6 class="text-overflow m-0">Welcome!</h6>
          </div>
          -->
          <a href="#!" class="dropdown-item" @click.prevent="editProfile">
            <i class="ni ni-single-02"></i>
            <span>{{ $t('my_profile') }}</span>
          </a>
          <!--
          <a href="#!" class="dropdown-item">
            <i class="ni ni-settings-gear-65"></i>
            <span>Settings</span>
          </a>
          <a href="#!" class="dropdown-item">
            <i class="ni ni-calendar-grid-58"></i>
            <span>Activity</span>
          </a>
          <a href="#!" class="dropdown-item">
            <i class="ni ni-support-16"></i>
            <span>Support</span>
          </a>
          -->
          <div class="dropdown-divider"></div>
          <a href="#!" class="dropdown-item" @click.prevent="logout">
            <i class="ni ni-user-run"></i>
            <span>Logout</span>
          </a>

        </template>
      </base-dropdown>
    </ul>
  </base-nav>
</template>
<script>
  import { CollapseTransition } from 'vue2-transitions';
  import BaseNav from '@/components/argon-core/Navbar/BaseNav.vue';
  import Modal from '@/components/argon-core/Modal.vue';
  import { hasMaxAccess, getAppsAccess } from '~/helpers/auth';
  import { mapGetters } from "vuex"
  import appNames from '../../../appNames';
  export default {
    components: {
      CollapseTransition,
      BaseNav,
      Modal
    },
    props: {
      type: {
        type: String,
        default: 'default', // default|light
        description: 'Look of the dashboard navbar. Default (Green) or light (gray)'
      }
    },
    computed: {
      ...mapGetters({
        loggedin: "auth/user",
        token: "auth/auth",
      }),
      apps() {
        return this.loggedin && getAppsAccess(this.loggedin.account)
      },
      hasMaxAccess() {
        return this.loggedin && hasMaxAccess(this.loggedin.account)
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
      routeName() {
        const { name } = this.$route;
        return this.capitalizeFirstLetter(name);
      },
      avatar() {
        if (this.loggedin) {
          if (!this.loggedin.avatar && this.loggedin.person_data) {
            let gender = this.loggedin?.person_data?.gender?.toLowerCase() ?? null;
            if (gender == 'female' || gender == 'f') {
              return '/img/theme/avatar_f.png'
            }
          } else if (this.loggedin.avatar) {
            // return process.env.s3BucketUri + this.loggedin.avatar
            return this.loggedin.avatar
          }
        }
        return '/img/theme/avatar_m.png'
      },
      userName() {
        if (this.loggedin) {
          let name = this.loggedin.name;
        //   if (this.loggedin.person_data && this.loggedin.person_data.middlename) {
        //     name += ' ' + this.loggedin.person_data.middlename
        //   }
          if (this.loggedin.person_data && this.loggedin.person_data.surname) {
            name += ' ' + this.loggedin.person_data.surname
          }
          return name;
        }
        return '';
      },
      navVarBackground(){
        let app = process.env.CURRENT_APP;
        if(app == appNames.getGreenGold)
          return 'bg-gradient-default navbar-dark';
        else
        return 'bg-gradient-info navbar-dark';
      }
    },
    data() {
      return {
        activeNotifications: false,
        showMenu: false,
        searchModalVisible: false,
        searchQuery: ''
      };
    },
    methods: {
      getChannelInfo(channels, type) {
        let channel = channels && channels.length && channels.find( c => c.type.value == type )
        if (channel) {
          return channel.value
        }
        return null
      },
      editProfile() {
        // window.location.href    = process.env.universalLogin+'/profile'
        this.$router.push('/profile')
      },
      logout() {
        // this.$store.dispatch('auth/logout')
        this.$router.push('/logout')
      },
      capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      },
      toggleNotificationDropDown() {
        this.activeNotifications = !this.activeNotifications;
      },
      closeDropDown() {
        this.activeNotifications = false;
      },
      toggleSidebar() {
        this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
      },
      hideSidebar() {
        this.$sidebar.displaySidebar(false);
      }
    }
  };
</script>

<template>
  <div :class="layoutClass" class="auth-layout">
    <notifications></notifications>
    <base-nav
      v-model="showMenu"
      type="light"
      :transparent="true"
      menu-classes="justify-content-end"
      class="navbar-horizontal navbar-main"
      expand="lg"
    >
      <div slot="brand" class="navbar-wrapper">
        <nuxt-link class="navbar-brand" to="/">
          <img :src="contrastlogoPath" alt="INAIA">
        </nuxt-link>
      </div>

     <template>
       <div class="navbar-collapse-header">
         <div class="row">
           <div class="col-6 collapse-brand">
             <nuxt-link to="/">
               <img :src="logoPath" alt="INAIA">
             </nuxt-link>
           </div>
           <div class="col-6 collapse-close">
             <button type="button" class="navbar-toggler" @click="showMenu = false">
               <span></span>
               <span></span>
             </button>
           </div>
         </div>
       </div>
     </template>
    </base-nav>

    <div class="main-content">
      <nuxt></nuxt>
    </div>

    <footer class="pb-5" id="footer-main">
      <div class="container">
        <div class="row align-items-center justify-content-xl-between">
          <div class="col-xl-6">
            <div class="copyright text-center text-lg-left text-muted">
              © {{year}} {{ $t('companyName') }}
            </div>
          </div>
          <div class="col-xl-6">
            <ul class="nav nav-footer justify-content-center justify-content-lg-end">
              <li class="nav-item">
                <a href="" class="nav-link" target="_blank" rel="noopener">{{ $t('privacy_policy') }}</a>
              </li>
              <li class="nav-item">
                <a href="" class="nav-link" target="_blank" rel="noopener">{{ $t('imprint') }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
<script>
  import BaseNav  from '~/components/argon-core/Navbar/BaseNav.vue';
  import appNames from '../appNames'
  export default {
    components: {
      BaseNav,
    },
    props: {
      backgroundColor: {
        type: String,
        default: 'black'
      }
    },
    data() {
      return {
        showMenu: false,
        menuTransitionDuration: 250,
        year: new Date().getFullYear(),
        pageClass: 'login-page',
      };
    },
    computed: {
      title() {
        return `${this.$route.name} Page`;
      },
      layoutClass() {
        let exceptions = ['profile', 'profile-edit', 'profile-reset-password']
        // let exceptions = ['index', 'home']
        if (!exceptions.includes(this.$route.name)) {
          return 'bg-default'
        } else {
          return 'bg-secondary'
        }
      },
      contrastlogoPath(){
        let app = process.env.CURRENT_APP;
        if(app == appNames.getGreenGold)
          return '/ggg-logo_contrast.png';
        else
          return "/logo_contrast.png"
      },
      logoPath(){
        let app = process.env.CURRENT_APP;
        if(app == appNames.getGreenGold)
          return '/getgreengold_logo.png';
        else
          return "/logo.png"
      }
    },
    methods: {
      closeMenu() {
        document.body.classList.remove('nav-open');
        this.showMenu = false;
      },
    },
    watch: {
      '$route.path'() {
        if (this.showMenu) {
          this.closeMenu();
        }
      }
    }
  };
</script>
<style lang="scss">
  .auth-layout {
    min-height: 100vh;
  }
</style>

<template lang="html">
   <div id="parentx">
    
    <vs-sidebar default-index="1" :parent="parent"  :hiddenBackground="doNotClose" color="primary" class="left-sidebar" spacer v-model="isSidebarActive" :click-not-close="doNotClose" :reduce="isSidebarReduced">
      
      <div class="header-sidebar text-center" slot="header">
        <vs-avatar size="70px" :src="require('@/assets/images/users/1.jpg')"/>
        <h4>{{ loggedin && loggedin.account && loggedin.account.username }}<br/>
          <small>{{ loggedin && loggedin.channels && getChannelInfo(loggedin.channels, 'email') }}</small>
        </h4>
      </div>
      
      <div v-bar class="vs-scrollable">
      <div>
      <template v-for="(sidebarLink, index) in sidebarLinks">

        <!-- Small Cap -->
        <span v-if="sidebarLink.title"  :key="index + '.' + index" class="small-cap">{{ $t(sidebarLink.i18n) || sidebarLink.title }}</span>
        <template v-else-if="!sidebarLink.title">
          <!-- Single Menu -->
          <vs-sidebar-item :key="sidebarLink.index" :icon-pack="sidebarLink.icon" :index="sidebarLink.index" v-if="!sidebarLink.child" :to="sidebarLink.url">
            <span class="hide-in-minisidebar">{{ $t(sidebarLink.i18n) || sidebarLink.name }}</span>
          </vs-sidebar-item>
          <!-- Dropdown Menu -->
          <template v-else >
            <vs-sidebar-group :title="sidebarLink.name" :key="sidebarLink.index" :icon-pack="sidebarLink.icon" :open="isSubLinkActive(sidebarLink)">
              <li v-for="(subLink) in sidebarLink.child" :key="subLink.index">
                  <vs-sidebar-item :icon-pack="subLink.icon" :to="subLink.url" :index="subLink.index">
                    <span class="hide-in-minisidebar">{{ $t(subLink.i18n) || subLink.name }}</span>
                  </vs-sidebar-item>
              </li>
          </vs-sidebar-group>
          <!-- /Dropdown Menu -->  
        </template>
        </template>
         
      </template> 
      </div>
      </div>
      
      <div class="footer-sidebar" slot="footer">
        <vs-button icon="reply" color="danger" type="flat" @click="logout"><span class="hide-in-minisidebar">log out</span></vs-button>
      </div>
      
    </vs-sidebar>

  </div>


</template>

<script>
import { mapGetters } from "vuex"

export default {
    name: "SideBar",
    props: {
        parent: {
            type: String
        },
        sidebarLinks: {
            type: Array,
            required: true
        },
        subLink: {
            type: Object
        },
        index: {
            default: null,
            type: [String, Number]
        }
    },
    data: () => ({
        doNotClose: false,
        windowWidth: window.innerWidth,
        round: true
    }),
    computed: {
        ...mapGetters({
            loggedin: "auth/user",
        }),
        //This is for mobile trigger
        isSidebarActive: {
            get() {
                return this.$store.state.vuesax.isSidebarActive;
            },
            set(val) {
                this.$store.commit("vuesax/IS_SIDEBAR_ACTIVE", val);
            }
        },
        getActive: function getActive() {
            return this.$destroy();
        },
        //This is for mini sidebar
        reduceSidebar() {
            return Boolean(this.isSidebarReduced);
        },
        isSidebarReduced: {
            get() {
                return this.$store.state.vuesax.isSidebarReduced;
            },
            set(val) {
                this.$store.commit("vuesax/TOGGLE_REDUCE_SIDEBAR", val);
            }
        },
        //This is for active group link
        isSubLinkActive() {
            return sidebarLink => {
                let open = false;
                if (sidebarLink.child) {
                    sidebarLink.child.forEach(link => {
                        if (this.$route.fullPath == link.url) {
                            open = true;
                        }
                    });
                }
            
                return open;
            };
        }
    },
    watch: {
        '$route'() {
            if(this.windowWidth < 1170 ) this.$store.commit('vuesax/IS_SIDEBAR_ACTIVE', false)
        },
    },
    methods: {
        handleWindowResize(event) {
            this.windowWidth = event.currentTarget.innerWidth
            this.setSidebarWidth()
        },
        getChannelInfo(channels, type) {
            let channel = channels && channels.length && channels.find( c => c.type.value == type )
            if (channel) {
                return channel.value
            }
            return null
        },
        setSidebarWidth() {
            if (this.windowWidth < 1170) {
                // console.error('error', this.$store)
                this.$store.commit("vuesax/IS_SIDEBAR_ACTIVE", false);
                (this.doNotClose = false),
                this.$store.dispatch("vuesax/updateSidebarWidth", "no-sidebar");
                
            } else {
                this.$store.commit("vuesax/IS_SIDEBAR_ACTIVE", true)
                this.doNotClose = true
                
                if (this.isSidebarReduced)
                    this.$store.dispatch("vuesax/updateSidebarWidth", "mini")
                else this.$store.dispatch("vuesax/updateSidebarWidth", "default")
            }
        },
        logout() {
            this.$store.dispatch('auth/logout')
        }
    },
    mounted() {
        this.$nextTick(() => {
            window.addEventListener("resize", this.handleWindowResize)
        })
        this.setSidebarWidth()
    },
    beforeDestroy() {
        this.setSidebarWidth()
        window.removeEventListener("resize", this.handleWindowResize)
    }
}
</script>
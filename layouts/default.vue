<template>
	<div class="main-wrapper" :class="[mainWrapperClass]">
		<!---Navigation-->
		<Navbar :topbarColor="topbarColor" :logo="require('@/assets/images/logo/logo-light-icon.png')" :title="logotitle" />
		<!---Sidebar-->
		<SideBar parent=".main-wrapper" :sidebarLinks="sidebarLinks"/>
		<!---Page Container-->
		<div class="main-container-fluid">
            <Breadcrumb/>	
            <transition name="router-anim" enter-active-class="fade-enter-active fade-enter" leave-active-class="fade-leave-active fade-enter">
                
                <nuxt />

            </transition>
            <!---Customizer / Settings-->
            <Customizer @updateTopbarColor="updateTopbarColor" />
		</div>	

    </div>
</template>

<script>
import Navbar from '@/layouts/full/header/Navbar.vue'
import SideBar from '@/layouts/full/sidebar/SideBar.vue'
import Customizer from '@/layouts/full/customizer/Customizer.vue'
import sidebarLinks from '@/layouts/full/sidebar/sidebarlinks.js'
import Breadcrumb from '@/layouts/full/breadcrumb/Breadcrumb.vue'
import themeConfig from '@/themeConfig.js'

export default {
    components: {
        Navbar,
        SideBar,
        Customizer,
        Breadcrumb
    },
    middleware: ['notFound', 'landingRoute'],
    data: () => ({
        topbarColor: themeConfig.topbarColor,
        logotitle: themeConfig.logotitle,
        sidebarLinks: sidebarLinks,
    }),
    computed: {
        sidebarWidth: function() {
            return this.$store.state.vuesax.sidebarWidth;
        },
        mainWrapperClass: function() {
            if(this.sidebarWidth == "default") {
                return "main-wrapper-default"
            } 
            else if(this.sidebarWidth == "mini") {return "main-wrapper-mini"}
            else if(this.sidebarWidth){ return "main-wrapper-full"}
            return "default"	
        }
    },
    watch: {
        '$store.state.vuesax.theme'(val) {
            this.toggleBodyClass(val)
        }
    },
    methods: {
        toggleBodyClass(className) {
            if (className == 'dark') {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
            }
        },
        updateTopbarColor(val) {
            this.topbarColor = val;
        }
    },
    
    mounted() {
        this.toggleBodyClass(themeConfig.theme)
    },
}
</script>

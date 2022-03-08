<template>
 <div>
    <base-header class="pb-6">
            <div class="row align-items-center py-4">
                <div class="col-lg-6 col-7">
                    <h6 class="h2 text-white d-inline-block mb-0">{{$t('depot_detail')}}</h6>
                </div>
            </div>
        </base-header>
    <div class="container-fluid mt--6" style="backgroud-color:white;">
        <page-loader :loaddingText="$t('loading_depot_details')" v-if="!loaded"/>
        <text-error :textError="$t('loading_depot_details_error')" v-if="loaded && loadedWithError"/>
        <div class="row" v-if="loaded && !loadedWithError">
            <div class="col">
                <Details :resource="depot"/>
            </div>
            <div class="col">

            </div>
        </div>
   </div>
 </div>
   
   
</template>

<script>
import { mapGetters } from "vuex"
import Details from '@/components/Depots/Details'
import PageLoader from '@/components/common/Loader/PageLoader';
import TextError from '@/components/common/Errors/TextError';
export default {
    layout: 'DashboardLayout',
    props: {
        showViewPage: {
            type: Boolean
        }
    },
    data() {
        return {
            depotId: this.$route.params.id,
            loaded:false,
            loadedWithError:false
        }
    },
    components: {
        PageLoader,
        TextError,
        Details
    },
    computed: {
       ...mapGetters('depots',{
            depot:"details"
        }),
    },
    watch: {
        depotId: {
            handler() {
                if (this.depotId) {
                    this.initDepotData()
                }
            },
            immediate: true
        },
    },
    methods: {
        initDepotData()
        {
            this.$store.dispatch('depots/details',this.depotId).then(()=>{
                this.loadedWithError=false;
            }).
            catch(err=>{
                this.loadedWithError=true;
            }).finally(()=>{
                this.loaded = true;
            });
        }
    }
}
</script>

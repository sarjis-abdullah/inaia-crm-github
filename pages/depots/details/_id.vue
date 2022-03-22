<template>
  <div>
    <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7">
          <h6 class="h2 text-white d-inline-block mb-0"  v-if="!loaded || loadedWithError">
            {{ $t("depot_detail") }}
          </h6>
          <h6 class="h2 text-white d-inline-block mb-0" v-if="loaded && !loadedWithError">
            {{ $t("depot") }} {{ depot.depot_number }}
          </h6>
        </div>
      </div>
    </base-header>
    <div class="container-fluid mt--6">
      <page-loader :loaddingText="$t('loading_depot_details')" v-if="!loaded" />
      <text-error
        :textError="$t('loading_depot_details_error')"
        v-if="loaded && loadedWithError"
      />
      <div  v-if="loaded && !loadedWithError">
      <div class="row">
        <div class="col-xl-4 col-md-6">
          <div class="card border-0">
            <div class="card-body">
              <div class="row">
                <div class="col">
                  <h5 class="card-title text-uppercase text-muted mb-0">
                    {{$t('depot_name')}}
                  </h5>
                  <span class="h2 font-weight-bold mb-0">{{
                    depot.name
                  }}</span>
                </div>
                <div class="col-auto">
                  <base-dropdown
                    title-classes="btn btn-sm btn-neutral mr-0"
                    menu-on-right
                    :has-toggle="false"
                  >
                    <template slot="title">
                      <i class="fas fa-ellipsis-h"></i>
                    </template>

                    <a class="dropdown-item" href="#">{{
                      $t("make_payment")
                    }}</a>
                    <a class="dropdown-item" href="#">{{ $t("details") }}</a>
                  </base-dropdown>
                </div>
              </div>
              <p class="mt-3 mb-0 text-sm">
                <span class="text-nowrap" v-if="client!=null"
                  >{{$t('client')}}: <a href="" @click.prevent="() => $router.push('/customers/details/'+depot.account_id)" class="">{{getCustomerName(client)}}</a></span
                >
              </p>
            </div>
          </div>
        </div>

        <div class="col-xl-4 col-md-6">
          <div class="card border-0">
            <div class="card-body">
              <div class="row">
                <div class="col">
                  <h5 class="card-title text-uppercase text-muted mb-0">
                    {{$t('total_gold_amount')}}
                  </h5>
                  <span class="h2 font-weight-bold mb-0"
                    ><i18n-n :value="depot.gold_amount/1000"></i18n-n> g</span
                  >
                </div>
                <div class="col-auto">
                  <base-dropdown
                    title-classes="btn btn-sm btn-neutral mr-0"
                    menu-on-right
                    :has-toggle="false"
                  >
                    <template slot="title">
                      <i class="fas fa-ellipsis-h"></i>
                    </template>

                    <a class="dropdown-item" href="#">{{
                      $t("make_payment")
                    }}</a>
                    <a class="dropdown-item" @click.prevent="addGoldGift">{{
                      $t("gold_gift")
                    }}</a>
                    <a class="dropdown-item" href="#">{{ $t("details") }}</a>
                  </base-dropdown>
                </div>
              </div>
              <p class="mt-3 mb-0 text-sm">
                <span class="text-nowrap">{{$t('depot_value')}}: <i18n-n :value="depot.gold_amount/1000*goldPrice"></i18n-n> €</span>
              </p>
            </div>
          </div>
        </div>

        <div class="col-xl-4 col-md-6">
          <div v-if="depot.is_savings_plan" class="card border-0">
            <div class="card-body">
              <div class="row">
                <div class="col">
                  <h5 class="card-title text-uppercase text-muted mb-0">
                    <font-awesome-icon
                      icon="fa fa-clock-rotate-left"
                      class="mr-1"
                    />{{$t('saving_plan')}}<span class="badge badge-success ml-2"
                      ><font-awesome-icon icon="fa fa-play" class="mr-1" />{{
                        $t(
                          depot.status
                            ? depot.status.name_translation_key
                            : depot.depot_status_id
                        )
                      }}</span
                    >
                  </h5>
                  <span class="h2 font-weight-bold mb-0"
                    >{{ $n(depot.interval_amount/100) }} €</span
                  >
                  <span class="text-muted"> / {{$t('monthly')}}</span>
                </div>
                <div class="col-auto">
                  <base-dropdown
                    title-classes="btn btn-sm btn-neutral mr-0"
                    menu-on-right
                    :has-toggle="false"
                  >
                    <template slot="title">
                      <i class="fas fa-ellipsis-h"></i>
                    </template>

                    <a class="dropdown-item" href="#">{{ $t("pause") }}</a>
                    <a class="dropdown-item" href="#">{{
                      $t("cancel_contract")
                    }}</a>
                  </base-dropdown>
                </div>
              </div>
              <p class="mt-3 mb-0 text-sm">
                <span class="text-nowrap"
                  >{{$t('running_time')}}: {{ $d(new Date(depot.interval_startdate),'short') }} -
                  {{ $d(new Date(depot.interval_enddate),'short') }}</span
                >
              </p>
            </div>
          </div>

          <div v-else class="card border-0">
            <div class="card-body">
              <div class="row">
                <div class="col">
                  <h5 class="card-title text-uppercase text-muted mb-0">
                    <font-awesome-icon
                      icon="fa fa-clock-rotate-left"
                      class="mr-1"
                    />{{$t('saving_plan')}}
                  </h5>
                  <span class="h2 font-weight-bold mb-0"
                    >{{$t('no_saving_plan')}}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <order-list :isDepotSet="true" :depotSetId="depot.id"/>
      <GoldGift :showModal="showGoldGift" @onClose="onGoldGiftClose" :depot="depot"/>>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import PageLoader from '@/components/common/Loader/PageLoader';
import TextError from '@/components/common/Errors/TextError';
import OrderList from '@/components/Orders/List'
import GoldGift from "../../../components/Depots/GoldGift";
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
            loadedWithError:false,
            client:null,
            showGoldGift:false,
        }
    },
    components: {
        PageLoader,
        TextError,
        OrderList,
        GoldGift
    },
    computed: {
       ...mapGetters('depots',{
            depot:"details",
            goldPrice:"getGoldPrice"
        }),
    },
     mounted () {
        if(this.goldPrice==0)
        {
            this.$store.dispatch('depots/getCurrentGoldPrice').then(res=>{
                this.goldPrice = res;
            })
        }

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
        getCustomerName(client) {
          if (client.person_data) return client.name + ' '+client.person_data.surname;
          else if (client.name) return client.name;
          else return false;
        },
        initDepotData()
        {
            this.$store.dispatch('depots/details',this.depotId).then(()=>{
                this.loadedWithError=false;
                this.$store.dispatch('clients/clientDetailsData',this.depot.account_id).then(res=>{
                      this.client = res.data.data.customer;
                  })
            }).
            catch(err=>{
                this.loadedWithError=true;
            }).finally(()=>{
                this.loaded = true;
            });
        },
        addGoldGift(){
          this.showGoldGift = true;
        },
        onGoldGiftClose(){
          this.showGoldGift =  false;
        }
    }

}
</script>

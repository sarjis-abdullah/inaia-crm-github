<template>
  <div>
    <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7">
          <h6 class="h2 text-white d-inline-block mb-0">
            {{ $t("depot_detail") }}
          </h6>
          <h6 class="h2 text-white d-inline-block mb-0">
            {{ $t("depot") }} {{ resource.depot_number }}
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
      <div class="row">
        <div class="col-xl-4 col-md-6">
          <div class="card border-0">
            <div class="card-body">
              <div class="row">
                <div class="col">
                  <h5 class="card-title text-uppercase text-muted mb-0">
                    Depot Name
                  </h5>
                  <span class="h2 font-weight-bold mb-0">{{
                    resource.name
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
                <span class="text-nowrap"
                  >Kunde: <a href="" class="">Yunus Morkramer</a></span
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
                    Goldbestand
                  </h5>
                  <span class="h2 font-weight-bold mb-0"
                    >{{ resource.gold_amount }} g</span
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
                    <a class="dropdown-item" href="#">{{ $t("details") }}</a>
                  </base-dropdown>
                </div>
              </div>
              <p class="mt-3 mb-0 text-sm">
                <span class="text-nowrap">Depotwert: 151.897,33 €</span>
              </p>
            </div>
          </div>
        </div>

        <div class="col-xl-4 col-md-6">
          <div v-if="resource.is_savings_plan" class="card border-0">
            <div class="card-body">
              <div class="row">
                <div class="col">
                  <h5 class="card-title text-uppercase text-muted mb-0">
                    <font-awesome-icon
                      icon="fa fa-clock-rotate-left"
                      class="mr-1"
                    />Sparplan<span class="badge badge-success ml-2"
                      ><font-awesome-icon icon="fa fa-play" class="mr-1" />{{
                        $t(
                          resource.status
                            ? resource.status.name_translation_key
                            : resource.depot_status_id
                        )
                      }}</span
                    >
                  </h5>
                  <span class="h2 font-weight-bold mb-0"
                    >{{ resource.interval_amount }} €</span
                  >
                  <span class="text-muted"> / monatlich</span>
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
                  >Laufzeit: {{ resource.interval_start_date }} -
                  {{ resource.interval_end_date }}</span
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
                    />Sparplan
                  </h5>
                  <span class="h2 font-weight-bold mb-0"
                    >Nicht eingerichtet</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div></div>

      <order-list />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import Details from '@/components/Depots/Details'
import PageLoader from '@/components/common/Loader/PageLoader';
import TextError from '@/components/common/Errors/TextError';
import OrderList from '@/components/Orders/List'
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
        Details,
        OrderList
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

<template>
  <div>
    <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7">
          <h6 class="h2 text-white d-inline-block mb-0" v-if="loaded && !loadedWithError">
            {{ $t("depot_number") }} {{ depot.depot_number }}
          </h6>
        </div>
      </div>
    </base-header>
    <div class="container-fluid mt--6">
      <page-loader :loaddingText="$t('loading_depot_details')" v-if="!loaded"></page-loader>
      <text-error
        :textError="$t('loading_depot_details_error')"
        v-if="loaded && loadedWithError"
      />
      <div v-if="loaded && !loadedWithError">
        <div class="row">
          <div class="col-xl-4 col-md-6">
            <div class="card border-0">
              <div class="card-body">
                <div class="row">
                  <div class="col">
                    <div class="media align-items-center">
                      <img :src="depot.avatar" alt="" class="avatar avatar-lg bg-white shadow rounded-circle mr-3" />
                      <div class="media-body">
                        <h5 class="card-title text-uppercase text-muted mb-0">{{$t('depot_name')}}</h5>
                        <span class="h2 font-weight-bold mb-0">{{depot.name }} </span>
                      </div>
                    </div>
                  </div>
                  <div class="col-auto">
                                        <base-dropdown
                      title-classes="btn btn-sm btn-link mr-0"
                      menu-on-right
                      :has-toggle="false"
                      v-if="hadDepotEditAccess"
                    >
                      <template slot="title">
                        <i class="fas fa-ellipsis-v"></i>
                      </template>
                      <a class="dropdown-item" v-if="depot.status.name_translation_key=='depot_status_blocked'"  @click.prevent="confirmResume()">{{ $t("activate_depot") }}</a>
                      <a class="dropdown-item" v-else @click.prevent="showBlockConfirm=true">{{ $t("block_depot") }}</a>
                      <a class="dropdown-item" @click.prevent="showDeposit">{{$t("add_deposit")}}</a>
                      <a class="dropdown-item" @click.prevent="openDepotHistory">{{$t("depot_history")}}</a>
                      <a class="dropdown-item" @click.prevent="editSalesAdvisor">{{ $t("edit_salesadvisor") }}</a>
                      <a class="dropdown-item" @click.prevent="openComment"><i class="fa fa-comment"></i>{{$t("depot_comment")}}</a>
                      
                    </base-dropdown>
                  </div>
                </div>
                <p class="mt-3 mb-0 text-sm" v-if="client!=null">
                  <UserInfo :customerId="client.contact_id"></UserInfo>
                </p>
                <div class="mt-3 mb-0 text-sm d-flex gap-3 align-items-center" >
                  <span>
                    {{ $t('target') }} : {{ depot && depot.target_type ? depot.target_type.title : $t('unassigned')  }}
                  </span>
                  <span class="ml-1 cursor-pointer" @click.prevent="changeTargetType">
                  <PencilOutlineIcon/>
                  </span>
                </div>
                <p class="mb-0 text-sm" v-if="paymentMethod">
                  {{ $t('payment_method') }} : {{ paymentMethod ? $t(paymentMethod) : $t('unassigned')  }}
                </p>
                <p class="mb-0 text-sm" v-if="paymentAccount">
                  {{ $t('account') }} : {{ paymentAccountDetails  }}
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
                      ><i18n-n :value="depot.gram_amount/1000"></i18n-n> g</span
                    >
                  </div>
                  <div class="col-auto">
                    <base-dropdown
                      title-classes="btn btn-sm btn-link mr-0"
                      menu-on-right
                      :has-toggle="false"
                      v-if="hadDepotEditAccess"
                    >
                      <template slot="title">
                        <i class="fas fa-ellipsis-v"></i>
                      </template>

                      <a class="dropdown-item" @click.prevent="addGoldGift"><i class="fa fa-gift"></i>{{$t("gold_gift")}}</a>
                    </base-dropdown>
                  </div>
                </div>
                <div class="mt-3 mb-0 text-sm">
                  <div class="text-nowrap">{{$t('depot_type')}}: {{$t(depot.depot_type.name_translation_key)}}</div>
                  <div class="text-nowrap">{{$t('depot_value')}}: <i18n-n :value="calculateDepotValue()"></i18n-n> €</div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-xl-4 col-md-6">
            <div v-if="depot.is_savings_plan" class="card border-0">
              <div class="card-body">
                <div class="row">
                  <div class="col">
                    <h5 class="card-title text-uppercase text-muted mb-0 mr-2">
                      <font-awesome-icon
                        icon="fa fa-clock-rotate-left"
                        class="mr-1"
                      />{{$t('saving_plan')}}<Status class="ml-2" :row="depot"/>

                    </h5>

                    <div>
                      <span class="h2 font-weight-bold mb-0">{{ $n(depot.interval_amount / 100) }} €</span>
                      <span class="text-muted text-sm"> / {{$t('monthly')}}</span>
                    </div>
                  </div>
                  <div class="col-auto">
                    <base-dropdown
                      title-classes="btn btn-sm btn-link mr-0"
                      menu-on-right
                      :has-toggle="false"
                    >
                      <template slot="title">
                        <i class="fas fa-ellipsis-v"></i>
                      </template>
                      <a class="dropdown-item" @click.prevent="showEditSavingPlan()" v-if="hadDepotEditAccess"
                      >{{ $t("edit_saving_plan") }}</a>
                      <a class="dropdown-item" @click.prevent="showDepotStatusHistory=true">{{ $t("status_history") }}</a>
                      <a class="dropdown-item" @click.prevent="showAgioTransaction=true" >{{ $t("agio_history") }}</a>
                      <div class="dropdown-divider"></div>

                      <a class="dropdown-item" @click.prevent="confirmPause()"
                        v-if="depot.status.name_translation_key=='depot_status_active' && hadSavingPlanStatusEditAccess"
                      ><i class="fa fa-pause-circle"></i>{{ $t("pause_savings_plan") }}</a>
                      <a class="dropdown-item" @click.prevent="confirmWithdraw()"
                        v-if="depot.status.name_translation_key=='depot_status_active' && hadSavingPlanStatusEditAccess"
                      ><i class="fa fa-times"></i>{{ $t("withdraw_contract") }}</a>
                      <a class="dropdown-item" @click.prevent="confirmComplete()"
                        v-if="depot.status.name_translation_key=='depot_status_active' && hadSavingPlanStatusEditAccess"
                      ><i class="fa fa-close"></i>{{ $t("complete_contract") }}</a>
                      <a class="dropdown-item" @click.prevent="confirmResume()"
                        v-if="(depot.status.name_translation_key=='depot_status_paused' || depot.status.name_translation_key=='depot_status_canceled')  && hadSavingPlanStatusEditAccess"
                      ><i class="fa fa-play-circle"></i>{{ $t("resume_savings_plan") }}</a>
                      <a class="dropdown-item" @click.prevent="confirmContractConfirm" v-if="depot.status.name_translation_key=='depot_status_applied_for_savings_plan'  && hadSavingPlanStatusEditAccess">
                        <i class="fa fa-check"></i>{{$t("confirm_contract") }}</a>
                      <a class="dropdown-item" @click.prevent="confirmCancel" v-if="depot.status.name_translation_key!='depot_status_canceled'  && hadSavingPlanStatusEditAccess">
                        <i class="fa fa-times"></i>{{$t("cancel_contract") }}</a>
                        <a class="dropdown-item" @click.prevent="confirmResume()"
                        v-if="(depot.status.name_translation_key=='depot_status_completed' || depot.status.name_translation_key=='depot_status_withdrawn')  && hadSavingPlanStatusEditAccess"
                      ><i class="fa fa-play-circle"></i>{{ $t("activate_contract") }}</a>
                    </base-dropdown>
                  </div>
                </div>
                <div class="mt-3 mb-0 text-sm">
                  <div>{{$t('running_time')}}: {{ $d(new Date(depot.interval_startdate),'short') }} - {{ $d(new Date(depot.interval_enddate),'short') }}</div>
                  <div>{{$t('agio')}}: {{ $n(depot.agio / 100) }} €</div>
                  <div v-if="depot.agio_payment_option=='onetime'">{{$t(depot.agio_payment_option)}}</div>
                  <div v-else>{{$t('billing')}} <span v-if="depot.agio_percentage == 75">75/25</span>
                    <span v-if="depot.agio_percentage == 50">50/50</span>
                  </div>
                  <div>{{$t('payment_method')}}: {{$t(depot.payment_method)}}</div>
                  <div>{{$t('interval_day')}}: {{$t(depot.interval_day?depot.interval_day.toString():'')}}</div>
                  <div>{{$t('invested_amount')}}: {{(depot.invested_amount/100)}} € {{ $t('of') }} {{(depot.target_amount/100)}} €</div>
                  <div v-if="depot && depot.status.name_translation_key=='depot_status_paused'">{{$t('paused_until')}}: <span v-if="pauseEndDate!=''">{{$d(new Date(pauseEndDate))}}</span><span v-else>No date available</span></div>
                </div>
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
                  <div class="col-auto">
                    <base-dropdown
                      title-classes="btn btn-sm btn-link mr-0"
                      menu-on-right
                      :has-toggle="false"
                    >
                      <template slot="title">
                        <i class="fas fa-ellipsis-v"></i>
                      </template>
                     
                      <a class="dropdown-item" @click.prevent="showDepotStatusHistory=true">{{ $t("status_history") }}</a>
                      <a class="dropdown-item" @click.prevent="showAgioTransaction=true" >{{ $t("agio_history") }}</a>
  
                    </base-dropdown>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <order-list :isDepotSet="true" :depotSetId="depot.id"/>
        <GoldGift :showModal="showGoldGift" @onClose="onGoldGiftClose" :depot="depot"/>
        <modal :show.sync="showPauseConfirm" class="orderModal" headerClasses="" bodyClasses="pt-0" footerClasses="border-top bg-secondary" :allowOutSideClose="false">
                    <template slot="header" class="pb-0">
                        <!--<h5 class="modal-title" id="exampleModalLabel">{{$t('order_details')}}</h5>-->
                        <span></span>
                    </template>
                    <div>
                        {{$t('pause_saving_plan_question')}}
                        <div class="mt-3">
                  {{ $t('paused_until') }} :
                  <date-picker
            size="large"
            v-model="endPauseDate"
            type="date"
            :placeholder="$t('select_end_pause_date_placeholder')"
          />
                </div>
                    </div>
                    <template slot="footer">
                        <base-button type="link" class="ml-auto" @click="cancelPause()">
                          {{$t('cancel')}}
                        </base-button>
                        <base-button type="primary" @click="() => pauseSavinPlan()"

                            :disabled="isSubmitting">
                            <span>{{$t('pause')}}</span>
                         </base-button>
                    </template>
        </modal>
        <modal :show.sync="showResumeConfirm" class="orderModal" headerClasses="" bodyClasses="pt-0" footerClasses="border-top bg-secondary" :allowOutSideClose="false">
            <template slot="header" class="pb-0">
                <!--<h5 class="modal-title" id="exampleModalLabel">{{$t('order_details')}}</h5>-->
                <span></span>
            </template>
            <div>
                {{$t('resume_saving_plan_question')}}
            </div>
            <template slot="footer">
                <base-button type="link" class="ml-auto" @click="cancelResume()">
                  {{$t('cancel')}}
                </base-button>
                <base-button type="primary" @click="() => resumeSavinPlan()"
                    :disabled="isSubmitting">
                    <span>{{$t('resume')}}</span>
                  </base-button>
            </template>
        </modal>
        <modal :show.sync="showWithdrawConfirm" class="orderModal" headerClasses="" bodyClasses="pt-0" footerClasses="border-top bg-secondary" :allowOutSideClose="false">
            <template slot="header" class="pb-0">
                <!--<h5 class="modal-title" id="exampleModalLabel">{{$t('order_details')}}</h5>-->
                <span></span>
            </template>
            <div>
                {{$t('withdraw_contract_question')}}
            </div>
            <template slot="footer">
                <base-button type="link" class="ml-auto" @click="cancelWithdraw()">
                  {{$t('cancel')}}
                </base-button>
                <base-button type="primary" @click="() => withdrawContract()"
                    :disabled="isSubmitting">
                    <span>{{$t('withdraw_contract')}}</span>
                  </base-button>
            </template>
        </modal>
        <modal :show.sync="showCompleteContract" class="orderModal" headerClasses="" bodyClasses="pt-0" footerClasses="border-top bg-secondary" :allowOutSideClose="false">
            <template slot="header" class="pb-0">
                <!--<h5 class="modal-title" id="exampleModalLabel">{{$t('order_details')}}</h5>-->
                <span></span>
            </template>
            <div>
                {{$t('complete_contract_question')}}
            </div>
            <template slot="footer">
                <base-button type="link" class="ml-auto" @click="cancelComplete()">
                  {{$t('cancel')}}
                </base-button>
                <base-button type="primary" @click="() => completeContract()"
                    :disabled="isSubmitting">
                    <span>{{$t('complete_contract')}}</span>
                  </base-button>
            </template>
        </modal>
        <modal :show.sync="showCancelConfirm" class="orderModal" headerClasses="" bodyClasses="pt-0" footerClasses="border-top bg-secondary" :allowOutSideClose="false">
            <template slot="header" class="pb-0">
                <!--<h5 class="modal-title" id="exampleModalLabel">{{$t('order_details')}}</h5>-->
                <span></span>
            </template>
            <div>
                {{$t('cancel_saving_plan_question')}}

            </div>
            <template slot="footer">
                <base-button type="link" class="ml-auto" @click="cancelCancel()">
                  {{$t('cancel')}}
                </base-button>
                <base-button type="primary" @click="() => cancelSavinPlan()"
                    :disabled="isSubmitting">
                    <span>{{$t('cancel_contract')}}</span>
                  </base-button>
            </template>
        </modal>
        <modal :show.sync="showAgioTransaction" class="orderModal" headerClasses="" bodyClasses="pt-0" footerClasses="border-top bg-secondary" :allowOutSideClose="false"  size="lg">
          <template slot="header" class="pb-0">
                <!--<h5 class="modal-title" id="exampleModalLabel">{{$t('order_details')}}</h5>-->
                <span></span>
            </template>
            <div>
              <AgioTransactions :depot_id="depotId"/>
           </div>

        </modal>
        <modal :show.sync="showDepotStatusHistory" class="orderModal" headerClasses="" bodyClasses="pt-0" footerClasses="border-top bg-secondary" :allowOutSideClose="false"  size="lg">
          <template slot="header" class="pb-0">
                <!--<h5 class="modal-title" id="exampleModalLabel">{{$t('order_details')}}</h5>-->
                <span></span>
            </template>
            <div>
              <DepotStatusHistory :depotStatus="depot.status_history"/>

           </div>

        </modal>
        <modal :show.sync="showBlockConfirm" class="orderModal" headerClasses="" bodyClasses="pt-0" footerClasses="border-top bg-secondary" :allowOutSideClose="false">
            <template slot="header" class="pb-0">
                <!--<h5 class="modal-title" id="exampleModalLabel">{{$t('order_details')}}</h5>-->
                <span></span>
            </template>
            <div>
                {{$t('are_you_sure_you_want_to_block_depot')}}

            </div>
            <template slot="footer">
                <base-button type="link" class="ml-auto" @click="cancelBlocked()">
                  {{$t('cancel')}}
                </base-button>
                <base-button type="primary" @click="() => blockDepot()"
                    :disabled="isSubmitting">
                    <span>{{$t('block_depot')}}</span>
                  </base-button>
            </template>
        </modal>
        <modal :show.sync="showDepotHistory" class="orderModal" headerClasses="" bodyClasses="pt-0" footerClasses="border-top bg-secondary" :allowOutSideClose="false"  size="lg">
          <template slot="header" class="pb-0">
                <!--<h5 class="modal-title" id="exampleModalLabel">{{$t('order_details')}}</h5>-->
                <span></span>
            </template>
            <div>
              <DepotHistory :depotHistories="depot.depot_histories"/>

           </div>

        </modal>
        <CommentBox :displayModal="showComments" :depot="depot" @closed="closeComments"/>
        <UpdateSavingPlan :show="showEditDepot" :depot="depot" @closed="closeEditSavingPlan"/>
        <AddDeposit :showModal="showAddDeposit" :depot="depot" @onClose="showAddDeposit=false"/>
        <AssignSalesAdvisor :showModal="showEditSalesAdvisor" :depot="depot" @cancelEditAdvisor="cancelEditSalesAdvisor"/>
        <UpdateTargetTypeModal :showModal="showEditTargetTypeModal" :depot="depot" @cancelEditAdvisor="showEditTargetTypeModal = false"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import PageLoader from '@/components/common/Loader/PageLoader';
import TextError from '@/components/common/Errors/TextError';
import OrderList from '@/components/Orders/List'
import GoldGift from "@/components/Depots/GoldGift";
import AssignSalesAdvisor from "@/components/Depots/AssignSalesAdvisor";
import UpdateTargetTypeModal from "@/components/Depots/UpdateTargetTypeModal";
import DepotHistory from "@/components/Depots/DepotHistory";
import Loader from "../../../components/common/Loader/Loader";
import PencilOutlineIcon from "@/components/common/Buttons/PencilOutlineIcon";
import Status from '@/components/Depots/Status';
import AgioTransactions from '@/components/Depots/AgioTransactions';
import DepotStatusHistory from '@/components/Depots/DepotStatusHistory';
import UserInfo from '@/components/Contacts/UserInfo';
import CommentBox from '@/components/Comment/CommentBox';
import {isSilverDepot,isGoldDepot} from "~/helpers/depots"
import {MessageBox} from 'element-ui';
import {
  DatePicker
} from "element-ui";
import { formatDateToApiFormat } from '../../../helpers/helpers';
import UpdateSavingPlan  from "@/components/Depots/UpdateSavingPlan";
import AddDeposit from '@/components/Depots/AddDeposit';
import { canEditDepot, canModifySavingPlanStatus} from '@/permissions';
import Modal from '../../../components/argon-core/Modal.vue';
import { apiErrorHandler } from '../../../helpers/apiErrorHandler';
export default {
    layout: 'DashboardLayout',
    props: {
        showViewPage: {
            type: Boolean
        }
    },
    data() {
        return {
            depotId: parseInt(this.$route.params.id),
            loaded:false,
            loadedWithError:false,
            client:null,
            showGoldGift:false,
            showPauseConfirm:false,
            showResumeConfirm:false,
            isSubmitting:false,
            showCancelConfirm:false,
            showAgioTransaction:false,
            showDepotStatusHistory:false,
            showComments:false,
            endPauseDate:null,
            showBlockConfirm:false,
            showEditDepot:false,
            showAddDeposit:false,
            showDepotHistory:false,
            showEditSalesAdvisor:false,
            showWithdrawConfirm:false,
            showCompleteContract:false,
            showConfirmActivate:false,
            paymentMethod:null,
            paymentAccount:null,
            showEditTargetTypeModal: false
        }
    },
    components: {
      Loader,
        PageLoader,
        TextError,
        OrderList,
        GoldGift,
        Status,
        AgioTransactions,
        DepotStatusHistory,
        UserInfo,
        CommentBox,
        DatePicker,
        UpdateSavingPlan,
        AddDeposit,
        DepotHistory,
        Modal,
        AssignSalesAdvisor,
        UpdateTargetTypeModal,
        PencilOutlineIcon
    },
    computed:
        {
       ...mapGetters('depots',{
            depot:"details",
            goldPrice:"getGoldPrice",
            silverPrice:'silverPrice'
        }),
        pauseEndDate(){
          let pausedDate = '';
          if(this.depot && this.depot.status && this.depot.status.name_translation_key == 'depot_status_paused'
          && this.depot.status_history && this.depot.status_history.length > 0 ){
            const history = this.depot.status_history.findLast(h=>h.depot_status_id==this.depot.status.id);
            if(history && history.end_date){
              pausedDate = history.end_date;
            }
          }
          return pausedDate;
        },
        hadDepotEditAccess(){
          return canEditDepot();
        },
        hadSavingPlanStatusEditAccess(){
          return canModifySavingPlanStatus();
        },
        paymentAccountDetails(){
          if(this.paymentAccount){
            let bank = "";
            let iban = "";
            this.paymentAccount.payment_account_specs.forEach(spec=>{
              if(spec.name =='iban'){
                iban = spec.value;
              }
              if(spec.name =='bank_name'){
                bank = spec.value;
              }
            })
            return bank + ' '+ iban
          }
          return ''
        }

    },
     mounted () {
       this.$confirm = MessageBox.confirm
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
      showDeposit(){
        this.showAddDeposit = true;
      },
      cancelEditSalesAdvisor(){
        this.showEditSalesAdvisor = false;
      },
      editSalesAdvisor (){
        this.showEditSalesAdvisor = true;
      },
      changeTargetType (){
        this.showEditTargetTypeModal = true;
      },
      showEditSavingPlan(){
        this.showEditDepot = true;
      },
      closeEditSavingPlan(){
          this.showEditDepot = false;
      },
        getCustomerName(client) {
          return client.username;
        },
        initPrices(){
            if(isGoldDepot(this.depot))
            {
              if(this.goldPrice==0)
              {
                  this.$store.dispatch('depots/getCurrentGoldPrice').then(res=>{
                      // this.goldPrice = res;
                  })
              }
            }
            if(isSilverDepot(this.depot))
            {
              if(this.silverPrice==0)
              {
                  this.$store.dispatch('depots/getCurrentSilverPrice').then(res=>{
                      this.silverPrice = res;
                  })
              }
            }
        },
        initDepotData()
        {
            this.$store.dispatch('depots/details',this.depotId).then((res)=>{

                this.initPrices();
                this.paymentMethod = res.data.data.payment_method;
                
                if(res.data.data.payment_account_id!=null){
                  this.$store.dispatch('payment-accounts/getPaymentAccountDetails',res.data.data.payment_account_id).then(res=>{
                    
                    this.paymentAccount = res;

                  })
                }
                this.loadedWithError=false;
                this.$store.dispatch('clients/clientAccountDetails',this.depot.account_id).then(res=>{
                      this.client = res;
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
        },
        confirmPause(){
          this.showPauseConfirm = true;
        },
        cancelPause(){
          this.showPauseConfirm = false;
        },
        confirmWithdraw(){
          this.showWithdrawConfirm = true;
        },
        cancelWithdraw(){
          this.showWithdrawConfirm = false;
        },
       
        withdrawContract(){
          const data = {
            depot_id:this.depot.id,
            account_id:this.depot.account_id
          };
          this.isSubmitting = true;
          this.$store.dispatch('depots/withdrawContract',data).then(()=>{
             this.$notify({type: 'success', timeout: 5000, message: this.$t('Depot_withdrawn_successfully')});
             this.showWithdrawConfirm = false;
          }).catch((err)=>{
            apiErrorHandler(err,this.$notify);
          }).finally(()=>{
            this.isSubmitting = false;
          })
        },
        confirmComplete(){
          this.showCompleteContract = true;
        },
        completeContract(){
          const data = {
            depot_id:this.depot.id,
            account_id:this.depot.account_id
          };
          this.isSubmitting = true;
          this.$store.dispatch('depots/completeContract',data).then(()=>{
             this.$notify({type: 'success', timeout: 5000, message: this.$t('depot_compeleted_successfully')});
             this.showCompleteContract = false;
          }).catch((err)=>{
            apiErrorHandler(err,this.$notify);
          }).finally(()=>{
            this.isSubmitting = false;
          })
        },
        cancelComplete(){
          this.showCompleteContract = false;
        },
        pauseSavinPlan(){
          const data = {
            depot_id:this.depot.id,
            account_id:this.depot.account_id,
            end_date:formatDateToApiFormat(this.endPauseDate)
          };
          this.isSubmitting = true;
          this.$store.dispatch('depots/pauseSavingPlan',data).then(()=>{
             this.$notify({type: 'success', timeout: 5000, message: this.$t('Depot_paused_successfully')});
             this.showPauseConfirm = false;
          }).catch((err)=>{
            apiErrorHandler(err,this.$notify);
          }).finally(()=>{
            this.isSubmitting = false;
          })
        },
        cancelResume(){
          this.showResumeConfirm = false;
        },
        confirmResume(){
          this.showResumeConfirm = true;
        },
        resumeSavinPlan(){
          const data = {
            depot_id:this.depot.id,
            account_id:this.depot.account_id
          };
          this.isSubmitting = true;
          this.$store.dispatch('depots/resumeSavingPlan',data).then(()=>{
             this.$notify({type: 'success', timeout: 5000, message: this.$t('Depot_resumed_successfully')});
             this.showResumeConfirm = false;
          }).catch((err)=>{
            apiErrorHandler(err,this.$notify);
          }).finally(()=>{
            this.isSubmitting = false;
          })
        },
        cancelCancel(){
          this.showCancelConfirm = false;
        },
        confirmCancel(){
          this.showCancelConfirm = true;
        },
        cancelCompete(){
          this.showCancelConfirm = false;
        },
        confirmContractConfirm (){
          this.$confirm(this.$t('do_you_want_to_confirm_contract','Warning',{
            confirmButtonText: this.$t('ok'),
            cancelButtonText: this.$t('cancel'),
            type: 'warning'
          })).then(()=>{
              const data = {
              depot_id:this.depot.id,
              account_id:this.depot.account_id
            };
            this.isSubmitting = true;
            this.$store.dispatch('depots/confirmSavingPlanContract',data).then(()=>{
              this.$notify({type: 'success', timeout: 5000, message: this.$t('savingplan_activated_successfully')});
              this.showCancelConfirm = false;
            }).catch((err)=>{
              apiErrorHandler(err,this.$notify);
            }).finally(()=>{
              this.isSubmitting = false;
            })
          })
        },
        cancelSavinPlan(){
          const data = {
            depot_id:this.depot.id,
            account_id:this.depot.account_id
          };
          this.isSubmitting = true;
          if(this.depot.status.name_translation_key=='depot_status_applied_for_savings_plan'){
            this.$store.dispatch('depots/rejectSavingPlan',data).then(()=>{
             this.$notify({type: 'success', timeout: 5000, message: this.$t('Depot_canceled_successfully')});
             this.showCancelConfirm = false;
          }).catch((err)=>{
            apiErrorHandler(err,this.$notify);
          }).finally(()=>{
            this.isSubmitting = false;
          })
          }
          else{
            this.$store.dispatch('depots/cancelSavingPlan',data).then(()=>{
             this.$notify({type: 'success', timeout: 5000, message: this.$t('Depot_canceled_successfully')});
             this.showCancelConfirm = false;
          }).catch((err)=>{
            apiErrorHandler(err,this.$notify);
          }).finally(()=>{
            this.isSubmitting = false;
          })
          }

        },

        blockDepot(){
          const data = {
            depot_id:this.depot.id,
            account_id:this.depot.account_id
          };
          this.isSubmitting = true;
          this.$store.dispatch('depots/blockDepot',data).then(()=>{
             this.$notify({type: 'success', timeout: 5000, message: this.$t('Depot_blocked_successfully')});
             this.showBlockConfirm = false;
          }).catch((err)=>{
            apiErrorHandler(err,this.$notify);
          }).finally(()=>{
            this.isSubmitting = false;
          })
        },
        cancelBlocked(){
          this.showBlockConfirm = false;
        },
        openComment(){
          this.showComments = true;
        },
        closeComments(){
          this.showComments = false;
        },
        openDepotHistory(){
          this.showDepotHistory = true;
        },
        calculateDepotValue(){
          let value = 0;
          if(isGoldDepot(this.depot))
          {
            value = this.depot.gram_amount/1000*this.goldPrice;
          }
          if(isSilverDepot(this.depot))
          {
            value = this.depot.gram_amount/1000*this.silverPrice;
          }
          return value;
        },

    }

}
</script>
<style>
.dropdown-item i { width: 16px; text-align: center}
.cursor-pointer {cursor: pointer;}
</style>

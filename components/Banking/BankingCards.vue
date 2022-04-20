<template>
  <div>
    <div class="card border-0">
      <!-- Card header -->
      <div class="card-header">
        <!-- Title -->
        <h5 class="h3 mb-0">{{$t('inaia_mastercard')}} </h5>
      </div>
      <!-- Card body -->
      <div class="card-body">
        <div class="row" v-for="cards in rowCards" :key="cards.key">
         <div class="col" v-for="card in cards.cards" :key="card.id">
             <div class="position-absolute" style="right: 1.5rem;">
          <base-dropdown
            title-classes="btn btn-sm btn-link mr-0"
            menu-on-right
            :has-toggle="false"
          >
            <template slot="title">
              <i class="fas fa-ellipsis-v"></i>
            </template>

            <a class="dropdown-item" v-if="card.activated && !card.is_blocked" @click.prevent="()=>displayBlockScreen(card)">{{$t('block_card')}}</a>
             <a class="dropdown-item" v-if="card.is_blocked && card.block_reason=='OTHER'" @click.prevent="()=>confirmUnBlockingCard(card)">{{$t('unblock_card')}}</a>
            
          </base-dropdown>
        </div>

             <h4 class="text-center">{{(!card.is_physical?$t('virtual')+' ':'')+$t('inaia_mastercard')}}</h4>
            <div class="inaiacardContainer" :class="card.is_blocked?'blocked':''">
              <div class="inaiacardNumber">
                <h4 style="color: white">{{formatWithSpaces(card.pan,4)}}</h4>
              </div>
              <div class="inaiacardDate">
                <h4 style="color: white">{{cardDate(card.expiry_date)}}</h4>
              </div>
            </div>
            <div
              class="
                d-flex
                flex-column
                justify-content-center
                align-items-center
                mt-2
              "
            >
              <span class="mt--2" style="font-size:15px" v-if="card.activated && !card.is_blocked">
                <i class="fa fa-dot-circle" style="color: #32CD32" ></i>  {{$t('active')}}</span
              >
              <span class="mt--2" style="font-size:15px" v-if="card.activated && card.is_blocked">
                <i class="fa fa-dot-circle" style="color: #8f9fb3" ></i>  {{$t('blocked')}}</span
              >
              <span class="mt--2" style="font-size:15px" v-if="!card.activated">
                <i class="fa fa-dot-circle" style="color: #8f9fb3" ></i>  {{$t('desactivated')}}</span>
             
            </div>
          </div>
          
        </div>
        
      </div>
    </div>
    <modal :show.sync="showBlockModal"  headerClasses="" bodyClasses="pt-0" footerClasses="border-top bg-secondary" @close="cancelBlockCard" :allowOutSideClose="false">
        <template slot="header" class="pb-0">
                        <h5 class="modal-title">{{$t('blocking_reason')}}</h5>
                        <span></span>
                    </template>
        <div class="d-flex align-align-items-center justify-content-center">
          <Select :placeholder="$t('blocking_reason')"
                    v-model="blokingReason"
                    clearable
                    class="mb-3"
                    >
              <Option v-for="option in blockingReasons"

                        :value="option.name_translation_key"
                        :label="$t(option.name_translation_key)"
                        :key="option.id">
              </Option>
            </Select>
        </div>
        <template slot="footer">
                        <base-button type="link" class="ml-auto" @click="cancelBlockCard()">
                          {{$t('cancel')}}
                        </base-button>
                        <base-button type="white" class="text-danger" @click="() => blockCard()"
                            :disabled="(!blokingReason) || isSubmitting">
                          {{$t('block_card')}}
                        </base-button>
                    </template>
    </modal>
    <modal :show.sync="showUnBlockModal"  headerClasses="" bodyClasses="pt-0" footerClasses="border-top bg-secondary" @close="cancelUnBlockCard" :allowOutSideClose="false">
        <template slot="header" class="pb-0">
                        <h5 class="modal-title">{{$t('confirm_unblocking')}}</h5>
                        <span></span>
                    </template>
        <div class="d-flex align-align-items-center justify-content-center">
          {{$t('unblock_card_confirmation')}}
        </div>
        <template slot="footer">
                        <base-button type="link" class="ml-auto" @click="cancelUnBlockCard()">
                          {{$t('cancel')}}
                        </base-button>
                        <base-button type="primary" @click="() => UnBlockingCard()"
                            :disabled="isSubmitting">
                          {{$t('unblock_card')}}
                        </base-button>
                    </template>
    </modal>
  </div>
</template>
<script>
import moment from 'moment';
import {Select,Option} from 'element-ui'
import {formatWithSpaces} from '../../helpers/helpers';
import { BLOCKREASONS} from '../../helpers/cards'
import Modal from '../argon-core/Modal.vue';
export default {
  components: { Modal,Select,Option },
  props: {
    cards: {
      type: Array,
      default: [],
    },
    account_id: {
      type: Number,
      default: -1
    }
  },
  mounted(){
      if(this.cards.length>0)
      {
          for (let index = 0; index < this.cards.length; index++) {
              if(index%2 == 0)
              {
                  if(index+1<this.cards.length)
                  {
                      this.rowCards.push({
                      key:index,
                      cards:[this.cards[index],this.cards[index+1]],
                      
                  })
                  }
                  else if(index+1==this.cards.length)
                  {
                      this.rowCards.push({
                      key:index,
                      cards:[this.cards[index]],
                    })
                  }
                  
              }
          }
      }
      this.blockingReasons = BLOCKREASONS;
  },
  data(){
      return {
          rowCards:[
          ],
          blockingReasons:[],
          showBlockModal:false,
          blokingReason:null,
          isSubmitting:false,
          selectedCard:null,
          showUnBlockModal:false
      }
  },
  methods:{
      formatWithSpaces,
      cardDate(date)
      {
          let m = moment(date);
          return m.format('MM/YY');
      },
      displayBlockScreen(card){
        this.showBlockModal = true;
        this.selectedCard = card;
      },
      cancelBlockCard(){
        this.showBlockModal = false;
        this.blokingReason = null;
        this.selectedCard = null;
      },
      blockCard(){
        let data = {
            "reason": this.blokingReason,
            "cardSerial": this.selectedCard.card_serial,
            "accountId": this.account_id,
            "isPhysical": this.selectedCard.is_physical==1
          }
          this.isSubmitting = true
          this.$store.dispatch("banking-accounts/blockCard",data).then(res=>{
            console.log(res);
            const c = this.cards.find(x=>x.id==res.id);
            Object.assign(c,res);
            this.$notify({type: 'success', timeout: 5000, message: this.$t('card_blocked_successfully')})
            this.cancelBlockCard();
          }).catch(()=>{
            this.$notify({type: 'danger', timeout: 5000, message: this.$t('card_blocked_unsuccessfully')})
          }).finally(()=>{
            this.isSubmitting = false;
          })
      },
      confirmUnBlockingCard(card)
      {
        this.showUnBlockModal = true;
        this.selectedCard = card;
      },
      cancelUnBlockCard()
      {
        this.showUnBlockModal = false;
        this.selectedCard = false;
      },
      UnBlockingCard(){
        this.isSubmitting = true
          this.$store.dispatch("banking-accounts/resumeCard",this.selectedCard.id).then(res=>{
            const c = this.cards.find(x=>x.id==res.id);
            c.is_blocked = false;
            this.$notify({type: 'success', timeout: 5000, message: this.$t('card_unblocked_successfully')})
            this.cancelUnBlockCard();
          }).catch(()=>{
            this.$notify({type: 'danger', timeout: 5000, message: this.$t('card_unblocked_unsuccessfully')})
          }).finally(()=>{
            this.isSubmitting = false;
          })
      }
  }
};
</script>
<style scoped>
.inaiacardContainer {
  width: 240px;
  height: 170px;
  background-image: url("/img/theme/inaia-mastercard.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  margin: auto;
  
}
.inaiacardNumber {
  position: relative;
  left: 10px;
  top: 64px;
}
.inaiacardDate {
  position: relative;
  left: 10px;
  top: 90px;
}
.blocked {
   opacity: 0.5;
}
</style>

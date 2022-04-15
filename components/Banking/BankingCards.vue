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

            <a class="dropdown-item" v-if="card.activated && !card.is_blocked">{{$t('block_card')}}</a>
             <a class="dropdown-item" v-if="!card.activated">{{$t('activate_card')}}</a>
             <a class="dropdown-item" v-if="card.is_blocked">{{$t('unblock_card')}}</a>
            
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
  </div>
</template>
<script>
import moment from 'moment';
import {formatWithSpaces} from '../../helpers/helpers';
export default {
  props: {
    cards: {
      type: Array,
      default: [],
    },
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
  },
  data(){
      return {
          rowCards:[
          ]
      }
  },
  methods:{
      formatWithSpaces,
      cardDate(date)
      {
          let m = moment(date);
          return m.format('MM/YY');
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

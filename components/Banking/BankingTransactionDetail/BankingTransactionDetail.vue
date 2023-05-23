<template>
    <modal :show.sync="showModal"  headerClasses="" bodyClasses="pt-0" footerClasses="border-top bg-secondary" @close="onDetailClose" :allowOutSideClose="false">
        <template slot="header" class="pb-0">
                        <!--<h5 class="modal-title" id="exampleModalLabel">{{$t('order_details')}}</h5>-->
                        <span></span>
                    </template>
        <div v-if="transaction!=null">
            <div class="text-center">
            <img :src="transaction.logo" class="icon"/>
            <h2 class="card-title mt-3 mb-0 title">{{$t(transaction.type)}}</h2>
        </div>
        <div class="mt-4 text-sm">
            <FundTransfer v-if="isFundTransfer(transaction.type)" :transaction="transaction"/>
            <PaymentIn v-if="isPaymentIn(transaction.type)" :transaction="transaction"/>
            <Sepa v-if="isPaymentOut(transaction.type)" :transaction="transaction"/>
            <Withdrawal v-if="isWithDrawal(transaction.type)" :transaction="transaction"/>
            <Redemption v-if="isRedemption(transaction.type)" :transaction="transaction"/>
            
            <div class="list-group list-group-flush" v-else>
               
                <detail-list-item :title="$t('sender')" ><div slot="value" >{{transaction.transfer_account_name}}</div></detail-list-item>
                <detail-list-item title="IBAN"><div slot="value" >{{transaction.transfer_account_iban}}</div></detail-list-item>
                <detail-list-item :title="$t('usage')" ><div slot="value" >{{transaction.reason_text}}</div></detail-list-item>
                <detail-list-item :title="$t('amount')"><div slot="value" >{{ transaction.direction == 'DEBIT' ? '-' : '+' }} {{$n(transaction.money_amount/100)}} €</div></detail-list-item>
            </div>
            
        </div>
        </div>
    </modal>
</template>
<script>
import FundTransfer from '@/components/Banking/BankingTransactionDetail/FundTransfer';
import PaymentIn from '@/components/Banking/BankingTransactionDetail/PaymentIn';
import Sepa from '@/components/Banking/BankingTransactionDetail/Sepa';
import Withdrawal from '@/components/Banking/BankingTransactionDetail/Withdrawal';
import Redemption from '@/components/Banking/BankingTransactionDetail/Redemption';
import DetailListItem from '@/components/common/DetailListItem.vue';
import {isFundTransfer,isPaymentIn,isPaymentOut,isWithDrawal,isRedemption} from '../../../helpers/bankingTransactions';
export default {
    props:{
        showModal:{
            type:Boolean,
            default: false
        },
        transaction:{
            type:Object,
            default:null
        }
    },
    components:{
        FundTransfer,
        PaymentIn,
        Sepa,
        Withdrawal,
        Redemption,
        DetailListItem
    },
    methods:{
        isFundTransfer,
        isPaymentIn,
        isPaymentOut,
        isWithDrawal,
        isRedemption,
        onDetailClose(){
            this.showModal = false;
            this.$emit('closed');
            
        }
    }
}
</script>
<style scoped>
.icon {
    width: 90px;
    height: 90px;
}
</style>
<template>
    <div class="card border-0">
        
            
       
      <div class="card-body">
        <div><span v-if="startDate && endDate">{{ startDate?$d(startDate)+' - ':'' }}{{ endDate?$d(endDate):'' }}</span></div>
        <div class="row mt-3">
            <div class="col-md">
                <date-picker type="date" v-model="startDate" :placeholder="$t('select_start_date_placeholder')" ></date-picker>
            
            </div>
            <div class="col-md">
                <date-picker type="date" v-model="endDate" :placeholder="$t('select_end_date_placeholder')"></date-picker>
            </div>
            <div class="col-md text-right">
                <button @click.prevent="changeDate()" type="button" class="btn base-button btn-icon btn-fab btn-neutral btn-sm">
                            <span class="btn-inner--icon"><i class="fas fa-filter"></i></span><span class="btn-inner--text">{{$t('filter')}}</span>
                          </button>
            </div>
            </div>
        <div id="chart">
        <div v-if="data && !loading">
            <div v-if="data.gold">
                <h3 class="my-3">Gold</h3>
                <div class="my-3" v-if="data.gold.agio">
                    <h5>Agio</h5>
                    <table class="text-sm">
                        <colgroup>
                        <col span="1" style="width: 15%;">
                        <col span="1" style="width: 15%;">
                        <col span="1" style="width: 15%;">
                        <col span="1" style="width: 15%;">
                        <col span="1" style="width: 15%;">
                        <col span="1" style="width: 15%;">
                        </colgroup>
                        <thead class="text-sm-center">
                            <th>Claim</th>
                            <th>Discounts</th>
                            <th>Discount from advisor</th>
                            <th>Discount inaia special offer</th>
                            <th>Discount pay immediately</th>
                            <th>Payment</th>
                        </thead>
                        <tbody class="text-sm-center">
                            <tr class="my-2">
                                <td>{{ $n(data.gold.agio.claim.amount) }}</td>
                               
                                <td>{{ data.gold.agio.discount.amount }}</td>
                                <td>{{ data.gold.agio.discount_from_advisor.amount }}</td>
                                <td>{{ data.gold.agio.discount_inaia_special_offer.amount }}</td>
                                <td>{{ data.gold.agio.discount_pay_immediately.amount }}</td>
                                <td>{{ data.gold.agio.payment.amount }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="my-3" v-if="data.gold.claims">
                    <h5>Claims</h5>
                    <table class="text-sm">
                        <colgroup>
                        <col span="1" style="width: 20%;">
                        <col span="1" style="width: 20%;">
                        <col span="1" style="width: 20%;">
                        <col span="1" style="width: 20%;">
                        <col span="1" style="width: 20%;">
                        
                        </colgroup>
                        <thead class="text-sm-center">
                            <th>Direct debit return</th>
                            <th>Gold delivery charge</th>
                            <th>Gold storage fee</th>
                            <th>Order reverted</th>
                            <th>Silver storage fee</th>
                           
                        </thead>
                        <tbody class="text-sm-center">
                            <tr class="my-2">
                                <td>{{ $n(data.gold.claims.direct_debit_return.amount) }}</td>
                               
                                <td>{{ $n(data.gold.claims.gold_delivery_charge.amount) }}</td>
                                <td>{{ $n(data.gold.claims.gold_storage_fee.amount) }}</td>
                                <td></td>
                                <td>{{ $n(data.gold.claims.silver_storage_fee.amount) }}</td>
                                
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="my-3" v-if="data.gold.transactions">
                    <h5>Transactions</h5>
                    <table class="text-sm">
                        <colgroup>
                            <col span="1" style="width: 15%;">
                        <col span="1" style="width: 15%;">
                        <col span="1" style="width: 15%;">
                        <col span="1" style="width: 15%;">
                        <col span="1" style="width: 15%;">
                        <col span="1" style="width: 15%;">
                        
                        </colgroup>
                        <thead class="text-sm-center">
                            <th>Agio</th>
                            <th>Delivery</th>
                            <th>Deposit</th>
                            <th>Gift</th>
                            <th>Purchase</th>
                            <th>Refund</th>
                            
                           
                        </thead>
                        <tbody class="text-sm-center">
                            <tr class="my-2">
                                <td>
                                    <div>{{ $n(data.gold.transactions.agio.money_amount) }} €</div>
                                    <div>{{ $n(data.gold.transactions.agio.gram_amount) }} g</div>
                                </td>
                               
                                <td>
                                    <div>{{ $n(data.gold.transactions.delivery.money_amount) }} €</div>
                                    <div>{{ $n(data.gold.transactions.delivery.gram_amount) }} g</div>
                                </td>
                                <td>
                                    <div>{{ $n(data.gold.transactions.deposit.money_amount) }} €</div>
                                    <div>{{ $n(data.gold.transactions.deposit.gram_amount) }} g</div>
                                </td>
                                <td>
                                    <div>{{ $n(data.gold.transactions.gift.money_amount) }} €</div>
                                    <div>{{ $n(data.gold.transactions.gift.gram_amount) }} g</div>
                                </td>
                                <td>
                                    <div>{{ $n(data.gold.transactions.purchase.money_amount) }} €</div>
                                    <div>{{ $n(data.gold.transactions.purchase.gram_amount) }} g</div>
                                </td>
                                <td>
                                    <div>{{ $n(data.gold.transactions.refund.money_amount) }} €</div>
                                    <div>{{ $n(data.gold.transactions.refund.gram_amount) }} g</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="text-sm">
                        <colgroup>
                            <col span="1" style="width: 15%;">
                        <col span="1" style="width: 15%;">
                        <col span="1" style="width: 15%;">
                        <col span="1" style="width: 15%;">
                        <col span="1" style="width: 15%;">
                        <col span="1" style="width: 15%;">
                        
                        </colgroup>
                        <thead class="text-sm-center">
                            <th>Sell</th>
                            <th>Storage fee</th>
                            <th>Transaction fee</th>
                            <th>Transfer in</th>
                            <th>Transfer out</th>
                            <th>Withdrawal</th>
                        </thead>
                        <tbody class="text-sm-center">
                            <tr class="my-2">
                                <td>
                                    <div>{{ $n(data.gold.transactions.sell.money_amount) }} €</div>
                                    <div>{{ $n(data.gold.transactions.sell.gram_amount) }} g</div>
                                </td>
                               
                                <td>
                                    <div>{{ $n(data.gold.transactions.storage_fee.money_amount) }} €</div>
                                    <div>{{ $n(data.gold.transactions.storage_fee.gram_amount) }} g</div>
                                </td>
                                <td>
                                    <div>{{ $n(data.gold.transactions.transaction_fee.money_amount) }} €</div>
                                    <div>{{ $n(data.gold.transactions.transaction_fee.gram_amount) }} g</div>
                                </td>
                                <td>
                                    <div>{{ $n(data.gold.transactions.transfer_in.money_amount) }} €</div>
                                    <div>{{ $n(data.gold.transactions.transfer_in.gram_amount) }} g</div>
                                </td>
                                <td>
                                    <div>{{ $n(data.gold.transactions.transfer_out.money_amount) }} €</div>
                                    <div>{{ $n(data.gold.transactions.transfer_out.gram_amount) }} g</div>
                                </td>
                                <td>
                                    <div>{{ $n(data.gold.transactions.withdrawal.money_amount) }} €</div>
                                    <div>{{ $n(data.gold.transactions.withdrawal.gram_amount) }} g</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div v-if="data.silver">
                <h3 class="my-3">Silver</h3>
                <div class="my-3" v-if="data.silver.agio">
                    <h5>Agio</h5>
                    <table class="text-sm">
                        <colgroup>
                        <col span="1" style="width: 15%;">
                        <col span="1" style="width: 15%;">
                        <col span="1" style="width: 15%;">
                        <col span="1" style="width: 15%;">
                        <col span="1" style="width: 15%;">
                        <col span="1" style="width: 15%;">
                        </colgroup>
                        <thead class="text-sm-center">
                            <th>Claim</th>
                            <th>Discounts</th>
                            <th>Discount from advisor</th>
                            <th>Discount inaia special offer</th>
                            <th>Discount pay immediately</th>
                            <th>Payment</th>
                        </thead>
                        <tbody class="text-sm-center">
                            <tr class="my-2">
                                <td>{{ $n(data.silver.agio.claim.amount) }}</td>
                               
                                <td>{{ data.silver.agio.discount.amount }}</td>
                                <td>{{ data.silver.agio.discount_from_advisor.amount }}</td>
                                <td>{{ data.silver.agio.discount_inaia_special_offer.amount }}</td>
                                <td>{{ data.silver.agio.discount_pay_immediately.amount }}</td>
                                <td>{{ data.silver.agio.payment.amount }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="my-3" v-if="data.silver.claims">
                    <h5>Claims</h5>
                    <table class="text-sm">
                        <colgroup>
                        <col span="1" style="width: 20%;">
                        <col span="1" style="width: 20%;">
                        <col span="1" style="width: 20%;">
                        <col span="1" style="width: 20%;">
                        <col span="1" style="width: 20%;">
                        
                        </colgroup>
                        <thead class="text-sm-center">
                            <th>Direct debit return</th>
                            <th>Gold delivery charge</th>
                            <th>Gold storage fee</th>
                            <th>Order reverted</th>
                            <th>Silver storage fee</th>
                           
                        </thead>
                        <tbody class="text-sm-center">
                            <tr class="my-2">
                                <td>{{ $n(data.silver.claims.direct_debit_return.amount) }}</td>
                               
                                <td>{{ $n(data.silver.claims.gold_delivery_charge.amount) }}</td>
                                <td>{{ $n(data.silver.claims.gold_storage_fee.amount) }}</td>
                                <td></td>
                                <td>{{ $n(data.silver.claims.silver_storage_fee.amount) }}</td>
                                
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="my-3" v-if="data.silver.transactions">
                    <h5>Transactions</h5>
                    <table class="text-sm">
                        <colgroup>
                            <col span="1" style="width: 15%;">
                        <col span="1" style="width: 15%;">
                        <col span="1" style="width: 15%;">
                        <col span="1" style="width: 15%;">
                        <col span="1" style="width: 15%;">
                        <col span="1" style="width: 15%;">
                        
                        </colgroup>
                        <thead class="text-sm-center">
                            <th>Agio</th>
                            <th>Delivery</th>
                            <th>Deposit</th>
                            <th>Gift</th>
                            <th>Purchase</th>
                            <th>Refund</th>
                            
                           
                        </thead>
                        <tbody class="text-sm-center">
                            <tr class="my-2">
                                <td>
                                    <div>{{ $n(data.silver.transactions.agio.money_amount) }} €</div>
                                    <div>{{ $n(data.silver.transactions.agio.gram_amount) }} g</div>
                                </td>
                               
                                <td>
                                    <div>{{ $n(data.silver.transactions.delivery.money_amount) }} €</div>
                                    <div>{{ $n(data.silver.transactions.delivery.gram_amount) }} g</div>
                                </td>
                                <td>
                                    <div>{{ $n(data.silver.transactions.deposit.money_amount) }} €</div>
                                    <div>{{ $n(data.silver.transactions.deposit.gram_amount) }} g</div>
                                </td>
                                <td>
                                    <div>{{ $n(data.silver.transactions.gift.money_amount) }} €</div>
                                    <div>{{ $n(data.silver.transactions.gift.gram_amount) }} g</div>
                                </td>
                                <td>
                                    <div>{{ $n(data.silver.transactions.purchase.money_amount) }} €</div>
                                    <div>{{ $n(data.silver.transactions.purchase.gram_amount) }} g</div>
                                </td>
                                <td>
                                    <div>{{ $n(data.silver.transactions.refund.money_amount) }} €</div>
                                    <div>{{ $n(data.silver.transactions.refund.gram_amount) }} g</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="text-sm">
                        <colgroup>
                            <col span="1" style="width: 15%;">
                        <col span="1" style="width: 15%;">
                        <col span="1" style="width: 15%;">
                        <col span="1" style="width: 15%;">
                        <col span="1" style="width: 15%;">
                        <col span="1" style="width: 15%;">
                        
                        </colgroup>
                        <thead class="text-sm-center">
                            <th>Sell</th>
                            <th>Storage fee</th>
                            <th>Transaction fee</th>
                            <th>Transfer in</th>
                            <th>Transfer out</th>
                            <th>Withdrawal</th>
                        </thead>
                        <tbody class="text-sm-center">
                            <tr class="my-2">
                                <td>
                                    <div>{{ $n(data.silver.transactions.sell.money_amount) }} €</div>
                                    <div>{{ $n(data.silver.transactions.sell.gram_amount) }} g</div>
                                </td>
                               
                                <td>
                                    <div>{{ $n(data.silver.transactions.storage_fee.money_amount) }} €</div>
                                    <div>{{ $n(data.silver.transactions.storage_fee.gram_amount) }} g</div>
                                </td>
                                <td>
                                    <div>{{ $n(data.silver.transactions.transaction_fee.money_amount) }} €</div>
                                    <div>{{ $n(data.silver.transactions.transaction_fee.gram_amount) }} g</div>
                                </td>
                                <td>
                                    <div>{{ $n(data.silver.transactions.transfer_in.money_amount) }} €</div>
                                    <div>{{ $n(data.silver.transactions.transfer_in.gram_amount) }} g</div>
                                </td>
                                <td>
                                    <div>{{ $n(data.silver.transactions.transfer_out.money_amount) }} €</div>
                                    <div>{{ $n(data.silver.transactions.transfer_out.gram_amount) }} g</div>
                                </td>
                                <td>
                                    <div>{{ $n(data.silver.transactions.withdrawal.money_amount) }} €</div>
                                    <div>{{ $n(data.silver.transactions.withdrawal.gram_amount) }} g</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="d-flex justify-content-center align-items-center" style="height: 200px;" v-else>
          <Loader/>
        </div>
      </div>
    </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
import { DatePicker } from 'element-ui';
import {formatDateToApiFormat} from '@/helpers/helpers'
export default({
    components: {
        DatePicker
    },
    computed: {
        ...mapGetters({
            data: "statistic/monthlyPeformance"
        }),
    },
    data(){
        return {
            startDate:null,
            endDate:null,
            loading:false
        }
    },
    mounted(){
        this.loadData();
    },
    methods:{
        loadData(){
            this.loading = true;
            let payload = '';
            
            if(this.startDate && this.endDate){
                payload= `start_date=${formatDateToApiFormat(this.startDate)}&end_date=${formatDateToApiFormat(this.endDate)}`;
            }
            this.$store.dispatch('statistic/getMonthlyPeformance',payload).finally(()=>{
                console.log(this.data);
                this.loading = false
            })
        },
        changeDate(){
            if(this.startDate && this.endDate){

                this.loadData();
            }
        }
    }
})
</script>

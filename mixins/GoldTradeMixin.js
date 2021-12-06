import { mapGetters } from "vuex"

export default {
    data() {
        return {
            agio: 4.95,
        }
    },
    computed: {
        ...mapGetters({
            bankingAccount: "banking/account",
            products: "products/products",
            currentGoldBuyPrice: "gold/currentBuyPrice",
            currentGoldSellPrice: "gold/currentSellPrice",
            priceDate: "gold/timestamp",
        }),
        productClass() {
            if (this.products && this.products.length && this.bankingAccount) {
                let pd  = this.products.find(p => p.account_id == this.bankingAccount.account_id)
                if (pd) {
                    return pd.product_class
                }
            }
            return null
        },
        buyingCharge() {
            if (this.productClass) {
                let pcs = this.productClass.product_class_specs,
                    buyingCharge    = pcs && pcs.length && pcs.find(s => s.name == 'buying_charge')

                if (buyingCharge) {
                    return buyingCharge
                }
            }
            return null
        },
        sellingCharge() {
            if (this.productClass) {
                let pcs = this.productClass.product_class_specs,
                    sellingCharge   = pcs && pcs.length && pcs.find(s => s.name == 'selling_charge')

                if (sellingCharge) {
                    return sellingCharge
                }
            }
            return null
        },
        transactionFee() {
            if (this.productClass) {
                let pcs = this.productClass.product_class_specs,
                    transactionFee  = pcs && pcs.length && pcs.find(s => s.name == 'transaction_fee')

                if (transactionFee) {
                    return parseFloat(transactionFee.value)
                }
            }
            return 0
        },
        transactionFeeUnit() {
            if (this.productClass) {
                let pcs = this.productClass.product_class_specs,
                    transactionFee  = pcs && pcs.length && pcs.find(s => s.name == 'transaction_fee')

                if (transactionFee) {
                    return transactionFee.unit
                }
            }
            return ''
        },
        ultimateGoldBuyPrice() {
            if (!this.buyingCharge) {
                return this.currentGoldBuyPrice
            }
            if (this.buyingCharge.unit === 'percentage') {
                return this.currentGoldBuyPrice * (1.0 + (parseInt(this.buyingCharge.value) / 10000))
            }
            return this.currentGoldBuyPrice + (parseInt(this.buyingCharge.value) / 100)
        },
        ultimateGoldSellPrice() {
            if (!this.sellingCharge) {
                return this.currentGoldSellPrice
            }
            if (this.sellingCharge.unit === 'percentage') {
                return this.currentGoldSellPrice / (1.0 + (parseInt(this.sellingCharge.value) / 10000))
            }
            return this.currentGoldSellPrice - (parseInt(this.sellingCharge.value) / 100)
        },
        ppsAccountVirtualCard() {
            if (!this.activeBankAccount || !this.cards.length) {
                return null
            }
            return this.cards.find(c => c.banking_account_id == this.activeBankAccount.id && c.is_physical == 0)
        }
    }
}

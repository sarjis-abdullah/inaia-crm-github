<template>
    <div class="container">
        <div class="mb-2 d-flex flex-column align-items-center justify-content-center">
                <img :src="productLogo" class="img"/>
                <h3>{{productName}}</h3>
        </div>
        <div class="row mb-2" v-for="item in productSpec" :key="item?item.id:-1">

            <div class="col-1" v-if="item">
                <i class ="fas" :class="item.active?'fa-check':'fa-close'"></i>
            </div>
            <div class="col-8" v-if="item">
                {{item.verbose}}
            </div>

        </div>
        <div class="mb-2 d-flex flex-column align-items-center justify-content-center" v-if="account_product_spec.length>0">
                <h3>{{$t('customer_product_spec')}}</h3>
        </div>
        <div class="row mb-2" v-for="item in account_product_spec" :key="item?item.id:-1">

            <div class="col-1">
                <i class ="fas fa-user"></i>
            </div>
            <div class="col-8">
                {{item.translated_name}}
            </div>
            <div class="col-3" v-if="item.value">
                {{$n(item.value/100)}} {{getUnit(item.unit)}}
            </div>

        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
    props:{
        product_class_id:{
            type: Number,
            default:  0
        },
        account_product_spec:{
            type: Array,
            default: []
        },
        accountId: {
          type: Number,
          default: 0
        }
    },
    computed:{
        ...mapGetters({
            productClasses : 'product-classes/productClasses'
        })
    },
    mounted(){
        if(this.productClasses.length==0)
        {
            this.$store.dispatch('product-classes/productClasses', {account_id:this.accountId}).then(()=>{
                this.init();
            });
        }
        else
        {
            this.init();
        }
    },
    data (){
        return{
            productSpec:[],
            productName:'',
            productLogo:''
        }
    },
    methods:{
        getUnit(unit)
        {
            if(unit=="euro")
            {
                return '€'
            }
            else if(unit == "percentage")
            {
                return '%';
            }
            else if(unit == "gram")
            {
                return "g";
            }
            else
            {
                return '';
            }
        },
        init(){
            this.productClasses.forEach(element => {
                if(element.id == this.product_class_id)
                {
                    this.productSpec = element.details;
                    this.productName = element.name;
                    this.productLogo = element.icon;
                }
            });
        }
    }

}
</script>
<style scoped>
.container{
    background-color: white;
    padding: 5px;
}
.img {
    height: 50px;
    width: 50px;
    margin-bottom: 10px;
}
</style>

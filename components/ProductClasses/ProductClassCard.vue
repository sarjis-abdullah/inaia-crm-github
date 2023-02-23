<template>
  <div class="card border-0">
    <div class="card-body">

      <div class="row">
        <div class="col">
            <h5 class="card-title text-uppercase text-muted mb-0">{{ $t('product_class') }}</h5>
            <div v-if="productClassDetails">
              <h2 class="mb-0"><i class="lnir" :class="productClassDetails.name == 'premuim' ? 'lnir-crown' : 'lnir-star'"></i> {{ $t(productClassDetails.name) }}</h2>
            </div>
            <div v-else><Loader :width="24" :height="24"></Loader></div>
        </div>
        <div class="col-auto">
          <base-dropdown title-classes="btn btn-sm btn-link mr-0"
                         menu-on-right
                         :has-toggle="false">

            <template slot="title">
              <i class="fas fa-ellipsis-v"></i>
            </template>

            <a class="dropdown-item" @click.prevent="showProductSpecifications">{{$t('product_class_specs')}}</a>
          </base-dropdown>
        </div>
      </div>
      <div class="mt-2 mb-0 text-sm text-center">
        <div class="display-2 d-flex align-items-center justify-content-center">5 € <span class="text-sm ml-2">/ {{ $t(productClassDetails.payment_period) }}</span></div>
        <div v-if="productClassDetails.next_billing_date">{{$t('next_billing_date')}}: {{ $d(new Date(productClassDetails.next_billing_date),'narrow') }}</div>
      </div>
    </div>
    <modal :show.sync="showProductSpec" bodyClasses="pt-0" footerClasses="border-top bg-secondary" :allowOutSideClose="false">
      <template slot="header">
          <h5 class="modal-title" id="confirmModal">{{$t('product_class_specs')}}</h5>
      </template>
      <ProductClassSpecification  :product_class_id="productClassDetails.id" :accountId="accountId" />
    </modal>
  </div>
</template>
<script>
import Loader from "../common/Loader/Loader";
import ProductClassSpecification from '@/components/ProductClasses/ProductClassSpecification';


export default {
  components: {
    Loader,
    ProductClassSpecification
  },
  props:{
    productClassDetails:{
      type:Object
    },
    accountId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      showProductSpec: false
    }
  },
  watch: {

  },
  methods: {
    showProductSpecifications(){
      this.showProductSpec = true;
    }
  },
  mounted() {

  }
}
</script>


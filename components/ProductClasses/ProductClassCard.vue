<template>
  <div class="card border-0">
    <div class="card-body">

      <div class="row">
        <div class="col">
            <h5 class="card-title text-uppercase text-muted mb-0">{{ $t('product_class') }}</h5>
            <div v-if="productClassDetails">
              <h2 class="mb-0"><i class="lnir" :class="productClassDetails.product_class.name_translation_key == 'product_class_premium' ? 'lnir-crown' : 'lnir-star'"></i> {{ $t(productClassDetails.product_class.name_translation_key) }}</h2>
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

            <a class="dropdown-item" href="#">{{$t('product_class_specs')}}</a>
          </base-dropdown>
        </div>
      </div>
      <div class="mt-2 mb-0 text-sm text-center">
        <div class="display-2 d-flex align-items-center justify-content-center">5 € <span class="text-sm ml-2">/ {{ $t(productClassDetails.payment_period) }}</span></div>
        <div>{{$t('next_billing_date')}}: {{ $d(new Date(productClassDetails.next_billing_date),'narrow') }}</div>
      </div>
    </div>

  </div>
</template>
<script>
import Loader from "../common/Loader/Loader";

export default {
  components: {
    Loader
  },
  props:{
    productClassDetails:{
      type:Object
    }
  },
  data() {
    return {
    }
  },
  watch: {

  },
  methods: {

  },
  mounted() {

  }
}
</script>


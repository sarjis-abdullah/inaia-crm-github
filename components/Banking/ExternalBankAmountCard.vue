<template>
    <div class="card border-0">
      <div class="card-body">
        <div class="row">
          <div class="col">
            <div class="media">
              <img src="/img/icons/cards/mastercard.png" alt="" class="avatar avatar-lg bg-white shadow rounded-circle mr-3" />
              <div class="media-body">
                <h5 class="card-title text-uppercase text-muted mb-0">Volksbank Böblingen</h5>
                <span class="h2 font-weight-bold mb-0 text-nowrap">0,00 €</span>
              </div>
            </div>
          </div>
          <div class="col-auto">
            <base-dropdown title-classes="btn btn-sm btn-link mr-0"
                           menu-on-right
                           :has-toggle="false">

              <template slot="title">
                <i class="fas fa-ellipsis-v"></i>
              </template>

              <a class="dropdown-item" href="#">{{$t('refresh_data')}}</a>
            </base-dropdown>
          </div>
        </div>
        <div class="mt-3 mb-0 text-sm">IBAN:
          <span class="text-nowrap iban">DE12 3456 7890 1234 5678</span>
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
  data() {
    return {
    }
  },
  methods: {
  },
  mounted() {
  }
}
</script>


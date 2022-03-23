<template>
  <div>

    <base-header class="pb-5">
      <div class="row align-items-center py-4">

        <div class="col-lg-6 col-7">

          <h6 class="h2 text-white d-inline-block mb-0">{{$t('customer') + ' '+$t('number_short') + ' ' + getAccountNumber }}</h6>

        </div>
        <div class="col-lg-6 col-5 text-right">
          <base-button size="sm" type="neutral" @click.prevent="() => $router.push('/customers/edit/'+info.id)">Edit Profile</base-button>
        </div>

      </div>
    </base-header>

    <div class="container-fluid mt--5">

      <div class="row">
        <div class="col-lg-8">

          <user-card :resource="resource"></user-card>

        </div>

        <div class="col-lg-4">

          <card class="border-0">
            <div class="row">
              <div class="col">
                <div class="media align-items-center">
                  <img src="/img/icons/cards/mastercard.png" alt="" class="avatar avatar-lg bg-white shadow rounded-circle mr-3">
                  <div class="media-body">
                    <h5 class="card-title text-uppercase text-muted mb-0">PPS Account</h5>
                    <span class="h2 font-weight-bold mb-0">2.452,44 €</span>
                  </div>
                </div>
              </div>
              <div class="col-auto">

                <base-dropdown title-classes="btn btn-sm btn-neutral mr-0"
                               menu-on-right
                               :has-toggle="false">

                  <template slot="title">
                    <i class="fas fa-ellipsis-h"></i>
                  </template>

                  <a class="dropdown-item" href="#">{{$t('make_payment')}}</a>
                  <a class="dropdown-item" href="#">{{$t('details')}}</a>
                </base-dropdown>

              </div>
            </div>
            <div class="mt-3 mb-0 text-sm">
              IBAN: <span class="text-nowrap iban">BE11 1111 1111 1111 1111</span>
            </div>
          </card>

        </div>

      </div>

      <depot-list :accountId="getAccoundId"></depot-list>




      <div>- Account settings (language, allow_marketing, privacy)</div>
      <div>- Products and specs</div>
      <div>- Money account</div>
      <div>- Cards</div>
      <div>- Depots</div>
      <div>- Orders</div>



    </div>

  </div>
</template>

<script>
import { mapGetters } from "vuex"
import Form from "@/components/Contacts/Form";
import UserCard from "@/components/Contacts/UserCard";
import Products from '@/components/Contacts/Products';
import DepotList from "@/components/Depots/List";

export default {
    components: {
        Form,
        UserCard,
        Products,
        DepotList
    },
    props: {
        resource: {
            type: Object
        }
    },
    computed: {
        ...mapGetters({
            types: "types/pairs"
        }),
        info() {
            console.log('resource', this.resource)
            return this.resource && this.resource.customer;
        },
        getType() {
            if (this.types && this.info.account) {
                return Object.keys(this.types).find( k => this.types[k] == this.info.account.type_id )
            }
            return null
        },
        getAccountNumber() {
          if (this.info.account) return this.info.account.account_number;
          else return false;
        },
        getAccoundId() {
          if (this.info.account) return this.info.account.id;
          else return false;
        }

    },

}
</script>

<style scoped>
.capitalize {
    text-transform: capitalize
}
</style>

<template>
    <vs-row vs-justify="center">
        <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12">
            <vs-card>
                <img
                    :src="require('@/assets/images/users/1.jpg')"
                    alt="user"
                    class="rounded-circle"
                    width="100"
                />
                <h4 class="card-title mt-3 mb-0">{{ getName() }}</h4>
                <h5 class="text-muted capitalize">{{ getType() }}</h5>
                <div class="mt-3 pt-3">
                    <address class="mb-0" v-if="contact.address">
                        {{ getAddress() }}
                    </address>
                    <address class="mb-0" v-if="getChannelInfo('mobile')">
                        <br />
                        <i class="mdi mdi-cellphone-iphone mr-2"></i>
                        {{ getChannelInfo('mobile') }}
                    </address>
                    <address class="mb-0" v-if="getChannelInfo('email')">
                        <br />
                        <i class="mdi mdi-email mr-2"></i>
                        {{ getChannelInfo('email') }}
                    </address>
                </div>
            </vs-card>
        </vs-col>
    </vs-row>
</template>

<script>
import { mapGetters } from "vuex"

export default {
    props: {
        contact: {
            type: Object
        }
    },
    computed: {
        ...mapGetters({
            types: "types/types"
        }),
    },
    methods: {
        getName() {
            return this.contact.name + (this.contact.person_data ? ' ' + this.contact.person_data.surname : '')
        },
        getType() {
            if (this.types && this.contact.account) {
                return Object.keys(this.types).find( k => this.types[k] == this.contact.account.type_id )
            }
            return null
        },
        getAddress() {
            return this.contact.address ?
                    this.contact.address.line1 + (this.contact.address.line2 ? ' ' + this.contact.address.line2 : '') +
                    (this.contact.address.city ? ', ' + this.contact.address.city : '') +
                    (this.contact.address.region ? ', ' + this.contact.address.region : '') +
                    (this.contact.address.postal_code ? ', ' + this.contact.address.postal_code : '')
                : ''
        },
        getChannelInfo(type) {
            let channel = this.contact.channels && this.contact.channels.length && this.contact.channels.find( c => c.type.value == type )
            if (channel) {
                return channel.value
            }
            return null
        },
    }
}
</script>

<style scoped>
.capitalize {
    text-transform: capitalize
}
</style>
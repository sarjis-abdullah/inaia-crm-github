<template>
    <div class="card">
        <img
            :src="require('@/static/img/theme/unknown.jpg')"
            alt="user"
            class="rounded-circle"
            width="100"
        />
        <h4 class="card-title mt-3 mb-0">{{ getName() }}</h4>
        <h5 class="text-muted capitalize">{{ getType() }}</h5>
        <div class="mt-3 pt-3">
            <address class="mb-0" v-if="resource.address">
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
    </div>
</template>

<script>
import { mapGetters } from "vuex"
import { getFormattedAddress } from "../../helpers/address"

export default {
    props: {
        resource: {
            type: Object
        }
    },
    computed: {
        ...mapGetters({
            types: "types/pairs"
        }),
    },
    methods: {
        getName() {
            return this.resource.name + (this.resource.person_data ? ' ' + this.resource.person_data.surname : '')
        },
        getType() {
            if (this.types && this.resource) {
                return Object.keys(this.types).find( k => this.types[k] == this.resource.type_id )
            }
            return null
        },
        getAddress() {
            return getFormattedAddress(this.resource.address)
        },
        getChannelInfo(type) {
            let channel = this.resource.channels && this.resource.channels.length && this.resource.channels.find( c => c.type.value == type )
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

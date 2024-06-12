<template>
    <div>

        <div class="row">
            <div class="col">
                <date-picker size="large" class="filterElement" v-model="startDate" type="date"
                    :placeholder="$t('select_start_date_placeholder')">
                </date-picker>
            </div>
            <div class="col">
                <date-picker class="filterElement" v-model="endDate" type="date"
                    :placeholder="$t('select_end_date_placeholder')">
                </date-picker>
            </div>

        </div>
        <div class="mt-3 float-right row">
            <base-button type="link" class="ml-auto" @click="cancel()">
                {{ $t('cancel') }}
            </base-button>
            <base-button type="primary" @click="() => download()" :disabled="isSubmitting || (!endDate || !startDate)">
                {{ $t('download') }}
            </base-button>
        </div>
    </div>
</template>
<script>
import { DatePicker } from "element-ui";
import { formatDateToApiFormat } from "../../helpers/helpers";
import { apiErrorHandler } from "../../helpers/apiErrorHandler";
export default {
    props: {
        depot: {
            type: Object,
            default: null
        },

    },
    components: {
        DatePicker
    },
    data: function () {
        return {
            startDate: null,
            endDate: null,
            isSubmitting: false
        }
    },
    methods: {
        cancel() {
            this.$emit('canceled')
        },
        download() {
            this.isSubmitting = true;
            const sDate = formatDateToApiFormat(this.startDate);
            const eDate = formatDateToApiFormat(this.endDate);
            this.$store.dispatch('depots/downloadStatement', { depotId: this.depot.id, startDate: sDate, endDate: eDate }).then(res => {
                const url = window.URL.createObjectURL(new Blob([res]));
                const link = document.createElement('a');
                link.href = url;
                let date = new Date();
                const fileName =
                    this.depot.name + '_' + sDate + '_' + eDate + '_' +
                    Math.floor(date.getTime() + date.getSeconds() / 2) +
                    '.pdf';
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
            }).catch(err => apiErrorHandler(err, this.$notify))
                .finally(() => {
                    this.isSubmitting = false;
                })
        }
    }
}
</script>
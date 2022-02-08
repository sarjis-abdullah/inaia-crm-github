<template>
    <div class="d-flex justify-content-start justify-content-md-end mt-2 mt-sm-0">
        <div class="btn-group btn-group-toggle btn-group" data-toggle="buttons">
            <label class="btn" v-if="showOneDay" :class="{ active: timeline === 'one_day' }" @click.prevent="updateTimeline('one_day')">
                <input type="radio" name="type" value="one_day" autocomplete="off"><span class="d-lg-none">{{ $t('day_short') }}</span><span class="d-none d-lg-inline">{{ $t('day') }}</span>
            </label>
            <label class="btn btn-secondary" :class="{ active: timeline === 'one_week' }" @click.prevent="updateTimeline('one_week')">
                <input type="radio" name="type" value="one_week" autocomplete="off"><span class="d-lg-none">{{ $t('week_short') }}</span><span class="d-none d-lg-inline">{{ $t('week') }}</span>
            </label>
            <label class="btn btn-secondary" :class="{ active: timeline === 'one_month' }" @click.prevent="updateTimeline('one_month')">
                <input type="radio" name="type" value="one_month" autocomplete="off"><span class="d-lg-none">{{ $t('month_short') }}</span><span class="d-none d-lg-inline">{{ $t('month') }}</span>
            </label>
            <label class="btn btn-secondary" :class="{ active: timeline === 'one_year' }" @click.prevent="updateTimeline('one_year')">
                <input type="radio" name="type" value="one_year" autocomplete="off"><span class="d-lg-none">{{ $t('year_short') }}</span><span class="d-none d-lg-inline">{{ $t('year') }}</span>
            </label>
            <label class="btn btn-secondary" :class="{ active: timeline === 'all' }" @click.prevent="updateTimeline('all')">
                <input type="radio" name="type" value="all" autocomplete="off"><span class="d-lg-none">*</span><span class="d-none d-lg-inline">{{ $t('max') }}</span>
            </label>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showOneDay: !process.env.quandlApiOn,
            timeline: 'one_month',
            list: {
                one_day: 'day',
                one_week: 'week',
                one_month: 'month',
                one_year: 'year',
                ytd: 'ytd',
                all: 'all'
            }            
        }
    },
    mounted() {
        this.$emit('update-timeline', this.timeline);
        this.fetchTimelineData()
    },
    methods: {

        updateTimeline(timeline) {
            this.$emit('update-timeline', timeline);
            this.timeline = timeline;
            this.fetchTimelineData();
        },

        async fetchTimelineData() {
            let balanceHistory = null, prices = null, payload = {"type": this.list[this.timeline]}
            prices  = await this.$store.dispatch('gold/prices', payload)
                .then(res => {
                    // console.error('price-history', res)
                    this.$emit('update-timeline-data', res);
                })
        }
    }
}
</script>
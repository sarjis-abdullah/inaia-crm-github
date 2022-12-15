<template>
    <div class="d-flex justify-content-end mt-0">
        <div class="btn-group btn-group-sm btn-group-toggle btn-group" data-toggle="buttons">
            <label class="btn" v-if="showOneDay" :class="{ active: timeline === 'one_day' }" @click.prevent="updateTimeline('one_day')">
                <input type="radio" name="type" value="one_day" autocomplete="off">{{ $t('day') }}
            </label>
            <!--
            <label class="btn btn-secondary" :class="{ active: timeline === 'one_week' }" @click.prevent="updateTimeline('one_week')">
                <input type="radio" name="type" value="one_week" autocomplete="off"><span class="d-lg-none">{{ $t('week_short') }}</span><span class="d-none d-lg-inline">{{ $t('week') }}</span>
            </label>
            -->
            <label class="btn btn-secondary" :class="{ active: timeline === 'one_month' }" @click.prevent="updateTimeline('one_month')">
                <input type="radio" name="type" value="one_month" autocomplete="off">{{ $t('month') }}
            </label>
            <label class="btn btn-secondary" :class="{ active: timeline === 'one_year' }" @click.prevent="updateTimeline('one_year')">
                <input type="radio" name="type" value="one_year" autocomplete="off">{{ $t('year') }}
            </label>
            <label class="btn btn-secondary" :class="{ active: timeline === 'all' }" @click.prevent="updateTimeline('all')">
                <input type="radio" name="type" value="all" autocomplete="off">{{ $t('max') }}
            </label>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        assetType:{
            type:String,
            default:'gold'
        }
    },
    data() {
        return {
            showOneDay: !process.env.quandlApiOn,
            timeline: 'one_year',
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
            console.log(this.assetType);
            let balanceHistory = null, prices = null, payload = {"type": this.list[this.timeline]};
            let action = 'gold/prices';
            if(this.assetType == 'silver')
            {
                action = 'silver/prices';
            }
            prices  = await this.$store.dispatch(action, payload)
                .then(res => {
                    // console.error('price-history', res)
                    this.$emit('update-timeline-data', res);
                })
        }
    }
}
</script>

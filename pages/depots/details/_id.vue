<template>
  <div>
    <Details v-if="depotData" :resource="depotData" />
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import Details from "@/components/Depots/Details"

export default {
  layout: 'DashboardLayout',
  props: {
    showViewPage: {
      type: Boolean
    }
  },
  data() {
    return {
      depotId: this.$route.params.id
    }
  },
  components: {
    Details
  },
  computed: {
    ...mapGetters({
      depotData: "depots/details",
    })
  },
  watch: {
    depotId: {
      handler() {
        if (this.depotId) {
          this.initData()
          console.log(this.depotData);
        }
      },
      immediate: true
    },
  },
  methods: {
    initData() {
      this.$store.dispatch("depots/details", this.depotId)
    },
  }
}
</script>

<template>
  <div class="text-center">
    <form-wizard
      @on-complete="onComplete"
      color="rgba(var(--vs-primary), 1)"
      :title="null"
      :subtitle="null"
    >
      <tab-content title="Personal details" icon="ti-user">
        <span class="font-weight-bold">My first tab content</span>
      </tab-content>
      <tab-content title="Reuirements" icon="ti-settings">
        <span class="font-weight-bold">My second tab content</span>
      </tab-content>
      <tab-content title="Last step" icon="ti-check">
        <span class="font-weight-bold">Yuhuuu! This seems pretty damn simple</span>
      </tab-content>
      <vs-button color="dark" slot="prev">
        <i class="mdi mdi-chevron-left mr-1"></i>
        Back
      </vs-button>
      <vs-button color="primary" slot="next">
        Next
        <i class="mdi mdi-chevron-right ml-1"></i>
      </vs-button>
      <vs-button color="success" slot="finish">
        Finish
        <i class="mdi mdi-bookmark-check ml-1"></i>
      </vs-button>
    </form-wizard>
  </div>
</template>

<script>
import { FormWizard, TabContent } from "vue-form-wizard";
import "vue-form-wizard/dist/vue-form-wizard.min.css";

export default {
  name: "FormWizardButtonSlot",
  data: () => ({
    title: "FormWizardButtonSlot"
  }),
  components: {
    FormWizard,
    TabContent
  },
  methods: {
    onComplete: function() {
      alert("Yay. Done!");
    }
  }
};
</script>
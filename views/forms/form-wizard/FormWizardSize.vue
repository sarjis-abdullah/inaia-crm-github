<template>
  <div class="text-center">
    <span class="badge badge-pill badge-info text-white px-3 py-2">Size with xs</span>
    <form-wizard
      @on-complete="onComplete"
      color="rgba(var(--vs-primary), 1)"
      :title="null"
      :subtitle="null"
      step-size="xs"
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
    </form-wizard>
    <hr class="custom-hr" />
    <span class="badge badge-pill badge-info text-white px-3 py-2">Size with sm</span>
    <form-wizard
      @on-complete="onComplete"
      color="rgba(var(--vs-primary), 1)"
      :title="null"
      :subtitle="null"
      step-size="sm"
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
    </form-wizard>
    <hr class="custom-hr" />
    <span class="badge badge-pill badge-info text-white px-3 py-2">Size with md</span>
    <form-wizard
      @on-complete="onComplete"
      color="rgba(var(--vs-primary), 1)"
      :title="null"
      :subtitle="null"
      step-size="md"
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
    </form-wizard>
    <hr class="custom-hr" />
    <span class="badge badge-pill badge-info text-white px-3 py-2">Size with lg</span>
    <form-wizard
      @on-complete="onComplete"
      color="rgba(var(--vs-primary), 1)"
      :title="null"
      :subtitle="null"
      step-size="lg"
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
    </form-wizard>
  </div>
</template>

<script>
import { FormWizard, TabContent } from "vue-form-wizard";
import "vue-form-wizard/dist/vue-form-wizard.min.css";

export default {
  name: "FormWizardSize",
  data: () => ({
    title: "FormWizardSize"
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
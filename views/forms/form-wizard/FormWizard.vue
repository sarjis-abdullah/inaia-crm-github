<template>
  <vs-row>
    <!-- ////////// 
          Card 1 
    /////////////-->
    <vs-col vs-lg="12" vs-xs="12" vs-sm="12">
      <vs-card>
        <h3 class="card-title">Default Form Wizard</h3>
        <p class="text-muted">
          vue-form-wizard is a vue based component with no external depenendcies which simplifies tab wizard management and for more details click
          <a
            href="https://www.npmjs.com/package/vue-form-wizard"
            target="_blank"
          >here.</a>
        </p>
        <FormWizardIcon></FormWizardIcon>
      </vs-card>
    </vs-col>
    <!-- ////////// 
          Card 2 
    /////////////-->
    <vs-col vs-lg="12" vs-xs="12" vs-sm="12">
      <vs-card>
        <h3 class="card-title">Form Wizard with Square</h3>
        <FormWizardSquare></FormWizardSquare>
      </vs-card>
    </vs-col>
    <!-- ////////// 
          Card 3 
    /////////////-->
    <vs-col vs-lg="12" vs-xs="12" vs-sm="12">
      <vs-card>
        <h3 class="card-title">Form Wizard with Tab</h3>
        <FormWizardTab></FormWizardTab>
      </vs-card>
    </vs-col>
    <!-- ////////// 
          Card 4 
    /////////////-->
    <vs-col vs-lg="12" vs-xs="12" vs-sm="12">
      <vs-card>
        <h3 class="card-title">Form Wizard with Size</h3>
        <FormWizardSize></FormWizardSize>
      </vs-card>
    </vs-col>
    <!-- ////////// 
          Card 5 
    /////////////-->
    <vs-col vs-lg="12" vs-xs="12" vs-sm="12">
      <vs-card>
        <h3 class="card-title">Form Wizard with Step Index</h3>
        <FormWizardIndex></FormWizardIndex>
      </vs-card>
    </vs-col>
    <!-- ////////// 
          Card 6 
    /////////////-->
    <vs-col vs-lg="12" vs-xs="12" vs-sm="12">
      <vs-card>
        <h3 class="card-title">Form Wizard with Custom Text</h3>
        <FormWizardCustomText></FormWizardCustomText>
      </vs-card>
    </vs-col>
    <!-- ////////// 
          Card 7 
    /////////////-->
    <vs-col vs-lg="12" vs-xs="12" vs-sm="12">
      <vs-card>
        <h3 class="card-title">Form Wizard with Title Slot</h3>
        <FormWizardTitleSlot></FormWizardTitleSlot>
      </vs-card>
    </vs-col>
    <!-- ////////// 
          Card 8 
    /////////////-->
    <vs-col vs-lg="12" vs-xs="12" vs-sm="12">
      <vs-card>
        <h3 class="card-title">Form Wizard with Button Slot</h3>
        <FormWizardButtonSlot></FormWizardButtonSlot>
      </vs-card>
    </vs-col>
    <!-- ////////// 
          Card 9
    /////////////-->
    <vs-col vs-lg="12" vs-xs="12" vs-sm="12">
      <vs-card>
        <h3 class="card-title">Form Wizard with Call funtion before switch</h3>
        <FormWizardCallFun></FormWizardCallFun>
      </vs-card>
    </vs-col>
    <!-- ////////// 
          Card 10
    /////////////-->
    <vs-col vs-lg="12" vs-xs="12" vs-sm="12">
      <vs-card>
        <h3 class="card-title">Form Wizard with Validation</h3>
        <FormWizardValidation></FormWizardValidation>
      </vs-card>
    </vs-col>
  </vs-row>
</template>

<script>
import FormWizardIcon from "./FormWizardIcon";
import FormWizardSquare from "./FormWizardSquare";
import FormWizardTab from "./FormWizardTab";
import FormWizardSize from "./FormWizardSize";
import FormWizardIndex from "./FormWizardIndex";
import FormWizardCustomText from "./FormWizardCustomText";
import FormWizardTitleSlot from "./FormWizardTitleSlot";
import FormWizardButtonSlot from "./FormWizardButtonSlot";
import FormWizardCallFun from "./FormWizardCallFun";
import FormWizardValidation from "./form-wizard-validation/FormWizardValidation";

export default {
  name: "FormWizard",
  data: () => ({
    title: "FormWizard"
  }),
  components: {
    FormWizardIcon,
    FormWizardSquare,
    FormWizardTab,
    FormWizardSize,
    FormWizardIndex,
    FormWizardCustomText,
    FormWizardTitleSlot,
    FormWizardButtonSlot,
    FormWizardCallFun,
    FormWizardValidation
  }
};
</script>
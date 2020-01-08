<template>
  <div>
    <form-wizard
      @on-complete="onComplete"
      color="rgba(var(--vs-primary), 1)"
      :title="null"
      :subtitle="null"
      shape="square"
      stepSize="sm"
    >
      <tab-content title="Personal details" icon="ti-user">
        <vs-row>
          <vs-col vs-lg="6" vs-xs="12" vs-sm="6">
            <vs-row class="mt-4">
              <vs-col
                vs-lg="3"
                vs-xs="12"
                vs-sm="4"
                class="d-flex align-items-center justify-content-start justify-content-md-end"
              >
                <label class="vs-input--label mb-0">First Name :</label>
              </vs-col>
              <vs-col vs-lg="9" vs-xs="12" vs-sm="8">
                <vs-input class="inputx w-100" placeholder="First Name Here" v-model="project1" />
              </vs-col>
            </vs-row>
            <vs-row class="mt-4">
              <vs-col
                vs-lg="3"
                vs-xs="12"
                vs-sm="4"
                class="d-flex align-items-center justify-content-start justify-content-md-end"
              >
                <label class="vs-input--label mb-0">Last Name :</label>
              </vs-col>
              <vs-col vs-lg="9" vs-xs="12" vs-sm="8">
                <vs-input class="inputx w-100" placeholder="Last Name Here" v-model="project2" />
              </vs-col>
            </vs-row>
          </vs-col>
          <vs-col vs-lg="6" vs-xs="12" vs-sm="6">
            <vs-row class="mt-4">
              <vs-col
                vs-lg="3"
                vs-xs="12"
                vs-sm="4"
                class="d-flex align-items-center justify-content-start justify-content-md-end"
              >
                <label class="vs-input--label mb-0">Email :</label>
              </vs-col>
              <vs-col vs-lg="9" vs-xs="12" vs-sm="8">
                <vs-input
                  type="email"
                  class="inputx w-100"
                  placeholder="Email Here"
                  v-model="project3"
                />
              </vs-col>
            </vs-row>
            <vs-row class="mt-4">
              <vs-col
                vs-lg="3"
                vs-xs="12"
                vs-sm="4"
                class="d-flex align-items-center justify-content-start justify-content-md-end"
              >
                <label class="vs-input--label mb-0">Contact No :</label>
              </vs-col>
              <vs-col vs-lg="9" vs-xs="12" vs-sm="8">
                <vs-input
                  type="tel"
                  class="inputx w-100"
                  placeholder="Contact No Here"
                  v-model="project4"
                />
              </vs-col>
            </vs-row>
          </vs-col>
        </vs-row>
      </tab-content>
      <tab-content title="Reuirements" icon="ti-settings">
        <vs-row>
          <vs-col vs-lg="6" vs-xs="12" vs-sm="6">
            <vs-row class="mt-4">
              <vs-col
                vs-lg="3"
                vs-xs="12"
                vs-sm="4"
                class="d-flex align-items-center justify-content-start justify-content-md-end"
              >
                <label class="vs-input--label mb-0">Company :</label>
              </vs-col>
              <vs-col vs-lg="9" vs-xs="12" vs-sm="8">
                <vs-input class="inputx w-100" placeholder="Company Name Here" v-model="project5" />
              </vs-col>
            </vs-row>
            <vs-row class="mt-4">
              <vs-col
                vs-lg="3"
                vs-xs="12"
                vs-sm="4"
                class="d-flex align-items-center justify-content-start justify-content-md-end"
              >
                <label class="vs-input--label mb-0">Interested In :</label>
              </vs-col>
              <vs-col vs-lg="9" vs-xs="12" vs-sm="8">
                <vs-select class="w-100" v-model="projectselect6">
                  <vs-select-item
                    :key="index"
                    :value="item.value"
                    :text="item.text"
                    v-for="(item,index) in projectoptions6"
                  />
                </vs-select>
              </vs-col>
            </vs-row>
          </vs-col>
          <vs-col vs-lg="6" vs-xs="12" vs-sm="6">
            <vs-row class="mt-4">
              <vs-col
                vs-lg="3"
                vs-xs="12"
                vs-sm="4"
                class="d-flex align-items-center justify-content-start justify-content-md-end"
              >
                <label class="vs-input--label mb-0">Budget :</label>
              </vs-col>
              <vs-col vs-lg="9" vs-xs="12" vs-sm="8">
                <vs-select class="w-100" v-model="projectselect7">
                  <vs-select-item
                    :key="index"
                    :value="item.value"
                    :text="item.text"
                    v-for="(item,index) in projectoptions7"
                  />
                </vs-select>
              </vs-col>
            </vs-row>
            <vs-row class="mt-4">
              <vs-col
                vs-lg="3"
                vs-xs="12"
                vs-sm="4"
                class="d-flex align-items-center justify-content-start justify-content-md-end"
              >
                <label class="vs-input--label mb-0">About Project :</label>
              </vs-col>
              <vs-col vs-lg="9" vs-xs="12" vs-sm="8">
                <vs-input class="inputx w-100" placeholder="About Project Here" v-model="project8" />
              </vs-col>
            </vs-row>
          </vs-col>
        </vs-row>
      </tab-content>
      <tab-content title="Last step" icon="ti-check">
        <vs-row class="mt-4">
          <vs-col vs-lg="2" vs-xs="12" vs-sm="4" class>
            <label class="vs-input--label mb-0">Total Experience :</label>
          </vs-col>
          <vs-col vs-lg="9" vs-xs="12" vs-sm="8">
            <div class="d-block float-left mt-1">
              <vs-radio v-model="event6" vs-name="event6" vs-value="1">1 year</vs-radio>
              <vs-radio v-model="event6" vs-name="event6" vs-value="2">2 year</vs-radio>
              <vs-radio v-model="event6" vs-name="event6" vs-value="3">3 year</vs-radio>
              <vs-radio v-model="event6" vs-name="event6" vs-value="4">4 year</vs-radio>
              <vs-radio v-model="event6" vs-name="event6" vs-value="5">5 year</vs-radio>
            </div>
          </vs-col>
        </vs-row>
      </tab-content>
    </form-wizard>
  </div>
</template>

<script>
import { FormWizard, TabContent } from "vue-form-wizard";
import "vue-form-wizard/dist/vue-form-wizard.min.css";

export default {
  name: "FormWizardSquare",
  data: () => ({
    title: "FormWizardSquare",
    project1: "",
    project2: "",
    project3: "",
    project4: "",
    project5: "",
    projectselect6: 0,
    projectoptions6: [
      { text: "Choose Your option", value: 0 },
      { text: "Designing", value: 1 },
      { text: "Development", value: 2 }
    ],
    projectselect7: 0,
    projectoptions7: [
      { text: "Choose Your option", value: 0 },
      { text: "Less than $5000", value: 1 },
      { text: "$5000 to $10000", value: 2 }
    ],
    project8: "",
    event6: ""
  }),
  methods: {
    onComplete: function() {
      alert("Yay. Done!");
    }
  },
  components: {
    FormWizard,
    TabContent
  }
};
</script>
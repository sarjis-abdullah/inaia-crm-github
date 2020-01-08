<template>
  <div>
    <vs-row vs-justify="center">
      <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12" vs-sm="12">
        <!--
          /////////////////
          Default Datepicker
          /////////////////
        -->
        <vs-card>
          <h3 class="card-title d-flex">Default Datepicker</h3>
          <p class="text-muted">
            A simple Vue.js datepicker component. Supports disabling of dates, inline mode, translations. For Customization read documentation from
            <a
              href="https://github.com/charliekassel/vuejs-datepicker"
              target="_blank"
            >here</a>.
          </p>
          <p class="card-subtitle"></p>
          <datepicker placeholder="Select Date"></datepicker>
        </vs-card>
      </vs-col>
      <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12" vs-sm="12">
        <!--
          /////////////////
          v-model datepicker
          /////////////////
        -->
        <vs-card>
          <h3 class="card-title d-flex">v-model datepicker</h3>
          <p class="card-subtitle"></p>
          <datepicker placeholder="Select Date" v-model="vModelExample"></datepicker>
          <p
            class="p-3 shadow mt-4 font-weight-bold border-bottom border-primary"
          >{{ vModelExample }}</p>
        </vs-card>
      </vs-col>

      <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12" vs-sm="12">
        <!--
          /////////////////
          Format datepicker
          /////////////////
        -->
        <vs-card>
          <h3 class="card-title d-flex">Format datepicker</h3>
          <p class="card-subtitle"></p>
          <datepicker :format="format"></datepicker>
          <div class="p-3 shadow mt-4 border-bottom border-primary">
            <h5 class="mb-3">Settings</h5>
            <div class="form-group">
              <label>Format</label>
              <select v-model="format">
                <option value="d MMM yyyy" selected>d MMM yyyy - e.g 12 Feb 2016</option>
                <option value="d MMMM yyyy">d MMMM yyyy - e.g 12 February 2016</option>
                <option value="yyyy-MM-dd">yyyy-MM-dd - e.g 2016-02-12</option>
                <option value="dsu MMM yyyy">dsu MMM yyyy - e.g 12th Feb 2016</option>
                <option value="D dsu MMM yyyy">D dsu MMM yyyy - e.g Sat 12th Feb 2016</option>
              </select>
            </div>
          </div>
        </vs-card>
      </vs-col>

      <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12" vs-sm="12">
        <!--
          /////////////////
          With minimum and maximum date range
          /////////////////
        -->
        <vs-card>
          <h3 class="card-title d-flex">With minimum and maximum date range</h3>
          <p class="card-subtitle"></p>
          <datepicker :disabledDates="disabledDates"></datepicker>
          <div class="p-3 shadow mt-4 border-bottom border-primary">
            <h5 class="mb-3">Settings</h5>
            <div class="form-group">
              <label>Disabled to:</label>
              <datepicker v-on:selected="disableTo"></datepicker>
            </div>
            <div class="form-group">
              <label>Disabled from:</label>
              <datepicker v-on:selected="disableFrom"></datepicker>
            </div>
            <div class="form-group">
              <label>Disabled Days of Month:</label>
              <input type="text" value v-on:change="setDisabledDays" />
            </div>
            <pre class="bg-light font-weight-bold border border-primary p-3">disabledDates: {{ disabledDates }}</pre>

            <h5>Resulting Date picker</h5>
            <datepicker :disabledDates="disabledDates"></datepicker>
          </div>
        </vs-card>
      </vs-col>

      <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12" vs-sm="12">
        <!--
          /////////////////
          Settings
          /////////////////
        -->
        <vs-card>
          <h3 class="card-title d-flex">Settings</h3>
          <p class="card-subtitle"></p>
          <div class="p-3 shadow mt-4 border-bottom border-primary">
            <div class="form-group">
              <label>Disabled Function:</label>
            </div>
            <h5>Resulting Date picker</h5>
            <datepicker :disabledDates="disabledFn"></datepicker>
          </div>
        </vs-card>
      </vs-col>

      <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12" vs-sm="12">
        <!--
          /////////////////
          Highlighting Dates Matching Given Function
          /////////////////
        -->
        <vs-card>
          <h3 class="card-title d-flex">Highlighting Dates Matching Given Function</h3>
          <p class="card-subtitle"></p>
          <datepicker :disabledDates="disabledDates"></datepicker>
          <div class="p-3 shadow mt-4 border-bottom border-primary">
            <h5 class="mb-3">Resulting Date picker</h5>
            <datepicker :highlighted="highlightedFn"></datepicker>
          </div>
        </vs-card>
      </vs-col>

      <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12" vs-sm="12">
        <!--
          /////////////////
          Highlighting Dates
          /////////////////
        -->
        <vs-card>
          <h3 class="card-title d-flex">Highlighting Dates</h3>
          <p class="card-subtitle"></p>
          <div class="p-3 shadow mt-4 border-bottom border-primary">
            <h5 class="mb-3">Settings</h5>
            <div class="form-group mt-3">
              <label>Highlight from:</label>
              <datepicker v-on:selected="highlightFrom"></datepicker>
            </div>
            <div class="form-group">
              <label>Highlight to:</label>
              <datepicker v-on:selected="highlightTo"></datepicker>
            </div>
            <div class="form-group">
              <label>Highlight Days of Month:</label>
              <input type="text" value v-on:change="setHighlightedDays" />
            </div>
            <pre class="bg-light font-weight-bold border border-primary p-3">highlighted: {{ highlighted }}</pre>

            <h5>Resulting Date picker</h5>
            <datepicker :highlighted="highlighted"></datepicker>
          </div>
        </vs-card>
      </vs-col>

      <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12" vs-sm="12">
        <!--
          /////////////////
          Translations
          /////////////////
        -->
        <vs-card>
          <h3 class="card-title d-flex">Translations</h3>
          <h5 class="mb-3">{{ languages[language].language }} datepicker</h5>

          <datepicker :language="languages[language]" format="d MMMM yyyy"></datepicker>
          <div class="p-3 shadow mt-4 border-bottom border-primary">
            <h5 class="mb-3">Settings</h5>
            <select v-model="language">
              <option
                :value="key"
                v-for="(language, key) in languages"
                :key="key"
              >{{ language.language }}</option>
            </select>
          </div>
        </vs-card>
      </vs-col>

      <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12" vs-sm="12">
        <!--
          /////////////////
          Inline datepicker
          /////////////////
        -->
        <vs-card>
          <h3 class="card-title d-flex">Inline datepicker</h3>
          <datepicker :inline="true"></datepicker>
        </vs-card>
      </vs-col>

      <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12" vs-sm="12">
        <!--
          /////////////////
          RTL datepicker
          /////////////////
        -->
        <vs-card>
          <h3 class="card-title d-flex">RTL datepicker</h3>
          <p class="card-subtitle"></p>
          <datepicker :language="languages.he"></datepicker>
        </vs-card>
      </vs-col>

      <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12" vs-sm="12">
        <!--
          /////////////////
          Day view only
          /////////////////
        -->
        <vs-card>
          <h3 class="card-title d-flex">Day view only</h3>
          <p class="card-subtitle"></p>
          <h3></h3>
          <datepicker :minimumView="'day'" :maximumView="'day'"></datepicker>
        </vs-card>
      </vs-col>

      <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12" vs-sm="12">
        <!--
          /////////////////
          Day view only RTL
          /////////////////
        -->
        <vs-card>
          <h3 class="card-title d-flex">Day view only RTL</h3>
          <p class="card-subtitle"></p>
          <h3></h3>
          <datepicker :minimumView="'day'" :maximumView="'day'" :language="languages.he"></datepicker>
        </vs-card>
      </vs-col>

      <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12" vs-sm="12">
        <!--
          /////////////////
          Month view only
          /////////////////
        -->
        <vs-card>
          <h3 class="card-title d-flex">Month view only</h3>
          <p class="card-subtitle"></p>
          <h3></h3>
          <datepicker :minimumView="'month'" :maximumView="'month'"></datepicker>
        </vs-card>
      </vs-col>

      <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12" vs-sm="12">
        <!--
          /////////////////
          Day and month view only
          /////////////////
        -->
        <vs-card>
          <h3 class="card-title d-flex">Day and month view only</h3>
          <p class="card-subtitle"></p>
          <h3></h3>
          <datepicker :minimumView="'day'" :maximumView="'month'" :initialView="'month'"></datepicker>
        </vs-card>
      </vs-col>

      <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12" vs-sm="12">
        <!--
          /////////////////
          Year and month view only
          /////////////////
        -->
        <vs-card>
          <h3 class="card-title d-flex">Year and month view only</h3>
          <p class="card-subtitle"></p>
          <h3></h3>
          <datepicker :minimumView="'month'" :maximumView="'year'" :initialView="'year'"></datepicker>
        </vs-card>
      </vs-col>

      <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12" vs-sm="12">
        <!--
          /////////////////
          Open programatically
          /////////////////
        -->
        <vs-card>
          <h3 class="card-title d-flex">Open programatically</h3>
          <p class="card-subtitle"></p>
          <datepicker ref="programaticOpen"></datepicker>
          <vs-button color="primary" class="mt-3" @click="openPicker">Open Picker</vs-button>
        </vs-card>
      </vs-col>

      <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12" vs-sm="12">
        <!--
          /////////////////
          Changed month event
          /////////////////
        -->
        <vs-card>
          <h3 class="card-title d-flex">Changed month event</h3>
          <p class="card-subtitle"></p>
          <datepicker v-on:changedMonth="logChangedMonth"></datepicker>
          <p v-for="(log,index) in changedMonthLog" :key="index">{{ log }}</p>
        </vs-card>
      </vs-col>
    </vs-row>
  </div>
</template>

<script>
import Datepicker from "vuejs-datepicker/dist/vuejs-datepicker.esm.js";
import * as lang from "vuejs-datepicker/src/locale";

const state = {
  date1: new Date()
};

export default {
  name: "fomrdatepicker",
  components: {
    Datepicker
  },
  data() {
    return {
      format: "d MMMM yyyy",
      disabledDates: {},
      disabledFn: {
        customPredictor(date) {
          if (date.getDate() % 3 === 0) {
            return true;
          }
        }
      },
      highlightedFn: {
        customPredictor(date) {
          if (date.getDate() % 4 === 0) {
            return true;
          }
        }
      },
      highlighted: {},
      eventMsg: null,
      state: state,
      language: "en",
      languages: lang,
      vModelExample: null,
      changedMonthLog: []
    };
  },
  methods: {
    highlightTo(val) {
      if (typeof this.highlighted.to === "undefined") {
        this.highlighted = {
          to: null,
          daysOfMonth: this.highlighted.daysOfMonth,
          from: this.highlighted.from
        };
      }
      this.highlighted.to = val;
    },
    highlightFrom(val) {
      if (typeof this.highlighted.from === "undefined") {
        this.highlighted = {
          to: this.highlighted.to,
          daysOfMonth: this.highlighted.daysOfMonth,
          from: null
        };
      }
      this.highlighted.from = val;
    },
    setHighlightedDays(elem) {
      if (elem.target.value === "undefined") {
        return;
      }
      let highlightedDays = elem.target.value
        .split(",")
        .map(day => parseInt(day));
      this.highlighted = {
        from: this.highlighted.from,
        to: this.highlighted.to,
        daysOfMonth: highlightedDays
      };
    },
    setDisabledDays(elem) {
      if (elem.target.value === "undefined") {
        return;
      }
      let disabledDays = elem.target.value.split(",").map(day => parseInt(day));
      this.disabledDates = {
        from: this.disabledDates.from,
        to: this.disabledDates.to,
        daysOfMonth: disabledDays
      };
    },
    disableTo(val) {
      if (typeof this.disabled.to === "undefined") {
        this.disabledDates = {
          to: null,
          daysOfMonth: this.disabledDates.daysOfMonth,
          from: this.disabled.from
        };
      }
      this.disabledDates.to = val;
    },
    disableFrom(val) {
      if (typeof this.disabledDates.from === "undefined") {
        this.disabled = {
          to: this.disabledDates.to,
          daysOfMonth: this.disabled.daysOfMonth,
          from: null
        };
      }
      this.disabledDates.from = val;
    },
    openPicker() {
      this.$refs.programaticOpen.showCalendar();
    },
    logChangedMonth(date) {
      this.changedMonthLog.push(date);
    }
  }
};
</script>

<style>
input,
select {
  padding: 0.75em 0.5em;
  border: 1px solid #ccc;
  width: 100%;
}
</style>

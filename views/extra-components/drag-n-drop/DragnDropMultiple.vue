<template>
  <div>
    <vs-row vs-justify="center">
      <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="6" vs-xs="12">
        <vs-list>
          <vs-list-header title="Branded Companies 1" color="primary"></vs-list-header>
          <draggable :list="company1" group="people" class="p-2 cursor-move">
            <vs-list-item
              v-for="(listItem, index) in company1"
              :key="index"
              :title="listItem.name"
              :subtitle="listItem.email"
            >
              <vs-button slot="avatar" icon="flip_to_back" radius class="mr-2"></vs-button>
            </vs-list-item>
          </draggable>
        </vs-list>
      </vs-col>
      <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="6" vs-xs="12">
        <vs-list>
          <vs-list-header title="Branded Companies 2" color="primary"></vs-list-header>
          <draggable :list="company2" group="people" class="p-2 cursor-move">
            <vs-list-item
              v-for="(listItem, index) in company2"
              :key="index"
              :title="listItem.name"
              :subtitle="listItem.email"
            >
              <vs-button slot="avatar" icon="flip_to_back" radius class="mr-2"></vs-button>
            </vs-list-item>
          </draggable>
        </vs-list>
      </vs-col>
    </vs-row>
    <vs-row vs-justify="center">
      <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="6" vs-xs="12">
        <pre class="p-3 bg-light border border-muted">List 1: {{ company1 }}</pre>
      </vs-col>
      <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="6" vs-xs="12">
        <pre class="p-3 bg-light border border-muted">List 2: {{ company2 }}</pre>
      </vs-col>
    </vs-row>
  </div>
</template>

<script>
import draggable from "vuedraggable";

export default {
  name: "DragnDropMultiple",
  data: () => ({
    title: "DragnDropMultiple",
    company1: [
      {
        name: "Quantum Computer Services",
        email: "AOL"
      },
      {
        name: "BackRub ",
        email: "Google"
      },
      {
        name: "Sound of Music ",
        email: "Best Buy"
      },
      {
        name: "Apple Computers",
        email: "Apple, Inc."
      }
    ],
    company2: [
      {
        name: "Research in Motion",
        email: "Blackberry"
      },
      {
        name: "Brad’s Drink",
        email: "Pepsi-Cola"
      },
      {
        name: "Tokyo Tsushin Kogyo",
        email: "Sony"
      },
      {
        name: "Blue Ribbon Sports",
        email: "Starbucks"
      }
    ]
  }),
  components: {
    draggable
  }
};
</script>
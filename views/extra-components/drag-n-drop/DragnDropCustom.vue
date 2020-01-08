<template>
  <div>
    <vs-row vs-justify="center">
      <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="4" vs-xs="12">
        <h4 class="card-title mt-4">List 1</h4>
        <draggable :list="customlist1" group="custom" class="cursor-move todo-cards">
          <vs-card class="shadow-none" v-for="(clist, index) in customlist1" :key="index">
            <div class="d-flex align-items-center">
              <h5 class="card-title">{{ clist.todotitle }}</h5>
              <div class="ml-auto">
                <span class="badge badge-danger rounded-0" :class="clist.badgeactive">
                  <i class="mdi mdi-bookmark"></i>
                </span>
              </div>
            </div>

            <p class="text-muted mb-0">{{ clist.todosubtitle }}</p>
          </vs-card>
        </draggable>
      </vs-col>
      <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="4" vs-xs="12">
        <h4 class="card-title mt-4">List 2</h4>
        <draggable :list="customlist2" group="custom" class="cursor-move progress-cards">
          <vs-card class="shadow-none" v-for="(clist, index) in customlist2" :key="index">
            <div class="d-flex align-items-center">
              <h5 class="card-title">{{ clist.todotitle }}</h5>
              <div class="ml-auto">
                <span class="badge badge-danger rounded-0" :class="clist.badgeactive">
                  <i class="mdi mdi-bookmark"></i>
                </span>
              </div>
            </div>
            <p class="text-muted mb-0">{{ clist.todosubtitle }}</p>
          </vs-card>
        </draggable>
      </vs-col>
    </vs-row>
    <vs-row vs-justify="center">
      <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="6" vs-xs="12">
        <pre class="p-3 bg-light border border-muted">Branded Companies 1: {{ customlist1 }}</pre>
      </vs-col>
      <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="6" vs-xs="12">
        <pre class="p-3 bg-light border border-muted">Branded Companies 2: {{ customlist2 }}</pre>
      </vs-col>
    </vs-row>
  </div>
</template>

<script>
import draggable from "vuedraggable";

export default {
  name: "DragnDropCustom",
  data: () => ({
    title: "DragnDropCustom",
    customlist1: [
      {
        todotitle: "Book a Ticket",
        todosubtitle:
          "Blandit tempus porttitor aasfs. Integer posuere erat a ante venenatis.",
        badgeactive: "d-none"
      },
      {
        todotitle: "Launch new template ",
        todosubtitle:
          "Integer posuere erat a ante vene natis.Blandit tempus porttitor aasfs.",
        badgeactive: ""
      },
      {
        todotitle: "Task review",
        todosubtitle:
          "Commodo luctus, nisi erat porttitor. Integer posuere erat a ante venenatis.",
        badgeactive: "d-none"
      },
      {
        todotitle: "Website Design",
        todosubtitle:
          "Dapibus ac facilisis in, egestas eget quam.Blandit tempus porttitor aasfs.",
        badgeactive: ""
      }
    ],
    customlist2: [
      {
        todotitle: "Book aadf Ticket",
        todosubtitle:
          "Blandit tempus porttitor aasfs. Integer posuere erat a ante venenatis.",
        badgeactive: ""
      },
      {
        todotitle: "Launch new template ",
        todosubtitle:
          "Integer posuere erat a ante vene natis.Blandit tempus porttitor aasfs.",
        badgeactive: "d-none"
      },
      {
        todotitle: "Task review",
        todosubtitle:
          "Commodo luctus, nisi erat porttitor. Integer posuere erat a ante venenatis.",
        badgeactive: "d-none"
      },
      {
        todotitle: "Website Design",
        todosubtitle:
          "Dapibus ac facilisis in, egestas eget quam.Blandit tempus porttitor aasfs.",
        badgeactive: "d-none"
      }
    ]
  }),
  components: {
    draggable
  }
};
</script>
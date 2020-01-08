<template>
  <div>
    <vs-list>
      <draggable :list="list" class="cursor-move">
        <vs-list-item
          class="flex items-center p-1"
          v-for="(item, index) in list"
          :key="index"
          :title="item"
        >
          <vs-avatar slot="avatar" icon="supervisor_account" class="mr-2" />
        </vs-list-item>
      </draggable>
    </vs-list>
  </div>
</template>

<script>
import draggable from "vuedraggable";

export default {
  name: "DragnDropAnimation",
  data: () => ({
    title: "DragnDropAnimation",
    list: [
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
      "when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      "It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
    ]
  }),
  components: {
    draggable
  }
};
</script>
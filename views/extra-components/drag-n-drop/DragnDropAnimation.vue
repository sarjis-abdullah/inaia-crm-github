<template>
  <div>
    <vs-list>
      <vs-list-header title="Animation swipe" color="primary"></vs-list-header>
      <draggable :list="list" class="cursor-move">
        <transition-group>
          <vs-list-item
            class="animation"
            v-for="listitem in list"
            :key="listitem.email"
            :title="listitem.name"
            :subtitle="listitem.email"
          >
            <vs-avatar slot="avatar" :text="listitem.name" />
          </vs-list-item>
        </transition-group>
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
      {
        name: "Quantum Computer Services",
        email: "AOL"
      },
      {
        name: "BackRub Sfgsg",
        email: "Google"
      },
      {
        name: "SoundMusic adfg",
        email: "Best Buy"
      },
      {
        name: "Apple Computers",
        email: "Apple, Inc."
      }
    ]
  }),
  components: {
    draggable
  }
};
</script>
<style>
.animation {
  transition: all 0.5s;
}
</style>
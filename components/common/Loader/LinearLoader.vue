<template>
  <div class="w-full mt-1">
    <div class="h-1 w-full bg-pink-100 overflow-hidden">
      <div class="progress w-full h-full bg-pink-500 left-right"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProgressBar",
};
</script>

<style scoped>
.progress {
  animation: progress 1s infinite linear;
}

.left-right {
  transform-origin: 0% 50%;
}

@keyframes progress {
  0% {
    transform: translateX(0) scaleX(0);
  }
  40% {
    transform: translateX(0) scaleX(0.4);
  }
  100% {
    transform: translateX(100%) scaleX(0.5);
  }
}

.w-full {
  width: 100%;
}

.h-1 {
  height: 0.25rem;
}

.bg-pink-100 {
  background-color: rgba(189,189,189 ,0.25);
}

.bg-pink-500 {
  background-color: #5e72e4;
}

.overflow-hidden {
  overflow: hidden;
}
</style>

<template>
  <swiper :options="swiperOption">
    <swiper-slide class="slide-1"></swiper-slide>
    <swiper-slide class="slide-2"></swiper-slide>
    <swiper-slide class="slide-3"></swiper-slide>
    <swiper-slide class="slide-4"></swiper-slide>
    <swiper-slide class="slide-5"></swiper-slide>
    <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
</template>

<script>
import "swiper/dist/css/swiper.min.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";

export default {
  name: "VerticalCarousel",
  data: () => ({
    title: "VerticalCarousel",
    swiperOption: {
      direction: "vertical",
      pagination: {
        el: ".swiper-pagination",
        clickable: true
      }
    }
  }),
  components: {
    swiper,
    swiperSlide
  }
};
</script>

<style scoped>
.swiper-container-vertical {
  height: 300px;
}
</style>
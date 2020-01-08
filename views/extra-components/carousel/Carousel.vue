<template>
  <vs-row vs-justify="center">
    <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12">
      <vs-card>
        <h3 class="card-title d-flex">Navigation Carousel</h3>
        <p class="text-muted">
          Swiper4 component for Vue, support pc and mobile, SPA and SSR. For more information read documentation from
          <a href="https://github.com/surmon-china/vue-awesome-swiper">here.</a>
        </p>
        <NavigationCarousel></NavigationCarousel>
      </vs-card>
      <vs-card>
        <h3 class="card-title d-flex">Pagination Carousel</h3>
        <PaginationCarousel></PaginationCarousel>
      </vs-card>
      <vs-card>
        <h3 class="card-title d-flex">Vertical Carousel</h3>
        <VerticalCarousel></VerticalCarousel>
      </vs-card>
      <vs-card>
        <h3 class="card-title d-flex">Multiple Slides at a time</h3>
        <MultislideCarousel></MultislideCarousel>
      </vs-card>
      <vs-card>
        <h3 class="card-title d-flex">Gellery</h3>
        <GalleryCarousel></GalleryCarousel>
      </vs-card>
    </vs-col>
  </vs-row>
</template>

<script>
import NavigationCarousel from "./NavigationCarousel";
import PaginationCarousel from "./PaginationCarousel";
import MultislideCarousel from "./MultislideCarousel";
import GalleryCarousel from "./GalleryCarousel";
import VerticalCarousel from "./VerticalCarousel";

export default {
  name: "Carousel",
  data: () => ({
    title: "Carousel"
  }),
  components: {
    NavigationCarousel,
    PaginationCarousel,
    MultislideCarousel,
    GalleryCarousel,
    VerticalCarousel
  }
};
</script>

<style lang="scss">
.swiper-container {
  background-color: #f0f5f9;
}
.swiper-slide {
  background-size: cover;
  background-position: center;
  height: 400px;
  &.slide-1 {
    background-image: url("../../../assets/images/big/img1.jpg");
  }
  &.slide-2 {
    background-image: url("../../../assets/images/big/img2.jpg");
  }
  &.slide-3 {
    background-image: url("../../../assets/images/big/img3.jpg");
  }
  &.slide-4 {
    background-image: url("../../../assets/images/big/img4.jpg");
  }
  &.slide-5 {
    background-image: url("../../../assets/images/big/img5.jpg");
  }
}
</style>


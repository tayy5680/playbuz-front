<template>
  <swiper
    class="game-list__swiper"
    :loop="!isMobile"
    :space-between="14"
    :slidesPerView="slideDisplayCount"
    :autoplay="{ delay: 4000, disableOnInteraction: false }"
    :class="{ 'mobile': isMobile }"
    :initialSlide="!isMobile ? 5 : 0"
  >
    <swiper-slide
      v-for="item of formatGameList"
      :key="item.GameID"
    >
      <gameItem
        :item="item"
        :isSwiper="true"
      />
    </swiper-slide>
  </swiper>
</template>

<script>
import { inject, computed } from 'vue'
import store from '@/store'

import gameItem from './item'

import SwiperCore, { Autoplay } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/swiper.scss'

SwiperCore.use([Autoplay])

export default {
  name: 'game-swiper-list',

  components: {
    Swiper,
    SwiperSlide,
    gameItem,
  },
  setup () {
    const formatGameList = inject('formatGameList')
    const count = inject('count')
    const isMobile = computed(() => store.getters['platform/isMobile'])
    const isTablet = computed(() => store.getters['platform/isTablet'])
    const slideDisplayCount = computed(() => isMobile.value ? 'auto' : count.value || isTablet.value ? 4 : 5)
    return {
      isMobile,
      slideDisplayCount,
      formatGameList,
    }
  },
}
</script>

<style lang="scss" scoped>
.game-list__swiper.mobile {
  .game__short__item,
  .swiper-slide {
    width: 120px !important;
  }
}
</style>

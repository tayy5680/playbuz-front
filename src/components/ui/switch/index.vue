<template>
  <div class="switch__wrap" :class="tw(['relative'])">
    <swiper
      class="switch__container"
      slidesPerView="auto"
      :spaceBetween="6"
      :class="tw(['mb-8px'])"
      :navigation="{
        nextEl: '.swiper-next',
        prevEl: '.swiper-prev'
      }"
    >
      <swiper-slide
        v-for="item of list"
        :key="item.id"
        :style="{ width: `${isMobile ? '' : 'auto !important'};` }"
        @click="$emit('action', item)"
        v-audio="'headerMenu'"
      >
        <div
          class="game__sort__item"
          :class="
            tw([
              'cursor-pointer',
              isMobile ? 'text-18px' : 'text-14px',
              'rounded-full',
              'py-4px',
              'px-18px',
              'transition',
              'duration-.28s',
              'hover:md:bg-[#7c7ed7]',
              'hover:md:text-white',
              activeID.toString() === item.id.toString() ? 'text-white bg-[#7c7ed7]' : 'text-[#707070] bg-white'
            ])
          "
        >
          {{ isTranslate ? $t(item.label) : item.label }}
        </div>
      </swiper-slide>
    </swiper>
    <div class="swiper-next"></div>
    <div class="swiper-prev"></div>
  </div>
</template>

<script>
  import { computed } from 'vue'
  import store from '@/store'

  import SwiperCore, { Navigation } from 'swiper'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import 'swiper/swiper.scss'

  SwiperCore.use([Navigation])

  export default {
    name: 'switch-swiper-list',

    components: {
      Swiper,
      SwiperSlide
    },

    props: {
      list: {
        type: Array,
        default: () => []
      },

      activeID: {
        type: [String, Number],
        default: () => ''
      },

      isTranslate: {
        type: Boolean,
        default: () => true
      }
    },

    setup() {
      const isMobile = computed(() => store.getters['platform/isMobile'])

      return {
        isMobile
      }
    }
  }
</script>

<style lang="scss">
  .switch__wrap {
    .swiper-slide {
      width: auto !important;
    }

    .swiper-prev,
    .swiper-next {
      pointer-events: none;
      position: absolute;
      top: 50%;
      z-index: 9;
      width: 17px;
      height: 19px;

      &::before {
        content: '';
        position: relative;
        z-index: 9;
        display: block;
        width: 17px;
        height: 19px;
        background: url('./images/i_arrow_right.svg') no-repeat;
        opacity: 0;
        transform: scale(0.8);
        animation: move 2.4s ease infinite;
        filter: invert(43%) sepia(26%) saturate(29%) hue-rotate(321deg) brightness(95%) contrast(91%);
      }

      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: -8px;
        transform: translateY(-50%);
        width: 30px;
        height: 40px;
        background: linear-gradient(to right, rgba(20, 20, 20, 0) 0, #f6f6f6 70%);
      }

      &.swiper-button-disabled {
        opacity: 0;
      }
    }

    .swiper-prev {
      left: 0;
      transform: translateY(-50%) rotate(180deg);
    }

    .swiper-next {
      right: 0;
      transform: translateY(-50%);
    }
  }

  @keyframes move {
    0% {
      left: 0;
      opacity: 0;
      transform: scale(0.8);
    }

    40% {
      left: 14px;
      opacity: 1;
      transform: scale(1);
    }

    80% {
      left: 24px;
      opacity: 0;
    }
  }
</style>

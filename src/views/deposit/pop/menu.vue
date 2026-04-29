<template>
  <div class="deposit-switch__wrap">
    <swiper
      class="deposit__switch__list"
      :pagination="{
        clickable: true,
        el: '.deposit-switch__pagination',
        bulletClass: tw(['block', 'mx-4px', 'h-10px', 'w-10px', 'bg-bannerBg', 'rounded-full', 'opacity-40'])
      }"
      :slidesPerView="menuData.length < viewCount ? menuData.length : viewCount"
      :slideToClickedSlide="true"
      :preventClicksPropagation="true"
      :allowTouchMove="menuData.length > viewCount"
    >
      <swiper-slide
        v-for="(item, index) of menuData"
        :key="item.id"
        :class="
          tw([
            'relative',
            'cursor-pointer',
            'text-center',
            'flex',
            'flex-col',
            'items-center',
            nowPayTypeID === item.id ? 'text-white' : 'text-depositColor',
            transitionBase
          ])
        "
        @click="changePayTypeID(item.id)"
        v-audio="'headerMenu'"
      >
        <div
          class="icon"
          :class="tw(['w-32px', 'h-32px'])"
          :style="{
            '-webkit-mask': setStyleMaskImage(item.type),
            mask: setStyleMaskImage(item.type)
          }"
        >
          <div
            class="icon-bg"
            :class="tw(['w-full', 'h-full', nowPayTypeID === item.id ? 'bg-white' : 'bg-depositColor', transitionBase])"
          ></div>
        </div>
        <div class="label" :class="tw(['relative', 'w-full', 'text-[13px]', 'px-px'])">
          {{ $t(item.label) }}
          <i
            v-if="menuData.length - 1 > index"
            :class="tw(['absolute', 'block', 'top-0', 'right-0', 'w-px', 'h-24px', 'bg-giftBtnInactive'])"
          >
          </i>
        </div>
      </swiper-slide>
      <div class="deposit-switch__pagination" v-show="menuData.length > viewCount"></div>
    </swiper>
  </div>
</template>

<script>
  import { ref, computed } from 'vue'
  import SwiperCore, { Pagination } from 'swiper'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import 'swiper/swiper.scss'
  import { DEPOSIT_TYPE_LIST } from '@/configs/deposit'

  SwiperCore.use([Pagination])

  export default {
    components: {
      Swiper,
      SwiperSlide
    },

    props: {
      nowPayTypeID: {
        type: String,
        default: () => ''
      },
      menuList: {
        type: Array,
        default: () => []
      },
      changePayTypeID: {
        type: Function
      }
    },

    setup(props) {
      const menuData = computed(() => props.menuList)
      const viewCount = ref(5)

      const setStyleMaskImage = url => {
        try {
          return `url(${require(`../images/i_pay_${url}.svg`)}) no-repeat center /contain`
        } catch {
          return ''
        }
      }

      return {
        viewCount,
        menuData,
        // fn
        setStyleMaskImage
      }
    }
  }
</script>

<style lang="scss">
  .deposit-switch__pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px 0 0;

    span {
      width: 8px;
      height: 8px;
      cursor: pointer;

      &.swiper-pagination-bullet-active {
        opacity: 0.9;
      }
    }
  }
</style>

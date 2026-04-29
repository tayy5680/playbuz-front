<template>
  <div class="deposit-switch__wrap" :class="tw(['border-b-1', 'border-[#3E3A39]', 'pb-3'])">
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
        v-for="item of menuData"
        v-audio="'headerMenu'"
        :key="item.id"
        :class="
          tw([
            'relative',
            'cursor-pointer',
            'text-center',
            'flex',
            'flex-col',
            'items-center',
            transitionBase,
            { active: nowPayTypeID === item.id },
            item.type
          ])
        "
        @click="changePayTypeID(item.id)"
      >
        <!-- icon -->
        <div class="items-area" :class="tw([nowPayTypeID === item.id ? '' : 'opacity-50'])">
          <div :class="tw(['h-[60px]', 'grid', 'items-center', 'justify-center'])">
            <img
              :src="require(`./images/i_pay_card${nowPayTypeID === item.id ? '_active' : ''}.svg`)"
              v-if="item.type === 'card'"
            />
            <img
              :src="require(`./images/i_pay_paypay${nowPayTypeID === item.id ? '_active' : ''}.svg`)"
              v-else-if="item.type === 'paypay'"
            />
            <img
              :src="require(`./images/i_pay_apple_pay${nowPayTypeID === item.id ? '_active' : ''}.svg`)"
              v-else-if="item.type === 'applePay'"
            />
          </div>
          <div class="label" :class="tw(['relative', 'w-full', 'text-[13px]', 'text-[#3E3A39]'])">
            {{ $t(item.label) }}
          </div>
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
      const menuData = computed(() => {
        if (!props.menuList.length) return []
        return props.menuList.map(item => DEPOSIT_TYPE_LIST.find(el => el.id === item.PayTypeID))
      })
      const viewCount = ref(5)

      return {
        viewCount,
        menuData
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

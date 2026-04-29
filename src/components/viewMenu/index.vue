<template>
  <div class="menu_container" :class="tw(['relative', 'text-BaseColor', { 'text-center': isCenter }])">
    <swiper
      class="menu__list"
      @swiper="
        swiper => {
          swiperElement = swiper
        }
      "
      @update="setActiveLine"
      @touchEnd="setActiveLine"
      :slidesPerView="'auto'"
      :spaceBetween="xRayMargin"
      :class="tw([isCenter ? 'inline-block' : 'min-w-full'])"
    >
      <swiper-slide
        class="menu__item"
        v-for="item of menuList"
        :key="item.id"
        :class="[
          tw(['cursor-pointer', 'transition-colors', 'flex', 'items-center', 'pb-8px', classNames]),
          activeID === item.id ? `text-${AccentColor} action` : `text${hoverColor}`
        ]"
        @click="action(item.id)"
        v-audio="'headerMenu'"
      >
        <div :class="tw(['flex'])">
          <slot :row="item" />
          <div v-if="item.id === 0 && isBadge" :class="tw(['rounded-full', 'bg-red-600', 'ml-1', 'h-1', 'w-1'])"></div>
        </div>
      </swiper-slide>
      <div
        class="menu__line"
        ref="lineElement"
        :class="
          tw(['absolute', 'left-0', 'bottom-0', 'h-4px', 'w-24px', 'bg-[#7c7ed7]', 'transition-all', 'rounded-full'])
        "
      />
    </swiper>
  </div>
</template>

<script>
  import { ref, nextTick, onMounted, watch, computed } from 'vue'
  import store from '@/store'
  import { getRoutes } from '@/router/routes'

  import SwiperCore, { Navigation } from 'swiper'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import 'swiper/swiper.scss'

  SwiperCore.use([Navigation])

  export default {
    name: 'view-menu',

    components: {
      Swiper,
      SwiperSlide
    },

    /*
    list:           列表。
    activeID:       目前位置。
    isCenter:       是否置中。
    upadteView:     當有此參數變動時會更新滑動位置。
  */
    props: {
      list: {
        type: Array,
        default: () => []
      },

      activeID: {
        type: [String, Number],
        default: () => 0
      },

      classNames: {
        type: String,
        default: () => ''
      },

      isCenter: {
        type: Boolean,
        default: () => false
      },

      upadteView: {
        type: [String, Number],
        default: () => ''
      },

      xRayMargin: {
        type: Number,
        default: () => 0
      },

      isBadge: {
        type: Boolean,
        default: () => false
      },

      AccentColor: {
        type: String,
        default: () => 'BaseColor'
      },

      hoverColor: {
        type: String,
        default: () => 'AccentColor'
      }
    },

    emit: ['action'],

    setup(props, { emit }) {
      const isMobile = computed(() => store.getters['platform/isMobile'])

      const swiperElement = ref(null)
      const lineElement = ref(null)

      const menuList = computed(() => {
        const routesList = getRoutes()
        return props.list.filter(item => {
          if (item.route) {
            return routesList.some(element => element.name === item.route.name)
          } else return item
        })
      })
      const action = id => {
        if (props.activeID === id) return false
        emit('action', id)
      }

      const setActiveLine = (listIndex = null) => {
        if (!swiperElement.value) return false

        nextTick(() => {
          const index = listIndex ?? props.list.findIndex(item => item.id === props.activeID)
          const ele = swiperElement?.value?.slides?.[index]
          if (!ele) return false

          lineElement.value.style.left = `${ele.offsetLeft +
            (ele.offsetWidth - lineElement.value.offsetWidth) / 2 +
            swiperElement.value.translate}px`
        })
      }

      watch(
        () => [store.state.platform.element.containerWidth, props.activeID, props.upadteView, props.list],
        () => {
          const index = props.list.findIndex(item => item.id === props.activeID)
          swiperElement.value.slideTo(index, 800, false)
          setActiveLine(index)
        }
      )

      onMounted(() => {
        setActiveLine()
      })

      return {
        isMobile,
        swiperElement,
        lineElement,
        menuList,
        // fn
        action,
        setActiveLine
      }
    }
  }
</script>

<style lang="scss" scoped>
  .menu_container {
    .swiper-slide {
      width: auto;
    }
  }
</style>

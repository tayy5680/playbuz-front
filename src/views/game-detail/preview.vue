<template>
  <div
    class="game-preview__wrap"
    v-if="loading || (list && list.length > 0)"
    :class="tw(['mt-30px', 'px-mobileSpace'])"
  >
    <div class="game-preview__container" :class="tw([isMobile ? 'min-h-82px' : 'min-h-138px'])">
      <el-skeleton
        v-if="loading"
        :loading="loading"
        :class="tw(['grid', 'grid-cols-1', 'md:grid-cols-3', 'gap-x-8px'])"
        :count="3"
        animated
      >
        <template id="template">
          <div :class="tw(['rounded-20px', 'overflow-hidden', isMobile ? 'h-82px' : 'h-138px'])">
            <el-skeleton-item variant="image" style="height: 100%;" />
          </div>
        </template>
      </el-skeleton>
      <swiper
        v-else
        @swiper="
          swiper => {
            swiperElement = swiper
          }
        "
        :space-between="swiperConfig.between"
        :slidesPerView="swiperConfig.slides"
      >
        <swiper-slide v-for="(item, index) of list" :key="index">
          <div
            class="preview__item"
            :class="
              tw([
                'relative',
                'bg-navBgHover',
                'rounded-20px',
                'overflow-hidden',
                'cursor-pointer',
                'h-200px',
                'md:h-138px',
                'flex',
                'group'
              ])
            "
            @click="action(item)"
          >
            <el-image
              class="preview__img"
              :class="tw(['w-full', 'h-full', 'object-cover', 'group-hover:scale-105', transitionBase])"
              :src="item.type === 'image' ? item.url : `https://img.youtube.com/vi/${item.url}/maxresdefault.jpg`"
              :alt="info.GameName"
              fit="cover"
            >
              <template #error>
                <div :class="tw(['flex', 'justify-center', 'items-center', 'h-full', 'bg-[#333]', 'p-[20%]'])">
                  <img :alt="item.GameName" :src="require(`@/assets/img/logo/logo_PlayBUZ.svg`)" />
                </div>
              </template>
              <template #placeholder>
                <el-skeleton-item variant="image" style="height: 100%;"></el-skeleton-item>
              </template>
            </el-image>
            <img
              class="preview__player"
              v-if="item.type === 'youtube'"
              :src="require('./images/i_video_play.svg')"
              :class="
                tw([
                  'pointer-events-none',
                  'absolute',
                  'top-1/2',
                  'left-1/2',
                  '-translate-1/2',
                  'z-10',
                  'w-60px',
                  'h-60px',
                  'opacity-80',
                  'group-hover:opacity-100',
                  'group-hover:scale-110',
                  transitionBase
                ])
              "
            />
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <carouselSwiper
      v-if="Object.keys(lightData).length"
      :action="action"
      :list="formatList"
      :initialSlide="initialSlide"
    />
  </div>
</template>

<script>
  import { ref, computed, inject, reactive, watch, onBeforeUnmount } from 'vue'
  import store from '@/store'

  import { GAME_PREVIEW } from '@/configs/game'
  import { event } from 'vue-gtag-next'

  import SwiperCore, { Autoplay } from 'swiper'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import 'swiper/swiper.scss'
  import carouselSwiper from '@/components/carousel'

  SwiperCore.use([Autoplay])

  export default {
    components: {
      Swiper,
      SwiperSlide,
      carouselSwiper
    },

    inject: ['info'],

    setup() {
      const isMobile = computed(() => store.getters['platform/isMobile'])
      const info = inject('info')
      const loading = ref(false)

      const list = ref([])
      const limitMinCount = 3

      const setList = () => {
        list.value = []
        if (GAME_PREVIEW[info.value.GameID]) list.value = list.value.concat(GAME_PREVIEW[info.value.GameID])

        const write = (obj = {}) => {
          if (obj.hidden && list.value.length >= limitMinCount) return false

          const target = { type: 'image' }
          list.value.push(Object.assign(target, obj))
        }

        for (let i = 1; i <= limitMinCount; i++) {
          const img = new Image()
          const url = `${process.env.VUE_APP_IMG_URL}/img/game/preview/${info.value.GameID}_0${i}.jpg`

          img.onload = () => {
            write({ url })
          }

          img.onerror = () => {
            write({ url, hidden: true })
          }

          img.src = url
        }
      }

      const formatList = computed(() => list.value.filter(item => !item.hidden))

      const swiperElement = ref(null)
      const swiperOffsetWidth = ref(50)
      const swiperConfig = reactive({
        between: computed(() => (isMobile.value ? 14 : 8)),
        slides: computed(() => (isMobile.value ? 1 : 3)),
        center: computed(() => isMobile.value),
        offset: computed(() => (isMobile.value ? swiperOffsetWidth.value : 0)),
        width: computed(() =>
          isMobile.value ? store.state.platform.element.containerWidth - swiperOffsetWidth.value * 2 : undefined
        )
      })

      const lightData = ref({})

      const init = async () => {
        if (Object.keys(info.value).length) {
          loading.value = false
          setList()
        } else {
          loading.value = true
        }
      }

      watch(info, obj => {
        init()
      })

      onBeforeUnmount(() => {
        store.dispatch('platform/setCover', false)
      })

      init()

      const initialSlide = ref(0)
      const action = (obj = {}) => {
        if (Object.keys(obj).length) event('game_detail_click', { click: 'preview' })
        if (obj.hidden) return false

        lightData.value = obj
        initialSlide.value = obj.type === 'image' ? list.value.findIndex(item => item.url === obj.url) : 0
        store.dispatch('platform/setCover', !!Object.keys(obj).length)
      }

      const imgUrl = ref(process.env.VUE_APP_IMG_URL)

      return {
        loading,
        isMobile,
        list,
        formatList,
        imgUrl,
        action,
        lightData,
        swiperElement,
        swiperConfig,
        initialSlide
      }
    }
  }
</script>

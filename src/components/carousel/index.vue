<template>
  <teleport to="body">
    <div
      class="light__wrap"
      :class="tw(['fixed', 'top-0', 'left-0', 'w-full', 'h-full', 'z-30'])"
      @click="close(false)"
    ></div>
    <div
      class="item__light"
      :class="
        tw(['fixed', 'z-30', 'top-1/2', 'left-0', 'md:left-[25svw]', '-translate-y-1/2', 'w-screen', 'md:w-[50svw]'])
      "
    >
      <swiper
        :loop="false"
        :autoplay="false"
        :slidesPerView="1"
        :initialSlide="initialSlide"
        :centeredSlides="true"
        @swiper="onSwiper"
        :speed="1000"
        :navigation="{
          nextEl: '.nextArrow',
          prevEl: '.prevArrow'
        }"
      >
        <div
          class="prevArrow"
          v-if="!isMobile"
          :class="tw(['fixed', 'w-[40px]', 'h-[40px]', 'z-30', 'top-[40%]', 'left-[-60px]', 'cursor-pointer'])"
          @click="pauseVideo()"
        >
          <img class="logo__img" :class="tw(['w-full', 'rotate-180'])" src="/img/slide/btn_step.svg" alt="prev arrow" />
        </div>
        <div
          class="nextArrow"
          v-if="!isMobile"
          :class="
            tw(['fixed', 'w-[40px]', 'h-[40px]', 'z-30', 'top-[40%]', 'left-[calc(50svw+20px)]', 'cursor-pointer'])
          "
          @click="pauseVideo()"
        >
          <img class="logo__img" :class="tw(['w-full', 'rotate-0'])" src="/img/slide/btn_step.svg" alt="next arrow" />
        </div>
        <swiper-slide v-for="item of lists" :key="item.id" :class="tw(['h-auto'])">
          <template v-if="item.type === 'image'">
            <el-image
              class="preview__img"
              :class="
                tw([
                  'w-screen',
                  'object-cover',
                  'md:w-[50svw]',
                  'h-full',
                  'object-contain',
                  'md:object-cover',
                  'px-12px',
                  'md:px-0',
                  'max-w-none',
                  'bg-cover',
                  'cursor-pointer'
                ])
              "
              :style="`background-image:url(${envImgUrl}/img/deposit/background/deposit_deposit_bg01.jpg)`"
              :src="item.url"
              @click="handleSlideTo"
            >
              <template #error>
                <div :class="tw(['w-[40%]', 'flex', 'justify-center', 'align-center', 'h-full', 'mx-auto'])">
                  <img :src="require(`@/assets/img/logo/logo_PlayBUZ.svg`)" :alt="$t('玩霸PlayBUZ')" />
                </div>
              </template>
            </el-image>
          </template>
          <template v-if="item.type === 'youtube'">
            <div
              class="youtube"
              :class="
                tw([
                  'relative',
                  'w-screen',
                  'md:w-[50svw]',
                  'h-full',
                  'px-12px',
                  'md:px-0',
                  'object-contain',
                  'md:object-cover',
                  'max-w-none'
                ])
              "
            >
              <iframe
                class="youtubeVideo"
                :class="tw(['w-full', 'h-full'])"
                :src="`https://www.youtube.com/embed/${item.url}?enablejsapi=1`"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer;autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              ></iframe>
            </div>
          </template>
        </swiper-slide>
      </swiper>
      <div class="small__view" :class="tw(['w-screen', 'md:w-[50svw]', 'mt-2', 'md:mt-3'])">
        <swiper
          :loop="false"
          :autoplay="false"
          :slidesPerView="isMobile ? 4 : 5"
          :initialSlide="initialSlide"
          :speed="1000"
          :spaceBetween="isMobile ? 2 : 8"
        >
          <swiper-slide v-for="(item, index) of lists" :key="item.id">
            <el-image
              class="preview__img"
              :class="
                tw([
                  'w-full',
                  'object-cover',
                  'cursor-pointer',
                  'filter',
                  'bg-cover',
                  'border-solid',
                  'border-[1px]',
                  nowSlide === index ? 'brightness-[1.2] border-white' : 'brightness-[.4] border-[#727272]'
                ])
              "
              @click="handleSlideMove(item.id)"
              :src="item.type === 'image' ? item.url : 'https://img.youtube.com/vi/' + item.url + '/maxresdefault.jpg'"
              :style="`background-image:url(${envImgUrl}/img/deposit/background/deposit_deposit_bg01.jpg)`"
              fit="cover"
            >
              <template #error>
                <div
                  @click="handleSlideMove(item.id)"
                  :class="tw(['w-[40%]', 'flex', 'h-[40px]', 'justify-center', 'align-center', 'h-full', 'mx-auto'])"
                >
                  <img :src="require(`@/assets/img/logo/logo_PlayBUZ.svg`)" :alt="$t('玩霸PlayBUZ')" />
                </div>
              </template>
            </el-image>
            <img
              class="preview__player"
              v-if="item.type === 'youtube'"
              :src="require('./images/i_video_play.svg')"
              :class="
                tw([
                  'object-cover',
                  'pointer-events-none',
                  'absolute',
                  'top-1/2',
                  'left-1/2',
                  '-translate-1/2',
                  'z-10',
                  'w-1/5',
                  'opacity-80'
                ])
              "
            />
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </teleport>
</template>

<script>
  import { ref, computed, watch } from 'vue'
  import store from '@/store'
  import SwiperCore, { Autoplay } from 'swiper'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import 'swiper/swiper.scss'

  SwiperCore.use([Autoplay])

  export default {
    name: 'carousel-swiper',

    components: {
      Swiper,
      SwiperSlide
    },

    props: {
      action: {
        type: Function,
        default: () => null
      },

      list: {
        type: Object,
        default: () => {}
      },

      initialSlide: {
        type: Number,
        default: () => 0
      }
    },

    setup(props) {
      const envImgUrl = process.env.VUE_APP_IMG_URL
      const isMobile = computed(() => store.getters['platform/isMobile'])
      const lists = computed(() => {
        props.list.forEach((item, index) => {
          item.id = index
        })
        return props.list
      })

      const nowSlide = ref(props.initialSlide)
      let swiper = null
      const onSwiper = element => {
        swiper = element

        if (props.initialSlide === 0) swiper.navigation.$prevEl.css('display', 'none')
        else if (props.initialSlide === props.list.length - 1) swiper.navigation.$nextEl.css('display', 'none')

        swiper.on('progress', (swiper, progress) => {
          if (progress > 1 || progress < 0) close(true)
          else {
            if (swiper.isEnd) swiper.navigation.$nextEl.css('display', 'none')
            else swiper.navigation.$nextEl.css('display', 'block')

            if (swiper.isBeginning) swiper.navigation.$prevEl.css('display', 'none')
            else swiper.navigation.$prevEl.css('display', 'block')
          }
        })

        swiper.on('slideChange', () => {
          nowSlide.value = swiper.realIndex
        })
      }

      const handleSlideTo = event => {
        const screenWidthCenter = window.innerWidth / 2
        if (screenWidthCenter > event.clientX && !swiper.isBeginning) handleSlideMove('left')
        else if (screenWidthCenter <= event.clientX && !swiper.isEnd) handleSlideMove('right')
        else close(true)
      }

      const lastDirection = ref(0)
      const handleSlideMove = direction => {
        if (direction !== lastDirection.value) {
          pauseVideo()
          lastDirection.value = direction
        }
        swiper.detachEvents()
        const key = props.list.findIndex(item => item.id === direction)
        if (direction === 'left') swiper.slidePrev(1000, false)
        else if (direction === 'right') swiper.slideNext(1000, false)
        else if (nowSlide.value !== key && key !== -1) {
          nowSlide.value = key
          swiper.slideTo(nowSlide.value, 1000, false)
        }
        setTimeout(() => swiper.attachEvents(), 1000)
      }

      const isBgm = computed(() => store.state.audio.bgm.isPlayBgm)
      const close = delayStatus => {
        if (delayStatus) setTimeout(() => props.action(), 500)
        else props.action()
        if (isBgm.value) store.dispatch('audio/handleBgmStatus', 'play')
      }
      const pauseVideo = () => {
        const video = document.getElementsByClassName('youtubeVideo')
        for (let i = 0; i < video.length; i++)
          video[i].contentWindow.postMessage('{"event":"command", "func":"pauseVideo", "args":""}', '*')
      }
      // 縮圖為youtube影片時暫停播放音樂
      watch(nowSlide, val => {
        if (props.list[val].type === 'youtube') store.dispatch('audio/handleBgmStatus', 'pause')
        else {
          if (isBgm.value) store.dispatch('audio/handleBgmStatus', 'play')
        }
      })
      const init = index => {
        if (props.list[index].type === 'youtube') store.dispatch('audio/handleBgmStatus', 'pause')
      }
      init(props.initialSlide)
      return {
        envImgUrl,
        isMobile,
        nowSlide,
        lists,
        handleSlideTo,
        onSwiper,
        handleSlideMove,
        close,
        pauseVideo
      }
    }
  }
</script>

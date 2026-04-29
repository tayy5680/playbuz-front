<template>
  <div class="billboard__wrap" @click.self="close(event, isTodayRead)" v-if="isOpenState">
    <div class="billboard__container">
      <el-carousel
        height="70svh"
        :arrow="newsList.length === 1 ? 'never' : isMobile ? 'always' : 'hover'"
        :indicator-position="newsList.length === 1 ? 'none' : 'outside'"
        :autoplay="true"
        trigger="click"
      >
        <el-carousel-item v-for="item of newsList" :key="item.NewsId">
          <div class="carousel-item-bg" :id="`item_${item.NewsId}`">
            <div
              class="content__lottie"
              v-if="item.MediaType === 'lottie'"
              :style="
                `
                cursor: ${item?.[isMobile ? 'OpenUrlMo' : 'OpenUrlPc'] ? 'pointer' : 'default'};
                ${item.ActionText ? 'height: calc(100% - 48px)' : 'height:100%'};
              `
              "
              @click="goUrl(item[isMobile ? 'OpenUrlMo' : 'OpenUrlPc'], item.OpenType)"
            ></div>
            <VueYtframe
              :data-newsId="item.NewsId"
              v-else-if="item.MediaType === 'video' && item.videoType === 'youtube'"
              :video-id="item.videoFormate"
              :player-vars="{ autoplay: 0, mute: 1, rel: 0 }"
              class="video-wrapper"
              @playing="onPlaying"
              @paused="onPaused"
              @ended="onEnded"
              @ready="onReady"
            />
            <el-image
              v-else
              :src="item[isMobile ? 'ImgUrlMo' : 'ImgUrlPc']"
              :alt="item.Title"
              :fit="'contain'"
              :key="lang"
              :style="`cursor: ${item?.[isMobile ? 'OpenUrlMo' : 'OpenUrlPc'] ? 'pointer' : 'default'}`"
              @click="goUrl(item[isMobile ? 'OpenUrlMo' : 'OpenUrlPc'], item.OpenType)"
            >
              <template #error>
                <div class="image-viewer-err">
                  <i class="bi bi-image"></i>
                </div>
              </template>
            </el-image>

            <button v-if="item?.ActionText" @click="goUrl(item[isMobile ? 'OpenUrlMo' : 'OpenUrlPc'], item.OpenType)">
              {{ item.ActionText }}
            </button>
          </div>
        </el-carousel-item>
      </el-carousel>
      <div class="dont-show-again-today">
        <el-checkbox v-model="isTodayRead" :label="$t('今日不再顯示活動訊息')" @change="setBillboardVisible" />
      </div>
      <div class="close-billboard-event" :class="{ mobile: isMobile }">
        <div @click.stop="close('billboard', isTodayRead)"><i class="bi bi-x"></i></div>
      </div>
    </div>
  </div>
</template>

<script>
  import { ref, inject, computed, onMounted, watch, nextTick, onUpdated, onUnmounted } from 'vue'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import SwiperCore, { Pagination, Navigation, Mousewheel, Keyboard } from 'swiper'
  import { useRoute } from 'vue-router'
  import dayjs from 'dayjs'
  import lottie from 'lottie-web'
  import store from '@/store'
  import { getJson } from '@/utils/get-Url-Data'

  SwiperCore.use([Navigation, Pagination, Mousewheel, Keyboard])
  export default {
    name: 'boillboard',

    props: {
      newsList: {
        type: Object
      }
    },

    components: {
      Swiper,
      SwiperSlide
    },

    inject: ['close'],

    setup(props) {
      window.onyoutubeiframeapiready = () => {}
      const loading = ref(false)
      const route = useRoute()
      const lang = computed(() => store.state.member.languageCode)
      const isTodayRead = ref(false)
      const isMobile = computed(() => store.getters['platform/isMobile'])
      const videoList = ref([])
      const isOpenState = computed(() => store.state.event.openState)

      const videoIframe = ref(null)

      /**
       * 影片目前狀態 0：stop ； 1：paly
       */
      const videoState = ref(0)

      const getImageUrl = url => {
        return url
      }

      watch(
        () => route.name,
        () => {
          isTodayRead.value = false
        }
      )
      watch(videoState, n => {
        if (!videoIframe.value) return
        const video = videoIframe.value.getIframe()
        if (n > 0) {
          video.style['z-index'] = 10
          document.documentElement.style.setProperty('--videoState', 'none')
          return
        }
        video.style['z-index'] = 0
        document.documentElement.style.setProperty('--videoState', 'block')
      })
      // 銷毀動畫
      watch(isOpenState, val => {
        if (val) renderLottie()
        else destroyLotties()
      })
      /**
       * 將lottie的動畫掛載上DOM
       */
      const lottieArr = ref([])
      const renderLottie = async () => {
        destroyLotties()
        for (const value of Object.values(props.newsList)) {
          if (value.MediaType !== 'lottie') continue

          await nextTick()
          // 抓取DOM
          const container = document.querySelectorAll(`#item_${value.NewsId}`)
          // 若無抓到DOM則返回
          if (!container) return
          // 至圖床抓取 Json
          const animUrl = value[isMobile.value ? 'ImgUrlMo' : 'ImgUrlPc']
          const json = await getJson(animUrl)
          for (const item of container) {
            // 預防塞兩次動畫
            const isSvg = item.querySelector('.content__lottie').getElementsByTagName('svg')
            if (isSvg.length) continue

            const anim = lottie.loadAnimation({
              container: item.querySelector('.content__lottie'),
              animationData: JSON.parse(JSON.stringify(json)),
              renderer: 'svg',
              loop: true,
              autoplay: true
            })
            lottieArr.value.push(anim)
          }
        }
      }
      const destroyLotties = () => {
        for (const anim of lottieArr.value) {
          anim?.destroy?.()
        }
        lottieArr.value = []
      }

      onMounted(() => {
        nextTick(() => {
          renderLottie()
        })
      })
      onUnmounted(() => {
        destroyLotties()
      })

      const enableContainer = inject('enableContainer')

      const init = async () => {
        loading.value = true
        loading.value = false
        videoIframe.value = null
        const returnUrl = new URLSearchParams(window.location.search).get('returnUrl')
        enableContainer.value = !Boolean(returnUrl)
      }

      init()

      const setBillboardVisible = () => {
        const now = new Date()
        now.setDate(now.getDate() + 1)
        const tomarrow = now.toISOString().split('T')[0]
        if (isTodayRead.value) localStorage.setItem('hideBillboardUntil', tomarrow)
        else localStorage.removeItem('hideBillboardUntil')
      }
      const goUrl = (url, method = '_blank') => {
        if (!url) return
        window.open(url, method)
      }

      const onPlaying = e => {
        videoState.value = 1
        videoIframe.value = e
      }

      const onPaused = e => {
        videoState.value = 0
        videoIframe.value = e
      }

      const onEnded = e => {
        videoState.value = 0
        videoIframe.value = e
      }

      const onSlideChange = async e => {
        // 判斷下個投影片是否為vide
        await nextTick()
        const item = e.slides[e.activeIndex]
        const isVideo = videoList.value.filter(e => e.newsId === item.dataset.newsid)
        if (isVideo.length) {
          for (const v of isVideo) {
            v.yt.getIframe().style['z-index'] = 10
          }
          document.documentElement.style.setProperty('--videoState', 'none')
          return
        }
        document.documentElement.style.setProperty('--videoState', 'block')

        // videoIframe.value = e.getIframe()
      }

      const onReady = e => {
        videoList.value = videoList.value.concat({
          newsId: e.getIframe().dataset.newsid,
          yt: e
        })
      }

      return {
        loading,
        isMobile,
        lang,
        isTodayRead,
        videoState,
        isOpenState,

        // fn
        goUrl,
        getImageUrl,
        onPlaying,
        onPaused,
        onEnded,
        onSlideChange,
        onReady,
        setBillboardVisible
      }
    }
  }
</script>

<style lang="scss">
  @import 'swiper/swiper.scss';
  @import 'swiper/components/navigation/navigation.scss';
  @import 'swiper/components/pagination/pagination.scss';

  $videoState: var(--videoState, block);

  .swiper-pagination-bullet {
    background: transparent;
    border: 1px solid white;
    opacity: 1;
  }

  .swiper-pagination-bullet-active {
    background: white;
  }

  .swiper-pagination {
    display: $videoState;
  }
</style>
<style lang="scss" scoped>
  .billboard__wrap {
    width: 100%;
    .billboard__container {
      :deep(.el-carousel) {
        .el-carousel__container {
          max-height: 500px;
        }
        .carousel-item-bg {
          height: 100%;
          text-align: center;
          display: flex;
          flex-direction: column;

          button {
            background-color: #7d7ed7;
            color: white;
            padding: 5px 20px;
            display: inline-block;
            width: fit-content;
            margin: 0 auto;
            border-radius: 100px;
            border: 1px solid white;
            margin-top: 12px;
            transition: all 0.2s ease;

            &:hover {
              background-color: white;
              color: #7d7ed7;
            }
          }
        }
        .video-wrapper {
          width: 100%;
          max-width: 800px;
          max-height: 450px;
          margin: 0 auto;
          padding: 0 30px;
        }
        .content__lottie {
          width: 100%;
          height: 100%;
          cursor: pointer;
          transform: translateZ(0);
          will-change: transform, opacity;
        }
        .el-image {
          height: 100%;
          cursor: pointer;
        }
        // 指示器
        .el-carousel__indicators {
          .el-carousel__indicator--horizontal {
            button {
              width: 10px;
              height: 10px;
              border-radius: 10px;
              background-color: #d9d9d9;
              opacity: 1;
            }

            &.is-active {
              button {
                background-color: #7c7ed7;
                width: 30px;
              }
            }
          }
        }
        // 箭頭
        .el-carousel__arrow {
          background-color: #00000094;

          &:hover {
            background-color: black;
          }
        }
      }

      .dont-show-again-today {
        text-align: center;
        :deep(.el-checkbox) .el-checkbox__label {
          cursor: pointer;
          color: white !important;
        }
      }

      .close-billboard-event {
        position: absolute;
        top: -40px;
        width: 100%;
        max-width: 800px;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;

        > div {
          color: #ffffff59;
          font-size: 40px;
          line-height: 40px;
          width: 40px;
          height: 40px;
          cursor: pointer;
          margin-left: auto;
          transition: all 0.2s ease;

          &:hover {
            color: white;
          }
        }
        &.mobile {
          position: relative;
          left: auto;
          transform: none;
          top: auto;
          width: 40px;
          margin: 0 auto;
          margin-top: 10px;
        }
      }
    }
  }
  .chekboxIsTodayShow {
    display: inline-flex;
    appearance: none;
    margin-right: 0.5rem;
    width: 0.8rem;
    height: 0.8rem;
    font: inherit;
    color: currentColor;
    background-color: #27252c;
    border: 0.1rem solid #9a1aef;
    border-radius: 0.15em;
    transform: translateY(-0.075em);
    place-content: center;
    cursor: pointer;

    &::before {
      content: '';
      width: 0.7rem;
      height: 0.7rem;
      background-color: #9a1aef;
      border-radius: 2px;
      transform: scale(0);
      transition: 120ms transform ease-in-out;
    }

    &:checked {
      &::before {
        transform: scale(1);
      }
    }
  }

  .content_detail {
    background: linear-gradient(to right, transparent 0%, #000000b3 20%, #000000b3 80%, transparent 100%);
  }

  .swiper-container {
    --swiper-navigation-color: white;
    --swiper-pagination-color: white;
  }

  %swiper-button {
    position: absolute;
    width: 40px;
    height: 40px;
    background-image: url('/img/icons/btn_imgarrow.svg');
    background-repeat: no-repeat;
    background-size: 40px 40px;

    &::after {
      display: none;
    }
  }

  .swiper-button-next {
    @extend %swiper-button;

    @media screen and (min-width: 768px) {
      right: -4rem;
    }
  }

  .swiper-button-prev {
    @extend %swiper-button;

    @media screen and (min-width: 768px) {
      left: -4rem;
    }

    --moz-transform: scaleX(-1);
    --webkit-transform: scaleX(-1);
    --o-transform: scaleX(-1);

    transform: scaleX(-1);
  }
</style>

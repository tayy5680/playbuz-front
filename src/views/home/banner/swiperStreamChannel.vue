<template>
  <div class="home-swiper-streamer" :key="isMobile">
    <swiper
      v-if="streamChannel.length"
      :key="streamChannel || isMobile"
      :effect="'coverflow'"
      :grabCursor="true"
      :centeredSlides="true"
      :slidesPerView="'auto'"
      :coverflowEffect="{
        rotate: 0,
        stretch: 170,
        scale: 0.9,
        depth: 0,
        modifier: 1,
        slideShadows: true
      }"
      :initialSlide="Math.floor((streamChannel.length - 1) / 2)"
      :loop="Boolean(streamChannel.length > 3)"
      :modules="modules"
      :class="['mySwiper', { mobileSwiper: isMobile }, { 'skeleton-swiper': !isWebSiteInitReady }]"
      :pagination="false"
      :navigation="
        !isMobile
          ? {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev'
            }
          : false
      "
      @swiper="setClass"
      @slideChange="setClass"
    >
      <swiper-slide
        v-for="(item, index) in streamChannel"
        :key="index"
        @click="action(item)"
        :class="tw([item?.GameLink ? 'cursor-pointer' : 'cursor-default', 'home-swiper-slide'])"
      >
        <div class="swiper__body" v-if="isWebSiteInitReady">
          <el-avatar
            class="bg-photo-path"
            :src="item?.PhotoPath"
            @error="errorHandler"
            :alt="$t('{name}的頭像', { name: item.Name })"
          >
            <img src="/img/member/preset_avatar00@2x.png" />
          </el-avatar>
          <div class="tips">
            <el-avatar :src="item?.PhotoPath" @error="errorHandler" :alt="$t('{name}的頭像', { name: item.Name })">
              <img src="/img/member/preset_avatar00@2x.png" />
            </el-avatar>

            <img class="icon-live" :src="`${imgUrl}/icon-live.svg`" alt="" />
            <div class="msg-info">
              <div>
                <span class="title">{{ item?.RoomName ?? '-' }}</span>
                <span class="name">{{ item?.Name ?? '' }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="swiper__body" v-else>
          <el-skeleton style="width: 240px" :loading="loading" animated>
            <template #template>
              <el-skeleton-item variant="image" />
            </template>
          </el-skeleton>
        </div>
      </swiper-slide>
    </swiper>
    <div v-else class="no-data">
      <img :src="`${imgUrl}/no-live-broadcast.svg`" alt="" />
      <div>
        {{ $t('目前似乎沒有人上船') }}
      </div>
    </div>
    <!-- 左右箭頭 -->
    <div v-if="!isMobile" class="swiper-button">
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>
  </div>
</template>

<script>
  import { ref, computed, watch, onMounted, nextTick } from 'vue'
  import store from '@/store'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import 'swiper/swiper.scss'
  import { getStreamChannel } from '@/api/game'
  import { useRoute, useRouter } from 'vue-router'
  import SwiperCore, { EffectCoverflow, Navigation } from 'swiper/core'
  SwiperCore.use([EffectCoverflow, Navigation])
  export default {
    components: {
      Swiper,
      SwiperSlide
    },
    setup() {
      const isMobile = computed(() => store.getters['platform/isMobile'])
      const isWebSiteInitReady = computed(() => store.state.platform.isWebSiteInitReady && isStreamChannelReady.value)
      const isStreamChannelReady = ref(false)
      const route = useRoute()
      const router = useRouter()

      const isLogin = computed(() => store.getters['member/isLogin'])
      const isGuest = computed(() => store.state.member.info?.IsGuest ?? true)
      const streamChannel = ref([])
      const imgUrl = computed(() => {
        return `${process.env.VUE_APP_IMG_URL}/img/home/2025NewHome`
      })
      const action = item => {
        if (!isWebSiteInitReady.value) return
        if (!isLogin.value || isGuest.value) {
          store.commit('sign/UPDATE_DRAWER_STATE', true)
          store.commit('sign/UPDATE_IS_DREWER_SHOW_GUEST', false)
        } else {
          if (!item?.GameLink) return router.push('/game/detail/100001')
          const url = new URL(item.GameLink)
          window.open(`${url.origin}/live${url.search}&streamerid=${item.UserId}`, '_blank')
        }
      }

      const init = async () => {
        try {
          const res = await getStreamChannel()
          if (res?.Data) {
            streamChannel.value = res?.Data
          } else throw new Error()
          isStreamChannelReady.value = true
        } catch (e) {
          streamChannel.value = []
          isStreamChannelReady.value = true
        }
      }

      const setClass = async () => {
        await nextTick()
        const items = document.querySelectorAll('.home-swiper-slide')
        const itemsArray = Array.from(items)
        const activeIndex = itemsArray.findIndex(el => el.classList.contains('swiper-slide-active'))

        itemsArray.forEach(item => {
          item.style.opacity = '0'
          item.style.pointerEvents = 'none'
        })

        for (let i = activeIndex - 2; i <= activeIndex + 2; i++) {
          if (itemsArray[i]) {
            itemsArray[i].style.opacity = '1'
            itemsArray[i].style.pointerEvents = 'auto'
          }
        }
      }

      onMounted(() => {
        init()
      })
      watch(isLogin, () => {
        init()
      })
      return {
        imgUrl,
        isMobile,
        setClass,
        isWebSiteInitReady,
        streamChannel,
        action,
        modules: [EffectCoverflow, Navigation]
      }
    }
  }
</script>
<style lang="scss" scoped>
  .home-swiper-streamer {
    padding: 80px 0;
    .swiper-button {
      display: flex;
      justify-content: space-between;
      position: relative;
      width: 100%;
      max-width: 935px;
      margin: 0 auto;
      margin-top: -150px;
      margin-bottom: 150px;
      z-index: 1;
      .swiper-button-prev,
      .swiper-button-next {
        position: relative;
        background-color: #d4d4d4;
        color: white;
        border-radius: 30px;

        &::after {
          font-size: 14px;
        }
      }
    }

    :deep(.mySwiper) {
      margin: 0 50px;
      .swiper-slide {
        width: 300px !important;
        height: 300px !important;
        overflow: hidden;
        border-radius: 15px;
        opacity: 0;
        pointer-events: none;
        transition: all 0.2s ease;

        // &.active {
        //   opacity: 1;
        //   pointer-events: auto;
        // }

        .swiper__body {
          width: 100%;
          height: 100%;
          cursor: pointer;

          .bg-photo-path {
            width: 100%;
            height: 100%;
            object-fit: cover;
            background-color: #c0c0c0;
            border-radius: 0;
          }

          .tips {
            position: relative;
            bottom: 70px;
            height: 60px;
            display: flex;
            justify-content: center;
            padding: 0 10px;

            .el-avatar {
              flex-shrink: 0;
              width: 50px;
              height: 50px;
              border-radius: 50%;
              img {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                border: 2px solid #ff2d55;
              }
            }
            .icon-live {
              position: absolute;
              width: 50px;
              height: auto;
              left: 10px;
              bottom: 0;
              background-color: #00000000;
            }

            .msg-info {
              flex-grow: 1;
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: #242a37cc;
              height: 100%;
              border-radius: 50px;
              padding: 0 15px;
              margin-left: 6px;
              > div {
                flex-grow: 1;
                color: white;
                > span {
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 1;
                  overflow: hidden;
                  word-break: break-all;
                }
                .title {
                  font-size: 14px;
                }
                .name {
                  font-size: 12px;
                }
              }
              button {
                flex-shrink: 0;
                background-color: #ff2d55;
                color: white;
                font-size: 12px;
                padding: 5px 15px;
                border-radius: 30px;

                &:hover {
                  background-color: #e52548;
                }
              }
            }
          }

          .el-skeleton__item {
            width: 300px;
            height: 300px;
          }
        }
      }

      &.mobileSwiper {
        margin: 0;
        padding: 100px 0px;
      }
    }

    .no-data {
      text-align: center;
      color: #cdcddf;
      padding: 25px 0;
      > img {
        display: inline-block;
        padding: 0 25px;
      }
      > div {
        margin-top: 30px;
        &::after {
          display: inline-block;
          text-align: left;
          padding-left: 6px;
          animation: dots 3s steps(4, end) infinite;
          content: '';
          width: 1em; /* 避免內容長度跳動 */
        }

        @keyframes dots {
          0% {
            content: '';
          }
          25% {
            content: '.';
          }
          50% {
            content: '..';
          }
          75% {
            content: '...';
          }
          100% {
            content: '';
          }
        }
      }
    }
  }
  @media (max-width: 767px) {
    .home-swiper-streamer {
      // margin-top: -27px;
      padding: 0;
    }
  }
</style>

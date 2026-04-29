<template>
  <div class="banners_container" :class="tw(['p-3', 'mb-6', 'md:p-6', 'md:mb-12', 'rounded-20px', 'relative'])">
    <div class="swiper_container" :class="tw(['overflow-hidden', 'rounded-20px'])">
      <swiper
        :pagination="{
          clickable: true,
          el: '.swiper-pagination',
          bulletClass: tw(['block', 'mx-4px', 'h-10px', 'w-10px', 'bg-swiperBullet', 'rounded-full']),
          bulletActiveClass: tw(['bg-swiperBulletActive', 'w-[40px]', 'bg-gradient-to-l from-AccentColor'])
        }"
        :space-between="12"
        :loop="true"
        :autoplay="{
          disableOnInteraction: false
        }"
        :preloadImages="false"
        :lazy="{
          loadPrevNext: true,
          loadPrevNextAmount: 2
        }"
      >
        <swiper-slide
          v-for="item of eventBannerList"
          :key="item.id"
          :data-swiper-autoplay="item.delay ? item.delay : 3000"
        >
          <div
            class="banner__item"
            :class="tw(['h-full', 'md:rounded-20px', 'overflow-hidden', 'cursor-pointer'])"
            @click="action(item)"
          >
            <div
              class="lottie"
              v-if="item.lottie"
              :class="tw(['absolute', 'top-0', 'left-0', 'w-full', 'h-full', 'z-10'])"
            >
              <div class="lottie_pc" :class="[item.id, tw(['hidden', 'md:block'])]"></div>
              <div class="lottie_mobile" :class="[item.id, tw(['md:hidden'])]"></div>
            </div>
            <video
              v-if="item.type === 'video'"
              :class="tw(['w-full', 'h-full', 'object-cover'])"
              autoplay
              muted
              loop
              playsinline
            >
              <source
                :key="lang"
                :src="item.bg[isMobile ? 'mobile' : 'pc'][lang] ?? item.bg[isMobile ? 'mobile' : 'pc']"
                type="video/mp4"
              />
            </video>
            <el-image
              class="banner_img swiper-lazy"
              v-else-if="item.bg && (item.bg.pc || item.bg.mobile)"
              :class="tw(['w-full', 'rounded-20px'])"
              :key="lang"
              :src="item.bg[isMobile ? 'mobile' : 'pc'][lang] ?? item.bg[isMobile ? 'mobile' : 'pc']"
              onerror="this.style.display='none'"
              :alt="item.label"
            >
            </el-image>
            <div class="detail" :class="tw([])">
              <div class="text" :class="tw([])">
                <div class="label" :class="tw(['text-20px', 'md:text-25px', 'text-center', 'font-bold', 'truncate'])">
                  {{ $t(item.label) || '' }}
                </div>
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
      <div
        class="swiper-pagination"
        :class="tw(['absolute', 'bottom-[-30px]', 'left-1/2', 'z-10', 'flex', '-translate-x-1/2'])"
      ></div>
    </div>
  </div>
  <!-- 彈窗 -->
  <viewPopup
    v-if="displayPopup"
    @close="
      () => {
        displayPopup = false
      }
    "
  >
    <template v-slot:context>
      <div class="info" :class="tw(['flex', 'flex-col', 'justify-center', 'items-center', 'h-[200px]'])">
        <img :class="tw(['mb-6', 'w-28'])" :src="require(`@/assets/img/logo/logo_PlayBUZ_only.png`)" :alt="SITE_NAME" />
        <span v-html="displayText || $t('敬請期待')" :class="tw(['text(white center xl)'])"> </span>
      </div>
    </template>
  </viewPopup>
</template>

<script>
  import { computed, nextTick, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import store from '@/store'
  import { event } from 'vue-gtag-next'
  import { useI18n } from 'vue-i18n'

  import viewPopup from '@/components/popup'

  import SwiperCore, { Pagination, Autoplay, Lazy } from 'swiper'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import 'swiper/swiper.scss'

  import { TODAY } from '@/configs'
  import { EVENT } from '@/configs/event'
  import lottie from 'lottie-web'

  import dayjs from 'dayjs'
  dayjs.extend(require('dayjs/plugin/isBetween'))

  SwiperCore.use([Pagination, Autoplay, Lazy])

  export default {
    name: 'banner',

    components: {
      Swiper,
      SwiperSlide,
      viewPopup
    },

    setup() {
      const { t } = useI18n()
      const SITE_NAME = computed(() => t(process.env.VUE_APP_SITE_NAME))
      const router = useRouter()
      const isMobile = computed(() => store.getters['platform/isMobile'])
      const lang = computed(() => store.state.member.languageCode)

      // 當前期間活動，進行排序
      const eventBannerList = computed(() => {
        return EVENT.reduce((acc, cur) => {
          const before = cur.deadline.before ?? undefined
          const start = cur.deadline.start ?? undefined
          const end = cur.deadline.end ?? undefined

          if (!start || !end) return acc

          // 包含banner資訊與開始結束時間，且在開始結束時間內或預熱與開始之間
          const startTime = start && end && TODAY.isBetween(start, end)
          const beforeTime = before && start && TODAY.isBetween(before, start)
          const target = cur.banner && (startTime || beforeTime)
          if (!target) return acc

          for (const item of cur.banner) {
            acc.push({
              ...item,
              // 是否是時間
              status: item.open ?? beforeTime ? 0 : startTime ? 1 : null
            })
          }

          return acc
        }, []).sort((a, b) => (a.top || 0) - (b.top || 0))
      })

      const buildLottieAnimate = (container, path) => {
        lottie.loadAnimation({
          container: container,
          path: path,
          renderer: 'svg',
          loop: true,
          autoplay: true
        })
      }

      onMounted(() => {
        nextTick(() => {
          for (const items of eventBannerList.value) {
            if (!items.lottie) continue

            for (const item of document.querySelectorAll(`.lottie_pc.${items.id}`)) {
              buildLottieAnimate(item, items.lottie.pc)
            }

            for (const item of document.querySelectorAll(`.lottie_mobile.${items.id}`)) {
              buildLottieAnimate(item, items.lottie.mobile)
            }
          }
        })
      })

      const displayPopup = ref(false)
      const displayText = ref('')
      const action = obj => {
        if (obj.unOpen || !obj.status) {
          displayPopup.value = true
          return false
        }

        displayText.value = ''

        if (obj.type === 'game') {
          if (obj.isStatic) {
            // 靜態資料不進入詳細頁
            const target = store.state.game.gameList.find(item => item.Vendor.ID === obj.id)
            if (target) {
              if (target.Vendor.GameUrl) window.open(target.Vendor.GameUrl)
              else if (target.Vendor.IOSUrl || target.Vendor.AndroidUrl) {
                if (store.state.platform.deviceInfo.toLowerCase().includes('android') && target.Vendor.AndroidUrl)
                  window.open(target.Vendor.AndroidUrl)
                else if (store.state.platform.deviceInfo.toLowerCase().includes('ios') && target.Vendor.IOSUrl)
                  window.open(target.Vendor.IOSUrl)
                else {
                  const url = target.Vendor.IOSUrl ?? target.Vendor.AndroidUrl
                  window.open(url)
                }
              } else {
                displayText.value = obj.displayText
                displayPopup.value = true
              }
            }
            return false
          }

          // gameID為 undefined 時跳到遊戲列表
          if (obj.gameID) router.push({ name: 'game/detail', params: { gameID: obj.gameID } })
          else router.push({ name: 'game', params: { type: 'slot', class: 'all' } })
        } else if (obj?.link?.type === 'href') {
          switch (obj?.link?.target) {
            case '_self':
              location.href = obj.link.url
              break
            case '_blank':
            default:
              window.open(obj.link.url)
              break
          }
        } else if (obj?.link?.type === 'router') {
          router.push(obj.link.router)
        } else {
          switch (obj.id) {
            case 'mine':
              event('mine_click', { click: 'banner' })
              store.dispatch('sign/loginProxy', { action: 'goMine', binding: true })
              break
          }
        }
      }

      const imgUrl = ref(process.env.VUE_APP_IMG_URL)

      return {
        eventBannerList,
        isMobile,
        displayPopup,
        displayText,
        SITE_NAME,
        imgUrl,
        lang,
        // fn
        action
      }
    }
  }
</script>
<style lang="scss" scoped>
  .banners_container {
    box-shadow: 0 0 5px #00000040;
  }
</style>

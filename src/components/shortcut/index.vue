<template>
  <div
    class="shortcut__wrap_a"
    ref="element"
    :class="
      tw([
        'select-none',
        'cursor-pointer',
        'fixed',
        'bottom-[70px]',
        //'right-[-38px]',
        'w-[120px]',
        'right-0',
        'z-10',
        'flex',
        'flex-col',
        'items-end',
        'justify-center',
        'transition-all'
      ])
    "
  >
    <div
      :class="
        tw([
          'bg-[#7d7ed7]',
          'relative',
          'text-white',
          'transition-all',
          'duration-300',
          'w-[30px]',
          'h-[30px]',
          'flex',
          'justify-center',
          'items-center',
          'rounded-full',
          'right-[8px]',
          isShortcutOpen ? 'bottom-0' : 'bottom-[-110px]'
        ])
      "
      style="box-shadow: 0px 0px 4px #00000066;"
      @click.stop="isShortcutOpen = !isShortcutOpen"
    >
      <i :class="`bi bi-caret-${isShortcutOpen ? 'right' : 'left'}-fill`"></i>
    </div>
    <div :class="tw(['relative', 'transition-all', 'duration-300', isShortcutOpen ? 'right-0' : 'right-[-120px]'])">
      <div
        ref="eventAnimateEl"
        class="event__container"
        style=""
        :class="tw([/*'mr-[38px]',*/ 'w-[120px]', 'select-none'])"
        @click.stop="eventAction"
      ></div>
      <!-- <div
    @click="action"
      class="shortcut__container"
      ref="animation"
      :class="tw(['w-full', 'md:w-[180px]', 'md:h-[180px]', 'max-w-[150px]', 'max-h-[150px]'])"
    ></div>
    <viewPetInfo /> -->

      <button class="scroll-top" @click="scrollToId('app')">
        <img :src="`${envImgUrl}/News/go-top.png`" alt="scroll top" />
      </button>
    </div>
  </div>
</template>

<script>
  import { useRoute } from 'vue-router'
  import { onMounted, ref, computed, watch, provide, onUnmounted } from 'vue'
  import store from '@/store'
  import lottie from 'lottie-web'
  import { event } from 'vue-gtag-next'
  import { deviceInfo } from '@/utils/ua'
  import { debounce } from 'lodash'
  import { getMiningPetInfo } from '@/api/member'
  import { DEFAULT_PET_ID } from './config'
  import viewPetInfo from './petInfo'

  export default {
    name: 'shortcut',

    components: {
      viewPetInfo
    },
    setup() {
      const route = useRoute()
      const isLogin = computed(() => store.getters['member/isLogin'])
      const isGuest = computed(() => store.state.member.info?.IsGuest ?? true)
      const petInfo = ref({})
      const envImgUrl = process.env.VUE_APP_IMG_URL
      const defaultPetID = DEFAULT_PET_ID
      const petID = ref(DEFAULT_PET_ID)
      const getPetInfo = async () => {
        try {
          if (isLogin.value && !isGuest.value) {
            const userToken = JSON.parse(localStorage.getItem('userToken'))
            const inputData = {
              accessToken: userToken[2]
            }
            const res = await getMiningPetInfo(inputData)
            petInfo.value = res.Data
            petID.value = petInfo.value.petInfo.id
          } else {
            petInfo.value = {}
            petID.value = DEFAULT_PET_ID
          }
        } catch {
          petInfo.value = {}
          petID.value = DEFAULT_PET_ID
        } finally {
          loadPetAnimation(petID.value)
        }
      }
      provide('petInfo', petInfo)
      watch(isLogin, () => {
        getPetInfo()
        refreshPetInfo()
      })
      // 重新回到此頁的時候，再取一次礦寵資料
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') getPetInfo()
      })
      // 每60秒取一次礦寵資料
      const getPetInterval = ref(null)
      const refreshPetInfo = () => {
        if (isLogin.value && !isGuest.value) {
          getPetInterval.value = setInterval(() => {
            getPetInfo()
          }, 60000)
        } else {
          clearInterval(getPetInterval.value)
        }
      }

      const mineUrl = computed(() => store.state.game.mine.url)
      watch(mineUrl, val => {
        if (!val) getPetInfo()
      })
      /**
       * @param { number } eleSize 礦寵尺寸
       * @param { number } eleHalfSize 礦寵尺寸(一半)
       * @param { number } heightDivide 下方邊界位置
       * @param { boolean } actionStatus 判定拖動或點擊狀態
       * @param { array } originPosition 紀錄點擊初始位置
       */

      const action = async () => {
        // 先判定未登入則顯示登入畫面
        if (!isLogin.value || isGuest.value) {
          store.commit('sign/UPDATE_DRAWER_STATE', true)
          store.commit('sign/UPDATE_IS_DREWER_SHOW_GUEST', false)
          return
        }
        event('mine_click', { click: 'float' })
        store.dispatch('sign/loginProxy', { binding: true, action: 'goMine' })
        if (store.state.audio.isPlaySound) {
          const audio = await store.dispatch('audio/getAudioPlayer', 'clickMinePet')
          if (audio) audio.play()
        }
      }

      const element = ref(null)
      const animation = ref(null)
      let outStatus = false
      let eleSize = 0
      let eleHalfSize = 0
      const heightDivide = window.innerHeight * 0.86
      onMounted(() => {
        eleSize = element.value.clientWidth
        eleHalfSize = element.value.clientWidth / 2
        // 處理ios瀏覽器滑動換頁時跑版，在滑動換頁時滑到礦寵前會先經過外層元素，因此監聽外層元素touch事件可阻止礦寵作用
        if (deviceInfo().includes('iOS')) {
          element.value.previousElementSibling.addEventListener('touchstart', () => {
            outStatus = true
          })
          element.value.previousElementSibling.addEventListener('touchend', () => {
            outStatus = false
          })
        }
        getPetInfo()
        refreshPetInfo()
        eventAnimation()
      })
      const loadPetAnimation = petID => {
        let animData = ''
        try {
          animData = require(`./lottie/${petID}.json`)
        } catch {
          animData = require(`./lottie/${defaultPetID}.json`)
        }
        lottie.destroy('lottieAnimation')
        lottie.loadAnimation({
          name: 'lottieAnimation',
          container: animation.value,
          animationData: animData,
          renderer: 'svg',
          loop: true,
          autoplay: true
        })
      }

      const isMobile = computed(() => store.getters['platform/isMobile'])
      watch(isMobile, () => {
        element.value.style.left = ''
        element.value.style.top = ''
      })

      // 20251017 添加活動浮動動畫於礦寵上方
      const eventAnimateEl = ref(null)
      const evantAnimArr = ref([])
      const eventAnimation = () => {
        destroyLotties()
        let animData = require(`./lottie/event/bind-line-gift-event.json`)
        lottie.destroy('eventAnimation')
        lottie.loadAnimation({
          name: 'eventAnimation',
          container: eventAnimateEl.value,
          animationData: animData,
          renderer: 'svg',
          loop: true,
          autoplay: true
        })
        evantAnimArr.value.push(animData)
      }
      const destroyLotties = () => {
        for (const anim of evantAnimArr.value) {
          anim?.destroy?.()
        }
        evantAnimArr.value = []
      }
      onUnmounted(() => {
        destroyLotties()
      })
      const eventAction = () => {
        window.open('https://lin.ee/ZLAGBl0', '_blank')
      }

      const scrollToId = name => {
        const container = document.getElementById('app')
        const target = document.getElementById(name)
        if (container && target) {
          const top = target.offsetTop
          container.scrollTo({ top, behavior: 'smooth' })
        }
      }

      // 添加收起功能
      const isShortcutOpen = ref(true)
      return {
        element,
        animation,
        petInfo,
        eventAnimateEl,
        isShortcutOpen,
        envImgUrl,
        // fn
        action,
        eventAction,
        scrollToId
      }
    }
  }
</script>
<style lang="scss" scoped>
  .scroll-top {
    display: inline-block;
    margin: 0 auto;
    width: 70px;
    height: 70px;
    margin-top: -80px;
    position: fixed;
    bottom: 0px;
    right: 0px;

    img {
      width: 100%;
      height: 100%;
    }
  }
  @media (max-width: 767px) {
    .scroll-top {
      width: 65px;
      height: 65px;
    }
  }
</style>

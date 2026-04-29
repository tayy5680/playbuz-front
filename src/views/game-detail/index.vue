<template>
  <div class="game-detail__wrap">
    <div class="game-detail__container" :class="tw(['mt-[-18px]'])">
      <gameBanner :info="info" :loading="loading" @open="action" />
      <div
        class="game-detail__content"
        :class="tw(['relative', 'bg-[#f0f0f0]', 'rounded-20px', 'py-30px', '-mt-20px', 'z-10'])"
        style="box-shadow: 0px 1px 3px #00000030;"
      >
        <viewInfo :info="info" :loading="loading" @open="action" />
        <gamePreview :info="info" :class="tw(['md:px-65px'])" />
        <div
          class="game-detail__text"
          :class="tw(['text-[#707070]', 'leading-normal', 'tracking-wider', 'mt-32px', 'px-mobileSpace', 'md:px-65px'])"
        >
          <el-skeleton v-if="!formatText.length" :loading="loading" animated />
          <p class="game-detail__article" v-else v-html="formatText" :class="tw(['leading-relaxed'])"></p>
          <div
            class="game-detail__more"
            v-if="displayMore"
            :class="tw(['cursor-pointer', 'mt-16px', 'text-lakeGreen', isMobile ? 'text-center' : 'text-right'])"
            @click="actionMore"
          >
            {{ enableMore ? $t('收起') : $t('閱讀更多') }}
          </div>
        </div>
      </div>
      <recommendList />
    </div>
    <gamePop
      v-if="enablePop"
      :info="info"
      :coinList="supportedPointTypeIDList"
      @close="setPop"
      @openWallet="toggleWallet"
    />
  </div>
</template>

<script>
  import { computed, provide, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import store from '@/store'

  import { gameInfo } from '@/api/game'
  import { COIN_TYPE } from '@/configs'
  import { event } from 'vue-gtag-next'

  import gameBanner from './banner'
  import viewInfo from './info'
  import gamePreview from './preview'
  import recommendList from './recommend'
  import gamePop from './pop'

  export default {
    name: 'game/detail',

    components: {
      gameBanner,
      viewInfo,
      gamePreview,
      recommendList,
      gamePop
    },

    setup() {
      const route = useRoute()
      const router = useRouter()
      const loading = ref(false)
      const isMobile = computed(() => store.getters['platform/isMobile'])
      const gameDetailProviderID = computed(() => info.value.Vendor?.GameProviderID)
      const isGuest = computed(() => store.state.member.info?.IsGuest ?? true)
      const isLogin = computed(() => store.getters['member/isLogin'])
      const lang = computed(() => store.state.member.languageCode)
      /** 是否是點擊立即遊玩進行登入 **/
      const isPageLogin = ref(false)

      const info = ref({})
      provide('info', info)

      // 遊戲支持幣值
      const supportedPointTypeIDList = computed(() => {
        let result = JSON.parse(JSON.stringify(COIN_TYPE)).reverse()

        // GameInfo中是否支援幣別
        const SupportedPointTypeIDList = info.value?.SupportedPointTypeID ?? []
        result = result.filter(item => SupportedPointTypeIDList.includes(item.id))
        return result
      })

      const getGameInfo = () => {
        return gameInfo({
          gameID: route.params.gameID,
          locale: lang.value
        })
          .then(res => {
            // 紀錄遊戲類型提供給返回鍵顯示文字。
            const trage = {
              gameDetailType: res.Data.GameType.toLowerCase(),
              minGold: res.Data.MinGold,
              minSilver: res.Data.MinSilver
            }
            store.dispatch('game/setGameDetailType', trage)
            info.value = res.Data
          })
          .catch(err => {
            console.warn(err)
          })
      }
      watch(lang, () => {
        init()
      })

      // 詳細介紹文字
      const limitTextLength = ref(150)
      const gameIntro = computed(() => info.value?.Introduction || '')
      const displayMore = computed(() => gameIntro.value.length > limitTextLength.value)
      const enableMore = ref(false)
      const formatText = computed(() => {
        return limitTextLength.value > gameIntro.value.length
          ? gameIntro.value
          : enableMore.value
          ? gameIntro.value
          : gameIntro.value
          ? gameIntro.value.slice(0, limitTextLength.value) + '...'
          : ''
      })

      const actionMore = () => {
        enableMore.value = !enableMore.value
        if (enableMore.value) event('game_detail_click', { click: 'more' })
      }

      const init = async () => {
        loading.value = true
        info.value = {}
        await getGameInfo()
        document.title = `${document.title} - ${info.value.GameName}`
        document.querySelector('meta[name="description"]').content = info.value.Introduction
        document.querySelector('meta[property="og:title"]').content = document.title
        document.querySelector('meta[property="og:description"]').content = info.value.Introduction
        enableMore.value = false
        loading.value = false
        // 網址添加GameType params
        router.replace({
          name: route.name,
          params: {
            ...route.params,
            gameType: info.value.GameType
          }
        })
      }

      watch(
        () => route.params.gameID,
        value => {
          if (value) init()
        }
      )
      watch(
        () => store.state.sign.drawerState,
        (value, oldValue) => {
          // 判斷使用者是否由遊戲詳細頁的「立即遊玩」點擊並且登入
          if (!value && !isLogin.value && isPageLogin.value) {
            isPageLogin.value = false
            return
          }
          if (!value && oldValue && isLogin.value && !isGuest.value && isPageLogin.value) {
            getGameInfo()
            setPop(true)
            isPageLogin.value = false
          }
        }
      )
      watch(isLogin, () => {
        init()
      })
      init()

      const enablePop = ref(false)
      const setPop = (bol = false) => {
        if (info.value.GameID === 5001) enablePop.value = false
        else enablePop.value = bol
      }

      const action = () => {
        if (isLogin.value) setPop(true)
        else {
          isPageLogin.value = true
          store.commit('sign/UPDATE_DRAWER_STATE', true)
          store.commit('sign/UPDATE_IS_DREWER_SHOW_GUEST', false)
        }
      }
      const bindAccount = () => {
        enablePop.value = false
        store.commit('sign/UPDATE_DRAWER_STEP', 'bindAccount')
        store.commit('sign/UPDATE_DRAWER_STATE', true)
      }
      provide('bindAccount', bindAccount)

      const gameLinkData = ref({})
      const enableWallet = computed(() => store.state.wallet.enableWallet)
      const toggleWallet = (obj = {}) => {
        if (Object.keys(obj).length) store.dispatch('wallet/setWalletActionObject', obj)
        store.dispatch('wallet/setIsDisplayViewData', false)
        store.dispatch('wallet/setDisplayBalanceType', obj.pointTypeID)
        store.dispatch('wallet/setEnableWallet', !store.state.wallet.enableWallet)
        if (enableWallet.value) event('wallet_show', { show: 'game' })
      }

      return {
        info,
        loading,
        enablePop,
        displayMore,
        enableMore,
        action,
        actionMore,
        formatText,
        isMobile,
        enableWallet,
        setPop,
        toggleWallet,
        gameLinkData,
        supportedPointTypeIDList,
        gameDetailProviderID
      }
    }
  }
</script>

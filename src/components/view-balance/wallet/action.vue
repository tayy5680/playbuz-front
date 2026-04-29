<template>
  <div class="wallet-action__wrap" :class="tw(['mb-40px', 'px-30px', 'md:px-60px'])">
    <div class="wallet-action__container">
      <div
        class="wallet-action__tips"
        :class="
          tw([
            'flex',
            'flex-col',
            'items-center',
            'justify-center',
            'my-12px',
            Object.keys(choseMainWallet).length ? '' : 'invisible'
          ])
        "
      >
        <div class="wallet-action__count" :class="tw([`text-[${walletTypeTemplete.color}]`, 'text-34px'])">
          {{ pointFormatter(choseMainWallet.count) }}
        </div>
        <viewSelectorMain
          :list="mainWalletList"
          :activeID="walletFrom.main"
          :themes="walletTypeTemplete.id"
          :placeholder="$t('請選擇轉出錢包')"
          @action="actionMainWallet"
          :disabled="disabledMainSwitchAction"
        />
      </div>
      <img class="wallet-action__move" :src="require('./images/i_arrow_d.svg')" :class="tw(['my-12px', 'mx-auto'])" />
      <viewSelectorMirror
        :list="minorWalletList"
        :activeID="walletFrom.minor"
        :themes="walletTypeTemplete.id"
        :placeholder="$t('請選擇轉入錢包')"
        @action="actionMinorWallet"
        :disabled="disabledMinorSwitchAction"
      />
      <div
        class="wallet-action__tips"
        :class="tw(['text-white', 'my-12px', Object.keys(choseMinorWallet).length ? '' : 'invisible'])"
      >
        <div class="wallet-action__count" :class="tw(['text(18px center)', 'font-extralight'])">
          {{ pointFormatter(choseMinorWallet.count) }}
        </div>
      </div>
      <div
        class="wallet-sample__wrap"
        :class="
          tw([
            'text(violet 14px)',
            'py-12px',
            'border-t',
            'border(dashed purpleLine)',
            'grid',
            'grid-cols-3',
            'gap-x-6px'
          ])
        "
      >
        <div
          class="wallet-sample__item"
          v-audio="'transferAmount'"
          v-for="(item, index) of sampleCountTemplete"
          :key="index"
          :class="
            tw([
              'cursor-pointer',
              'flex-1',
              'p-8px',
              'text-center',
              buttonStatus(item.count)
                ? walletType === 1
                  ? `bg-[${walletTypeTemplete.color}] text-[#000000]`
                  : `bg-switchMobileBg text-white`
                : 'bg-[#302E33] text-[#7B7B7B]',
              'rounded-10px',
              'text-18px',
              'md:text-14px'
            ])
          "
          @click="actionSampleteCount(item.count)"
        >
          {{ item.label }}
        </div>
      </div>
      <div
        class="wallet__count"
        :class="tw(['bg-deepBlackPurple', 'rounded-full', 'border', 'border-depositInputLine', 'p-4px'])"
      >
        <div
          class="wallet__input"
          :class="tw(['w-full', 'flex', 'items-center', 'p-6px', 'pl-28px', walletFrom.count ? 'pr-6px' : 'pr-28px'])"
        >
          <input
            :class="tw(['bg-transparent', 'placeholder-depositInputLine', 'text(white 18px center)', 'w-full'])"
            :placeholder="$t('請輸入轉帳額度')"
            type="tel"
            pattern="\d*"
            inputmode="numeric"
            v-model="walletFrom.count"
            @input="isChoseSample = false"
            :disabled="loading || buttonAllLoading"
          />
          <div
            class="wallet__close"
            v-if="walletFrom.count"
            :class="
              tw([
                'w-26px',
                'h-26px',
                'border',
                'border-white',
                'rounded-full',
                'flex',
                'items-center',
                'justify-center',
                'flex-shrink-0',
                loading || buttonAllLoading ? 'pointer-events-none' : ''
              ])
            "
            @click="clearCoin"
          >
            <div
              class="wallet-close__icon"
              :class="tw(['w-14px', 'h-14px', 'bg-white'])"
              :style="{
                '-webkit-mask': `url(${require('./images/i_close.svg')}) no-repeat center /contain`,
                mask: `url(${require('./images/i_close.svg')}) no-repeat center /contain`
              }"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="wallet-action__bottom"
      :class="tw([isMobile || !isDisplayViewData ? '' : 'flex', 'items-center', 'mt-10px'])"
    >
      <div
        v-audio="Boolean(item.disable) ? 'none' : 'payAndEnterGame'"
        v-for="(item, index) of buttonList"
        :key="item.disable"
        :class="
          tw([
            'flex-1',
            'relative',
            'overflow-hidden',
            'cursor-pointer',
            'text(18px center white)',
            item.disable
              ? 'bg-purpleLine cursor-not-allowed text-confirmBtnText'
              : item.id === 0
              ? 'bg-switchMobileBg'
              : 'bg-depositBtnBg',
            'rounded-full',
            'flex-1',
            'p-8px',
            buttonList.length > index ? 'mr-4px' : '',
            !item.enable ? 'hidden' : '',
            isMobile || !isDisplayViewData ? 'mb-10px' : '',
            transitionBase
          ])
        "
        @click="action(item.id)"
        v-loading="loading || buttonAllLoading"
      >
        {{ $t(item.label) }}
      </div>
    </div>
    <div
      class="wallet__warring"
      v-if="choseMainWallet.maintenStatus || choseMinorWallet.maintenStatus"
      :class="tw(['text(16px center chatroomUnreadBg)', 'my-14px'])"
    >
      <span>{{ $t(choseMainWallet.maintenStatus ? '轉出' : '') }}</span>
      <span>{{ $t(choseMinorWallet.maintenStatus ? '轉入' : '') }}</span>
      <span>{{ $t('遊戲商維護中，請稍後再操作') }}</span>
    </div>
  </div>
</template>

<script>
  import { inject, reactive, computed, watch, ref, onBeforeUnmount } from 'vue'
  import store from '@/store'
  import viewSelectorMain from './selector-main'
  import viewSelectorMirror from './selector-mirror'

  import { postWalletTransfer } from '@/api/wallet'
  import { useNotice } from '@/utils/use-notice'
  import { pointFormatter } from '@/utils/formatters'
  import { gameOpenProcess } from '@/utils/game-open-process'
  import { event } from 'vue-gtag-next'
  import { useI18n } from 'vue-i18n'

  export default {
    name: 'wallet-action',

    components: {
      viewSelectorMain,
      viewSelectorMirror
    },

    setup() {
      const { t } = useI18n()
      const sampleCountTempleteList = reactive([
        { coinID: 1, label: '3,000', count: 3000 },
        { coinID: 1, label: '6,000', count: 6000 },
        { coinID: 2, label: '10,000', count: 10000 },
        { coinID: 2, label: '50,000', count: 50000 },
        { coinID: 0, label: t('全部'), count: null }
      ])

      const sampleCountTemplete = computed(() => {
        return sampleCountTempleteList.filter(item => item.coinID === walletTypeTemplete.value?.id || item.coinID === 0)
      })

      const buttonStatus = count => {
        const inputCount = parseInt(walletFrom.count) || 0
        const hasCount = choseMainWallet.value.count
        if (count === inputCount) return false
        if (count === null) return inputCount !== hasCount
        return hasCount >= count
      }

      // 重複點擊時累加
      const choseSampleCount = ref(null)
      const isChoseSample = ref(false)

      const isMobile = computed(() => store.getters['platform/isMobile'])
      const disabledMainSwitchAction = computed(() => store.state.wallet.wallectStatus.mainProviderDisable)
      const disabledMinorSwitchAction = computed(() => store.state.wallet.wallectStatus.minorProviderDisable)
      const mainSwitchProviderID = computed(() => store.state.wallet.wallectStatus.mainProviderID)
      const minorSwitchProviderID = computed(() => store.state.wallet.wallectStatus.minorProviderID)
      const walletType = computed(() => store.state.wallet.displayBalanceType)
      const isDisplayViewData = computed(() => store.state.wallet.isDisplayViewData)
      const walletTypeTemplete = inject('walletTypeTemplete')
      const gameWalletCountList = inject('gameWalletCountList')
      const gameDetail = computed(() => store.state.game.gameDetail)
      const gameObject = computed(() => store.state.wallet.walletActionObject)
      const lowBet = computed(() =>
        walletTypeTemplete.value?.id === 2 ? gameDetail.value.minSilver : gameDetail.value.minGold
      )

      const buttonAllLoading = inject('buttonAllLoading')

      const walletFrom = reactive({})
      const initWalletFrom = () => {
        walletFrom.main = null
        walletFrom.minor = null
        walletFrom.count = null
      }
      initWalletFrom()

      watch(
        () => walletFrom.count,
        () => {
          if (walletFrom.count) walletFrom.count = walletFrom.count.replace(/[^\d]/g, '')
          if (parseInt(walletFrom.count) > choseMainWallet.value.count)
            walletFrom.count = choseMainWallet.value.count.toString()
        }
      )

      const formatWalletList = computed(() => {
        if (!gameWalletCountList.value) return []
        return gameWalletCountList.value.reduce((acc, cur) => {
          const target = {
            id: cur.WalletPointTypeID,
            label: cur.WalletName,
            count: cur.Balance,
            maintenStatus: cur.MaintenanceID
          }
          return acc.concat(target)
        }, [])
      })

      const actionSampleteCount = action => {
        if (!choseMainWallet.value.count || choseMainWallet.value.count < action)
          return useNotice({ type: 'error', message: t('餘額不足'), isI18n: false })
        if (action) walletFrom.count = action.toString()
        else {
          choseSampleCount.value = null
          walletFrom.count = choseMainWallet.value.count.toString()
        }
        isChoseSample.value = true
      }

      const choseMainWallet = computed(() => {
        if (!formatWalletList.value.length || !walletFrom.main) return {}
        return formatWalletList.value.find(item => item.id === walletFrom.main)
      })

      const choseMinorWallet = computed(() => {
        if (!formatWalletList.value.length || !walletFrom.minor) return {}
        return formatWalletList.value.find(item => item.id === walletFrom.minor)
      })

      const mainWalletList = computed(() => {
        return formatWalletList.value.filter(item => item.id !== walletFrom.minor)
      })

      const minorWalletList = computed(() => {
        return formatWalletList.value.filter(item => item.id !== walletFrom.main)
      })

      const actionMainWallet = id => {
        walletFrom.main = id
      }

      const actionMinorWallet = id => {
        walletFrom.minor = id
      }

      // 切換幣值種類時
      watch(walletTypeTemplete, (newVal, oldVal) => {
        const oldMain = store.state.wallet.walletList[oldVal.id].find(
          item => item.WalletPointTypeID === walletFrom.main
        )
        const oldMinor = store.state.wallet.walletList[oldVal.id].find(
          item => item.WalletPointTypeID === walletFrom.minor
        )
        const newMain = oldMain?.GameProviderID
          ? gameWalletCountList.value.find(item => item.GameProviderID === oldMain.GameProviderID)
          : null
        const newMinor = oldMinor?.GameProviderID
          ? gameWalletCountList.value.find(item => item.GameProviderID === oldMinor.GameProviderID)
          : null
        initWalletFrom()
        walletFrom.main = newMain?.WalletPointTypeID || mainWalletList.value[0].id
        walletFrom.minor = newMinor?.WalletPointTypeID || null
        store.dispatch('wallet/setPointTypeID', newVal.id)
      })

      const loading = ref(false)
      const buttonList = reactive([
        {
          id: 1,
          label: '確認轉帳',
          enable: true,
          disable: computed(() => {
            // 如果欄位未全部填寫
            const nonFillOut = Object.values(walletFrom)
              .map(item => !!item)
              .includes(false)

            // 如果輸入金額大於本身擁有額度
            const nonwalletCount = walletFrom.count > choseMainWallet.value.count

            return (
              nonFillOut ||
              nonwalletCount ||
              !Number(walletFrom.count) ||
              choseMainWallet.value?.maintenStatus ||
              choseMinorWallet.value?.maintenStatus
            )
          })
        },
        {
          id: 0,
          label: '直接進入遊戲',
          enable: computed(() => gameObject.value && Object.keys(gameObject.value).length),
          disable: false
        }
      ])

      const action = async id => {
        if (buttonAllLoading.value || loading.value) return false

        if (id === 1) {
          const target = buttonList.find(item => item.id === id)
          if (target.disable) return false
        }

        loading.value = true

        try {
          switch (id) {
            case 0:
              await actionGameLink()
              setTimeout(() => {
                loading.value = false
              }, 3000)
              break
            case 1:
              await actionPostWalletTransfer()
              await actionPostWalletSearch()
                .then(() => {
                  if (gameObject.value && Object.keys(gameObject.value).length) {
                    actionGameLink()
                  }
                })
                .finally(() => {
                  clearCoin()
                  loading.value = false
                })
              break
          }
        } catch (err) {
          console.warn(err)
        }
      }

      /**
       * 1.確認錢包價錢是否符合此遊戲最低遊玩金額
       * 2.Yes: 開啟遊戲連結，並關閉錢包視窗 No: 提示訊息
       */
      const actionGameLink = () => {
        event('game_play', {
          game_id: gameObject.value?.gameID,
          coin_type: gameObject.value?.pointTypeID
        })

        if (choseMinorWallet.value?.count >= lowBet.value) {
          return gameOpenProcess(gameObject.value).then(() => store.dispatch('wallet/setEnableWallet', false))
        }

        return useNotice({ type: 'error', message: `${t('此款遊戲最低遊玩金額為')} ${lowBet.value}`, isI18n: false })
      }

      const actionPostWalletTransfer = () => {
        return postWalletTransfer({
          FromWalletPointTypeID: walletFrom.main,
          ToWalletPointTypeID: walletFrom.minor,
          Point: parseInt(walletFrom.count),
          CheckProviderMember: true
        })
          .then(_ => {
            useNotice({ type: 'info', message: '轉移成功' })
          })
          .catch(err => {
            const errorCodeList = {
              6400: '錢包餘額不足',
              6501: '遊戲中，不可轉帳'
            }

            const errorMessage = errorCodeList[err.Code] ?? '發生錯誤，請稍後再試，或洽客服人員'
            useNotice({ type: 'error', message: errorMessage })
          })
      }

      const clearCoin = () => {
        walletFrom.count = null
        isChoseSample.value = false
        choseSampleCount.value = null
      }

      const actionPostWalletSearch = () => {
        return store.dispatch('wallet/updateAllWallet')
      }

      const setStyleMaskImage = url => {
        return `url(${url}) no-repeat center /contain`
      }

      const init = () => {
        // 預設轉出錢包為主錢包(id:0)與轉入錢包為VA 拉霸(id:1)
        const mainProviderID = mainSwitchProviderID?.value ?? 0
        const minorProviderID = minorSwitchProviderID?.value ?? 1
        const main = gameWalletCountList.value.find(item => item.GameProviderID === mainProviderID)
        const minor = gameWalletCountList.value.find(item => item.GameProviderID === minorProviderID)
        walletFrom.main = main?.WalletPointTypeID ?? null
        walletFrom.minor = minor?.WalletPointTypeID ?? null
      }

      init()

      onBeforeUnmount(() => {
        store.dispatch('wallet/setWalletDefaultStatus')
      })

      return {
        loading,

        walletType,
        sampleCountTemplete,
        disabledMainSwitchAction,
        disabledMinorSwitchAction,
        walletFrom,
        mainWalletList,
        minorWalletList,
        actionMainWallet,
        actionMinorWallet,
        choseMainWallet,
        choseMinorWallet,
        action,
        isMobile,
        isDisplayViewData,

        walletTypeTemplete,
        pointFormatter,
        setStyleMaskImage,
        buttonList,
        isChoseSample,
        buttonAllLoading,
        choseSampleCount,

        // fn
        clearCoin,
        actionSampleteCount,
        buttonStatus
      }
    }
  }
</script>

<template>
  <div
    class="game-pop__cover"
    :class="tw(['fixed', 'left-0', 'top-0', 'w-full', 'h-full', 'z-40'])"
    @click="close"
  ></div>
  <div
    class="game-pop__wrap"
    v-if="Object.keys(info).length"
    :class="tw(['fixed', 'left-1/2', 'bottom-0', '-translate-x-1/2', 'top-1/2', '-translate-1/2', 'z-40'])"
  >
    <div class="game-pop__container" :class="tw(['relative', 'bg-[white]', 'rounded-20px', 'w-428px', 'h-300px'])">
      <div class="game-pop__icon" :class="tw(['relative', 'flex', 'justify-center', 'transform', '-translate-y-1/2'])">
        <img
          class="game-pop__img"
          :src="`${gameSiteURL}/game/pc/type_short/${info.GameID}.jpg`"
          :class="tw(['relative', 'w-128px', 'h-128px', 'rounded-20px', 'shadow-gameDetailIcon'])"
        />
      </div>
      <div class="game-pop__label" :class="tw(['text([#707070] 28px center)', '-mt-40px', 'font-bold'])">
        {{ info.GameName }}
      </div>
      <div class="game-pop__coin__list" :class="tw(['flex', 'mt-52px'])">
        <div
          class="game-pop__coin__item"
          v-audio="['chooseCoin']"
          v-if="coinList.length === 0"
          :class="tw(['relative', 'flex-1', 'flex', 'flex-col', 'items-center', 'cursor-pointer', 'group'])"
        >
          <div
            class="game-pop__coin__label"
            :class="
              tw([
                'text(18px [#7c7ed7])',
                'mt-14px',
                'transform',
                'group-hover:scale-125',
                'group-hover:text-white',
                transitionBase,
                'duration-300'
              ])
            "
            @click="bindAccount"
          >
            {{ $t('金幣限定遊戲，註冊後就能遊玩唷！') }}
          </div>
        </div>
        <div
          class="game-pop__coin__item"
          v-audio="['chooseCoin']"
          v-for="(item, index) of coinList"
          :class="tw(['relative', 'flex-1', 'flex', 'flex-col', 'items-center', 'cursor-pointer', 'group'])"
          :key="item.id"
          @click="action(item.id)"
        >
          <img
            class="game-pop__coin__icon"
            :src="item.img"
            :class="tw(['w-56px', 'h-56px', 'transform', 'group-hover:scale-125', transitionBase, 'duration-300'])"
          />
          <div
            class="game-pop__coin__label"
            :class="
              tw([
                'text(18px coinColor)',
                'mt-14px',
                'transform',
                'group-hover:scale-125',
                'group-hover:text-white',
                transitionBase,
                'duration-300'
              ])
            "
          >
            {{ $t('{coinName}遊玩', { coinName: $t(item.label) }) }}
          </div>
          <div
            class="game-pop__coin__line"
            v-if="coinList.length - 1 > index"
            :class="tw(['absolute', 'top-1/2', '-translate-y-1/2', 'right-0', 'bg-purpleLine', 'h-80px', 'w-1px'])"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { inject, onBeforeMount, onUnmounted } from 'vue'
  import { useRoute } from 'vue-router'
  import store from '@/store'

  import { useNotice } from '@/utils/use-notice'

  export default {
    name: 'game-pop',

    props: {
      info: {
        type: Object,
        default: () => {}
      },

      coinList: {
        type: Array,
        default: () => []
      }
    },

    emits: ['close', 'openWallet'],

    setup(props, { emit }) {
      const gameSiteURL = process.env.VUE_APP_IMG_URL + '/img'

      onBeforeMount(() => {
        store.dispatch('platform/setCover', true)
      })

      onUnmounted(() => {
        store.dispatch('platform/setCover', false)
      })
      const ORIGIN = location.origin
      const route = useRoute()

      const action = async id => {
        const target = {
          pointTypeID: id,
          gameID: props.info.GameID,
          gameProvider: props.info.Vendor.GameProvider,
          gameProviderGameID: props.info.Vendor.GameProviderGameID,
          returnUrl: `${ORIGIN}${route.path}`
        }

        const choseWallet = store.state.wallet.walletList[id]
        if (!choseWallet) return useNotice({ type: 'error', message: '發生錯誤，請稍後再試，或洽客服人員' })

        const wallet = choseWallet.find(item => item.GameProviderID === props.info.Vendor.GameProviderID)
        if (!wallet) return useNotice({ type: 'error', message: '發生錯誤，請稍後再試，或洽客服人員' })

        const wallectStatus = JSON.parse(JSON.stringify(store.state.wallet.wallectStatus))
        wallectStatus.minorProviderDisable = true
        wallectStatus.minorProviderID = props.info.Vendor.GameProviderID
        wallectStatus.supportedPointTypeID = props.info.SupportedPointTypeID
        store.dispatch('wallet/setWalletStatus', wallectStatus)

        emit('openWallet', target)
        close()
        return false
      }

      const close = () => {
        emit('close')
      }

      return {
        close,
        gameSiteURL,
        // fn
        action,
        bindAccount: inject('bindAccount')
      }
    }
  }
</script>

<template>
  <teleport to="body">
    <div
      class="wallet__wrap"
      :class="tw(['fixed', 'z-30', 'inset-0', 'flex', 'w-full', 'h-full', 'items-center', 'justify-center'])"
    >
      <div class="wallet__container" :class="tw(['bg-navBgHover', 'rounded-20px', `chose-tag-${choseID}`])">
        <div
          class="wallet__top"
          :class="tw([isMobile ? '' : 'bg-deepBlackPurple', 'py-20px', 'px-24px', 'rounded-t-20px'])"
        >
          <div class="wallet__tool" :class="tw(['relative', 'flex', 'items-center', 'md:mb-0'])">
            <div
              v-for="item of topToolList"
              :key="item.id"
              :class="[
                !isDisplayViewData && ['shop', 'record'].includes(item.id) ? 'hidden' : '',
                `wallet__${item.id}`,
                tw([
                  'relative',
                  item.aside ? 'mr-auto' : 'ml-32px',
                  ['close'].includes(item.id) ? 'p-10px -m-10px' : ''
                ])
              ]"
              v-audio="item.id === 'close' ? 'close' : 'none'"
            >
              <div
                class="icon"
                :class="[
                  tw([
                    'cursor-pointer',
                    `w-${item.size}px`,
                    `h-${item.size}px`,
                    item.id === 'question' && switchQuesttion ? 'bg-menuLine' : 'bg-white',
                    'hover:bg-menuLine'
                  ])
                ]"
                :style="{
                  '-webkit-mask': setStyleMaskImage(item.icon),
                  mask: setStyleMaskImage(item.icon)
                }"
                @click="topAction(item.id, 'click')"
                @mouseover="topAction(item.id, 'mouseover')"
                @mouseleave="topAction(item.id, 'mouseleave')"
                @touchend="topAction(item.id, 'touchend')"
              ></div>
              <viewPop v-if="item.id === 'question' && switchQuesttion" />
            </div>
          </div>
          <!-- <div class="wallet__menu">
            <viewMenu />
          </div> -->
        </div>
        <div
          class="wallet__main"
          :class="tw(['flex', 'overflow-y-scroll', isMobile ? '' : 'mt-34px', 'mb-12px'])"
          style="max-height: calc(90svh - 100px);"
        >
          <viewData v-if="!isMobile && isDisplayViewData" :class="tw(['flex-1'])" />
          <viewAction :class="tw(['flex-1'])" />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
  import { ref, computed, provide, onBeforeMount, onUnmounted } from 'vue'
  import store from '@/store'
  import { useRouter, useRoute } from 'vue-router'

  import { COIN_TYPE } from '@/configs'

  import viewMenu from './menu'
  import viewData from './data'
  import viewAction from './action'
  import viewPop from './pop'

  export default {
    name: 'wallet',

    components: {
      viewMenu,
      viewData,
      viewAction,
      viewPop
    },

    setup() {
      const route = useRoute()
      const router = useRouter()
      const choseID = computed(() => store.state.wallet.displayBalanceType)
      const switchQuesttion = ref(false)
      const buttonAllLoading = ref(false)

      provide('buttonAllLoading', buttonAllLoading)

      const topToolList = ref([
        { id: 'question', icon: require('./images/i_cashinfo.svg'), size: 26, aside: true },
        { id: 'shop', icon: require('./images/i_cashplus2.svg'), size: 26 },
        { id: 'record', icon: require('./images/i_ghistory.svg'), size: 26 },
        { id: 'close', icon: require('./images/i_close.svg'), size: 18 }
      ])

      const topAction = (id, action) => {
        if (isMobile.value && (action === 'touchend' || action === 'click')) {
          switch (id) {
            case 'question':
              switchQuesttion.value = !switchQuesttion.value
              break
            case 'shop':
              if (route.name !== 'deposit') router.push({ name: 'deposit' })
              store.dispatch('wallet/setEnableWallet', false)
              break
            case 'record':
              store.dispatch('wallet/setEnableRecord', true)
              store.dispatch('wallet/setEnableWallet', false)
              break
            case 'close':
              store.dispatch('wallet/setEnableWallet', false)
              break
          }
        } else if (!isMobile.value && action !== 'touchend') {
          switch (id) {
            case 'question':
              if (!['mouseover', 'mouseleave'].includes(action)) break
              switchQuesttion.value = action === 'mouseover'
              break
            case 'shop':
              if (action !== 'click') break
              if (route.name !== 'deposit') router.push({ name: 'deposit' })
              store.dispatch('wallet/setEnableWallet', false)
              break
            case 'record':
              if (action !== 'click') break
              store.dispatch('wallet/setEnableRecord', true)
              store.dispatch('wallet/setEnableWallet', false)
              break
            case 'close':
              if (action !== 'click') break
              store.dispatch('wallet/setEnableWallet', false)
              break
          }
        }
      }
      provide('topAction', topAction)

      const isDisplayViewData = computed(() => store.state.wallet.isDisplayViewData)
      const isMobile = computed(() => store.getters['platform/isMobile'])
      const walletType = computed(() => store.state.wallet.displayBalanceType)

      const walletTypeTemplete = computed(() => {
        const target = COIN_TYPE.find(item => item.id === walletType.value)
        if (target.id === 2) target.color = '#cd9cff'
        return target
      })
      provide('walletTypeTemplete', walletTypeTemplete)

      const mainWalletCount = computed(() => {
        const target = store.state.wallet.walletList?.[walletType.value]
        if (!target) return 0
        const chose = target.find(item => item.WalletPointTypeID === walletType.value)
        return chose.Balance
      })
      provide('mainWalletCount', mainWalletCount)

      const gameWalletCountList = computed(() => {
        const target = store.state.wallet.walletList
        if (!Object.keys(target).length) return []
        return target[walletType.value]
      })
      provide('gameWalletCountList', gameWalletCountList)

      const setStyleMaskImage = url => {
        return `url(${url}) no-repeat center /contain`
      }

      onBeforeMount(() => {
        store.dispatch('platform/setCover', true)
      })

      onUnmounted(() => {
        // 還原轉帳預設值
        store.dispatch('wallet/setIsDisplayViewData', true)
        store.dispatch('wallet/setWalletActionObject', null)
        store.dispatch('wallet/setDisplayBalanceType', 1)
        store.dispatch('wallet/setEnableWallet', false)

        store.dispatch('platform/setCover', false)
      })

      return {
        choseID,
        topToolList,
        mainWalletCount,
        isMobile,
        switchQuesttion,
        isDisplayViewData,
        // fn
        setStyleMaskImage,
        topAction
      }
    }
  }
</script>
<style scoped>
  /* width */
  ::-webkit-scrollbar {
    display: block;
    width: 10px;
    opacity: 1;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: transparent;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }
</style>

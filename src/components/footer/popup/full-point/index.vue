<template>
  <div
    class="miningpet__debug__mode"
    :class="tw([
      'flex',
      'items-center',
      'justify-between',
      'mt-[12px]',
      'w-full',
    ])"
  >
    <p :class="tw(['text-white'])">顯示所有錢包</p>
    <switchView
      active="開啟"
      inactive="關閉"
      :switchBol="isDebugMode"
      :class="tw([
        'ml-[20px]',
      ])"
      @change="action()"
    />
  </div>
</template>

<script>
import { computed, watch } from 'vue'
import store from '@/store'
import switchView from '@/components/ui/switch-view'

export default {
  components: {
    switchView,
  },

  setup () {
    const action = () => {
      store.dispatch('wallet/setWalletDebug', !isDebugMode.value)
    }
    const isDebugMode = computed(() => store.state.wallet.debug)

    watch(isDebugMode, (val) => {
      const superModeItem = JSON.parse(localStorage.getItem('superMode'))
      if (localStorage.getItem('superMode')) {
        const superMode = {
          ...superModeItem,
          walletDebug: val,
        }
        localStorage.setItem('superMode', JSON.stringify(superMode))
      }
    })
    return {
      action,
      isDebugMode,
    }
  },
}
</script>

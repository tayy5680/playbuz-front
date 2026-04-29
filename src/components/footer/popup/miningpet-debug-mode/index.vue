<template>
  <div
    class="miningpet__debug__mode"
    :class="tw([
      'flex',
      'items-center',
      'mt-3',
      'mr-auto',
    ])"
  >
    <p :class="tw(['text-white'])">礦寵開啟 Debug 模式:</p>
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
      store.dispatch('game/setMineDebug', !isDebugMode.value)
    }
    const isDebugMode = computed(() => store.state.game.mine.debug)

    watch(isDebugMode, (val) => {
      const superModeItem = JSON.parse(localStorage.getItem('superMode'))
      if (localStorage.getItem('superMode')) {
        const superMode = {
          ...superModeItem,
          debug: val,
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

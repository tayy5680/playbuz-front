<template>
  <teleport to="#pop-view__teleport">
    <transition name="pop-view">
      <slot v-if="displayPoint"></slot>
    </transition>
  </teleport>
</template>

<script>
import { computed, onUnmounted, ref, watch } from 'vue'
import store from '@/store'

export default {
  name: 'teleport-item',

  setup (props, { slots }) {
    const point = ref(null)
    point.value = new Date().getTime()

    watch(() => slots.default()[0].type, (obj) => {
      /*
        obj type
        object: has component
        symbol: none component
      */
      store.dispatch('platform/setTeleportList', point.value)
    })

    const displayPoint = computed(() => {
      return store.state.platform.teleportList[0] === point.value
    })

    onUnmounted(() => {
      store.dispatch('platform/setTeleportList', point.value)
    })

    return {
      displayPoint,
    }
  },
}
</script>

<template>
    <div class="pop__wrap" :class="tw([
      'absolute',
      'z-10',
    ])">
      <div
        :class="tw([
          'relative',
          'bottom-full',
          'top-[1px]',
          'left-2',
          'w-0',
          'h-0',
          'border',
          'border-solid',
          'border-t-0',
          'border-r-[7px]',
          'border-b-[10px]',
          'border-l-[7px]',
        ])"
        :style="{ borderColor: 'transparent transparent #fff transparent' }"
      />
      <div
        class="pop__container"
        :class="tw([
          'bg-white',
          'p-[25px]',
          'rounded-[6px]',
          'w-[240px]',
        ])"
      >
        {{ explanin }}
      </div>
    </div>
    <teleport
      to="body"
      v-if="isMobile"
    >
      <div
        class="pop__mask"
        :class="tw([
          'absolute',
          'top-0',
          'left-0',
          'w-full',
          'h-full',
          'z-40',
        ])"
        @click="close"
        v-audio="'close'"
      />
    </teleport>
  </template>

<script>
import { computed } from 'vue'
import store from '@/store'

export default {
  name: 'wallet-pop',

  props: {
    message: {
      type: String,
      default: () => '',
    },
    action: {
      type: Function,
      default: () => '',
    },
  },

  setup (props) {
    const close = () => {
      props.action()
    }
    const isMobile = computed(() => store.getters['platform/isMobile'])
    const explanin = computed(() => props.message)

    return {
      isMobile,
      explanin,
      // fn
      close,
    }
  },
}
</script>

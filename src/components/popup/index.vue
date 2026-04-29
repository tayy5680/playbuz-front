<template>
  <teleport to="body">
    <transition name="fade">
      <div
        class="popup__wrap"
        :class="tw([
          'fixed',
          'top-0',
          'left-0',
          'h-full',
          'w-full',
          'z-30',
          'flex',
          'items-center',
          'justify-center',
        ])"
      >
        <div
          class="popup__mask"
          :class="tw([
            'fixed',
            'top-0',
            'left-0',
            'h-full',
            'w-full',
          ])"
          @click="$emit('close')"
        ></div>
        <div
          class="popup__container"
          v-loading="loading"
          :class="tw([
            'relative',
            'bg-navBgHover',
            'p-30px',
            'rounded-20px',
            'w-300px',
            'max-w-full',
            'min-h-300px',
            'max-h-full',
            'flex',
            'flex-col',
            'overflow-hidden',
          ])"
        >
          <div class="popup__top">
            <div
              class="popup__close"
              v-if="enableClose"
              @click="$emit('close')"
            ></div>
          </div>
          <div
            class="popup__context"
            :class="tw([
              'm-auto'
            ])"
          >
            <slot name="context"></slot>
          </div>
          <div class="popup__bottom"
          :class="tw([
            $slots.bottom ? 'mt-32px': '',
          ])">
            <slot name="bottom"></slot>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { onBeforeMount, onUnmounted } from 'vue'
import store from '@/store'

export default {
  props: {
    enableClose: {
      type: Boolean,
      default: () => false,
    },

    loading: {
      type: Boolean,
      default: () => false,
    },
  },

  emits: [
    'close',
  ],

  setup () {
    onBeforeMount(() => {
      store.dispatch('platform/setCover', true)
    })

    onUnmounted(() => {
      store.dispatch('platform/setCover', false)
    })
  },
}
</script>

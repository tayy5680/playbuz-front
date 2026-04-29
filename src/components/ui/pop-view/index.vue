<template>
  <div
    class="pop-view__wrap"
    :class="
      tw(['fixed', 'top-1/2', 'left-1/2', '-translate-x-1/2', '-translate-y-1/2', 'z-30', 'px-[14px]', 'max-w-full'])
    "
  >
    <div
      class="pop-view__container"
      :class="
        tw([
          'relative',
          'h-full',
          'bg-[#f8f8f8]',
          'p-[24px]',
          `w-[${viewWidth}]`,
          'max-w-full',
          `h-[${viewHeight}]`,
          `max-h-[${viewMaxHeight}]`,
          'rounded-20px',
          'mx-auto',
          'flex',
          'flex-col',
          'select-none'
        ])
      "
    >
      <div
        class="pop-view__top"
        :class="tw(['flex', 'items-center', 'justify-center', 'flex-shrink', 'text([#374151] [20px])'])"
      >
        <slot name="top"></slot>
      </div>
      <div class="pop-view__main" :class="tw(['flex-1', 'flex', 'flex-col', 'h-[90%]'])">
        <el-scrollbar wrap-style="display: flex; flex-direction: column; flex: 1 1 1px;" view-style="flex: 1 1 100%;">
          <slot name="container"></slot>
        </el-scrollbar>
      </div>
      <div v-if="$slots.bottom" class="pop-view__bottom">
        <slot name="bottom"></slot>
      </div>
      <div
        class="pop-view__close"
        :class="
          tw(['cursor-pointer', 'text([#374151] [26px])', 'absolute', 'top-[24px]', 'right-[24px]', 'leading-[30px]'])
        "
        v-audio="'close'"
        @click="$emit('close')"
      >
        <i class="bi bi-x-lg"></i>
      </div>
    </div>
  </div>
</template>

<script>
  import { onBeforeMount, onUnmounted } from 'vue'
  import store from '@/store'

  export default {
    name: 'pop-view',

    props: {
      viewWidth: {
        type: String,
        default: () => '428px'
      },

      viewHeight: {
        type: String,
        default: () => '500px'
      },

      viewMaxHeight: {
        type: String,
        default: () => '80svh'
      }
    },

    setup() {
      const setStyleMaskImage = url => {
        return `url(${url}) no-repeat center /contain`
      }

      onBeforeMount(() => {
        store.dispatch('platform/setCover', true)
      })

      onUnmounted(() => {
        store.dispatch('platform/setCover', false)
      })

      return {
        setStyleMaskImage
      }
    }
  }
</script>

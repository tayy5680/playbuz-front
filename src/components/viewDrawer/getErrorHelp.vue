<template>
  <div :class="tw(['flex', 'flex-col', 'items-center', 'justify-around', 'h-full', 'pt-10', 'pb-5'])">
    <div :class="tw(['flex', 'flex-col', 'items-center', 'pt-11'])">
      <img :src="require(`@/assets/img/logo/logo_PlayBUZ_only.png`)" :class="tw(['w-20'])" />
    </div>
    <p :class="tw(['text-violet', 'mb-20'])">
      {{ $t('請洽客服人員。') }}
    </p>
    <button
      :class="
        tw([
          'border-1',
          'border-violet',
          'block',
          'text-base',
          'w-1/2',
          'h-12',
          'mr-2',
          'mb-14',
          'tablet:text-sm',
          'tablet:h-11',
          'tablet:mb-0',
          'text-violet',
          'rounded-full',
          'focus:outline-none'
        ])
      "
      @click="close"
    >
      {{ $t('我知道了') }}
    </button>
  </div>
</template>

<script>
  import { inject, onMounted, onUnmounted, computed, ref } from 'vue'
  import store from '@/store'

  export default {
    name: 'getErrorHelp',

    setup() {
      const close = inject('close')

      const enterFn = event => {
        if (event.key === 'Enter') close()
      }

      onMounted(() => {
        window.addEventListener('keydown', enterFn)
      })
      onUnmounted(() => {
        window.removeEventListener('keydown', enterFn)
      })

      const imgUrl = ref(process.env.VUE_APP_IMG_URL)

      return {
        imgUrl,
        close
      }
    }
  }
</script>

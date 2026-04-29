<template>
  <div class="pop__wrap" :class="tw(['absolute', 'top-full', 'left-0', 'mt-[14px]', 'ml-[-2px]', 'z-20'])">
    <div
      class="pop__arrow"
      :class="
        tw([
          'absolute',
          'bottom-full',
          'left-2',
          'w-0',
          'h-0',
          'border',
          'border-solid',
          'border-t-0',
          'border-r-[7px]',
          'border-b-[10px]',
          'border-l-[7px]'
        ])
      "
      :style="{ borderColor: 'transparent transparent #fff transparent' }"
    ></div>
    <div class="pop__container" :class="tw(['bg-white', 'p-[25px]', 'rounded-[6px]', 'z-10', 'w-[286px]'])">
      {{
        $t(
          '不同遊戲類型皆有隸屬的電子錢包，為使會員可同時遊玩多種遊戲，遊戲前，需由主要錢包轉移遊戲幣至其他電子錢包中。'
        )
      }}
    </div>
  </div>
  <teleport to="body" v-if="isMobile">
    <div
      class="pop__mask"
      :class="tw(['absolute', 'top-0', 'left-0', 'w-full', 'h-full', 'z-40'])"
      @click="close"
      v-audio="'close'"
    ></div>
  </teleport>
</template>

<script>
  import { inject, computed } from 'vue'
  import store from '@/store'

  export default {
    name: 'wallet-pop',

    setup() {
      const topAction = inject('topAction')
      const close = () => {
        topAction('question', 'touchend')
      }
      const isMobile = computed(() => store.getters['platform/isMobile'])

      return {
        isMobile,
        // fn
        close
      }
    }
  }
</script>

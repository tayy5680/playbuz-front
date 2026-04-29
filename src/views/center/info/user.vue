<template>
  <div class="user__wrap">
    <div
      class="user__container"
      :class="tw(['flex', 'flex-col', 'items-center', 'justify-center', 'h-[211px]', 'w-[261px]'])"
    >
      <img
        class="info__user-pic"
        :class="
          tw([
            info?.frame ? 'w-[128px] h-[128px]' : 'w-[148px] h-[148px]',
            'object-cover',
            'rounded-full',
            'mx-auto',
            'mt-[-20px]'
          ])
        "
        :src="info.picture"
      />
      <img
        class="info__user-frame"
        v-if="info?.frame"
        :src="info?.frame"
        :class="tw(['absolute', 'block', 'w-[216px]', 'h-[216px]'])"
      />
    </div>
  </div>
</template>

<script>
  import { computed } from 'vue'
  import store from '@/store'

  export default {
    name: 'center-info',

    setup() {
      const info = computed(() => {
        const target = store.state.member.info

        return {
          picture: target?.PhotoSrc || require('./images/i_m_user.svg'),
          frame: target?.FrameSrc || ''
        }
      })

      return {
        info
      }
    }
  }
</script>

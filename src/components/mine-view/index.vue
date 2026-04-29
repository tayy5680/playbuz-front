<template>
  <div class="mine__wrap" :class="tw(['fixed', 'inset-0', 'z-30', 'overflow-hidden'])">
    <div
      class="mine__wrap__close"
      :class="
        tw([
          'fixed',
          'bg-[black]',
          'w-full',
          'h-[50px]',
          'z-[41]',
          'justify-end',
          'flex',
          'pr-[20px]',
          'md:w-auto',
          'md:h-auto',
          'md:pr-0',
          'md:right-0'
        ])
      "
      @click="actionClose"
      v-audio="'close'"
    >
      <maskPicture
        :img="require('@/assets/img/icons/i_close.svg')"
        bgColor="white"
        :class="tw(['cursor-pointer', 'md:m-5'])"
      />
    </div>
    <!-- 遊戲畫面比例為高:寬 1:0.5625 {width: 720, height: 1280}-->
    <iframe
      class="mine__frame"
      :src="url"
      :class="tw(['mx-auto', 'z-40', 'h-[100svh]', 'w-[56.25svh]', 'max-w-full', 'max-h-full', 'pt-[50px]', 'md:pt-0'])"
      scrolling="no"
    ></iframe>
  </div>
</template>

<script>
  import { computed, watch } from 'vue'
  import store from '@/store'
  import { useRoute } from 'vue-router'
  import maskPicture from '@/components/maskPicture/maskPicture.vue'

  export default {
    components: {
      maskPicture
    },
    setup() {
      const route = useRoute()
      const url = computed(() => store.state.game.mine.url)

      const isBgm = computed(() => store.state.audio.bgm.isPlayBgm)
      const actionClose = () => {
        store.dispatch('game/setMineUrl', '')
        if (isBgm.value) store.dispatch('audio/handleBgmStatus', 'play')
      }
      store.dispatch('audio/handleBgmStatus', 'pause')

      watch(
        () => route.name,
        () => {
          actionClose()
        }
      )

      return {
        url,
        // fn
        actionClose
      }
    }
  }
</script>

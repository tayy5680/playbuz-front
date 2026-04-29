<template>
  <div class="audio-button">
    <button @click="openAudioWindow">
      <div ref="element"></div>
    </button>
  </div>
</template>

<script>
  import { ref, computed, onMounted, watch } from 'vue'
  import store from '@/store'
  import lottie from 'lottie-web'

  export default {
    name: 'view-audio-button',
    setup() {
      const isPlay = computed(() => store.state.audio.isPlaySound || store.state.audio.bgm.isPlayBgm)
      const element = ref(null)
      const openAudioWindow = () => {
        store.dispatch('audio/setIsShowWindow', true)
      }
      const anim = ref(null)
      onMounted(() => {
        anim.value = lottie.loadAnimation({
          container: element.value,
          renderer: 'svg',
          loop: true,
          autoplay: isPlay.value,
          animationData: require('./images/ani_sound.json')
        })
      })
      watch(isPlay, val => {
        if (val) anim.value.play()
        else anim.value.pause()
      })

      return {
        element,
        openAudioWindow
      }
    }
  }
</script>

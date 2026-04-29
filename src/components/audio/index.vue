<template>
  <popView class="audio__wrap" v-if="isShowWindow" @close="close" :viewWidth="'380px'" :viewHeight="'400px'">
    <template #container>
      <div class="audio__main">
        <div class="audio__sound">
          <div class="title">{{ $t('音效') }}</div>
          <switchView :switchBol="isSound" @change="setSound(!isSound)" />
        </div>
        <div class="audio__bgm">
          <div class="title">{{ $t('背景音樂') }}</div>
          <switchView :switchBol="isBgm" @change="handleBgm(!isBgm ? 'play' : 'stop')" />
        </div>
      </div>
    </template>
  </popView>
</template>

<script>
  import { computed, ref, watch, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import popView from '@/components/ui/pop-view'
  import switchView from '@/components/ui/switch-view'
  import store from '@/store'
  import { AUDIO_BGM_URL } from './config'
  import { Howl } from 'howler'

  export default {
    name: 'view-audio',
    components: {
      popView,
      switchView
    },
    setup() {
      const route = useRoute()
      const isShowWindow = computed(() => store.state.audio.isShowWindow)

      // 音效控制
      const isSound = computed(() => store.state.audio.isPlaySound)
      const setSound = isPlay => {
        store.dispatch('audio/setPlaySound', isPlay)
      }

      // bgm控制
      const isBgm = computed(() => store.state.audio.bgm.isPlayBgm)
      const isPausing = computed(() => store.state.audio.bgm.isPausing)
      const bgmPlayer = ref(
        new Howl({
          src: [AUDIO_BGM_URL],
          loop: true,
          onplay: () => {
            setBgmLocalStorage(true)
          },
          onstop: () => {
            setBgmLocalStorage(false)
          }
        })
      )
      /**  @param {string} status play、stop、pause 三種狀態 */
      const handleBgm = status => {
        store.dispatch('audio/handleBgmStatus', status)
      }
      // 監聽離開/回歸畫面的暫停控制
      const visibilityPause = ref(false)
      document.addEventListener('visibilitychange', event => {
        const isloaclBgm = localStorage.getItem('audio_isBgm') === 'true'
        switch (event.target.visibilityState) {
          case 'hidden':
            // 若bgm早已暫停，則回歸畫面時不觸發'play'，維持暫停狀態
            if (!isPausing.value) {
              handleBgm('pause')
              visibilityPause.value = true
            }
            break
          case 'visible':
            // 因應localStorage在分頁中改變，切換畫面時重新同步Bgm狀態
            if (isloaclBgm && visibilityPause.value) handleBgm('play')
            store.dispatch('audio/setBgm', { isPlayBgm: isloaclBgm })
            visibilityPause.value = false
            break
        }
      })
      const setBgmLocalStorage = isPlay => {
        if (isPlay !== isBgm.value) store.dispatch('audio/setBgm', { isPlayBgm: isPlay })
      }

      const init = () => {
        store.dispatch('audio/setBgm', { player: bgmPlayer.value })
        // 初始化 bgm 音量
        const isBgmLocal = localStorage.getItem('audio_isBgm')
        handleBgm(isBgmLocal === 'false' || !isBgm.value ? 'stop' : 'play')
        // 初始化音效開關
        const isSoundLocal = localStorage.getItem('audio_isSound')
        setSound(isSoundLocal ? isSoundLocal === 'true' : isSound.value)
      }

      onMounted(() => {
        init()
      })
      const close = () => {
        store.dispatch('audio/setIsShowWindow', false)
      }

      //  打招呼 : 在首頁 && 音效開啟 && 尚未打過招呼 => 打招呼
      const isHome = computed(() => route.name === 'home')
      const isHello = ref(false)
      const playHello = async () => {
        if (isHello.value) return false
        isHello.value = true
        if (isHome.value && isSound.value) {
          const audio = await store.dispatch('audio/getAudioPlayer', 'helloHome')
          if (audio) audio.play()
        }
      }
      watch(isHome, val => {
        if (val) playHello()
      })
      return {
        isShowWindow,
        isSound,
        isBgm,
        close,
        setSound,
        handleBgm
      }
    }
  }
</script>
<style lang="scss" scoped>
  .audio__wrap {
    .audio__main {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
      gap: 48px;
      text-align: center;
      margin-top: -12px;
      .audio__sound,
      .audio__bgm {
        .title {
          color: #374151;
          font-size: 20px;
          margin-bottom: 16px;
        }
      }
    }
    :deep(.el-switch) {
      margin: 0 auto;
      width: 90px !important;
      height: 42px !important;
      .el-switch__core {
        width: 90px !important;
        height: 42px !important;
        background-color: white;
        border-color: #d3d4df;
      }
      .el-switch__label span {
        color: #d3d4df;
        font-size: 16px;
        font-weight: bold;
      }
      .el-switch__action {
        background-color: #d3d4df;
        box-shadow: none;
        width: 30px !important;
        height: 30px !important;
      }
      .el-switch__label--right {
        opacity: 0 !important;
      }

      &.is-checked {
        .el-switch__core {
          background: #3336eb;
          border-color: #3336eb;
        }
        .el-switch__label span {
          color: #d3d4df00;
        }
        .el-switch__action {
          background-color: white;
          box-shadow: none;
        }
      }
    }
  }
</style>

<template>
  <div class="view-about-cofun-live" :style="`background-image: url(${bgImgUrl});`">
    <div class="container-main">
      <div class="block-height"></div>
      <p v-fade="'up'">
        {{
          $t(
            'Cofun LIVE酷玩直播採用領先業界的創新互動模式，讓直播主與玩家能夠實現零時差互動體驗，同步參與遊戲與即時交流，打造前所未有的沉浸感。不僅支援多人同時在線遊玩，還搭配Q版視覺風格介面與直覺式操作設計，無論新手或資深用戶皆能輕鬆上手，快速融入直播與遊戲結合的全新娛樂場景。'
          )
        }}
      </p>
      <div v-fade="'up'">
        <button class="basic-btn" @click="cofunPage">{{ $t('立即體驗') }}</button>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { inject, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import store from '@/store'
  const scrollToId = inject('scrollToId')
  const router = useRouter()
  const lang = computed(() => store.state.member.languageCode)
  const cofunPage = () => {
    router.push('/game/detail/100001')
  }

  const bgImgUrl = computed(() => {
    let imgLanguage = lang.value === 'zh-TW' ? 'tw' : 'en'
    return `${process.env.VUE_APP_IMG_URL}/img/home/2025NewHome/bg-about-cofun-${imgLanguage}-pc.svg`
  })

  // 目前video這張圖只有中英文兩個版本
  const videoImgUrl = computed(() => {
    let imgLanguage = lang.value === 'zh-TW' ? 'tw' : 'en'
    return `${process.env.VUE_APP_IMG_URL}/img/home/2025NewHome/video_${imgLanguage}.svg`
  })
</script>
<style lang="scss" scoped>
  .view-about-cofun-live {
    color: white;
    text-align: center;
    background-size: 100%, auto;
    background-position: top, center;
    background-repeat: no-repeat;
    background-color: black;

    .container-main {
      align-items: center;
      max-width: 900px;
    }

    .block-height {
      height: 47svw;
      width: 100%;
    }
  }

  .basic-btn {
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: white;
    color: #7c7ed7;
    text-align: center;
    padding: 10px;
    border-radius: 0.5rem;
    border: 2px solid white;
    word-wrap: break-word;
    white-space: break-spaces;
    width: 100%;
    max-width: 250px;
    margin-top: 60px;
    margin-bottom: 80px;

    &:hover {
      border: 2px solid #1f2530;
      background-color: #7c7ed7;
      color: #fff;
      transform: scale(1.08, 1.13);
    }
  }
</style>

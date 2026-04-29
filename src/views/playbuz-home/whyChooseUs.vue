<template>
  <div class="view-why-choose-us " id="about">
    <div class="container-main basic-title" v-fade="'opacity'">
      <h2>{{ $t('Cofun LIVE 為何值得選擇？') }}</h2>
      <h5>
        {{ $t('整合互動直播、即時遊戲與分潤機制，Cofun LIVE 打造一站式娛樂解決方案，為創作者與觀眾創造雙贏價值。') }}
      </h5>
    </div>

    <div class="container-main" :class="tw(['grid', 'grid-cols-1', 'md:grid-cols-2', 'pc:grid-cols-3', 'gap-7'])">
      <div v-for="(item, index) in CHOOSE_US_LIST" :key="index" v-fade="{ dir: 'up', duration: 0.3 * index + 0.8 }">
        <div class="basic-card role-card ">
          <div class="title">
            <img :src="`${imgUrl}/${item.iconFileName}.svg`" alt="" />
            <h5>{{ $t(item.title) }}</h5>
          </div>
          <p>{{ $t(item.label) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { computed } from 'vue'

  const CHOOSE_US_LIST = [
    {
      iconFileName: 'why-choose-us-icon-income',
      title: '多種分潤機制',
      label: 'Cofun LIVE 不僅提供最低 50% 起的抖內分潤，更設有多元激勵機制，讓創作者收益全面升級。'
    },
    {
      iconFileName: 'why-choose-us-icon-live',
      title: '輕鬆開播',
      label: '開播超簡單，一支手機就能立即上線，開始你的直播之旅！'
    },
    {
      iconFileName: 'why-choose-us-icon-filter',
      title: '支持多種濾鏡',
      label: '你喜歡怎麼播，就怎麼播！風格自己決定，創意完全不設限。'
    },
    {
      iconFileName: 'why-choose-us-icon-safety',
      title: '安全無慮平台',
      label: '您的內容與收益，將受到業界領先的資安技術全方位保護，確保安心無虞。'
    },
    {
      iconFileName: 'why-choose-us-icon-community',
      title: '友善互助的社群',
      label: '透過公開互動機制，您不僅可以輕鬆與其他創作者互相認識、交流想法，更能建立實質連結。'
    },
    {
      iconFileName: 'why-choose-us-icon-platform',
      title: '支援多平台及裝置',
      label: '可以透過手機、平板電腦或電腦進行串流或觀看。任何設備均可存取。'
    }
  ]
  const imgUrl = computed(() => {
    return `${process.env.VUE_APP_IMG_URL}/img/home/2025NewHome`
  })
</script>
<style lang="scss" scoped>
  .view-why-choose-us {
    text-align: center;
    background: white;
    padding: 90px 0 60px 0;

    .container-main.title {
      padding-bottom: 60px;
      h2 {
        font-size: 2.25rem;
        line-height: 2.5rem;
        font-weight: bold;
        color: black;
        padding-bottom: 20px;
      }
    }

    .role-card {
      text-align: left;
      padding: 30px 30px 30px 30px;
      height: 100%;
      background-color: white;
      border: 1px solid #7c7ed7;

      &:hover {
        transform: translateY(0px);
        box-shadow: rgba(99, 102, 241, 0.01) 0px 0.329276px 0.823189px -0.164638px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
          rgba(0, 0, 0, 0.098) 0px 9.67072px 14.5061px -2.90122px,
          rgba(0, 0, 0, 0.098) 0px 3.86829px 5.80243px -3.86829px;
      }

      .title {
        display: flex;
        color: #7c7ed7;
        align-items: center;
        padding-bottom: 20px;
        img {
          padding-right: 15px;
        }
        h5 {
          font-weight: bold;
          font-size: 1.2rem;
          line-height: 2rem;
        }
      }

      > p {
        color: #314167;
      }
    }
  }
</style>

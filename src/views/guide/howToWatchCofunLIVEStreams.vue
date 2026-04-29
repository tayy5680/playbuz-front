<template>
  <div class="view-guide-use-cofun">
    <div
      class="guide-title"
      :style="` -webkit-mask-image: url(${imgUrl}/bg-mask.png); mask-image: url(${imgUrl}/bg-mask.png); `"
    >
      <div class="container-main">
        <h1>{{ $t('如何觀看酷玩直播') }}</h1>
        <h5>{{ $t('流程教學') }}</h5>
      </div>
    </div>

    <div class="step container-main">
      <img
        :class="tw(['mb-[30px]', 'mx-auto', 'w-full', 'max-w-[800px]'])"
        :src="getStepImg('0')"
        :alt="$t('演示畫面')"
      />
      <h5>
        <span>{{ $t('步驟{num}', { num: 1 }) }}</span
        >{{ $t('點擊登入') }}
      </h5>
      <div class="step-content" style="grid-template-columns: repeat(1, 1fr);">
        <div style="align-items:start;">
          <div class="title">
            <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg?v=1107);`">1</div>
            <div>{{ $t('點擊右上方「登入」按鈕。') }}</div>
          </div>
          <img class="step-img" :src="getStepImg('1')" :alt="$t('演示畫面')" />
        </div>
      </div>

      <h5>
        <span>{{ $t('步驟{num}', { num: 2 }) }}</span
        >{{ $t('登入方式') }}
      </h5>
      <div class="step-content-4-grid">
        <div class="title">
          <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg?v=1107);`">1</div>
          <div>{{ $t('選擇任一種註冊/登入方式 (訪客不適用)。') }}</div>
        </div>
        <div class="image"><img :class="tw(['max-w-[320px]'])" :src="getStepImg('2-1')" :alt="$t('演示畫面')" /></div>
        <div class="title">
          <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg?v=1107);`">2</div>
          <div>{{ $t('完成註冊。') }}</div>
        </div>
        <div class="image">
          <img :class="tw(['max-w-[100px]', 'py-5'])" :src="getStepImg('2-2')" :alt="$t('演示畫面')" />
        </div>
      </div>

      <h5>
        <span>{{ $t('步驟{num}', { num: 3 }) }}</span
        >{{ $t('點擊最新遊戲') }}
      </h5>
      <div class="step-content">
        <div>
          <div class="title">
            <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg?v=1107);`">1</div>
            <div>{{ $t('回到首頁，點擊左上方「最新遊戲 」。') }}</div>
          </div>
          <img class="step-img" :src="getStepImg('3-1')" :alt="$t('演示畫面')" />
        </div>
        <div>
          <div class="title">
            <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg?v=1107);`">2</div>
            <div>{{ $t('進入頁面，找到「酷玩直播」，也可以直接使用搜尋來找到遊戲。') }}</div>
          </div>
          <img class="step-img" :src="getStepImg('3-2')" :alt="$t('演示畫面')" />
        </div>
      </div>

      <h5>
        <span>{{ $t('步驟{num}', { num: 4 }) }}</span
        >{{ $t('進入遊戲') }}
      </h5>
      <div class="step-content">
        <div>
          <div class="title">
            <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg?v=1107);`">1</div>
            <div>{{ $t('點擊立即遊玩。') }}</div>
          </div>
          <img class="step-img" :src="getStepImg('4-1')" :alt="$t('演示畫面')" />
        </div>
        <div>
          <div class="title">
            <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg?v=1107);`">2</div>
            <div>{{ $t('選擇「金幣」遊玩。') }}</div>
          </div>
          <img class="step-img" :src="getStepImg('4-2')" :alt="$t('演示畫面')" />
        </div>
      </div>

      <h5>
        <span>{{ $t('步驟{num}', { num: 5 }) }}</span
        >{{ $t('立即遊玩') }}
      </h5>
      <div class="step-content">
        <div>
          <div class="title">
            <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg?v=1107);`">1</div>
            <div>{{ $t('輸入想要轉入的金額，再點選確認轉帳。') }}</div>
          </div>
          <img class="step-img" :src="getStepImg('5-1')" :alt="$t('演示畫面')" />
        </div>
        <div>
          <img class="step-img" :src="getStepImg('5-2')" :alt="$t('演示畫面')" />
        </div>
      </div>

      <div class=" complete">
        <h5>{{ $t('教學完成！') }}</h5>
        <div>{{ $t('接下來就可以與喜歡的直播主一同遊玩酷玩直播囉') }}</div>
        <img
          class="step-img"
          :class="tw(['mb-[100px]', 'mt-[50px]', 'mx-auto'])"
          :src="`${imgUrl}/complete-et.svg`"
          :alt="$t('教學完成！')"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
  import { ref, computed, watch } from 'vue'
  import store from '@/store'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const lang = computed(() => store.state.member.languageCode)

  // 圖床上目前有的語系資料夾名稱
  const imageLanguageFolderName = {
    'en-US': 'en',
    'zh-TW': 'tw'
  }
  const imgUrl = computed(() => {
    return `${process.env.VUE_APP_IMG_URL}/img/guide/`
  })
  const stepImgUrl = computed(() => {
    const folderName = imageLanguageFolderName?.[lang.value] ?? 'en'
    return `${imgUrl.value}/HowToWatchCofunLIVEStreams/${folderName}`
  })
  const getStepImg = fileStepName => {
    const folderName = imageLanguageFolderName?.[lang.value] ?? 'en'
    return `${imgUrl.value}/HowToWatchCofunLIVEStreams/${folderName}/step${fileStepName}.png?v=1.1`
  }
</script>
<style lang="scss" scoped>
  .view-guide-use-cofun {
    margin-top: -18px;
    margin-bottom: -30px;
    background-color: #f8f9ff;
    word-break: break-word;
    line-break: anywhere;

    .step-img {
      display: inline-block;
      padding: 15px 0px;
    }
    .step {
      padding-top: 100px;
      color: black;
      h5 {
        text-align: center;
        color: black;
        font-size: 25px;
        font-weight: bold;
        padding: 50px 0 30px 0;

        span {
          background: linear-gradient(to right, #aa34ff 0%, #6629ff 100%);
          color: white;
          display: inline-block;
          margin-right: 15px;
          line-height: 40px;
          padding: 0 10px;
          border-radius: 10px;
        }
      }

      .step-content {
        display: flex;
        text-align: center;
        padding: 20px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        align-items: stretch;
        max-width: 1000px;
        margin: 0 auto;

        > div {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          .title {
            width: 100%;
            flex-grow: 1;
            display: flex;
            text-align: left;
            align-items: center;
            &.align-start {
              align-items: flex-start;
            }

            .number {
              color: white;
              flex-shrink: 0;
              width: 42px;
              height: 42px;
              background-position: center;
              background-repeat: no-repeat;
              font-size: 14px;
              text-align: center;
              line-height: 40px;
              margin-right: 5px;
            }
            > div:last-child {
              display: flex;
              align-items: center;
            }
          }
        }
      }

      .step-content-4-grid {
        display: flex;
        text-align: center;
        padding: 20px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        align-items: stretch;
        max-width: 850px;
        margin: 0 auto;

        .title {
          flex-grow: 1;
          display: flex;
          text-align: left;
          justify-content: center;
          align-items: center;
          &.align-start {
            align-items: flex-start;
          }

          .number {
            color: white;
            flex-shrink: 0;
            width: 42px;
            height: 42px;
            background-position: center;
            background-repeat: no-repeat;
            font-size: 14px;
            text-align: center;
            line-height: 40px;
            margin-right: 5px;
          }
          > div:last-child {
            display: flex;
            align-items: center;
          }
        }
        .image {
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            width: 100%;
          }
        }

        @media (min-width: 768px) {
          > div:nth-child(1) {
            grid-column: 1;
            grid-row: 1;
          }
          > div:nth-child(2) {
            grid-column: 1;
            grid-row: 2;
          }
          > div:nth-child(3) {
            grid-column: 2;
            grid-row: 1;
          }
          > div:nth-child(4) {
            grid-column: 2;
            grid-row: 2;
          }
        }
      }
      @media (max-width: 767px) {
        .step-content-4-grid {
          display: flex;
          flex-direction: column;
        }
      }
      .complete {
        padding: 50px 0;
        text-align: center;
        h5 {
          font-size: 30px;
          padding-bottom: 10px;
        }
      }
      @media (max-width: 767px) {
        h5 {
          padding-bottom: 0 !important;
        }
        .step-content {
          display: block;

          .title {
            margin-top: 30px;
          }
          &.step5,
          &.step5-2 {
            display: block;
          }
          &.step5-2 > div {
            margin-top: 50px;
          }
        }
      }
    }

    .guide-title {
      background-color: hotpink;
      color: white;
      height: 360px;
      background: linear-gradient(to right, #aa34ff 0%, #6629ff 100%);
      -webkit-mask-repeat: repeat-x;
      -webkit-mask-size: auto;
      -webkit-mask-position: top center;
      mask-repeat: repeat-x;
      mask-size: auto;
      mask-position: top center;

      &::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        background-image: url('./image/bg-et.png');
        background-repeat: repeat;
      }

      .container-main {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        h1 {
          font-size: 40px;
          font-weight: bold;
        }
        h5 {
          font-size: 22px;
        }
      }
      // @media (min-width: 1400px) {
      //   .bg {
      //     width: 100%;
      //     object-fit: inherit;
      //   }
      // }
    }
  }
</style>

<template>
  <div class="view-guide-use-cofun">
    <div
      class="guide-title"
      :style="` -webkit-mask-image: url(${imgUrl}/bg-mask.png); mask-image: url(${imgUrl}/bg-mask.png); `"
    >
      <div class="container-main">
        <h1>{{ $t('如何提領直播收益') }}</h1>
        <h5>{{ $t('提領教學') }}</h5>
      </div>
    </div>
    <!-- prettier-ignore -->
    <div class="step container-main">
      <img :class="tw(['mb-[30px]','mx-auto','w-full','max-w-[800px]'])" :src="getStepImg('0')" :alt="$t('演示畫面')" />
      <h5><span>{{ $t('步驟{num}', {num:1}) }}</span>{{ $t('完成提領審核驗證') }}</h5>
      <div class="step-content">
        <div>
          <div class="title">
            <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg?v=1107);`">1</div>
            <div>{{$t('點選「設定」。')}}</div>
          </div>
          <img class="step-img" :src="getStepImg('1-1')" :alt="$t('演示畫面')" />
        </div>
        <div>
          <div class="title">
            <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg?v=1107);`">2</div>
            <div>{{$t('完成提領審核區的驗證項目，以開通提領功能。')}}</div>
          </div>
          <img  class="step-img" :src="getStepImg('1-2')" :alt="$t('演示畫面')" />
        </div>
        <div>
          <div class="title">
            <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg?v=1107);`">3</div>
            <div>{{$t('驗證完成。')}}</div>
          </div>
          <img class="step-img" :src="getStepImg('1-3')" :alt="$t('演示畫面')" />
        </div>
      </div>


      <h5><span>{{ $t('步驟{num}', {num:2}) }}</span>{{ $t('查看收益數據與前往提領。') }}</h5>
      <div class="step-content">
        <div>
          <div class="title">
            <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg?v=1107);`">1</div>
            <div>{{ $t('點選A「我的收益」查看收益數據或直接點選B「提領」前往提領中心。') }}</div>
          </div>
          <img class="step-img" :src="getStepImg('2-1')" :alt="$t('演示畫面')" />
        </div>
        <div>
          <div class="title">
            <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg?v=1107);`">2</div>
            <div>{{ $t('確認收益數據後點選「前往提領」。') }}</div>
          </div>
          <img  class="step-img" :src="getStepImg('2-2')" :alt="$t('演示畫面')" />
        </div>
        <div>
          <div class="title">
            <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg?v=1107);`">3</div>
            <div>{{ $t('點選「提領」。') }}</div>
          </div>
          <img class="step-img" :src="getStepImg('2-3')" :alt="$t('演示畫面')" />
        </div>
      </div>


      <h5><span>{{ $t('步驟{num}', {num:3}) }}</span>{{ $t('確認提領金額與狀態') }}</h5>
      <div class="step-content">
        <div>
          <div class="title align-start">
            <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg?v=1107);`">1</div>
            <div>{{ $t('於「請輸入提領金額 (USD) 」欄位，輸入欲提領的金額 (以美元計算)，並點選「確認提領」。') }}</div>
          </div>
          <img class="step-img" :src="getStepImg('3-1')" :alt="$t('演示畫面')" />
        </div>
        <div>
          <div class="title align-start">
            <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg?v=1107);`">2</div>
            <div>{{ $t('確認提領資訊後，請點選「確定」。') }}</div>
          </div>
          <img  class="step-img" :src="getStepImg('3-2')" :alt="$t('演示畫面')" />
        </div>
        <div>
          <div class="title align-start">
            <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg?v=1107);`">3</div>
            <div>{{ $t('可於「提領紀錄」查詢申請進度與狀態。') }}</div>
          </div>
          <img class="step-img" :src="getStepImg('3-3')" :alt="$t('演示畫面')" />
        </div>
      </div>


      <h5><span>{{ $t('步驟{num}', {num:4}) }}</span>{{ $t('勞務報酬單回簽確認') }}</h5>
      <div class="step4">
        <div><img :class="tw(['max-w-[250px]'])" :src="getStepImg('4')" :alt="$t('演示畫面')" /></div>
        <ol>
          <li>{{ $t('請至驗證過的電子郵件收件匣中查收標題為「Cofun Live 提領勞務報酬單」的信件。') }}</li>
          <li>{{ $t('請開啟附件並確認各項資訊及金額是否正確。') }}</li>
          <li>{{ $t('若確認無誤，請回覆信件「確認無誤」字樣，即會開始安排付款流程；如有任何疑問請直接回覆信件詢問。') }}</li>
          <li>{{ $t('請耐心等待，您可在「提領紀錄」中查看進度。') }}</li>
        </ol>
      </div>

      <h5><span>{{ $t('補充') }}</span>{{ $t('如何查詢提領紀錄') }}</h5>
      <div class="step-content step5">
        <div>
          <div class="title">
            <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg?v=1107);`">1</div>
            <div>{{ $t('點選「提領」。') }}</div>
          </div>
          <img class="step-img" :src="getStepImg('5-1')" :alt="$t('演示畫面')" />
        </div>
        <div>
          <div class="title">
            <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg?v=1107);`">2</div>
            <div>{{ $t('點選「查看更多」。') }}</div>
          </div>
          <img  class="step-img" :src="getStepImg('5-2')" :alt="$t('演示畫面')" />
        </div>
      </div>
      <div class="step-content step5-2">
        <div>
          <div class="fun-title"><span>{{ $t('方法{num}', {num:1}) }}</span></div>
          <p :class="tw(['max-w-[11em]', 'text-left'])" >{{ $t('於畫面上方的日期區塊，點擊您想查詢的紀錄。') }}</p>
          <img class="step-img" :src="getStepImg('5-3')" :alt="$t('演示畫面')" />
        </div>
        <div>
          <div class="fun-title"><span>{{ $t('方法{num}', {num:2}) }}</span></div>
          <p>
            {{ $t('點選下方的「提領搜尋」，進入查詢界面。') }}<br>
            {{ $t('在查詢界面中，選擇「提領狀態」，輸入時間區間並點擊「確定」查詢。') }}
          </p>
          <img :class="tw(['w-full'])" :src="getStepImg('5-4')" :alt="$t('演示畫面')" />
        </div>
        
      </div>
      
      <div class=" complete">
        <h5>{{ $t('教學完成！') }}</h5>
        <div>{{ $t('趕緊前往查看你的收益吧') }}</div>
        <img
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
    return `${imgUrl.value}/HowToWithdrawEarnings/${folderName}`
  })
  const getStepImg = fileStepName => {
    const folderName = imageLanguageFolderName?.[lang.value] ?? 'en'
    return `${imgUrl.value}/HowToWithdrawEarnings/${folderName}/step${fileStepName}.png?v=1.1`
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
      min-height: 520px;
      width: auto;
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
          background: linear-gradient(93.76deg, #ff36a3 -9.11%, #ac29ff 109.19%);
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
        grid-template-columns: repeat(3, 1fr);
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
            flex-grow: 1;
            display: flex;
            text-align: left;
            max-width: 270px;
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

        &.step5 {
          grid-template-columns: repeat(2, 1fr);
          max-width: 550px;
          margin: 0 auto;
        }

        &.step5-2 {
          display: flex;
          gap: 20px;
          > div {
            border: 2px solid #dddddd;
            border-radius: 32px;
            padding: 20px;
            min-width: 33%;

            .fun-title {
              background-color: #f8f9ff;
              padding: 0 20px;
              margin-top: -40px;
              text-align: center;

              span {
                background: linear-gradient(93.76deg, #ff36a3 -9.11%, #ac29ff 109.19%);
                color: white;
                display: inline-block;
                line-height: 40px;
                padding: 0 10px;
                border-radius: 10px;
                font-size: 25px;
                font-weight: bold;
              }
            }

            p {
              padding: 20px 0 30px 0;
              flex-grow: 1;
            }
            img {
              padding: 0;
            }
          }
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
      background: linear-gradient(to right, #ffe8cc 0%, #ff36a3 46%, #ac29ff 100%);
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
    }

    .step4 {
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        flex-shrink: 0;
        margin-right: 50px;
      }
      ol {
        max-width: 400px;
        list-style: none;
        counter-reset: num;
        padding-left: 0;
        li {
          counter-increment: num;
          margin: 20px 0;
          position: relative;
          padding-left: 2.5em;
        }
        li::before {
          content: counter(num);
          position: absolute;
          left: 0;
          top: 0;
          width: 25px;
          height: 25px;
          background: linear-gradient(93.76deg, #ff36a3 -9.11%, #ac29ff 109.19%);
          color: white;
          text-align: center;
          line-height: 23px;
          border-radius: 50%;
          font-size: 14px;
        }
      }
    }
    @media (max-width: 767px) {
      .step4 {
        display: block;
        text-align: center;
        img {
          margin: 20px auto 50px auto;
          // margin-bottom: 10px;
        }
        ol {
          text-align: left;
          max-width: 100%;
        }
      }
    }
  }
</style>

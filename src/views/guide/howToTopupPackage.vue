<template>
  <div class="view-guide-topup-package">
    <div
      class="guide-title"
      :style="` -webkit-mask-image: url(${imgUrl}/bg-mask.png); mask-image: url(${imgUrl}/bg-mask.png); `"
    >
      <div class="container-main">
        <h1>{{ $t('如何儲值 PlayBUZ 禮包') }}</h1>
        <h5>{{ $t('儲值教學') }}</h5>
      </div>
    </div>

    <div class="step container-main">
      <img
        :class="tw(['mb-[30px]', 'mx-auto', 'w-full', 'max-w-[800px]'])"
        :src="getStepImg('0')"
        :alt="$t('演示畫面')"
      />
      <h5>
        <span>{{ $t('步驟{num}', { num: 1 }) }} </span>{{ $t('點擊商城') }}
      </h5>
      <div class="step-content">
        <div style="align-items:start;">
          <div class="title">
            <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg?v=1107);`">1</div>
            <div>{{ $t('點擊上方選單的「商城」。') }}</div>
          </div>
          <img class="step-img" :src="getStepImg('1')" :alt="$t('演示畫面')" />
        </div>
      </div>

      <h5>
        <span>{{ $t('步驟{num}', { num: 2 }) }} </span>{{ $t('選擇禮包') }}
      </h5>
      <div class="step-content">
        <div style="align-items:start;">
          <div class="title">
            <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg?v=1107);`">1</div>
            <div>{{ $t('進入到商城頁面後，點擊想要儲值的禮包品項。') }}</div>
          </div>
          <img class="step-img" :src="getStepImg('2')" :alt="$t('演示畫面')" />
        </div>
      </div>

      <h5>
        <span>{{ $t('步驟{num}', { num: 3 }) }} </span>{{ $t('確認訂單') }}
      </h5>
      <div class="step-content">
        <div style="align-items:start;">
          <div class="title">
            <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg?v=1107);`">1</div>
            <div>{{ $t('點擊後，確認購買資訊。') }}</div>
          </div>
          <img class="step-img" :src="getStepImg('3-1')" :alt="$t('演示畫面')" />
        </div>
      </div>
      <div class="step-grid-3">
        <div>
          <div class="purple-title">{{ $t('統一編號') }}</div>
          <p>{{ $t('信箱、抬頭、統一編號為必填資訊。') }}</p>
        </div>
        <div>
          <img class="step-img" :src="getStepImg('3-2')" :alt="$t('演示畫面')" />
        </div>
        <div>
          <div class="purple-title">{{ $t('載具類型') }}</div>
          <p>{{ $t('信箱為必填資訊，手機條碼與自然人憑證擇一填寫。') }}</p>
        </div>
        <div>
          <img class="step-img" :src="getStepImg('3-3')" :alt="$t('演示畫面')" />
        </div>
        <div>
          <div class="purple-title">{{ $t('捐贈') }}</div>
          <p>{{ $t('信箱為必填資訊，可選擇創世基金會or自行填入愛心碼。') }}</p>
        </div>
        <div>
          <img class="step-img" :src="getStepImg('3-4')" :alt="$t('演示畫面')" />
        </div>
      </div>

      <h5>
        <span>{{ $t('步驟{num}', { num: 4 }) }} </span>{{ $t('付款方式') }}
      </h5>
      <div class="step-content" :class="tw(['pb-0'])">
        <div style="align-items:start;">
          <div class="title">
            <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg?v=1107);`">1</div>
            <div>{{ $t('點擊購買後跳轉至付款頁面，可選擇信用卡 or 綠界Pay來做支付。') }}</div>
          </div>
        </div>
      </div>
      <div class="step-content step4">
        <div>
          <div class="purple-title">{{ $t('信用卡') }}</div>
          <img class="step-img" :src="getStepImg('4-1')" :alt="$t('演示畫面')" />
        </div>
        <div>
          <div class="purple-title">{{ $t('綠界Pay') }}</div>
          <img class="step-img" :src="getStepImg('4-2')" :alt="$t('演示畫面')" />
        </div>
      </div>

      <h5>
        <span>{{ $t('步驟{num}', { num: 5 }) }} </span>{{ $t('付款方式') }}
      </h5>
      <div class="step-content">
        <div style="align-items:start;">
          <div class="title">
            <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg?v=1107);`">1</div>
            <div>{{ $t('點擊購買後跳轉至付款頁面，可選擇信用卡 or 綠界Pay來做支付。') }}</div>
          </div>
          <img class="step-img" :src="getStepImg('5')" :alt="$t('演示畫面')" />
        </div>
      </div>

      <div class=" complete">
        <h5>{{ $t('儲值成功！') }}</h5>
        <div>{{ $t('快來支持你喜歡的直播主吧') }}</div>
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
    return `${imgUrl.value}/HowToTopupPackage/${folderName}`
  })
  const getStepImg = fileStepName => {
    const folderName = imageLanguageFolderName?.[lang.value] ?? 'en'
    return `${imgUrl.value}/HowToTopupPackage/${folderName}/step${fileStepName}.png?v=1.2`
  }
</script>
<style lang="scss" scoped>
  .view-guide-topup-package {
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
        grid-template-columns: repeat(1, 1fr);
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

        &.step4 {
          display: flex;
          > div {
            justify-content: flex-start;
          }
        }
        @media (max-width: 767px) {
          &.step4 {
            display: block;
            img {
              max-width: 400px;
              width: 100%;
            }
          }
        }
      }

      .purple-title {
        font-size: 17px;
        color: white;
        border-radius: 50px;
        padding: 8px 25px;
        background: linear-gradient(93.76deg, #b636ff -9.11%, #5f24ff 109.19%);
        margin: 10px 0;
        display: inline-block;
      }
      .step-grid-3 {
        display: flex;
        text-align: center;
        padding: 20px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        align-items: stretch;
        margin: 0 auto;
        > div {
          text-align: center;

          img {
            width: 100%;
          }
          p {
            max-width: 280px;
            width: 100%;
            margin: 0 auto;
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
          > div:nth-child(5) {
            grid-column: 3;
            grid-row: 1;
          }
          > div:nth-child(6) {
            grid-column: 3;
            grid-row: 2;
          }
        }
      }
      @media (max-width: 767px) {
        .step-grid-3 {
          display: flex;
          flex-direction: column;
          img {
            max-width: 300px;
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

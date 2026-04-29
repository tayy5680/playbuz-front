<template>
  <div class="view-guide-use-cofun">
    <div
      class="guide-title"
      :style="` -webkit-mask-image: url(${imgUrl}/bg-mask.png); mask-image: url(${imgUrl}/bg-mask.png); `"
    >
      <div class="container-main">
        <h1>{{ $t('如何成為Cofun LIVE直播主') }}</h1>
        <h5>{{ $t('註冊教學') }}</h5>
      </div>
    </div>
    <!-- prettier-ignore -->
    <div class="step container-main">

      <img :class="tw(['mb-[30px]','mx-auto','w-full','max-w-[800px]'])" :src="getStepImg('0')" :alt="$t('演示畫面')" />
      <h5><span>{{ $t('步驟{num}', {num:1}) }}</span>{{ $t('註冊新帳號') }}</h5>
      <div class="step-content two-content">
        <div>
          <div class="title">
            <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg);`">1</div>
            <div v-html="$t('閱讀條款後，點選<br>「同意並繼續」開始註冊。')"></div>
          </div>
          <img class="step-img" :src="getStepImg('1-1')" :alt="$t('演示畫面')" />
        </div>
        <div>
          <div class="title">
            <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg);`">2</div>
            <div v-html="$t('請擇一註冊：<br>手機號碼、LINE、Apple ID。')"></div>
          </div>
          <img  class="step-img" :src="getStepImg('1-2')" :alt="$t('演示畫面')" />
        </div>
      </div>

      <div class="step-1-flex">
        <div class="step1-34">
          <div class="step1-3">
          <div class="fun-title" v-html="$t('使用{type}註冊', { type: `<span style='color:#47A9FF'>${$t('手機號碼')}</span>`} )"></div>
            <p :class="tw(['text-left'])" >{{ $t('輸入您的【電話號碼】後，點選「發送驗證碼」，收到六位數驗證碼後填入，再點選「下一步」。') }}</p>
            <img class="step-img" :class="tw(['h-[500px]'])" :src="getStepImg('1-3')" :alt="$t('演示畫面')" />
          </div>
          <div class="step1-4">
            <div class="fun-title" v-html="$t('使用{type}註冊', { type: `<span style='color:#FF9D47'>Apple ID</span>`} )"></div>
              <p :class="tw(['text-left'])" >{{ $t('請確認您要登入Cofun LIVE的信箱是否正確，並點選「繼續」。') }}</p>
              <img class="step-img" :class="tw(['h-[500px]'])"  :src="getStepImg('1-4')" :alt="$t('演示畫面')" />
          </div>
        </div>

        <div class="step1-5">
          <div class="fun-title" v-html="$t('使用{type}註冊', { type: `<span style='color:#0DC758'>LINE</span>`} )"></div>
          <div class="step-content">
            <div>
              <div class="title">
                <div class="number" :style="`background-image: url(${stepImgUrl}/line-title-icon.svg);`">1</div>
                <div v-html="$t('閱讀條款後，點選<br>「同意並繼續」開始註冊。')"></div>
              </div>
              <img class="step-img" :class="tw(['h-[500px]'])" :src="getStepImg('1-5')" :alt="$t('演示畫面')" />
            </div>
            <div>
              <div class="title">
                <div class="number" :style="`background-image: url(${stepImgUrl}/line-title-icon.svg);`">2</div>
                <div v-html="$t('請擇一註冊：<br>手機號碼、LINE、Apple ID。')"></div>
              </div>
              <img  class="step-img" :class="tw(['h-[500px]'])" :src="getStepImg('1-6')" :alt="$t('演示畫面')" />
            </div>
          </div>
        </div>
      </div>
      <div class="step-content four-content">
        <div>
          <div class="title">
            <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg);`">3</div>
            <div>{{$t("請選擇您的【地區】，並設定專屬【暱稱】【帳號】，填寫完成後請點選「下一步」。")}}
              <small>※{{$t('若有【推薦人邀請碼】請一併輸入')}}</small>
            </div>
          </div>
          <img class="step-img" :src="getStepImg('1-7')" :alt="$t('演示畫面')" />
        </div>
        <div>
          <div class="title">
            <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg);`">4</div>
            <div v-html="$t('輸入您的【電話】後，點選「發送驗證碼」，收到六位數 驗證碼後填入，再點選「完成」。')"></div>
          </div>
          <img  class="step-img" :src="getStepImg('1-8')" :alt="$t('演示畫面')" />
        </div>
        <div>
          <div class="title">
            <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg);`">5</div>
            <div v-html="$t('請填寫【姓名】、【出生日期】、【性別】，並輸入【身分證號或居留證號碼】，並往下滑。')"></div>
          </div>
          <img  class="step-img" :src="getStepImg('1-9')" :alt="$t('演示畫面')" />
        </div>
        <div>
          <div class="title">
            <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg);`">6</div>
            <div v-html="$t('請上傳相關證件照片，完成後點選「完成」。')"></div>
          </div>
          <img  class="step-img" :src="getStepImg('1-10')" :alt="$t('演示畫面')" />
        </div>
      </div>

      <h5><span>{{ $t('步驟{num}', {num:2}) }}</span>{{ $t('收款帳戶資料') }}</h5>
      <div class="step-content">
        <div>
          <div class="title">
            <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg);`">1</div>
            <div>{{ $t('請點選「設定」。') }}</div>
          </div>
          <img class="step-img" :src="getStepImg('2-1')" :alt="$t('演示畫面')" />
        </div>
        <div>
          <div class="title">
            <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg);`">2</div>
            <div>{{ $t('請點選「收款帳戶資料」。') }}</div>
          </div>
          <img  class="step-img" :src="getStepImg('2-2')" :alt="$t('演示畫面')" />
        </div>
        <div>
          <div class="title">
            <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg);`">3</div>
            <div>{{ $t('請選擇您的「收款幣種」為「美元$USD」或「新台幣$TWD」，並點選「下一步」。') }}</div>
          </div>
          <img class="step-img" :src="getStepImg('2-3')" :alt="$t('演示畫面')" />
        </div>
      </div>

      <div class="step-content step2-45">
        <div class="step2-4">
          <div class="fun-title"><span>{{ $t('美元$USD') }}</span></div>
          <p :class="tw(['text-left'])" >{{ $t('輸入您的【美金銀行帳號】、【收款人名稱】、【地址】、【收款國別】、【SWIFT ID】、【銀行名稱】、【銀行地址】，並上傳您的銀行存摺封面，完成後點選「前往認證」。') }}</p>
          <img  :class="tw(['h-[520px]'])" :src="getStepImg('2-4')" :alt="$t('演示畫面')" />
        </div>
        <div class="step2-5">
          <div class="fun-title"><span>{{ $t('新台幣$TWD') }}</span></div>
          <p>
            {{ $t('請選擇您的台幣銀行名稱，並輸入您的【銀行帳號】、【收款人名稱】，並上傳您的銀行存摺封面，完成後點選「前往認證」。') }}
          </p>
          <img class="step-img" :class="tw(['h-[520px]'])" :src="getStepImg('2-5')" :alt="$t('演示畫面')" />
        </div>
        
      </div>

      <h5><span>{{ $t('步驟{num}', {num:3}) }}</span>{{ $t('實名收益啟動') }}</h5>
      <div class="step-content">
        <div>
          <div class="title">
            <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg);`">1</div>
            <div>{{ $t('請點選「設定」。') }}</div>
          </div>
          <img class="step-img" :src="getStepImg('3-1')" :alt="$t('演示畫面')" />
        </div>
        <div>
          <div class="title">
            <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg);`">2</div>
            <div>{{ $t('請點選「實名收益啟動」。') }}</div>
          </div>
          <img  class="step-img" :src="getStepImg('3-2')" :alt="$t('演示畫面')" />
        </div>
        <div>
          <div class="title">
            <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg);`">3</div>
            <div>{{ $t('請填寫您的【真實姓名】、【出生日期】、【性別】、【身分證字號/居留證號碼】，並上傳您的證件正反面照片，完成後點選「前往認證」。') }}</div>
          </div>
          <img class="step-img" :src="getStepImg('3-3')" :alt="$t('演示畫面')" />
        </div>
      </div>


      <h5><span>{{ $t('步驟{num}', {num:4}) }}</span>{{ $t('稅務設定') }}</h5>
      <div class="step-content">
        <div>
          <div class="title">
            <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg);`">1</div>
            <div>{{ $t('請點選「設定」。') }}</div>
          </div>
          <img class="step-img" :src="getStepImg('4-1')" :alt="$t('演示畫面')" />
        </div>
        <div>
          <div class="title">
            <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg);`">2</div>
            <div>{{ $t('請點選「稅務設定」。') }}</div>
          </div>
          <img  class="step-img" :src="getStepImg('4-2')" :alt="$t('演示畫面')" />
        </div>
        <div>
          <div class="title">
            <div class="number" :style="`background-image: url(${stepImgUrl}/title-icon.svg);`">3</div>
            <div>{{ $t('請選擇您的【稅務身分別】，並點選確認。') }}</div>
          </div>
          <img class="step-img" :src="getStepImg('4-3')" :alt="$t('演示畫面')" />
        </div>
      </div>

      <div class=" complete">
        <h5>{{ $t('註冊完成！') }}</h5>
        <div>{{ $t('恭喜您成為直播主') }}</div>
        <img class="step-img" :class="tw(['mb-[100px]', 'mt-[50px]','mx-auto'])" :src="`${imgUrl}/complete-et.svg`" :alt="$t('教學完成！')" />
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
    return `${imgUrl.value}/HowToBecomeCofunLIVEStreamer/${folderName}`
  })
  const getStepImg = fileStepName => {
    const folderName = imageLanguageFolderName?.[lang.value] ?? 'en'
    return `${imgUrl.value}/HowToBecomeCofunLIVEStreamer/${folderName}/step${fileStepName}.png?v=1.5`
  }
</script>
<style lang="scss" scoped>
  img[src$='.svg'] {
    image-rendering: -webkit-optimize-contrast; /* Safari 專用修正 */
  }
  .view-guide-use-cofun {
    margin-top: -18px;
    margin-bottom: -30px;
    background-color: #f8f9ff;
    word-break: break-word;
    line-break: anywhere;

    .step-img {
      display: inline-block;
      padding: 15px 0px;
      width: auto;
      max-height: 520px;
    }
    .step-1-flex {
      padding: 40px 0;
      display: flex;
      justify-content: center;
      .step1-34 {
        display: flex;
        gap: 20px;
        justify-content: center;
        padding-right: 20px;

        > div {
          width: 280px;
          display: flex;
          flex-direction: column;
        }
      }
      .step1-3,
      .step1-4,
      .step1-5 {
        border: 2px solid #dddddd;
        border-radius: 32px;
        padding: 20px;
        min-width: 250px;

        .fun-title {
          background-color: #f8f9ff;
          padding: 0 10px;
          margin: -40px auto 0 auto;
          font-size: 25px;
          line-height: 40px;
          font-weight: bold;
          color: #2c2c2c;
          white-space: nowrap;
          width: min-content;
          text-align: center;
        }

        p {
          padding: 20px 0 30px 0;
          flex-grow: 1;
        }
        img {
          padding: 0;
          margin: 0 auto;
        }
      }

      .step1-5 {
        margin: 0;
        max-width: 560px;
        .step-content {
          display: flex;
          height: 100%;
          padding: 0;
          .title {
            padding: 20px 0 10px 0;
          }
          img {
            padding: 0 !important;
          }
        }
      }
    }
    @media (max-width: 1200px) {
      .step-1-flex {
        display: block;
        .step1-34 {
          padding-right: 0;
        }

        .step1-5 {
          margin: 60px auto 0 auto;
        }
      }
    }
    @media (max-width: 768px) {
      .step-1-flex {
        display: block;
        .step1-34 {
          display: block;
          .step1-3,
          .step1-4 {
            margin: 0 auto;
            max-width: 350px;
            width: 100%;
            margin-bottom: 60px;
            p {
              max-width: 100% !important;
            }
          }
        }
        .step1-5 .step-content {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
        }
      }
    }
    @media (max-width: 400px) {
      .step-1-flex {
        display: block;
        .step1-5 .step-content {
          display: block;
        }
      }
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
          }
        }
        small {
          display: block;
          padding-bottom: 10px;
        }

        &.four-content {
          grid-template-columns: repeat(4, 1fr);
        }
        &.two-content {
          grid-template-columns: repeat(2, 1fr);
          max-width: 600px;
          margin: 0 auto;
        }
        @media (max-width: 1200px) {
          &.four-content {
            grid-template-columns: repeat(2, 1fr);
            max-width: 600px;
            margin: 0 auto;
          }
        }

        &.step2-45 {
          display: flex;

          .step2-4 {
            flex-grow: 1;
          }
          .step2-5 {
            max-width: 320px;
          }
          .step2-4,
          .step2-5 {
            border: 2px solid #dddddd;
            border-radius: 32px;
            padding: 20px;
            min-width: 250px;

            .fun-title {
              background-color: #f8f9ff;
              padding: 0 10px;
              margin: -40px auto 0 auto;
              font-size: 25px;
              line-height: 40px;
              font-weight: bold;
              color: #2c2c2c;
              white-space: nowrap;
              width: min-content;
              text-align: center;
            }

            p {
              padding: 20px 0 30px 0;
              flex-grow: 1;
            }
            img {
              padding: 0;
              margin: 0 auto;
            }
          }
        }

        @media (max-width: 767px) {
          &.step2-45 {
            flex-direction: column;
            align-items: center;

            > div {
              margin-bottom: 60px;
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

    @media (max-width: 767px) {
      .step4 {
        display: block;
        img {
          margin: 20px auto 50px auto;
          // margin-bottom: 10px;
        }
      }
    }
  }
</style>

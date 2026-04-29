<template>
  <div class="about_wrap">
    <div class="about_container container-mo-main">
      <div class="logo" :class="tw(['flex', 'justify-center', 'items-center', 'mb-40px'])">
        <img
          class="logo_img"
          :src="require(`@/assets/img/logo/logo_PlayBUZ.svg`)"
          :alt="SITE_NAME"
          :class="tw(['w-28'])"
        />
        <div class="logo__line" :class="tw(['w-px', 'bg-frameHasText', 'h-52px', 'mx-16px'])" />
        <div class="logo__label">
          <div class="logo__title" :class="tw(['text-[24px', 'font-bold', 'tracking-widest'])">
            {{ SITE_NAME }}
          </div>
        </div>
      </div>
      <p>{{ $t('{siteName} — 不只是遊戲，更是全球娛樂的交流平台。', { siteName: SITE_NAME }) }}</p>
      <p>
        {{
          $t('{siteName} 匯聚來自世界各地的玩家，共同打造一個兼具娛樂性與互動性的線上社群空間。', {
            siteName: SITE_NAME
          })
        }}
        {{ $t('我們深信，遊戲不應只是單一的體驗，而是一場可以連結彼此的文化對話與數位生活。') }}
        {{ $t('我們積極攜手優質遊戲開發商，不斷精進產品內容，只為帶來更流暢、更精彩的娛樂體驗。') }}
      </p>
      <p>
        {{
          $t(
            '除了多元的遊戲內容，{siteName} 更致力於整合數位娛樂產品與服務，為用戶提供豐富且靈活的選擇，滿足不同市場與玩家族群的需求。',
            { siteName: SITE_NAME }
          )
        }}
      </p>
      <p>
        {{ $t('如需業務合作或洽詢，歡迎聯絡我們：') }}<br />
        <a :href="`mailto:${siteMail}`">{{ siteMail }}</a>
      </p>
    </div>
  </div>
</template>

<script>
  import { SITE } from '@/configs'
  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import store from '@/store'

  export default {
    setup() {
      const imgUrl = ref(process.env.VUE_APP_IMG_URL)
      const siteMail = computed(() => SITE.contact.mail)
      const { t } = useI18n()
      const SITE_NAME = computed(() => t(process.env.VUE_APP_SITE_NAME))
      const isMobile = computed(() => store.getters['platform/isMobile'])
      return {
        imgUrl,
        SITE_NAME,
        siteMail,
        isMobile
      }
    }
  }
</script>
<style lang="scss" scoped>
  .about_wrap {
    p {
      padding-bottom: 30px;
    }
  }
</style>

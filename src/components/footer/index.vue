<template>
  <footer class="footer_container" :class="tw(['h-full', 'text-white', 'text-center', 'md:pb-[30px]', 'pb-[120px]'])">
    <div :class="tw(['w-[10rem]', 'mx-auto', 'pt-14'])">
      <img :alt="SITE_NAME" :src="require(`@/assets/img/logo/logo_PlayBUZ.svg`)" :title="SITE_NAME" />
    </div>
    <div class="footer_list" :class="tw(['inline-flex', 'items-center'])">
      <span
        v-for="(item, index) of tidyList"
        :key="item.id"
        :class="
          tw([
            'h-4',
            'px-4',
            'my-6',
            'flex',
            'cursor-pointer',
            'items-center',
            'text-[#707070]',
            'hover:underline',
            { 'border-r border(solid [#707070])': tidyList.length - 1 > index }
          ])
        "
        @click="action(item)"
      >
        {{ $t(item.label, { siteName: SITE_NAME }) }}
      </span>
    </div>
    <div class="social-link">
      <a v-for="(item, index) in SOCIAL_LIST" :key="index" target="_blank" :href="item.url" :title="item.id">
        <i :class="`bi ${item.icon}`"></i>
      </a>
    </div>
    <div :class="tw(['text-footerTipsText'])">
      <!-- <div v-if="SERVICE_HOURS">{{ `${$t('維護時間')} : ${serviceWeek}` }}</div> -->
      <div v-if="SERVICE_PHONE">{{ `${$t('客服電話')} : ${SERVICE_PHONE}` }}</div>
    </div>
    <div :class="tw(['flex', 'justify-center', 'px-3'])">
      <img :class="tw(['mr-3'])" :src="`${imageURL}/img/footer/rating-18plus.svg`" :alt="$t('18 歲以上限制級標誌')" />
      <div :class="tw(['tablet:flex', 'tablet:flex-col', 'text-footerTipsText', 'text-[14px]', 'mt-5'])">
        <div>{{ `${$t('E-mail信箱')} : service.tw@playbuz.app` }}</div>
        <div>{{ $t('華權數位整合行銷有限公司') }} {{ $t('統編') }}：97565974</div>
        <div :class="tw(['w-full'])">{{ COPYRIGHT }}</div>
      </div>
    </div>
    <div :class="tw(['text-footerTipsText', 'text-sm'])" @click="setMode">
      {{ versionTitle }} v{{ VERSION }}
      <template v-if="modeObject.status"> &nbsp;({{ $t('超級模式') }}) </template>
      <teleportItem>
        <popupView v-if="modeObject.display && modeObject.status" @close="modeObject.display = false" />
      </teleportItem>
    </div>
  </footer>
</template>

<script>
  import { computed, reactive, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { event } from 'vue-gtag-next'
  import store from '@/store'

  import teleportItem from '@/components/ui/teleport-item'
  import popupView from './popup'

  import { COPYRIGHT, SERVICE_HOURS, SERVICE_PHONE, WEEKS, SOCIAL_LIST } from '@/configs'
  import { VERSION } from '@/configs/version'
  import { useNotice } from '@/utils/use-notice'
  import { LIST_FAQ } from '@/views/FAQ/i18n/index.js'
  import { USER_RULE_BUTTON_LIST } from '@/configs/userRule.js'

  export default {
    name: 'view-footer',

    components: {
      teleportItem,
      popupView
    },

    setup() {
      const { t } = useI18n()
      const SITE_NAME = computed(() => t(process.env.VUE_APP_SITE_NAME))
      const route = useRoute()
      const router = useRouter()
      const versionTitle = process.env.VUE_APP_VERSION_TITLE ?? 'qa'
      const imageURL = process.env.VUE_APP_IMG_URL

      const serviceWeek = computed(() =>
        SERVICE_HOURS?.replace(/[一二三四五六日]/g, match => {
          return `( ${t(match)} )`
        })
      )

      const tidyList = [
        { id: 'about', label: '關於玩霸', router: { name: 'about' } },
        {
          id: 'userRules',
          label: '相關規範',
          router: { name: 'userRules', params: { pageId: USER_RULE_BUTTON_LIST[0].id } }
        },
        { id: 'service', label: '常見問題', router: { name: 'FAQ', params: { faqTypeName: LIST_FAQ[0].name } } }
      ]

      const action = item => {
        router.push(item.router)
      }

      const goLink = obj => {
        if (obj?.router) router.push(obj.router)
        else if (obj?.src) window.open(obj.src, '_blank')
      }

      const modeObject = reactive({
        count: 0,
        countLimit: 10,
        timeLimit: 10000,
        timer: null,
        status: computed(() => {
          if (!JSON.parse(process.env.VUE_APP_SUPER_MODE)) return false
          return modeObject.count >= modeObject.countLimit
        }),
        display: false
      })

      watch(
        () => modeObject.status,
        bol => {
          if (bol && modeObject.timer) {
            const superMode = {
              debug: store.state.game.mine.debug
            }
            localStorage.setItem('superMode', JSON.stringify(superMode))
            useNotice({ type: 'gpg', message: '開啟超級模式 =͟͟͞͞( •̀д•́)' })
          }
        }
      )

      const setMode = () => {
        // 未打開超級模式則不觸發
        if (!JSON.parse(process.env.VUE_APP_SUPER_MODE)) return false

        if (modeObject.count >= modeObject.countLimit) {
          modeObject.display = !modeObject.display
          return false
        }

        modeObject.count++

        if (!modeObject.timer) {
          modeObject.timer = setTimeout(() => {
            if (modeObject.count < modeObject.countLimit) modeObject.count = 0
            clearTimeout(modeObject.timer)
            modeObject.timer = null
          }, modeObject.timeLimit)
        }
      }

      const init = () => {
        if (localStorage.getItem('superMode')) {
          modeObject.count = modeObject.countLimit
          const getSuperMode = JSON.parse(localStorage.getItem('superMode'))
          store.dispatch('game/setMineDebug', getSuperMode.debug)
        }
      }

      init()

      return {
        SITE_NAME,
        SERVICE_HOURS,
        SERVICE_PHONE,
        WEEKS,
        VERSION,
        COPYRIGHT,
        tidyList,
        modeObject,
        versionTitle,
        serviceWeek,
        SOCIAL_LIST,
        imageURL,
        // fn
        action,
        goLink,
        setMode
      }
    }
  }
</script>

<style lang="scss" scoped>
  .social-link {
    a {
      background-color: #8492aa;
      color: #e8effa;
      transition: all 0.2s ease;
      border-radius: 6px;
      margin: 0 4px;
      display: inline-block;
      width: 30px;
      height: 30px;
      display: inline-flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background-color: #7c7ed7;
        color: white;
        scale: 1.1;
      }

      i {
        font-size: 16px;
        line-height: 16px;
      }
    }
  }
</style>

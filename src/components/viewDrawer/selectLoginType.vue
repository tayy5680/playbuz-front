<template>
  <div :class="tw(['flex', 'flex-col', 'h-full', 'justify-between'])">
    <div class="logo-svg"><img class="mx-auto" src="./images/PlayBUZ_logo_chat.svg" /></div>
    <div class="popularize__welcome" v-if="getPopularizeCode" :class="tw(['relative', 'text(white lg center base)'])">
      <h1 :class="tw(['text-xl', 'mb-2'])">
        {{ $t('嗨!新朋友') }}
      </h1>
      <p v-if="codeUserNickname">{{ $t('立即領取{name}送你的大禮包！', { name: codeUserNickname }) }}</p>
    </div>
    <div :class="tw(['text-[#1F2530]', 'text-center', 'mt-[11px]', 'mb-[24px]'])">
      {{ $t('請選擇登入方式') }}
    </div>
    <div class="type__main" :class="tw(['relative'])">
      <div :class="tw(['flex', 'justify-center', 'gap-[24px]', 'items-center'])">
        <div
          class="main__type__option"
          v-for="item of loginOptionList"
          :key="item.id"
          v-loading="loading"
          :class="
            tw([
              'w-full',
              'w-[111px]',
              'h-[127px]',
              'rounded-xl',
              'flex',
              'flex-col',
              'items-center',
              'justify-center',
              'transition',
              item.id === 'guest' && info ? 'hidden' : '',
              { hidden: item.id === 'guest' && !isDrawerShowGuest },
              item.isVerified ? '' : 'hover:opacity-70 cursor-pointer bg-[#374151]'
            ])
          "
          style="box-shadow: 0px 2px 2.3px 0px #0E072442;"
          v-audio="['asideMenu']"
          @click="selectOption(item)"
        >
          <div
            :class="tw(['w-40px', 'h-40px', 'bg-white', 'mb-[11px]'])"
            :style="{
              '-webkit-mask': `url(${require(`${item.icon}`)}) no-repeat center /contain`,
              mask: `url(${require(`${item.icon}`)}) no-repeat center /contain`
            }"
          />
          <span :class="tw(['text(white [14px])'])">{{ item.isVerified ? $t('已驗證') : $t(item.label) }}</span>
        </div>
      </div>
    </div>
    <div class="type__other" v-if="LOGIN_OPTION_OTHER.length > 1">
      <div :class="tw(['my-[30px]'])">
        <el-divider>
          <span :class="tw(['text-[16px]'])">{{ $t('更多登入方式') }} </span>
        </el-divider>
      </div>

      <div :class="tw(['flex', 'justify-center', 'items-center', 'gap-[32px]', 'my-[32px]'])">
        <div
          class="other__type__option"
          v-for="item of LOGIN_OPTION_OTHER"
          :key="item.id"
          v-loading="loading"
          :class="
            tw([
              'cursor-pointer',
              'hover:bg-InputBackground',
              'rounded-xl',
              'flex',
              'flex-col',
              'transition',
              'hover:opacity-70'
            ])
          "
          v-audio="['asideMenu']"
          @click="selectOption(item)"
        >
          <div
            v-if="item.isColor"
            :class="tw(['w-40px', 'h-40px', 'bg-BaseColor', 'my-3', item.isColor ?? `fill-[${item.color}]`])"
            :style="{
              '-webkit-mask': `url(${item.icon}) no-repeat center /contain`,
              mask: `url(${item.icon}) no-repeat center /contain`
            }"
          />
          <img
            v-else
            :src="`${item.icon}`"
            :class="tw(['w-[40px]', 'h-auto', item.isColor ?? `fill-[${item.color}]`])"
          />
        </div>
      </div>
    </div>
    <!-- 使用者合約聲明 -->
    <div class="privacy__policy" :class="tw(['flex', 'justify-center', 'items-start'])">
      <div :class="tw(['text([#707070] [16px])', 'leading-[16px]'])"><i class="bi bi-exclamation-circle"></i></div>
      <div :class="tw(['ml-3', 'text([#707070] [12px])', 'w-[323px]', 'min-w-[70%]'])">
        <div v-html="TERMS_I18N?.[lang] ?? TERMS_I18N['en-US']"></div>
        {{ $t('我們保證會員資訊絕不外流，敬請安心使用。') }}
      </div>
    </div>
  </div>
</template>
<script>
  import { ref, computed, onMounted, inject, onUnmounted, watch } from 'vue'
  import lottie from 'lottie-web'
  import { useRoute, useRouter } from 'vue-router'
  import { event } from 'vue-gtag-next'
  import store from '@/store'
  import { useNotice } from '@/utils/use-notice'
  import { UNKNOWN_USER_NAME, lineUrl, yahooUrl, appleUrl } from '@/configs'
  import { getMemberPromoteInfo } from '@/api/member'
  import { getJson, getImgUrl } from '@/utils/get-Url-Data'

  export default {
    name: 'select-login-type',

    setup() {
      const TERMS_I18N = {
        'zh-TW': `登入／註冊即表示您 <b style="color:black;">已年滿 18 歲，且同意遵守<a href='/userRules/user-guidelines' target='_blank'><u>《使用者條款》</u></a></b>。`,
        'en-US': `By logging in or signing up, you <b style="color:black;">confirm that you are at least 18 years old and agree to the <a href='/userRules/user-guidelines' target='_blank'><u>《Terms of Use》</u></a></b>.`,
        'zh-CN': `登录/注册即表示您 <b style="color:black;">已年满 18 岁，且同意遵守<a href='/userRules/user-guidelines' target='_blank'><u>《用户条款》</u></a></b>。`,
        'ja-JP': `ログインまたは登録することで、<b style="color:black;">18歳以上であり、<a href='/userRules/user-guidelines' target='_blank'><u>《利用規約》</u></a>に同意したものとみなされます</b>。`
      }
      const router = useRouter()
      const route = useRoute()

      const info = computed(() => store.state.member.info)
      const logIn = computed(() => store.state.sign.logIn)
      const isDrawerShowGuest = computed(() => store.state.sign.isDrawerShowGuest)
      const loading = ref(false)
      const logo = ref(null)
      const changeView = inject('changeView')
      const setLoginType = inject('setLoginType')
      const close = inject('close')
      const LOGIN_OPTION = [
        { id: 'phoneNumber', label: '手機', icon: './images/i_mm_phone.svg' },
        { id: 'email', label: '信箱', icon: './images/i_email.svg' }
        // { id: 'guest', label: '訪客', icon: './images/i_geust.svg' }
      ]

      watch(logIn, newVal => {
        loading.value = newVal
      })

      const loginOptionList = computed(() => {
        return LOGIN_OPTION.map(item => {
          if ((item.id === 'email' && info.value?.Email) || (item.id === 'phone' && info.value?.PhoneNumber)) {
            item.isVerified = true
          }
          return item
        })
      })

      const showOtherOption = ref(false)
      const LOGIN_OPTION_OTHER = [
        // { id: 'agent', icon: getImgUrl('img/icons/i_mm_name.svg'), color: '#fff', isColor: true, hidden: true },
        { id: 'line', icon: require('@/assets/img/icons/i_linelogo.svg'), color: '', isColor: false, hidden: false },
        { id: 'apple', icon: require('@/assets/img/icons/i_apple_ios.svg'), color: '', isColor: false, hidden: false }
      ]
      //  getPopularizeCode：是否藉由推廣碼註冊
      const popularizeCode = inject('popularizeCode')
      const getPopularizeCode = computed(() => {
        return popularizeCode.value
          ? popularizeCode.value.promote || popularizeCode.value.introduce || popularizeCode.value.introduction
          : null
      })
      const lang = computed(() => store.state.member.languageCode)
      onMounted(async () => {
        const termsBtn = document.getElementById('termsBtn')
        if (termsBtn) {
          termsBtn.addEventListener('click', () => {
            const routeUrl = router.resolve({ name: 'userRules', query: { pageId: 'terms-of-service' } }).href
            window.open(routeUrl, '_blank')
          })
        }

        if (info.value?.Email && info.value?.PhoneNumber) {
          close()
          return false
        }

        const logoJson = ref('/lottie/login/ani_logintop_xpg_jp.json')
        const lanLogo = () => {
          if (lang.value === 'zh-TW') {
            logoJson.value = '/lottie/login/ani_logintop_xpg_tw.json'
          }
          if (lang.value === 'en-US') {
            logoJson.value = '/lottie/login/ani_logintop_xpg_en.json'
          }
        }
        await lanLogo()
        const animUrl = getPopularizeCode.value ? '/lottie/login/ani_logintop_xpg.json' : logoJson.value
        const json = await getJson(animUrl)
        lottie.loadAnimation({
          container: logo.value,
          animationData: json,
          renderer: 'svg',
          loop: true,
          autoplay: true
        })
      })

      // 點十下出現帳密登入按鈕
      const clickLogoCount = ref(0)
      const clickLogoCountLimit = ref(10)
      const clickLogoTimer = ref(null)
      const actionClickLogo = () => {
        if (info.value) return false
        clickLogoCount.value++
        if (clickLogoCount.value > clickLogoCountLimit.value) showOtherOption.value = true
        if (!clickLogoTimer.value) {
          clickLogoTimer.value = setTimeout(() => {
            if (clickLogoCount.value < clickLogoCountLimit.value) clickLogoCount.value = 0
            clearTimeout(clickLogoTimer.value)
            clickLogoTimer.value = null
          }, 10000)
        }
      }
      onUnmounted(() => {
        if (clickLogoTimer.value) {
          clearTimeout(clickLogoTimer.value)
          clickLogoTimer.value = null
        }
      })

      const selectOption = item => {
        if (loading.value) return false
        // let data = ''
        switch (item.id) {
          case 'guest':
            guestSignIn()
            break
          case 'agent':
            setLoginType(item.id)
            changeView('AgentInput')
            break
          case 'line':
            window.location.assign(lineUrl())
            break
          case 'yahoo':
            window.location.assign(yahooUrl())
            break
          case 'apple':
            window.location.assign(appleUrl())
            break
          default:
            if (item.isVerified) return false
            setLoginType(item.id)
            changeView('viewInputValidate')
            break
        }
      }
      // 訪客遊玩
      const guestSignIn = async () => {
        event('signup_guest_click', { click: '' })
        try {
          loading.value = true
          await store.dispatch('login/createGuest')
          if (store.state.platform.returnUrl) store.dispatch('platform/redirectToReturnUrl')
          changeView('signupGift')
        } catch (err) {
          useNotice({ type: 'error', message: '發生錯誤，請稍後再試，或洽客服人員' })
        } finally {
          loading.value = false
        }
      }
      const init = () => {
        event('signup_show', { show: location.pathname })
        if (getPopularizeCode.value) getMemberPromoteInfoData()
        if (logIn.value) loading.value = true
      }

      // 取得推廣人的資料
      const codeUserNickname = inject('codeUserNickname')
      const getMemberPromoteInfoData = () => {
        if (!popularizeCode.value) return false

        const query = {}
        if (popularizeCode.value.promote) query.PromoteCode = popularizeCode.value.promote
        else if (popularizeCode.value.introduce) query.PromoteCode = popularizeCode.value.introduce
        else if (popularizeCode.value.introduction) query.IntroduceCode = popularizeCode.value.introduction
        else return false

        return getMemberPromoteInfo(query)
          .then(res => {
            codeUserNickname.value = res.Data?.NickName || UNKNOWN_USER_NAME
          })
          .catch(err => {
            const errorCodeList = {
              400: '查無此輸入碼',
              1026: '推廣碼失效，將轉為一般註冊流程',
              1027: '介紹碼失效，將轉為一般註冊流程',
              9404: '查無此輸入碼'
            }

            const errorMessage = errorCodeList[err.Code] ?? '發生錯誤，請稍後再試，或洽客服人員'
            const type = ['1026', '1027'].includes(err.Code) ? 'info' : 'error'
            useNotice({ type, message: errorMessage })
            if (['1026', '1027'].includes(err.Code)) {
              delete route.query.introduction
              if (popularizeCode.value.introduction) store.commit('login/SET_MGM_CODE', '')
              if (popularizeCode.value.promote) store.commit('login/SET_AGM_CODE', '')
              else if (popularizeCode.value.introduce) store.commit('login/SET_AGM_CODE', '')
              localStorage.removeItem('popularizeCode')
              popularizeCode.value = null
            }
          })
      }
      init()
      return {
        lang,
        loading,
        logo,
        getPopularizeCode,
        clickLogoCount,
        clickLogoCountLimit,
        loginOptionList,
        LOGIN_OPTION_OTHER,
        showOtherOption,
        codeUserNickname,
        info,
        isDrawerShowGuest,
        TERMS_I18N,
        // fn
        selectOption,
        actionClickLogo
      }
    }
  }
</script>
<style lang="scss" scoped>
  .main__type__option {
    box-shadow: 0 0 12px #0006;
  }
</style>

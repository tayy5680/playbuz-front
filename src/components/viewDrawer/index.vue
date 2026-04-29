<template>
  <popView
    class="sign-in-ddrawer"
    v-if="enableShow"
    @close="close"
    :viewWidth="'444px'"
    :viewHeight="'620px'"
    :viewMaxHeight="'90svh'"
  >
    <template #container>
      <component :is="nowStep" :class="tw(['flex-1', 'w-full'])" />
    </template>
  </popView>
  <!-- <div
    class="drawer__block"
    v-show="enableShow"
    :class="
      tw([
        'fixed',
        'bottom-0',
        'md:bottom-1/2',
        'left-0',
        'md:left-1/2',
        'md:-translate-x-1/2',
        'md:translate-y-1/2',
        'z-30',
        'w-full',
        'md:max-w-108'
      ])
    "
  >
    <div
      class="drawer__view"
      :class="
        tw([
          'flex',
          'flex-col',
          'justify-between',
          'md:items-center',
          'text-violet',
          'bg-PopBackground',
          'rounded-t-20px',
          'md:rounded-20px',
          'md:min-h-144',
          'md:max-h-3/5',
          'overflow-y-auto',
          'xs:overflow-y-visible',
          'pb-20px'
        ])
      "
    >
      <component :is="nowStep" :class="tw(['flex-1', 'w-full'])" />
      <div
        ref="closeBtn"
        v-audio="'close'"
        :class="tw(['cursor-pointer', 'absolute', 'top-20px', 'right-20px'])"
        @click="close"
      >
        <maskPicture size="18" :img="require('@/assets/img/icons/i_close.svg')" />
      </div>
    </div>
  </div> -->
</template>

<script>
  import { ref, computed, provide, onMounted, onUnmounted, onBeforeUnmount, nextTick } from 'vue'
  import store from '@/store'
  import { useI18n } from 'vue-i18n'
  import { event } from 'vue-gtag-next'
  import { useRoute, useRouter } from 'vue-router'
  import popView from '@/components/ui/pop-view'
  import maskPicture from '@/components/maskPicture/maskPicture.vue'
  import SignupGift from './signupGift'
  import EditNameAndPhoto from './editNameAndPhoto.vue'
  import AgentInput from './agentInput.vue'
  import GetHelp from './getHelp.vue'
  import GetErrorHelp from './getErrorHelp.vue'
  import IntroduceGift from './introduce/introduceGift'
  import IntroduceSuccess from './introduce/introduceSuccess.vue'
  import Third from './third'
  import ThreadAward from './thread-award'
  import viewSelectLoginType from './selectLoginType'
  import viewInputValidate from './inputValidate.vue'
  export default {
    name: 'view-drawer',
    components: {
      popView,
      SignupGift,
      EditNameAndPhoto,
      AgentInput,
      GetHelp,
      GetErrorHelp,
      IntroduceGift,
      IntroduceSuccess,
      Third,
      ThreadAward,
      viewSelectLoginType,
      viewInputValidate,
      maskPicture
    },
    setup() {
      const { t } = useI18n()
      const SITE_NAME = computed(() => t(process.env.VUE_APP_SITE_NAME))

      const router = useRouter()
      const route = useRoute()
      const codeUserNickname = ref('')
      const info = computed(() => store.state.member.info)
      provide('codeUserNickname', codeUserNickname)
      const currentStep = computed(() => {
        if (store.state.sign.drawerStep === 'bindAccount') {
          if (store.state.sign.drawerBindType) {
            setLoginType(store.state.sign.drawerBindType)
            return 'viewInputValidate'
          }
          return null
        }
        return store.state.sign.drawerStep
      })
      const isLogin = computed(() => store.getters['member/isLogin'])

      const loading = ref(false)
      provide('loading', loading)
      const closeBtn = ref(null)
      // 是否顯示畫面
      const enableShow = ref(true)
      provide('enableShow', enableShow)
      const close = () => {
        if (loading.value) return false
        store.commit('sign/UPDATE_DRAWER_STATE', false)
      }
      provide('close', close)
      const popularizeCode = ref(JSON.parse(localStorage.getItem('popularizeCode')))
      provide('popularizeCode', popularizeCode)
      const i18nAnim = logoJSON => {
        logoJSON = logoJSON.replaceAll('只要', t('只要'))
        logoJSON = logoJSON.replaceAll('個步驟，', t('個步驟，'))
        logoJSON = logoJSON.replaceAll('立即成為正式會員！', t('立即成為正式會員！'))
        logoJSON = logoJSON.replaceAll('享受免費銀幣與各式精彩活動', t('享受免費銀幣與各式精彩活動'))
        logoJSON = logoJSON.replaceAll('GPG平台', t('{siteName}平台', { siteName: SITE_NAME.value }))
        return logoJSON
      }
      provide('i18nAnim', i18nAnim)
      const resize = () => {
        const meta = closeBtn.value.getBoundingClientRect()
        closeBtn.value.style.position = meta.top < 0 ? 'fixed' : 'absolute'
      }
      onMounted(() => {
        //  resize()
        //  window.addEventListener('resize', resize)
        const urlSearchParams = new URLSearchParams(location.search)
        const params = Object.fromEntries(urlSearchParams.entries())
        if (params?.third === 'jkf') {
          store.commit('sign/UPDATE_DRAWER_STEP', 'third')
          changeView('Third')
        } else if (info.value && info.value.IsGuest && !currentStep.value) {
          store.commit('sign/UPDATE_DRAWER_STEP', 'bindAccount')
        }
      })
      onBeforeUnmount(() => {
        if (nowStep.value === 'viewInputValidate') event('signup_leave', { leave: 'phone_verify' })
        else if (nowStep.value === 'editNameAndPhoto') event('signup_leave', { leave: 'photo_nickname' })
      })
      onUnmounted(() => {
        window.removeEventListener('resize', resize)
        store.commit('sign/UPDATE_DRAWER_STEP', '')
        store.commit('sign/UPDATE_DRAWER_BIND_TYPE', '')
        store.dispatch('platform/setCover', false)
        // loginProxy 登入流程後回調
        if (isLogin.value) {
          const hookProcess = sessionStorage.getItem('handleLoginProcedure')
          if (hookProcess) {
            store.dispatch('sign/loginProxy', JSON.parse(hookProcess))
          }
          // 重置登入資料
          store.commit('login/RESET_STORE')
        }
      })
      const init = () => {
        nextTick(() => {
          store.dispatch('platform/setCover', true)
        })
      }
      init()
      const nowStep = computed(() => {
        return nowView.value || currentStep.value || 'viewSelectLoginType'
      })
      const nowView = ref(null)
      const changeView = viewName => {
        nowView.value = viewName
      }
      provide('changeView', changeView)
      // 選擇登入方式loginType：phone、email、agent
      const loginType = ref('')
      const setLoginType = typeName => {
        loginType.value = typeName
      }
      provide('loginType', loginType)
      provide('setLoginType', setLoginType)
      return {
        enableShow,
        nowStep,
        closeBtn,
        close
      }
    }
  }
</script>
<style lang="scss" scoped>
  .resendBtn {
    .el-loading-spinner {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: -19px;
      height: 100%;

      .circular {
        width: 25px;
        height: 25px;
      }

      .path {
        stroke: #fff;
      }
    }
  }
</style>

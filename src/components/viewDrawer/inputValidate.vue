<template>
  <!-- 主要區域 -->
  <div :class="tw(['flex', 'flex-col', 'h-full', 'justify-center', 'w-full', 'text-BaseColor'])">
    <div
      class="validate__back"
      :class="
        tw([
          'w-full',
          'p-[20px]',
          'absolute',
          'absolute',
          'right-0',
          'cursor-pointer',
          isThird ? 'top-[-120px] md:top-[-185px]' : 'top-0',
          { hidden: isThird && isThirdLogin }
        ])
      "
      @click="backToSelect"
    >
      <maskPicture
        v-if="showBack()"
        v-audio="['close']"
        size="26"
        :img="require('@/assets/img/icons/i_back2.svg')"
        :class="tw(['bg-BaseColor', 'cursor-pointer'])"
      />
    </div>
    <div class="validate__input" :class="tw(['px-[14%]', 'text(center)', { 'pt-[10px]': !isThird }])">
      <div :class="tw([{ 'flex justify-center': isThird }])">
        <div
          :class="
            tw(['w-[90px]', 'h-[90px]', 'bg-BaseColor', isThird ? 'mr-2 w-[30px] inline-block' : 'mx-auto w-[90px]'])
          "
          :style="{
            '-webkit-mask': `url(${require(`${
              INPUT_OPTION[INPUT_OPTION.findIndex(el => el.id === loginType)].icon
            }`)}) no-repeat center /contain`,
            mask: `url(${require(`${
              INPUT_OPTION[INPUT_OPTION.findIndex(el => el.id === loginType)].icon
            }`)}) no-repeat center /contain`
          }"
        />
        <!-- <img :src="require(`${INPUT_OPTION[INPUT_OPTION.findIndex(el => el.id === loginType)].icon}`)"
          :class="tw([
            'h-auto',
            isThird ? 'mr-2 w-[30px] inline-block' : 'mx-auto w-[90px]',
          ])"
        /> -->
        <p :class="tw(['py-4'])">
          {{ $t(INPUT_OPTION[INPUT_OPTION.findIndex(el => el.id === loginType)].label) }}
        </p>
      </div>
      <div v-if="loginType === 'phoneNumber'">
        <vue-tel-input
          class="validate__phone__input"
          v-model="inputValue"
          @on-input="checkOnInput"
          @keydown.enter="submitAndSendOTP"
          :inputOptions="{ type: 'tel', inputmode: 'numeric' }"
          :class="tw(['border-line', 'rounded-full', 'py-1', 'px-2', 'text(lg base)', 'bg-InputBackground'])"
        />
      </div>
      <div v-else-if="loginType === 'email'">
        <input
          class="validate__email__input"
          v-model="inputValue"
          @input="checkOnInput"
          @keydown.enter="submitAndSendOTP"
          :class="
            tw([
              'border-1',
              'border-line',
              'rounded-full',
              'py-1',
              'px-2',
              'w-full',
              'h-[40px]',
              'text(lg base center)',
              'bg-InputBackground',
              'focus:border-nicknameBorder'
            ])
          "
        />
      </div>
      <button
        class="validate__send__OTP"
        v-loading="loading"
        :disabled="!isInputValid || (isSendOTP && countdown >= 0)"
        :class="
          tw([
            isInputValid && (!isSendOTP || countdown < 0)
              ? 'bg-purpleBtn text(white) cursor-pointer'
              : 'bg-purpleLine text-white cursor-not-allowed',
            'px-5 py-2',
            'rounded',
            'my-3',
            { 'mr-1': isSendOTP }
          ])
        "
        @click="submitAndSendOTP"
      >
        {{ isSendOTP ? $t('重新發送') + (countdown >= 0 ? `(${countdown}s)` : '') : $t('發送驗證碼') }}
      </button>
    </div>
    <div class="validate__OTP" v-show="isShowValidateUI" :class="tw(['text(center)', 'px-[14%]'])">
      <p :class="tw(['py-4'])">
        {{ $t('請輸入驗證碼') }}
      </p>
      <div
        :class="tw(['px-5', 'w-full', 'flex', 'justify-center', 'relative', { 'pb-5': userStatus !== 'userSignUp' }])"
      >
        <input
          class="validate__input__box"
          ref="inputOTPElement"
          v-model="inputOTPCode"
          type="tel"
          pattern="\d*"
          inputmode="numeric"
          maxlength="6"
          :disabled="!isInputValid"
          @keydown="onInput"
          @input="onInput"
          @focus="isFocus = true"
          @blur="isFocus = false"
          @keydown.enter="handleValidate"
          :class="tw(['absolute', 'left-0', 'top-0', 'w-full', 'h-full', 'bg-transparent', 'text-transparent', 'z-10'])"
          :style="{
            caretColor: 'transparent'
          }"
        />
        <div
          class="fake__input__box"
          v-for="(i, index) in 6"
          :key="index"
          @click="focusOTPInput"
          :class="[
            tw([
              isInputValid ? 'border-line bg-codeBox' : 'border-[#ffffff1f] bg-[#28252b]',
              'flex',
              'items-center',
              'justify-center',
              'w-1/6',
              'h-16',
              'tablet:h-14',
              'rounded-md',
              'mx-0.5',
              'tablet:h-16',
              'tablet:mx-0.5',
              'text(center 3xl white)',
              'font-medium',
              'border-1'
            ]),
            OTPCodes.length === index && isInputValid ? 'dot' : ''
          ]"
        >
          {{ OTPCodes.length === index && isInputValid ? '_' : OTPCodes[index] || '' }}
        </div>
      </div>
      <div class="validate_18" :class="tw(['flex', 'justify-center', 'items-start', 'pt-3', 'px-3'])">
        <div :class="tw(['pr-3', 'pt-0.5'])">
          <input type="checkbox" v-model="isAgechecked" class="checked__privacy__statement" v-audio="['asideMenu']" />
        </div>
        <div :class="tw(['text([12px] left)'])">
          {{ $t('我聲明我已年滿 18 歲，符合使用本服務的最低年齡限制。') }}
        </div>
      </div>
      <div class="validate__privacy__policy" :class="tw(['flex', 'justify-center', 'items-start', 'pb-3', 'px-3'])">
        <div :class="tw(['pr-3', 'pt-0.5'])">
          <input
            type="checkbox"
            v-model="isPrivacychecked"
            class="checked__privacy__statement"
            v-audio="['asideMenu']"
          />
        </div>
        <div :class="tw(['text([12px] left)'])" v-html="TERMS_I18N?.[lang] ?? TERMS_I18N['en-US']"></div>
      </div>
      <button
        class="validate__handle"
        v-loading="loading"
        :disabled="!isInputValid || !isPrivacychecked || !isAgechecked || !isSendOTP || OTPCodes.length !== 6"
        :class="
          tw([
            isInputValid && isPrivacychecked && isSendOTP && isAgechecked && OTPCodes.length === 6
              ? 'bg-purpleBtn cursor-pointer'
              : 'bg-purpleLine cursor-not-allowed',
            'px-5',
            'py-1',
            'rounded-full',
            'my-3',
            'w-full',
            'h-[40px]',
            'text(white)'
          ])
        "
        @click="handleValidate"
      >
        {{ $t('下一步') }}
      </button>
    </div>
  </div>
</template>
<script>
  import { ref, computed, inject, provide, onMounted, watch, onUnmounted, reactive, nextTick } from 'vue'
  import {
    postTokenSendLoginVerification,
    postCheckLoginVerification,
    getMemberInfo,
    postCertification,
    postValidateContactInfo
  } from '@/api/member'
  import { RECAPTCHA, CERTIFIED_CD_SEC, RESEND_CERTIFIED_CD_SEC } from '@/configs'
  import { useNotice } from '@/utils/use-notice'
  import { useReCaptcha } from 'vue-recaptcha-v3'
  import store from '@/store'
  import { event } from 'vue-gtag-next'
  import { setToken } from '@/utils'
  import { useI18n } from 'vue-i18n'
  import dayjs from 'dayjs'
  import './input.scss'
  import { useValidator, required, email } from '@/utils/use-validator'
  import maskPicture from '@/components/maskPicture/maskPicture.vue'

  export default {
    name: 'input-validate',

    components: {
      maskPicture
    },

    setup() {
      const TERMS_I18N = {
        'zh-TW': `同意 <a href='/userRules/privacy-policy' target='_blank'><u>《隱私權政策》</u></a> 及個人資料蒐集使用及接收簡訊。`,
        'en-US': `I agree to the <a href='/userRules/privacy-policy' target='_blank'><u>Privacy Policy</u></a>, the collection and use of personal data, and receiving SMS notifications.`,
        'ja-CN': `同意 <a href='/userRules/privacy-policy' target='_blank'><u>《隐私权政策》</u></a> 以及个人资料的收集使用和接收短信。`,
        'zh-JP': `<a href='/userRules/privacy-policy' target='_blank'><u>「プライバシーポリシー」</u></a>に同意し、個人情報の収集・利用およびSMSの受信に同意します。`
      }
      const { t } = useI18n()
      const reCaptcha = useReCaptcha()
      const userStatus = ref('')
      const loginType = inject('loginType')
      const changeView = inject('changeView')
      const close = inject('close')
      const popularizeCode = inject('popularizeCode')
      const isPrivacychecked = ref(true)
      const isAgechecked = ref(true)
      const isBindAccount = computed(() => store.state.sign.drawerStep === 'bindAccount')
      const lang = computed(() => store.state.member.languageCode)
      const info = computed(() => store.state.member.info)
      const isSendOTP = ref(false)
      const loading = ref(false)
      const isShowPrivacyPolicy = ref(false)
      const isShowValidateUI = ref(false)
      // third
      const isThird = computed(() => store.state.sign.drawerStep === 'third')
      const isThirdLogin = ref(false)
      const thirdLoginObject = inject('thirdLoginObject', {})
      const thirdChangeStep = inject('thirdChangeStep', () => {})
      const showBack = () => {
        if (info.value === null || info.value.Roles.includes('Guest')) return true
        return false
      }

      provide('validateLoading', loading)
      const INPUT_OPTION = [
        { id: 'phoneNumber', label: '請輸入手機號碼', icon: './images/i_mm_phone.svg' },
        { id: 'email', label: '請輸入Email信箱', icon: './images/i_email.svg' }
      ]
      const backToSelect = () => {
        if (isThird.value) thirdChangeStep('viewSelectLoginType')
        else changeView('viewSelectLoginType')
      }
      const resetInput = () => {
        loading.value = false
        inputOTPCode.value = ''
        isSendOTP.value = false
        isShowPrivacyPolicy.value = false
        if (!isThird.value || !isThirdLogin.value) {
          inputValue.value = ''
          legalInputValue.value = null
        }
      }

      // 使用者輸入內容是否符合規範
      const legalInputValue = ref('')
      const inputValue = ref('')
      const isInputValid = ref(false)
      const checkOnInput = (p, inputObject) => {
        if (!inputValue.value) {
          isInputValid.value = false
          return false
        }

        switch (loginType.value) {
          case 'phoneNumber':
            legalInputValue.value = inputObject.number
            isInputValid.value = inputObject.valid
            inputValue.value = inputObject.formatted
            break
          case 'email': {
            const v$ = useValidator(
              emailRules,
              reactive({
                email: inputValue.value
              })
            )
            v$.value.$touch()
            isInputValid.value = !v$.value.$error
            legalInputValue.value = inputValue.value
            break
          }
        }
      }
      const emailRules = computed(() => {
        return {
          email: {
            required: required(),
            email: email()
          }
        }
      })
      const submitAndSendOTP = async () => {
        if (loading.value || countdown.value > 0) return false
        if (!isInputValid.value) return useNotice({ type: 'error', message: '請檢查輸入的資料是否正確' })
        loading.value = true

        window.scrollTo(0, 0)
        try {
          isShowPrivacyPolicy.value = false
          isPrivacychecked.value = true
          isAgechecked.value = true
          // 是否註冊過
          const verifiedRes = await getValidateInfo()
          if (verifiedRes === 'registered') {
            if (isBindAccount.value || isThird.value) {
              let errMsg = {
                email: '該信箱地址已註冊，請使用其他信箱。',
                phoneNumber: '該手機號碼已註冊，請使用其他號碼。'
              }
              useNotice({ type: 'error', message: errMsg?.[loginType.value] ?? '該帳號已存在，請選擇其他帳號名稱。' })
              return false
            }
          } else if (verifiedRes === 'unregistered') {
            isShowPrivacyPolicy.value = true
            isPrivacychecked.value = false
            isAgechecked.value = false
          } else return false
          await reCaptcha.recaptchaLoaded()
          const token = await reCaptcha.executeRecaptcha(RECAPTCHA.actionList.login)

          isSendOTP.value = false
          // 直接發送登入驗證碼
          const inputData = {
            reCAPTCHA: token,
            locale: lang.value,
            [loginType.value]: legalInputValue.value
          }
          await postTokenSendLoginVerification(inputData)
          isSendOTP.value = true
          isShowValidateUI.value = true
          useNotice({
            type: 'success',
            message: `驗證碼已寄送，請由${loginType.value === 'phoneNumber' ? '簡訊' : '信箱'}確認您的6位數驗證碼。`
          })
        } catch (err) {
          const errorCodeList = {
            1006: '驗證碼已發送，請稍後再試',
            1008: '超出驗證次數上限',
            1010: '發送驗證碼失敗，請確認輸入的資料是否正確'
          }
          if (err.Code === '1006') {
            isSendOTP.value = true
            isShowValidateUI.value = true
          }
          const errorMessage = errorCodeList[err.Code] ?? '發生錯誤，請稍後再試，或洽客服人員'
          useNotice({ type: 'error', message: errorMessage })
        } finally {
          loading.value = false
          nextTick(() => {
            focusOTPInput()
          })
        }
      }
      const getValidateInfo = async () => {
        const inputData = {
          [loginType.value]: legalInputValue.value
        }
        return await postValidateContactInfo(inputData)
          .then(() => {
            return 'registered'
          })
          .catch(err => {
            if (err.Code === '1032') return 'unregistered'
            useNotice({ type: 'error', message: '發生錯誤，請稍後再試，或洽客服人員' })
            return err.Code
          })
      }
      // 驗證碼輸入區
      const inputOTPElement = ref(null)
      const isFocus = ref(false)
      const inputOTPCode = ref('')
      const OTPCodes = computed(() => inputOTPCode.value.split(''))
      const onInput = event => {
        if (event.key === 'Process') inputOTPCode.value = ''
        inputOTPCode.value = inputOTPCode.value.replace(/(\s)|[^0-9]/g, '')
      }
      const focusOTPInput = () => {
        inputOTPElement.value.focus()
      }
      const handleValidate = async () => {
        if (
          loading.value ||
          OTPCodes.value.length !== 6 ||
          !isPrivacychecked.value ||
          !isAgechecked.value ||
          !isInputValid.value ||
          !isSendOTP.value
        )
          return
        if (inputOTPCode.value.split().every(i => isNaN(Number(i)))) return

        loading.value = true
        // 是否註冊過
        const verifiedRes = await getValidateInfo()
        if (verifiedRes === 'registered') {
          if (isBindAccount.value || isThird.value) {
            let errMsg = {
              email: '該信箱地址已註冊，請使用其他信箱。',
              phoneNumber: '該手機號碼已註冊，請使用其他號碼。'
            }
            useNotice({ type: 'error', message: errMsg?.[loginType.value] ?? '該帳號已存在，請選擇其他帳號名稱。' })
            resetInput()
          } else await checkLoginOTP()
        } else if (verifiedRes === 'unregistered') {
          if (isBindAccount.value && info.value?.IsGuest === false) await checkBindMoreAccountOTP()
          else await checkSignUpOTP()
        }
        inputOTPCode.value = ''
        loading.value = false
      }
      const checkLoginOTP = async () => {
        try {
          const inputData = {
            verifyCode: inputOTPCode.value,
            device: store.state.platform.deviceInfo,
            [loginType.value]: legalInputValue.value
          }
          await postCheckLoginVerification(inputData).then(res => {
            if (res.Status.Code === '0') {
              setToken(res)
              store.dispatch('member/logIn', JSON.parse(localStorage.getItem('userToken')))
            }
          })
          event('login', { path: location.pathname, method: loginType.value })

          await getMemberInfo()
          await store.dispatch('member/logIn')
          if (store.state.platform.returnUrl) store.dispatch('platform/redirectToReturnUrl')
          const info = store.state.member.info
          useNotice({ type: 'gpg', message: `Hi! ${info?.NickName || ''} ${t('歡迎回來！')}`, isI18n: false })
          changeView('ThreadAward')
        } catch (err) {
          const errorCodeList = {
            1002: '驗證碼失效',
            1005: '驗證碼失效',
            1008: '驗證錯誤次數過多',
            1011: '驗證碼錯誤',
            1006: '操作頻繁，請稍後再試',
            401: '驗證碼錯誤'
          }
          const errorMessage = errorCodeList[err.Code] ?? '發生錯誤，請稍後再試，或洽客服人員'
          useNotice({ type: 'error', message: errorMessage })
          focusOTPInput()
        }
      }
      const checkSignUpOTP = async () => {
        const type =
          popularizeCode.value &&
          (popularizeCode.value.promote || popularizeCode.value.introduce || popularizeCode.value.introduction)
            ? 'introduce'
            : 'signup'
        try {
          if (!info.value) await store.dispatch('login/createGuest')
          const inputData = {
            verifyCode: inputOTPCode.value,
            [loginType.value]: legalInputValue.value
          }
          const res = await postCertification(inputData).then(res => {
            if (res.Status.Code === '0') {
              setToken(res)
              store.dispatch('member/logIn', JSON.parse(localStorage.getItem('userToken')))
            }
            return res
          })
          // 綁定推廣碼(agm)與邀請碼(mgm)
          if (type === 'introduce') {
            store.commit('login/SET_SIGNUP_REWARD', res.Data)
            await store.dispatch('login/acceptMemberLine')
          }
          await getMemberInfo()
          await store.dispatch('member/logIn', '')
          await store.dispatch('member/pathNickname')

          if (isThird.value) {
            useNotice({ message: '帳號設定成功' })
            event('sign_up', { success: 'JKF' })
            if (!thirdLoginObject.valueOf?.NickName || !thirdLoginObject.valueOf?.PhotoPath)
              thirdChangeStep('viewSetProfile')
            else thirdChangeStep('viewReward')
            return false
          }
          if (isBindAccount.value) {
            const loginProcedure = sessionStorage.getItem('handleLoginProcedure')
            const info = store.state.member.info
            if (info && !info.IsGuest && loginProcedure) store.dispatch('sign/loginProxy', JSON.parse(loginProcedure))

            const popularizeCode = JSON.parse(localStorage.getItem('popularizeCode'))
            const target = popularizeCode?.third
              ? 'JKF'
              : popularizeCode?.promote || popularizeCode?.introduce
              ? 'AGM'
              : popularizeCode?.introduction
              ? 'MGM'
              : process.env.VUE_APP_SITE_TITLE
            event('sign_up', { success: target })
          } else {
            event('sign_up', { success: process.env.VUE_APP_SITE_TITLE })
          }
          if (store.state.platform.returnUrl) store.dispatch('platform/redirectToReturnUrl')
          store.dispatch('event/setOpenState', true)
          changeView('editNameAndPhoto')
        } catch (err) {
          // 推廣碼：已綁定則忽略直接跳下一步
          if (err.Code === '423') {
            changeView('editNameAndPhoto')
            return false
          }
          useNotice({ type: 'error', message: '驗證失敗' })
          const errorCodeList = {
            1002: '驗證碼失效',
            1005: '驗證碼失效',
            1008: '驗證錯誤次數過多',
            1011: '驗證碼錯誤',
            1006: '操作頻繁，請稍後再試',
            401: '驗證碼錯誤'
          }
          const errorMessage = errorCodeList[err.Code] ?? '發生錯誤，請稍後再試，或洽客服人員'
          useNotice({ type: 'error', message: errorMessage })
          focusOTPInput()
        }
      }
      const checkBindMoreAccountOTP = async () => {
        try {
          const inputData = {
            verifyCode: inputOTPCode.value,
            [loginType.value]: legalInputValue.value
          }
          await postCertification(inputData)
          await getMemberInfo()
          await store.dispatch('member/logIn')
          useNotice({ type: 'gpg', message: '綁定成功！', isI18n: false })
          close()
        } catch (err) {
          useNotice({ type: 'error', message: '驗證失敗' })
          const errorCodeList = {
            1002: '驗證碼失效',
            1005: '驗證碼失效',
            1008: '驗證錯誤次數過多',
            1011: '驗證碼錯誤',
            1006: '操作頻繁，請稍後再試',
            401: '驗證碼錯誤'
          }
          const errorMessage = errorCodeList[err.Code] ?? '發生錯誤，請稍後再試，或洽客服人員'
          useNotice({ type: 'error', message: errorMessage })
          focusOTPInput()
        }
      }

      onMounted(async () => {
        const loginTypeCapitalize = loginType.value ? loginType.value.replace(/^\w/, c => c.toUpperCase()) : ''
        if (!loginType.value || info.value?.[loginTypeCapitalize]) {
          backToSelect()
          return false
        }
        // 第三方：是否有thirdLoginObject
        if (!isThird.value) return false

        const thirdLoginNumber = thirdLoginObject.valueOf?.[loginTypeCapitalize]

        if (thirdLoginNumber) {
          legalInputValue.value = thirdLoginNumber

          isInputValid.value = true
          inputValue.value = thirdLoginNumber
          // 判斷輸入完成的信箱，是否發過認證簡訊並且時間差小於180秒
          const getResendSec = localStorage.getItem(`resendStamp_${thirdLoginNumber.replace(/\s+/g, '')}`) ?? 0
          const sec = getResendSec ? dayjs().diff(dayjs.unix(getResendSec), 'second') : 0
          if (CERTIFIED_CD_SEC - sec > 0 && sec > 0) isSendOTP.value = true
          isThirdLogin.value = true
        }
      })

      // resend 倒數
      const countdown = ref(0)
      const secondInterval = ref(null)
      watch(isSendOTP, val => {
        if (val) startTimer()
        else {
          countdown.value = 0
          clearInterval(secondInterval.value)
        }
      })
      onUnmounted(() => {
        clearInterval(secondInterval.value)
      })
      const startTimer = () => {
        const getResendSec = localStorage.getItem(`resendStamp_${inputValue.value.replace(/\s+/g, '')}`)
        let sec = 0
        if (getResendSec) sec = dayjs().diff(dayjs.unix(getResendSec), 'second')
        if (getResendSec && sec >= 0 && sec < RESEND_CERTIFIED_CD_SEC) {
          countdown.value = RESEND_CERTIFIED_CD_SEC - sec
          secondInterval.value = setInterval(() => {
            countdown.value--
            if (countdown.value < 0) {
              clearInterval(secondInterval.value)
            }
          }, 1000)
        } else {
          updateStamp()
        }
      }
      const updateStamp = () => {
        localStorage.setItem(`resendStamp_${inputValue.value.replace(/\s+/g, '')}`, dayjs().unix())
        countdown.value = RESEND_CERTIFIED_CD_SEC
        startTimer()
      }
      return {
        INPUT_OPTION,
        loginType,
        inputValue,
        inputOTPElement,
        isFocus,
        inputOTPCode,
        OTPCodes,
        isPrivacychecked,
        isAgechecked,
        loading,
        isSendOTP,
        isBindAccount,
        userStatus,
        isInputValid,
        isThird,
        isThirdLogin,
        countdown,
        isShowValidateUI,
        isShowPrivacyPolicy,
        TERMS_I18N,
        lang,
        // fn
        resetInput,
        handleValidate,
        onInput,
        focusOTPInput,
        backToSelect,
        checkOnInput,
        submitAndSendOTP,
        showBack
      }
    }
  }
</script>

<style lang="scss" scoped>
  .checked__privacy__statement {
    display: grid;
    appearance: none;
    margin: 0;
    width: 1.25em;
    height: 1.25em;
    font: inherit;
    color: currentColor;
    background-color: #27252c;
    border: 1px solid white;
    border-radius: 0.15em;
    transform: translateY(-0.075em);
    place-content: center;
    cursor: pointer;

    &::before {
      content: '';
      width: 0.7em;
      height: 0.7em;
      background-color: #9a1aef;
      border-radius: 2px;
      transform: scale(0);
      transition: 120ms transform ease-in-out;
    }

    &:checked {
      &::before {
        transform: scale(1);
      }
    }
  }

  .dot {
    border-color: #7a4baa !important;
  }
</style>

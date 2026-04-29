<template>
  <div class="agent__wrap" :class="tw(['flex', 'flex-col', 'h-full'])">
    <div class="member__back" :class="tw(['w-full', 'p-[20px]', 'cursor-pointer'])" @click="backToSelect">
      <maskPicture size="20" :img="require('@/assets/img/icons/i_back2.svg')" />
    </div>
    <p :class="tw(['text-BaseColor', 'text-lg', 'tablet:text-base', 'text-center', 'pt-7', 'pb-5'])">
      {{ $t('帳號登入') }}
    </p>
    <div :class="tw(['mx-auto', 'w-5/6', 'pb-5', 'tablet:w-3/5', 'tablet:pb-10'])">
      <label :class="tw(['block', 'mb-1', 'text-sm', 'pl-3.5'])">
        {{ $t('帳號') }}
      </label>
      <input
        type="account"
        :placeholder="$t('請輸入您的帳號')"
        v-model="user.account"
        @keydown.enter="submit"
        :class="
          tw([
            'block',
            'w-full',
            'h-11',
            'px-6',
            'rounded-full',
            'placeholder-inputHolder',
            'text-white',
            'text-base',
            'border-1',
            'border-purpleLine',
            'bg-codeBox'
          ])
        "
      />
      <label :class="tw(['block', 'mt-4', 'mb-1', 'text-sm', 'pl-3.5'])">
        {{ $t('密碼') }}
      </label>
      <input
        type="password"
        v-model="user.password"
        @keydown.enter="submit"
        :placeholder="$t('請輸入6~12位數密碼')"
        :class="
          tw([
            'block',
            'w-full',
            'h-11',
            'px-6',
            'rounded-full',
            'placeholder-inputHolder',
            'text-white',
            'text-base',
            'border-1',
            'border-purpleLine',
            'bg-codeBox'
          ])
        "
      />
      <p :class="tw(['mt-3', 'mb-8', 'text-right'])">
        <a
          :class="
            tw([
              'text-base',
              'tablet:text-sm',
              'cursor-pointer',
              'hover:text-SubColor',
              'transition-all',
              'duration-200'
            ])
          "
          @click="action('help')"
        >
          {{ $t('忘記密碼?') }}
        </a>
      </p>
      <button
        :class="
          tw([
            isDisabledButton ? 'bg-purpleLine' : 'bg-purpleBtn',
            isDisabledButton ? 'cursor-not-allowed' : 'cursor-pointer',
            'block',
            'w-full',
            'h-12',
            'tablet:h-11',
            'text-white',
            'rounded-full',
            'mt-3',
            'focus:outline-none'
          ])
        "
        :disabled="isDisabledButton"
        @click="submit"
      >
        {{ $t('登入') }}
      </button>
      <div
        :class="
          tw(['mx-auto', 'mt-3', 'pt-3', 'tablet:mt-5', 'tablet:pt-5', 'w-full', 'border-t-1', 'border-purpleLine'])
        "
      >
        <button
          :class="
            tw([
              'bg-grayBtn',
              'block',
              'm-auto',
              'w-full',
              'h-12',
              'tablet:h-11',
              'text-white',
              'rounded-full',
              'focus:outline-none'
            ])
          "
          @click="action('close')"
        >
          {{ $t('取消') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import { inject, computed, reactive } from 'vue'
  import { RECAPTCHA } from '@/configs'
  import { useReCaptcha } from 'vue-recaptcha-v3'
  import { setToken } from '@/utils'
  import store from '@/store'
  import { event } from 'vue-gtag-next'
  import { useNotice } from '@/utils/use-notice'
  import { getMemberInfo, postTokenAdLogin } from '@/api/member'
  import maskPicture from '@/components/maskPicture/maskPicture.vue'

  export default {
    name: 'agentInput',

    components: {
      maskPicture
    },

    setup() {
      const close = inject('close')
      const changeView = inject('changeView')
      const user = reactive({
        account: '',
        password: ''
      })
      const backToSelect = () => {
        changeView('viewSelectLoginType')
      }
      const reCaptcha = useReCaptcha()

      const isDisabledButton = computed(() => {
        return !user.account || !user.password || user.account.length < 6 || user.password.length < 6
      })

      const submit = async () => {
        if (isDisabledButton.value) return false

        await reCaptcha.recaptchaLoaded()
        const token = await reCaptcha.executeRecaptcha(RECAPTCHA.actionList.agentLogin)

        try {
          const response = await postTokenAdLogin({
            reCAPTCHA: token,
            account: user.account.trim(),
            password: user.password.trim()
          })
          await setToken(response)
          event('login', { path: location.pathname, method: 'account' })
          await getMemberInfo()
          await store.dispatch('member/logIn')
          useNotice({ type: 'playbuz', message: '登入成功' })
          // 有returnUrl的話跳轉連結
          if (store.state.platform.returnUrl) store.dispatch('platform/redirectToReturnUrl')
          store.commit('sign/UPDATE_DRAWER_STATE', false)
        } catch (e) {
          useNotice({ type: 'error', message: '發生錯誤，請稍後再試，或洽客服人員' })
          changeView('getHelp')
        }
      }
      // 幫助按鈕
      const action = id => {
        switch (id) {
          case 'help':
            changeView('getHelp')
            break
          case 'close':
            close()
            break
        }
      }

      return {
        isDisabledButton,
        user,
        // fn
        action,
        submit,
        backToSelect
      }
    }
  }
</script>

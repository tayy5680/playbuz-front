<template>
  <div :class="tw(['w-full'])">
    <div
      class="jkf__picture"
      v-if="thirdLoginObject.PhotoPath"
      :class="
        tw([
          'relative',
          'w-[80px]',
          'h-[80px]',
          'flex-shrink-0',
          'bg-bg',
          'rounded-full',
          'overflow-hidden',
          'mx-auto',
          'mb-24px'
        ])
      "
    >
      <img class="jkf__avatar" :src="thirdLoginObject.PhotoPath" />
    </div>
    <div class="jkf__text" :class="tw(['text(white center)', 'mb-20px', 'flex', 'flex-col', 'h-full'])">
      <div
        class="jkf__nick-name"
        v-if="thirdLoginObject.NickName"
        :class="tw(['font-bold', 'text-22px', 'mb-16px', 'overflow-ellipsis', 'overflow-hidden', 'whitespace-nowrap'])"
      >
        {{ $t('嗨！') }}{{ thirdLoginObject.NickName }}
      </div>
      <div
        class="jkf__nick-text"
        :class="tw(['my-auto'])"
        v-html="$t('立即領取{name}送你的大禮包！', { name: 'JKFxGPG<br>' })"
      ></div>
    </div>
    <div class="third__type__main" :class="tw(['relative', 'py-3'])">
      <div :class="tw(['text(violet center)', 'mb-6'])">
        {{ $t('請選擇登入方式') }}
      </div>
      <div :class="tw(['flex', 'justify-center', 'items-center'])">
        <div
          class="third__type__option"
          v-for="item of LOGIN_OPTION"
          :key="item.id"
          v-loading="loading"
          :class="
            tw([
              'cursor-pointer',
              'bg-[#352F3A]',
              'hover:bg-purpleLine ',
              'p-6',
              'max-w-[30%]',
              'w-full',
              'mx-1',
              'rounded-xl',
              'flex',
              'flex-col',
              'items-center',
              'transition'
            ])
          "
          v-audio="['asideMenu']"
          @click="selectOption(item.id)"
        >
          <img :src="require(`${item.icon}`)" :class="tw(['w-[40px]', 'h-auto', 'my-3'])" />
          <span>{{ $t(item.label) }}</span>
        </div>
      </div>
    </div>
    <div class="icon__hint" :class="tw(['flex', 'justify-center', 'items-start', 'mt-9'])">
      <img :class="tw(['pt-0.5', 'w-[18px]'])" :src="require('./images/i_note.svg')" />
      <div v-html="TERMS_I18N?.[lang] ?? TERMS_I18N['en-US']"></div>
      <div>{{ $t('我們保證會員資訊絕不外流，敬請安心使用。') }}</div>
    </div>
  </div>
</template>

<script>
  import { inject } from 'vue'
  import { setToken } from '@/utils'
  import store from '@/store'
  import { useNotice } from '@/utils/use-notice'
  import { useRouter, useRoute } from 'vue-router'
  import { postTokenRegister } from '@/api/member'

  export default {
    setup() {
      const lang = computed(() => store.state.member.languageCode)
      const TERMS_I18N = {
        'zh-TW': `登入／註冊即表示您 <b>已年滿 18 歲，且同意遵守<a href='/userRules/user-guidelines' target='_blank'><u>《使用者條款》</u></a></b>。`,
        'en-US': `By logging in or signing up, you <b>confirm that you are at least 18 years old and agree to the <a href='/userRules/user-guidelines' target='_blank'><u>《Terms of Use》</u></a></b>.`,
        'zh-CN': `登录/注册即表示您 <b>已年满 18 岁，且同意遵守<a href='/userRules/user-guidelines' target='_blank'><u>《用户条款》</u></a></b>。`,
        'ja-JP': `ログインまたは登録することで、<b>18歳以上であり、<a href='/userRules/user-guidelines' target='_blank'><u>《利用規約》</u></a>に同意したものとみなされます</b>。`
      }
      const router = useRouter()
      const route = useRoute()
      const thirdChangeStep = inject('thirdChangeStep')
      const thirdLoginObject = inject('thirdLoginObject')
      const loading = inject('loading')
      const setLoginType = inject('setLoginType')
      const thirdObject = inject('thirdObject')
      const LOGIN_OPTION = [
        { id: 'phoneNumber', label: '手機', icon: './images/i_mm_phone.svg' },
        { id: 'email', label: '信箱', icon: './images/i_email.svg' }
      ]
      const selectOption = id => {
        setLoginType(id)
        thirdChangeStep('viewInputValidate')
      }

      const actionPostTokenCustomLogin = async () => {
        if (store.state.member.info) return false

        const target = JSON.parse(localStorage.getItem('popularizeCode'))
        try {
          const inputData = {
            promoteCode: target.third,
            customField: target.token,
            registerSource: target.third,
            locale: store.state.member.languageCode
          }
          const res = await postTokenRegister(inputData)
          if (res.Status.Code !== '0') return false
          thirdObject.value = res.Data
          const input = {
            access_token: res.access_token,
            refresh_token: res.refresh_token,
            NickName: res.Data.NickName,
            PhoneNumber: res.Data.PhoneNumber,
            PhotoPath: res.Data.PhotoPath,
            Email: res.Data.Email
          }
          await formatStep(input)
          localStorage.removeItem('popularizeCode')
          if (thirdLoginObject.value.PhoneNumber) selectOption('phoneNumber')
          else if (thirdLoginObject.value.Email) selectOption('email')
        } catch (err) {
          // 轉為訪客狀態
          if (err.Code === '001') {
            formatStep(err.Data)
            return false
          }

          const errorCodeList = {
            400: '查無此輸入碼',
            1004: '帳號已存在'
          }
          const errorMessage = errorCodeList[err.Code] ?? '發生錯誤，請稍後再試，或洽客服人員'
          useNotice({ type: 'error', message: errorMessage })

          // 如果為已註冊手機則清空網址三方相關參數。
          if (err.Code === '1004') {
            localStorage.removeItem('popularizeCode')
            const query = JSON.parse(JSON.stringify(route.query))
            delete query.third
            delete query.token
            router.replace({ query })
          }

          close()
        }
      }
      const formatStep = async obj => {
        // TODO: 重工 待重構
        await setToken(obj)
        store.dispatch('member/logIn', JSON.parse(localStorage.getItem('userToken')))
        const spaceList = Object.values(obj)
          .map(item => item)
          .filter(item => item === '')
        if (!spaceList.length) {
          thirdLoginObject.value = obj
          return false
        }
      }

      const init = async () => {
        loading.value = true
        if (!store.state.member.info) await actionPostTokenCustomLogin()
        loading.value = false
      }

      init()
      return {
        TERMS_I18N,
        lang,
        loading,
        LOGIN_OPTION,
        thirdLoginObject,
        selectOption
      }
    }
  }
</script>

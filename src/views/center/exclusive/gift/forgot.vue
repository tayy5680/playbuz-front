<template>
  <div
    class="forget-gift__wrap"
    :class="tw([
      'h-full',
      'flex-1',
    ])"
  >
    <div
      class="forget-gift__container"
      :class="tw([
        'mx-auto',
        'h-full',
        'w-full',
        'flex',
        'flex-col',
        'items-center',
        'justify-between',
      ])"
    >
      <div
        class="forget-gift__title"
        :class="tw([
          'text(violet 20px center)',
          'mb-6px',
        ])"
      >
        {{ $t(OTPType) }}<br>{{ $t('請輸入您收到的驗證碼') }}
      </div>
      <verifyInput
        :code="inputCode"
        @keydown.enter="onSubmit"
        @input="(el) => inputCode = el.target.value"
        :class="tw([
          'my-auto',
        ])"
      />
      <button
        class="forget-gift__button"
        :class="tw([
          'cursor-pointer',
          'block',
          'w-full',
          'text-[18px]',
          'text-white',
          'text-center',
          'rounded-full',
          'focus:outline-none',
          'py-8px',
          inputCode.length === 6 && !loading
            ? 'bg-purpleBtn cursor-pointer'
            : 'bg-purpleLine cursor-not-allowed',
        ])"
        @click="onSubmit"
      >
        {{$t('驗證')}}
      </button>
      <hr
        :class="tw([
          'border-purpleLine',
          'w-full',
          'my-[16px]',
        ])"
      />
      <div
        class="forget-gift__bottom"
        :class="tw([
          'flex',
          'w-full',
        ])"
      >
        <div
          class="tips"
          :class="tw([
            'text-[14px]',
            'flex-1',
            'text-[#6A6273]',
          ])"
        >
          {{$t('尚未收到簡訊嗎?')}}
          <br />
          {{$t('按鈕重新發送')}}?
        </div>
        <button
          class="resendBtn"
          v-loading="loading"
          :class="tw([
            'relative',
            'flex-1',
            'border-1',
            'block',
            'text-[14px]',
            'rounded-full',
            'focus:outline-none',
            'overflow-hidden',
            timerCount
              ? 'border-purpleLine text-purpleLine cursor-not-allowed'
              : 'border-violet text-violet cursor-pointer',
          ])"
          @click="onReset"
        >
          {{ timerCount ? $t('重新發送 {time} 秒', { time: timerCount }) : $t('重新發送') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, inject } from 'vue'
import store from '@/store'

import verifyInput from '@/components/ui/verify-input'

import dayjs from 'dayjs'
import {
  postTransactionSendTransactionPasswordVerify,
  postTransactionCheckTransactionPasswordVerify,
} from '@/api/gift'
import { useNotice } from '@/utils/use-notice'

export default {
  name: 'gift-forgot',

  components: {
    verifyInput,
  },

  setup () {
    const loading = ref(false)
    const inputCode = ref('')
    const setupIndex = inject('setupIndex')
    const memberData = computed(() => store.state.member.info)
    const lang = computed(() => store.state.member.languageCode)
    const OTPType = ref('')

    watch(inputCode, (val) => {
      inputCode.value = val.toString().replace(/(\s)|[^0-9]/g, '')
    })

    const onSubmit = async () => {
      if (loading.value || inputCode.value.length !== 6) return false

      loading.value = true
      try {
        await postTransactionCheckTransactionPasswordVerify({
          verifyCode: inputCode.value,
        })
        await store.dispatch('member/logIn')
        inputCode.value = ''
        setupIndex.value++
      } catch {
        useNotice({ type: 'error', message: '發生錯誤，請稍後再試，或洽客服人員' })
      } finally {
        loading.value = false
      }
    }

    const RESET_SECOUND = 30
    let timer = null
    const timerCount = ref(0)
    const isGuest = computed(() => store.state.member.info?.IsGuest ?? true)
    const pointer = computed(() => isGuest.value ? '' : `_stamp-gift-forget${store.state.member.info.MemberID}`)

    const onReset = async () => {
      if (timerCount.value || loading.value) return false

      try {
        loading.value = true
        await postTransactionSendTransactionPasswordVerify({ locale: lang.value })
        localStorage.setItem(pointer.value, dayjs().unix() + RESET_SECOUND)
        updateTimer()
      } catch (err) {
        useNotice({ type: 'error', message: '發生錯誤，請稍後再試，或洽客服人員' })
      } finally {
        loading.value = false
      }
    }

    const updateTimer = () => {
      timer = setInterval(() => {
        const stamp = localStorage.getItem(pointer.value)
        const now = dayjs().unix()

        if (stamp && (stamp - now >= 0)) timerCount.value = stamp - now
        else {
          timerCount.value = 0
          localStorage.removeItem(pointer.value)
          clearInterval(timer)
        }
      }, 1000)
    }

    const init = () => {
      const stamp = localStorage.getItem(pointer.value)
      const now = dayjs().unix()

      if (stamp && (stamp - now >= 0)) {
        timerCount.value = stamp - now
        updateTimer()
      } else onReset()
      OTPType.value = memberData.value.Email ? '信箱驗證' : '手機驗證'
    }

    init()

    return {
      OTPType,
      loading,
      inputCode,
      timerCount,
      // fn
      onSubmit,
      onReset,
    }
  },
}
</script>

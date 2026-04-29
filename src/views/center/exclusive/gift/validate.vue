<template>
  <div class="validate__wrap" :class="tw(['h-full', 'flex-1'])">
    <div
      class="validate__container"
      :class="tw(['mx-auto', 'h-full', 'w-full', 'flex', 'flex-col', 'items-center', 'justify-between'])"
    >
      <div class="validate__title" :class="tw(['text(white 20px center)', 'mb-6px'])">
        {{ $t('請輸入贈禮密碼') }}
      </div>
      <div class="validate__tips" :class="tw(['text(violet 18px)', 'mb-6px'])">
        {{ $t('請輸入6位數字密碼') }}
      </div>
      <verifyInput
        :code="inputCode"
        @keydown.enter="onSubmit"
        @input="el => (inputCode = el.target.value)"
        :class="tw(['mt-auto'])"
      />
      <div
        class="validate__forget"
        v-if="hasTransactionPassword"
        :class="tw(['cursor-pointer', 'text(right violet)', 'w-full', 'mt-[12px]', 'mb-auto'])"
        @click="setupIndex--"
      >
        {{ $t('忘記贈禮密碼？') }}
      </div>
      <hr :class="tw(['border-purpleLine', 'w-full', 'my-[16px]'])" />
      <div class="validate__forget-tips" :class="tw(['w-full', 'text-[14px]', 'text-[#6A6273]', 'mb-[12px]'])">
        {{
          hasTransactionPassword
            ? `※ ${$t('若忘記密碼須重新進行手機驗證。')}`
            : `※ ${$t('此六位數往後將成為你的贈禮密碼，請妥善保存。')}`
        }}
      </div>
      <button
        class="validate__button"
        v-loading="loading"
        :class="
          tw([
            inputCode.length === 6 && !loading
              ? 'cursor-pointer bg-giftBtnBg'
              : 'cursor-not-allowed bg-giftBtnInactive',
            'block',
            'w-full',
            'text-[18px]',
            'text-white',
            'text-center',
            'rounded-full',
            'focus:outline-none',
            'py-8px'
          ])
        "
        @click="onSubmit"
      >
        {{ $t('下一步') }}
      </button>
    </div>
  </div>
</template>

<script>
  import { ref, computed, watch, inject } from 'vue'
  import store from '@/store'

  import verifyInput from '@/components/ui/verify-input'

  import { postTransactionVerifyPassword, getTransactionSetTransactionPassword } from '@/api/gift'
  import { getTransactionRewardPoint } from '@/api/deposit'
  import { useNotice } from '@/utils/use-notice'

  export default {
    name: 'gift-validate',

    components: {
      verifyInput
    },

    setup() {
      const loading = ref(false)
      const inputCode = ref('')
      const setupIndex = inject('setupIndex')
      const giftObject = inject('giftObject')
      const apiPackingList = inject('apiPackingList')

      const info = computed(() => store.state.member.info)
      const hasTransactionPassword = computed(() => !!info.value?.TransactionPassword)

      watch(inputCode, val => {
        inputCode.value = val.toString().replace(/(\s)|[^0-9]/g, '')
      })

      const onSubmit = async () => {
        if (loading.value || inputCode.value.length !== 6) return false

        try {
          loading.value = true

          // 未填寫過密碼就先寫入。
          if (!hasTransactionPassword.value) {
            await getTransactionSetTransactionPassword({
              transactionPassword: inputCode.value
            })
            await store.dispatch('member/logIn')
          }

          await postTransactionVerifyPassword({
            transactionPassword: inputCode.value
          })
          // 取得贈點最大最小值
          await getApiPackingList()
          giftObject.password = JSON.parse(JSON.stringify(inputCode.value))
          inputCode.value = ''
          setupIndex.value++
        } catch (err) {
          const errorCodeList = {
            1001: '密碼錯誤',
            3001: '操作頻繁，請稍後再試'
          }
          const errorMessage = errorCodeList[err.Code] ?? '發生錯誤，請稍後再試，或洽客服人員'
          useNotice({ type: 'error', message: errorMessage })
        } finally {
          loading.value = false
        }
      }
      const getMiddeleQuick = (min, max) => {
        return min * 2 < max ? min * 2 : (min + max) / 2
      }
      const getApiPackingList = async () => {
        try {
          const res = await getTransactionRewardPoint().then(res => res?.Data)
          if (res) {
            apiPackingList.value = {
              gold: {
                minLimit: res.MinGoldPerTransaction,
                setp: 100,
                quick: [
                  res.MinGoldPerTransaction,
                  getMiddeleQuick(res.MinGoldPerTransaction, res.MaxGoldPerTransaction),
                  res.MaxGoldPerTransaction
                ]
              },
              silver: {
                minLimit: res.MinGoldPerTransaction,
                setp: 100,
                quick: [
                  res.MinSilverPerTransaction,
                  getMiddeleQuick(res.MinSilverPerTransaction, res.MaxSilverPerTransaction),
                  res.MaxSilverPerTransaction
                ]
              }
            }
          } else throw new Error()
        } catch (e) {
          apiPackingList.value = null
        }
      }

      return {
        setupIndex,
        loading,
        inputCode,
        hasTransactionPassword,
        // fn
        onSubmit
      }
    }
  }
</script>

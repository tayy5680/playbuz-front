<template>
  <form action="#" method="post" class="view-credit-card">
    <!-- 卡號 -->
    <div class="mt-24px">
      <div for="cardNumber" :class="tw(['mb-8px'])">{{ $t('卡號') }}</div>
      <div
        id="mulpay-cardNumber"
        :class="
          tw([
            'py-8px',
            'px-20px',
            'rounded-full',
            'bg-InputBackground',
            'border',
            'w-full',
            'placeholder-depositInputLine',
            transitionBase,
            validator.isCardNumberError ? 'border-red-600' : 'border-[#544f5b]'
          ])
        "
      ></div>
    </div>

    <!-- 持有人 -->
    <div class="mt-24px">
      <div :class="tw(['mb-8px'])">{{ $t('持有人') }}</div>
      <input
        class="input"
        :placeholder="$t('必填')"
        :class="
          tw([
            'py-8px',
            'px-20px',
            'rounded-full',
            'bg-InputBackground',
            'border',
            'w-full',
            'placeholder-depositInputLine',
            transitionBase,
            validator.isNameError ? 'border-red-600' : 'border-[#544f5b]'
          ])
        "
        v-model="creditCardName"
      />
    </div>

    <div :class="tw(['mt-24px', 'grid', 'grid-cols-2', 'gap-4'])">
      <!-- 有效期限 -->
      <div>
        <div for="expiry">{{ $t('有效期限') }}</div>
        <div
          id="mulpay-expiry"
          :class="
            tw([
              'py-8px',
              'px-20px',
              'rounded-full',
              'bg-InputBackground',
              'border',
              'border-[#544f5b]',
              'w-full',
              'placeholder-depositInputLine',
              transitionBase,
              validator.isCardExpiryError ? 'border-red-600' : 'border-[#544f5b]'
            ])
          "
        ></div>
      </div>

      <!-- 安全碼 -->
      <div>
        <div for="cvc">{{ $t('安全碼') }}</div>
        <div
          id="mulpay-cvc"
          :class="
            tw([
              'py-8px',
              'px-20px',
              'rounded-full',
              'bg-InputBackground',
              'border',
              'border-[#544f5b]',
              'w-full',
              'placeholder-depositInputLine',
              transitionBase,
              validator.isCardCvcError ? 'border-red-600' : 'border-[#544f5b]'
            ])
          "
        ></div>
      </div>
    </div>
  </form>
</template>
<script>
  import { onMounted, nextTick, inject, watch, ref } from 'vue'
  import { useNotice } from '@/utils/use-notice'
  import { useRoute } from 'vue-router'

  // data
  import { cardInputStyle, expiryInputStyle, cvcInputStyle } from './config.js'

  // utils
  import { validator, getCreditCardToken, createTransaction, startTransaction, handleValidator } from './utils.js'

  export default {
    components: {},
    props: {
      memberInfo: { type: Object }
    },

    setup(props) {
      // use
      const route = useRoute()

      /** values: mulpay 方法(於 deposit/index.vue 掛載sdk) */
      const mulpay = inject('mulpay')

      /** values: mulpay 表單元素(卡號, 有效期限, 安全碼) */
      const mulPayFormElements = ref(null)

      /** values: 訂單狀態(0=無, 1=交易處理中, 2=交易成功, 3=交易失敗) */
      const gmoOrderStatus = inject('gmoOrderStatus')

      const loading = inject('loading')

      const creditCardName = ref('')

      /** methods: 建立 mulpay 元素(於 deposit/index.vue 掛載sdk) */
      const init = async () => {
        try {
          // 建立: mulpay parent elements (獲取卡片信息輸入表單的包裝元素)
          const elements = mulpay.value.createElements()

          // 建立: 子元素(卡號, 有效期限, 安全碼)
          const cardNumberInputElement = elements.create('cardNumber', { style: cardInputStyle })
          const expiryInputElement = elements.create('cardExpiry', { style: expiryInputStyle })
          const cvcInputElement = elements.create('cardCvc', { style: cvcInputStyle })

          // 子元素: 獲取子元素的包裝元素(卡號, 有效期限, 安全碼)
          const cardNumberWrapperElement = document.getElementById('mulpay-cardNumber')
          const cardExpiryWrapperElement = document.getElementById('mulpay-expiry')
          const cardCvcWrapperElement = document.getElementById('mulpay-cvc')

          // 子元素: 掛載(卡號, 有效期限, 安全碼)
          cardNumberInputElement.mount(cardNumberWrapperElement)
          expiryInputElement.mount(cardExpiryWrapperElement)
          cvcInputElement.mount(cardCvcWrapperElement)

          // 表單元素(含卡號, 有效期限, 安全碼)
          mulPayFormElements.value = [cardNumberInputElement, expiryInputElement, cvcInputElement]
        } catch (error) {
          console.error('初始化信用卡欄位錯誤', error)
          useNotice({ type: 'error', message: '找不到信用卡欄位，請重新整理' })
        }
      }

      /** methods: GMO mul-pay金流-信用卡支付 */
      const submit = async (gmoInfo = { AccessID: '', AccessPass: '', OrderID: '' }) => {
        try {
          if (!gmoInfo.AccessID) throw Error(`找不到資料，${JSON.stringify(gmoInfo)}`)
          if (!gmoInfo.AccessPass) throw Error(`找不到資料，${JSON.stringify(gmoInfo)}`)
          if (!gmoInfo.OrderID) throw Error(`找不到資料，${JSON.stringify(gmoInfo)}`)

          // TODO: 是否開啟測試(說明: 網址改為開發機)
          const isOpenTest = false
          loading.value = true

          // step1. 取得加密後的信用卡資訊tokens
          const resCreditCard = await getCreditCardToken(mulpay.value, mulPayFormElements.value, creditCardName.value)
          if (resCreditCard === '發生錯誤') {
            loading.value = false
            return false
          }

          // 狀態變更
          gmoOrderStatus.value = 1

          // step2. 建立交易/收費執行(與發卡公司溝通進行付款)
          const resExecTran = await createTransaction(isOpenTest, route, gmoInfo, resCreditCard)
          if (resExecTran === '發生錯誤') {
            gmoOrderStatus.value = 3
            return false
          }
          loading.value = false

          // step3. 開始交易(會回傳此筆交易是否需要3DS驗證)
          const resStartTran = await startTransaction(resExecTran, gmoInfo)
          if (resStartTran === '發生錯誤') {
            gmoOrderStatus.value = 3
            return false
          }
        } catch (error) {
          console.error(error)
          useNotice({ type: 'error', message: '發生錯誤,如需進一步查詢,請聯繫客服。' })
          gmoOrderStatus.value = 3
        }
      }

      /** methods: 欄位驗證 */
      const verifyElements = async () => {
        // 初始化
        validator.isNameError = false

        // 驗證
        const errorMsg = '欄位未填寫完成'
        if (!creditCardName.value) {
          validator.isNameError = true
          throw Error(errorMsg)
        }
        const options = { tokenNumber: 2 }
        const resCreditCard = await mulpay.value.getTokenThroughIframe(
          mulPayFormElements.value[0],
          creditCardName.value,
          options
        )

        if (resCreditCard.result === 'validation_error') {
          handleValidator(resCreditCard.errorList)
          throw Error(errorMsg)
        }
      }

      onMounted(async () => {
        /** watch: 偵測是否重新開啟Modal */
        nextTick(() => {
          watch(
            route.params?.depositPackageGroupID,
            async () => {
              await new Promise(resolve => setTimeout(resolve, 10))
              if (!route.query?.orderId) init()
            },
            { immediate: true }
          )
        })
      })
      return {
        mulpay,
        validator,
        creditCardName,

        // fun
        init,
        submit,
        verifyElements
      }
    }
  }
</script>

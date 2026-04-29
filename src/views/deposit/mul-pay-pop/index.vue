<template>
  <div
    class="mul-pay-pop__wrap"
    :class="
      tw(['absolute', 'z-30', 'top-1/2', 'left-1/2', '-translate-x-1/2', '-translate-y-1/2', 'w-[430px]', 'max-w-full'])
    "
  >
    <div
      class="mul-pay-pop__container"
      :class="tw(['bg-PopBackground', 'px-10px', 'pb-30px', 'mx-18px', 'md:mx-0', 'rounded-20px'])"
    >
      <!-- 關閉icon -->
      <div
        v-if="gmoOrderStatus !== 1"
        class="mul-pay-pop__close__icon"
        v-audio="'close'"
        :class="tw(['h-60px', 'w-60px', 'ml-auto', 'pt-20px'])"
        @click="close"
      >
        <maskPicture size="18" :img="require('@/assets/img/icons/i_close.svg')" :class="tw(['m-auto', 'h-[100%]'])" />
      </div>
      <!-- GMO支付 -->
      <div v-if="gmoOrderStatus === 0">
        <el-scrollbar class="mul-pay-pop__article" max-height="80svh">
          <!-- tabs(信用卡、PayPay、Apple Pay) -->
          <viewMenu
            :nowPayTypeID="nowPayTypeID"
            :menuList="
              tabs.map(item => {
                return { PayTypeID: item.id }
              })
            "
            :changePayTypeID="changePayTypeID"
          />
          <!-- 標題: 總計金額 -->
          <transition @before-enter="beforeEnter" @enter="enter" :css="false">
            <div class="mainmain" :key="nowPayTypeID">
              <titleView :nowPackageDetail="nowPackageDetail" @setCount="setCount" />

              <div class="mul-pay-pop__data" :class="tw(['px-20px'])">
                <!-- 標題: 小計金額 -->
                <totalView
                  :conditionQuantityRemains="nowPackageDetail?.ConditionQuantityRemains"
                  :nowPayDetail="nowPayDetail"
                />

                <!-- Email -->
                <div class="deposit-email-input">
                  <!-- tip -->
                  <div class="email-tips" :class="tw(['text-lakeGreen', 'text-[14px]', 'mt-24px', 'mb-8px'])">
                    *{{ $t('請提供您的信箱以寄送發票') }}
                  </div>

                  <!-- input -->
                  <div>
                    <div :class="tw(['w-[100px]', 'mb-8px'])">E-mail</div>
                    <input
                      class="input"
                      :placeholder="'*' + $t('電子信箱為必填資訊')"
                      :class="
                        tw([
                          'py-8px',
                          'px-20px',
                          'rounded-full',
                          'bg-InputBackground',
                          'border',
                          'w-full',
                          'placeholder-depositInputLine',
                          v$.mail?.$error ? 'border-red-600' : 'border-depositInputLine',
                          transitionBase
                        ])
                      "
                      @input="onInputMailInvoice"
                      v-model="submitData.mail"
                    />
                  </div>

                  <!-- checkbox -->
                  <div
                    v-if="userInfoEmail.infoEmail"
                    class="mul-pay-pop__user__mail__checkbox"
                    :class="
                      tw([
                        'cursor-pointer',
                        'flex',
                        'items-center',
                        'text-[14px]',
                        'mb-12px',
                        'mt-8px',
                        userInfoEmail.isChecked ? 'text-white' : 'text-violet'
                      ])
                    "
                    @click="useUserInfoEmail"
                  >
                    <div
                      class="icon"
                      :class="tw(['h-24px', 'w-24px', 'flex', 'items-center', 'justify-center', 'mr-12px'])"
                    >
                      <img v-if="userInfoEmail.isChecked" :src="require('../images/i_tick2_act.svg')" />
                      <div
                        class="non"
                        v-else
                        :class="tw(['h-20px', 'w-20px', 'rounded-full', 'border', 'border-coinColor'])"
                      ></div>
                    </div>
                    <div>{{ $t('使用會員信箱') }}</div>
                  </div>
                </div>

                <!-- 信用卡支付 -->
                <payCreditCardView ref="payCreditCardViewRef" :memberInfo="memberInfo" v-if="nowPayTypeID === 3" />

                <!-- 請注意提示 -->
                <div
                  v-if="![6, 7].includes(nowPayTypeID)"
                  class="tips"
                  :class="tw(['text-[14px]', 'text-[#00dfb9]', 'mb-10px'])"
                >
                  *{{ $t('如超過24小時未付款之訂單，系統將自動取消。') }} <br />
                  *<span v-html="REFUND_NOTICE_I18N?.[lang] ?? REFUND_NOTICE_I18N['en-US']"></span>
                </div>

                <!-- 我已閱讀 -->
                <div :class="tw(['flex', 'items-baseline'])">
                  <input class="chekboxIsRead" type="checkbox" v-model="isRead" v-audio="['asideMenu']" />
                  <label :class="tw(['text-[#FF4181]', 'text-[14px]'])">
                    {{ $t('我已閱讀') }}
                  </label>
                </div>

                <!-- 按鈕 -->
                <div
                  class="btn_deposit_mul-pay-pop_buy"
                  v-loading="loading"
                  :class="
                    tw([
                      'mt-20px',
                      'cursor-pointer',
                      'bg-depositBtnBg',
                      'rounded-full',
                      'text(18px center white)',
                      'p-8px',
                      { 'pointer-events-none opacity-40': !nowPackageDetail?.IsConditionAvailable },
                      { 'pointer-events-none opacity-40': loading }
                    ])
                  "
                  @click="submit()"
                  style="filter: grayscale(1); pointer-events: none; cursor: not-allowed;"
                >
                  {{ $t('購買') }}
                </div>
              </div>
            </div>
          </transition>
        </el-scrollbar>
      </div>

      <div v-else>
        <!-- 交易處理中 -->
        <div v-if="gmoOrderStatus === 1" :class="tw(['text(20px center black)', 'py-36px md:py-[20px]'])">
          <div
            ref="completeStatusIconRef"
            class="mul-pay-pop_complete__lottie__status"
            :class="tw(['w-[120px]', 'h-[120px]', 'mx-auto', 'pt-[30px]'])"
          ></div>
          <p>{{ $t('交易處理中') }}</p>
          <p>{{ $t('請稍後') }}...</p>
        </div>

        <!-- 交易成功 -->
        <div v-else-if="gmoOrderStatus === 2" :class="tw(['text(20px center black)', 'py-36px md:py-[20px]'])">
          <div
            ref="completeStatusIconRef"
            class="mul-pay-pop_complete__lottie__status"
            :class="tw(['w-[120px]', 'h-[120px]', 'mx-auto', 'pt-[30px]'])"
          ></div>
          <p>{{ $t('訂單完成') }}！</p>
          <p :class="tw(['cursor-pointer', 'underline', 'font-bold'])" @click="action('record')">
            {{ $t('可至訂單中心查詢購買紀錄。') }}
          </p>
        </div>

        <!-- 交易失敗 -->
        <div v-else :class="tw(['text(20px center black)', 'py-36px md:py-[20px]'])">
          <img
            :class="tw(['font-extralight', 'w-full', 'max-w-32', 'm-auto', 'pt-30px'])"
            :src="require('./images/i_system_info_note.svg')"
          />
          <div :class="tw(['pt-10px', 'px-8px'])">
            {{ $t('訂單狀態異常, 請至"會員中心>訂單"查看,如需進一步查詢,請聯繫客服。') }}
          </div>
          <buttonView
            :type="'opacity'"
            :class="
              tw([
                'p-8px',
                'mt-16px',
                'text(center 18px)',
                'text-[#AFA0BE]',
                'leading-6',
                'w-full',
                'max-w-32',
                'border-[#AFA0BE]',
                'border hover:bg-sort hover:text-white hover:border-sort'
              ])
            "
            @click="action('record')"
          >
            {{ $t('查看訂單紀錄') }}
          </buttonView>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { reactive, ref, computed, inject, onMounted, onUnmounted, provide, nextTick, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { event } from 'vue-gtag-next'
  import { cloneDeep, remove } from 'lodash'
  import lottie from 'lottie-web'
  import store from '@/store'
  import { REFUND_NOTICE_I18N } from '@/views/deposit/pop/config.js'

  // utils
  import { useValidator, required, email } from '@/utils/use-validator'
  import { useNotice } from '@/utils/use-notice'

  // components
  import totalView from './total.vue'
  import viewMenu from './menu.vue'
  import titleView from './title.vue'
  import payCreditCardView from './credit-card/index.vue'
  import maskPicture from '@/components/maskPicture/maskPicture.vue'
  import buttonView from '@/components/ui/button-view'

  // configs
  import { DEPOSIT_TYPE_LIST } from '@/configs/deposit'

  // utils
  import { onGMOPayPay, checkOrderStatus, onApplePayJSClicked, isCheckApplePay } from './utils.js'

  // api
  import { postElectronicMallBuyPackage } from '@/api/deposit'

  export default {
    name: 'deposit-pop',

    components: {
      totalView,
      viewMenu,
      titleView,
      payCreditCardView,
      maskPicture,
      buttonView
    },

    setup() {
      const route = useRoute()
      const router = useRouter()
      const isRead = ref(false)

      const lang = computed(() => store.state.member.languageCode)

      const loading = ref(false)
      provide('loading', loading)

      const setPackagePop = inject('setPackagePop')

      /**
       * @param {Array} nowTypeListData 當前Type(time/limit/cycle)內含的所有禮包內容
       * @param {Object} nowPackageDetail 當前禮包所有內容
       * @param {number} nowPayTypeID 當前禮包中，所選付款類型ID，預設為第一種付款方式
       * @param {Object} nowPayDetail 當前禮包中，所選付款類型詳細資料
       */
      const nowTypeListData = inject('nowTypeListData')
      const nowPackageDetail = computed(() => {
        if (!nowTypeListData.value.length) return {}
        const name = parseInt(route.params?.depositPackageGroupID)
        const values = nowTypeListData.value.find(item => item.PackageGroupID === name) ?? {}
        return values
      })

      /** 支付方式(3=信用卡, 4=PayPay, 5=ApplePay) */
      const nowPayTypeID = ref(3)
      const nowPayDetail = computed(() => nowPackageDetail.value?.PackageListResultDetail?.[0])
      const changePayTypeID = payType => {
        event('shopping_package_click', { click: 'deposit_type' })
        nowPayTypeID.value = payType
      }
      // 預設顯示的付款類型ID
      watch(nowPackageDetail, val => {
        if (!nowPayTypeID.value) nowPayTypeID.value = val?.PackageListResultDetail?.[0]?.PayTypeID ?? 0
      })

      /** 幣別 */
      const currency = computed(() => {
        const target = DEPOSIT_TYPE_LIST.find(item => item.id === nowPayTypeID.value)
        const value = target && [6, 7].includes(target.id) ? target.label : store.getters['member/currency']
        return value
      })
      provide('currency', currency)

      /** 送出的資料 */
      const submitData = reactive({ mail: '', count: 1 })
      provide('submitData', submitData)

      // 檢查輸入內容是否合規則
      const form = reactive({
        mail: computed(() => submitData.mail)
      })
      const rules = computed(() => {
        const ruleData = {}
        for (const item of Object.keys(form)) {
          ruleData[item] = { required: required() }
          if (item === 'mail') ruleData[item].email = email()
        }
        return ruleData
      })
      const v$ = useValidator(rules, form)

      const close = () => {
        // 清除訂單已結帳資料
        localStorage.gmoData = ''
        const { depositPackageGroupID, ...restParams } = route.params
        router.push({ name: route.name, params: restParams })
        setPackagePop(false)
      }

      const submit = async () => {
        if (!isRead.value) return useNotice({ type: 'error', message: '請閱讀注意事項，並勾選我已閱讀' })
        v$.value.$touch()
        if (v$.value.$error || loading.value) return false

        loading.value = true

        // buyType，3=信用卡, 4=PayPay, 5=ApplePay
        const chosePaymentType = DEPOSIT_TYPE_LIST.find(item => item.id === nowPayTypeID.value)
        const input = {
          paymentTypeName: chosePaymentType.type,
          itemName: nowPackageDetail.value.PackageName,
          price: nowPayDetail.value.ActuallyPayAmount,
          packageID: nowPayDetail.value.PackageID,
          quantity: parseInt(submitData.count),
          buyType: nowPayTypeID.value,
          uniformInvoiceInfo: {
            buyerEmailAddress: submitData.mail
          }
        }

        if ([6, 7].includes(nowPayTypeID.value)) {
          delete input.uniformInvoiceInfo
        }

        try {
          if (chosePaymentType.type === 'applePay') {
            // ApplePay支付
            loading.value = false
            await onApplePayJSClicked(router, route, gmoOrderStatus, input, handleSetInterval)
          } else {
            // 無法在call api後打開分頁，所以先行打開
            let newWindow = null
            if (input.paymentTypeName === 'paypay') newWindow = window.open()

            // 信用卡欄位驗證
            if (input.paymentTypeName === 'card' && payCreditCardViewRef.value)
              await payCreditCardViewRef.value.verifyElements()

            // 其他支付方式，3=信用卡, 4=PayPay, 5=ApplePay
            const response = await postElectronicMallBuyPackage(input)
            switch (input.paymentTypeName) {
              // 信用卡支付
              case 'card':
                onPayCreditCard(response)
                break

              // PayPay支付
              case 'paypay':
                gmoOrderStatus.value = 1
                onGMOPayPay(response, router, route, handleSetInterval, newWindow)
                break
            }
          }

          event('begin_checkout', {
            currency: currency,
            value: 0,
            payment_type: input.paymentTypeName,
            items: [
              {
                item_id: input.packageID,
                item_name: input.itemName,
                currency: currency,
                price: input.price,
                quantity: input.quantity
              }
            ]
          })
        } catch (err) {
          if (err.message === '欄位未填寫完成') return
          const errorCodeList = {
            7002: '購買次數不足',
            7007: '購買數量已達上限'
          }
          const errorMessage = errorCodeList[err.Code] ?? '發生錯誤，請稍後再試，或洽客服人員'
          useNotice({ type: 'error', message: errorMessage })
        } finally {
          loading.value = false
        }
      }
      const setStyleMaskImage = url => {
        return `url(${url}) no-repeat center /contain`
      }

      const init = () => {
        // 目前預設選擇第一筆為主要通道
        if (!nowPayTypeID.value)
          nowPayTypeID.value = nowPackageDetail.value?.PackageListResultDetail?.[0]?.PayTypeID ?? 0
      }

      // XPG:mailInvoice專用
      // user帳號內如果有email資訊，預設寫入email欄位內
      const memberInfo = computed(() => store.state.member.info)
      const userInfoEmail = reactive({
        isChecked: Boolean(memberInfo.value?.Email),
        infoEmail: memberInfo.value?.Email ?? ''
      })
      const useUserInfoEmail = () => {
        userInfoEmail.isChecked = !userInfoEmail.isChecked
        submitData.mail = userInfoEmail.isChecked ? userInfoEmail.infoEmail : ''
      }
      const onInputMailInvoice = () => {
        if (memberInfo.value?.Email) {
          userInfoEmail.isChecked = Boolean(submitData.mail === userInfoEmail.infoEmail)
        }
      }
      // 乘法運算
      const multiplication = (payAmount, count) => {
        if (!payAmount) return 0
        if (Math.floor(payAmount) === payAmount) return payAmount * count

        const decimalPlaces = 10 ** (payAmount.toString().split('.')[1].length || 0)
        return (Math.floor(payAmount * decimalPlaces) * count) / decimalPlaces
      }
      provide('multiplication', multiplication)

      // =========== GMO mul-pay金流 ===========
      const tabs = computed(() => {
        const ApplePaySession = window.ApplePaySession
        const array = cloneDeep(DEPOSIT_TYPE_LIST)

        // 檢查是否支援 Apple Pay
        if (!ApplePaySession) remove(array, item => item.type === 'applePay')
        if (!isCheckApplePay.value) remove(array, item => item.type === 'applePay')

        return array
      })
      /** values: 信用卡支付Ref */
      const payCreditCardViewRef = ref(null)

      /** values: 訂單狀態(0=無, 1=交易處理中, 2=交易成功, 3=交易失敗) */
      const gmoOrderStatus = ref(0)
      provide('gmoOrderStatus', gmoOrderStatus)

      /** values: 訂單狀態Icon ref */
      const completeStatusIconRef = ref(null)

      /** methods: 跳至子組件信用卡支付 */
      const onPayCreditCard = async response => {
        if (!payCreditCardViewRef.value) {
          console.error('找不到信用卡支付function，請重新整理')
          return false
        }

        payCreditCardViewRef.value.submit({
          AccessID: response?.Data?.GMOAccessID,
          AccessPass: response?.Data?.GMOAccessPass,
          OrderID: response?.Data?.PayselInfo?.ORDER_ID
        })
      }

      /** methods: 訂單狀態Icon動畫設定 */
      const anim = () => {
        const processing = '/lottie/deposit/i_system_ani_exclamationmark.json'
        const success = '/lottie/deposit/i_ani_ok.json'
        let path = processing
        if (gmoOrderStatus.value === 2) path = success

        lottie.destroy('completeStatusIconRef')
        lottie.loadAnimation({
          name: 'completeStatusIconRef',
          container: completeStatusIconRef.value,
          path: path,
          renderer: 'svg',
          loop: true,
          autoplay: true
        })
      }

      /** methods: 跳轉頁面 */
      const action = key => {
        switch (key) {
          // 跳轉到訂單
          case 'record':
            router.replace({ name: 'center/record' })
            break
        }
      }

      /** 處理: 當前訂單狀態 */
      const handleOrderStatus = async () => {
        try {
          const status = await checkOrderStatus(route)
          nowPayTypeID.value = status.nowPayTypeID
          gmoOrderStatus.value = status.gmoOrderStatus
          if (status.isError) clearInterval(intervalId.value)
        } catch (error) {
          console.error('確認訂單狀態發生錯誤，請稍後再試，或洽客服人員', error)
          useNotice({ type: 'error', message: '確認訂單狀態發生錯誤，請稍後再試，或洽客服人員' })
        }
      }

      /** 五秒取一次訂單資料 */
      const intervalId = ref(null)

      /** 五秒取一次訂單資料 */
      const handleSetInterval = () => {
        intervalId.value = setInterval(async () => {
          handleOrderStatus()
        }, 5000)
      }

      /** watch: 偵測訂單狀態Icon */
      watch(gmoOrderStatus, () => {
        setTimeout(() => {
          anim()
        }, 300)
      })

      // onMounted
      onMounted(async () => {
        nextTick(() => {
          event('shopping_package_show', { show: '' })
          store.dispatch('platform/setCover', true)
          init()
          submitData.mail = userInfoEmail.infoEmail
        })

        // PayPay付款，status=success成功畫面防呆
        const status = route.query?.status
        if (status === 'success') {
          gmoOrderStatus.value = 2
          return
        }

        // 取得當前訂單狀態
        const orderId = route.query?.orderId
        if (orderId) gmoOrderStatus.value = 1
        handleOrderStatus()

        // PayPay付款，五秒取一次訂單資料
        if (orderId) handleSetInterval()
      })

      // onUnmounted
      onUnmounted(() => {
        event('shopping_package_leave', { leave: '' })
        store.dispatch('platform/setCover', false)
        clearInterval(intervalId.value)
      })

      // <transition> 用參數與監聽
      const beforeEnter = el => {
        el.style.opacity = '1'
      }
      const enter = (el, done) => {
        el.style.transition = 'opacity 0.3s'
        el.style.opacity = '0'
        setTimeout(() => {
          el.style.opacity = '1'
          done()
        }, 200)
      }
      return {
        DEPOSIT_TYPE_LIST,
        memberInfo,
        submitData,
        v$,
        nowPayTypeID,
        nowPayDetail,
        nowPackageDetail,
        userInfoEmail,
        isRead,
        REFUND_NOTICE_I18N,
        lang,
        // fn
        setStyleMaskImage,
        close,
        submit,
        changePayTypeID,
        onInputMailInvoice,
        useUserInfoEmail,

        // 金流
        tabs,
        loading,
        /** values: 訂單狀態(0=無, 1=交易處理中, 2=交易成功, 3=交易失敗) */
        gmoOrderStatus,
        /** values: 信用卡支付Ref */
        payCreditCardViewRef,
        /** values: 訂單狀態Icon ref */
        completeStatusIconRef,
        action,

        beforeEnter,
        enter
      }
    }
  }
</script>
<style lang="scss" scoped>
  .chekboxIsRead {
    display: inline-flex;
    appearance: none;
    margin-right: 0.5rem;
    width: 0.7rem;
    height: 0.7rem;
    color: currentColor;
    background-color: #27252c;
    border: 0.1rem solid #ff4181;
    border-radius: 0.15em;
    cursor: pointer;

    &::before {
      content: '';
      width: 0.6rem;
      height: 0.6rem;
      background-color: #ff4181;
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

  .close__icon > div {
    height: 100%;
  }

  .bg-depositBtnBg {
    background: linear-gradient(90deg, #6100c2 0%, #a136e8 100%);
  }
</style>

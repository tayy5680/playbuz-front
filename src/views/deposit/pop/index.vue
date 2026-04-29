<template>
  <div
    class="deposit-pop__wrap"
    :class="
      tw(['absolute', 'z-30', 'top-1/2', 'left-1/2', '-translate-x-1/2', '-translate-y-1/2', 'w-428px', 'max-w-full'])
    "
  >
    <div
      class="deposit-pop__container"
      :class="tw(['bg-depositBg', 'px-10px', 'pb-30px', 'mx-18px', 'md:mx-0', 'rounded-20px'])"
    >
      <div
        class="close__icon"
        :class="tw(['ml-auto', 'w-60px', 'h-60px', 'bg-white', 'cursor-pointer'])"
        :style="{
          '-webkit-mask': setStyleMaskImage(require('./images/i_pad_menu_close.svg')),
          mask: setStyleMaskImage(require('./images/i_pad_menu_close.svg'))
        }"
        @click="close"
        v-audio="'close'"
      ></div>
      <el-scrollbar class="deposit-pop__article" max-height="80svh">
        <viewMenu :nowPayTypeID="nowPayTypeID" :menuList="menuList" :changePayTypeID="changePayTypeID" />
        <titleView :nowPayTypeID="nowPayTypeID" :nowPackageDetail="nowPackageDetail" @setCount="setCount" />
        <div class="deposit__data" :class="tw(['px-20px'])">
          <totalView
            :conditionQuantityRemains="nowPackageDetail?.ConditionQuantityRemains"
            :nowPayDetail="nowPayDetail"
          />
          <div class="deposit__title" v-if="nowPayTypeID === 5" :class="tw(['text-lakeGreen', 'mt-24px', 'mb-16px'])">
            *{{ $t('請選擇當前使用的電信才能成功購買') }}
          </div>
          <selectView
            v-if="nowPayTypeID === 5"
            :list="TELECOM_CARRIER_LIST"
            :activeID="submitData.telecomType"
            :placeholder="$t('請選擇電信商')"
            @action="
              id => {
                submitData.telecomType = id
              }
            "
            :error="v$.telecomSelect?.$error"
          />
          <template v-if="![6, 7].includes(nowPayTypeID)">
            <div class="deposit__title" :class="tw(['text-lakeGreen', 'mt-24px', 'mb-16px', 'text-[14px]'])">
              *{{ $t('請選擇要使用的購物發票載具或捐贈') }}
            </div>
            <div
              class="deposit__list"
              :class="
                tw(['flex', 'justify-between', 'border(b lakeGreen dashed)', 'mb-24px', 'pb-16px', 'text-[14px]'])
              "
            >
              <div
                class="deposit__item"
                v-for="item of DONATE_MARK_LIST"
                :key="item.id"
                :class="
                  tw([
                    item.type,
                    'cursor-pointer',
                    'flex',
                    'items-center',
                    submitData.documentsTypeChose === item.type ? 'text-white' : 'text-violet'
                  ])
                "
                @click="submitData.documentsTypeChose = item.type"
              >
                <div
                  class="icon"
                  :class="tw(['h-24px', 'w-24px', 'flex', 'items-center', 'justify-center', 'mr-12px'])"
                >
                  <img v-if="submitData.documentsTypeChose === item.type" :src="require('../images/i_tick2_act.svg')" />
                  <div
                    class="non"
                    v-else
                    :class="tw(['h-20px', 'w-20px', 'rounded-full', 'border', 'border-deepBlackPurple'])"
                  ></div>
                </div>
                <div class="label">
                  {{ $t(item.label) }}
                </div>
              </div>
            </div>
          </template>
          <template v-if="submitData.documentsTypeChose === 'uniform'">
            <div class="deposit__mail" :class="tw(['device-0', 'flex', 'items-center', 'text-[14px]', 'mb-12px'])">
              <div
                class="icon"
                :class="tw(['h-24px', 'w-24px', 'flex', 'items-center', 'justify-center', 'mr-12px', 'flex-shrink-0'])"
              >
                <img :src="require('../images/i_tick2_act.svg')" />
              </div>
              <div class="label" :class="tw(['mr-12px', 'whitespace-nowrap', 'text-white'])">
                {{ MAIL_TEAMPLETE.label }}
              </div>
              <input
                class="input"
                :placeholder="$t(MAIL_TEAMPLETE.placeholder)"
                :class="
                  tw([
                    'py-8px',
                    'px-20px',
                    'ml-auto',
                    'rounded-full',
                    'bg-depositInputBg',
                    'border',
                    'border-depositInputLine',
                    'placeholder-depositInputLine',
                    'text-white',
                    'w-full',
                    v$.mail?.$error ? 'border-red-600' : 'border-depositInputLine',
                    transitionBase
                  ])
                "
                v-model="submitData.mail"
              />
            </div>

            <div class="deposit-uniform__container">
              <div
                class="deposit-uniform__item"
                v-for="item of IDENTIFIER_LIST"
                :key="item.id"
                :class="tw(['flex', 'items-center', 'text-[14px]', 'mb-[8px]'])"
              >
                <div
                  class="icon"
                  :class="tw(['h-24px', 'w-24px', 'flex', 'items-center', 'justify-center', 'mr-12px'])"
                >
                  <img :src="require('../images/i_tick2_act.svg')" />
                </div>
                <div class="label" :class="tw(['text-white', 'flex-1'])">
                  {{ $t(item.label) }}
                </div>
                <input
                  class="input"
                  v-model="submitData.uniformData[item.id]"
                  :placeholder="$t(item.placeholder)"
                  :class="
                    tw([
                      'py-8px',
                      'px-20px',
                      'rounded-full',
                      'bg-depositInputBg',
                      'border',
                      'placeholder-depositInputLine',
                      'text-white',
                      'focus:outline-none',
                      transitionBase,
                      v$[item.id].$error ? 'border-red-600' : 'border-depositInputLine'
                    ])
                  "
                />
              </div>
            </div>
          </template>
          <template v-if="submitData.documentsTypeChose === 'donate' && ![6, 7].includes(nowPayTypeID)">
            <div class="deposit__mail" :class="tw(['device-0', 'flex', 'items-center', 'text-[14px]', 'mb-12px'])">
              <div
                class="icon"
                :class="tw(['h-24px', 'w-24px', 'flex', 'items-center', 'justify-center', 'mr-12px', 'flex-shrink-0'])"
              >
                <img :src="require('../images/i_tick2_act.svg')" />
              </div>
              <div class="label" :class="tw(['mr-12px', 'whitespace-nowrap', 'text-white'])">
                {{ MAIL_TEAMPLETE.label }}
              </div>
              <input
                class="input"
                :placeholder="$t(MAIL_TEAMPLETE.placeholder)"
                :class="
                  tw([
                    'py-8px',
                    'px-20px',
                    'ml-auto',
                    'rounded-full',
                    'bg-depositInputBg',
                    'border',
                    'border-depositInputLine',
                    'placeholder-depositInputLine',
                    'text-white',
                    'w-full',
                    v$.mail?.$error ? 'border-red-600' : 'border-depositInputLine',
                    transitionBase
                  ])
                "
                v-model="submitData.mail"
              />
            </div>
            <div class="deposit__title" :class="tw(['text-violet', 'text-[14px]', 'mt-24px', 'mb-16px'])">
              *{{ $t('請選擇捐贈單位') }}
            </div>
            <div class="deposit__list" :class="tw(['border(b violet dashed)', 'mb-24px', 'pb-16px'])">
              <div
                class="deposit__item"
                v-for="item of DONATE_LIST"
                :key="item.id"
                :class="
                  tw([
                    item.id,
                    'cursor-pointer',
                    'flex',
                    'items-center',
                    'text-[14px]',
                    'mb-12px',
                    submitData.donateItemChose.id === item.id ? 'text-white' : 'text-violet'
                  ])
                "
                @click="submitData.donateItemChose.id = item.id"
              >
                <div
                  class="icon"
                  :class="tw(['h-24px', 'w-24px', 'flex', 'items-center', 'justify-center', 'mr-12px'])"
                >
                  <img v-if="submitData.donateItemChose.id === item.id" :src="require('../images/i_tick2_act.svg')" />
                  <div
                    class="non"
                    v-else
                    :class="tw(['h-20px', 'w-20px', 'rounded-full', 'border', 'border-coinColor'])"
                  ></div>
                </div>
                <input
                  class="input"
                  v-if="item.type === 'placeholder'"
                  :placeholder="$t(item.label)"
                  :class="
                    tw([
                      'py-8px',
                      'px-20px',
                      'rounded-full',
                      'bg-depositInputBg',
                      'border',
                      'placeholder-depositInputLine',
                      v$.donateValue?.$error ? 'border-red-600' : 'border-depositInputLine',
                      transitionBase
                    ])
                  "
                  v-model="submitData.donateItemChose.value"
                />
                <div class="label" v-else>
                  {{ $t(item.label) }}
                </div>
              </div>
            </div>
          </template>
          <template v-if="submitData.documentsTypeChose === 'device'">
            <div class="deposit__list">
              <div class="deposit__mail" :class="tw(['device-0', 'flex', 'items-center', 'text-[14px]', 'mb-12px'])">
                <div
                  class="icon"
                  :class="
                    tw(['h-24px', 'w-24px', 'flex', 'items-center', 'justify-center', 'mr-12px', 'flex-shrink-0'])
                  "
                >
                  <img :src="require('../images/i_tick2_act.svg')" />
                </div>
                <div class="label" :class="tw(['mr-12px', 'whitespace-nowrap', 'text-white'])">
                  {{ MAIL_TEAMPLETE.label }}
                </div>
                <input
                  class="input"
                  :placeholder="$t(MAIL_TEAMPLETE.placeholder)"
                  :class="
                    tw([
                      'py-8px',
                      'px-20px',
                      'ml-auto',
                      'rounded-full',
                      'bg-depositInputBg',
                      'border',
                      'border-depositInputLine',
                      'placeholder-depositInputLine',
                      'text-white',
                      'w-full',
                      v$.mail?.$error ? 'border-red-600' : 'border-depositInputLine',
                      transitionBase
                    ])
                  "
                  v-model="submitData.mail"
                />
              </div>
              <div
                class="deposit__item"
                v-for="item of DEVICE_LIST"
                :key="item.id"
                :class="
                  tw([
                    item.id,
                    'flex',
                    'items-center',
                    'text-[14px]',
                    'mb-12px',
                    submitData.deviceItemChose === item.id ? 'text-white' : 'text-violet'
                  ])
                "
                @click="submitData.deviceItemChose = item.id"
              >
                <div
                  class="icon"
                  :class="
                    tw(['h-24px', 'w-24px', 'flex', 'items-center', 'justify-center', 'mr-12px', 'flex-shrink-0'])
                  "
                >
                  <img v-if="submitData.deviceItemChose === item.id" :src="require('../images/i_tick2_act.svg')" />
                  <div
                    class="non"
                    v-else
                    :class="
                      tw(['h-20px', 'w-20px', 'rounded-full', 'border', 'cursor-pointer', 'border-deepBlackPurple'])
                    "
                  ></div>
                </div>
                <div class="label" :class="tw(['mr-12px', 'whitespace-nowrap'])">
                  {{ $t(item.label) }}
                </div>
                <div
                  class="input"
                  :class="
                    tw([
                      'py-8px',
                      'px-20px',
                      'ml-auto',
                      'rounded-full',
                      'bg-depositInputBg',
                      'border',
                      'border-depositInputLine',
                      'flex',
                      'items-center',
                      v$[item.id]?.$error ? 'border-red-600' : 'border-depositInputLine',
                      'w-175px'
                    ])
                  "
                >
                  <span v-if="item.id === 'phone'" :class="tw(['mr-4px'])">
                    /
                  </span>
                  <input
                    class="input"
                    :placeholder="$t(item.placeholder)"
                    :class="tw(['bg-transparent', 'placeholder-depositInputLine', 'w-full'])"
                    v-model="submitData.deviceData[item.id]"
                  />
                </div>
              </div>
            </div>
          </template>
          <div v-if="![6, 7].includes(nowPayTypeID)" class="tips" :class="tw(['text-[14px]', 'text-[#00dfb9]'])">
            *{{ $t('如超過24小時未付款之訂單，系統將自動取消。') }}
            <br />
            *<span v-html="REFUND_NOTICE_I18N?.[lang] ?? REFUND_NOTICE_I18N['en-US']"></span>
          </div>
          <div
            class="btn"
            :class="
              tw([
                'mt-20px',
                'cursor-pointer',
                'bg-depositBtnBg',
                'rounded-full',
                'text(18px center white)',
                'p-8px',
                { 'pointer-events-none opacity-40': !nowPackageDetail?.IsConditionAvailable || !menuList.length }
              ])
            "
            @click="submit"
          >
            {{ $t('購買') }}
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
  import { reactive, ref, computed, inject, onMounted, onUnmounted, provide, nextTick, watch } from 'vue'
  import store from '@/store'
  import { useRoute, useRouter } from 'vue-router'

  import selectView from './selectView.vue'
  import totalView from './total.vue'
  import viewMenu from './menu.vue'
  import titleView from './title.vue'

  import { event } from 'vue-gtag-next'
  import { postElectronicMallBuyPackage } from '@/api/deposit'
  import {
    DONATE_MARK_LIST,
    DONATE_LIST,
    MAIL_TEAMPLETE,
    DEVICE_LIST,
    IDENTIFIER_LIST,
    DONATE_TEMPLATE,
    TELECOM_CARRIER_LIST,
    REFUND_NOTICE_I18N
  } from './config.js'
  import { DEPOSIT_TYPE_LIST } from '@/configs/deposit'

  import {
    useValidator,
    required,
    email,
    donate,
    barcode,
    certificate,
    uniform,
    rawUniform
  } from '@/utils/use-validator'
  import { isOpenAnotherWebPage } from '@/utils/ua'
  import { useNotice } from '@/utils/use-notice'
  import { CURRENCY } from '@/configs'

  export default {
    name: 'deposit-pop',

    components: {
      selectView,
      totalView,
      viewMenu,
      titleView
    },

    setup() {
      const lang = computed(() => store.state.member.languageCode)
      const deviceInfo = computed(() => store.state.platform.deviceInfo)
      const menuList = computed(() => {
        if (!nowPackageDetail.value?.PackageListResultDetail) return []

        const isSafari = deviceInfo.value.toLowerCase().includes('safari')

        // 生成 payType 清單
        const list = nowPackageDetail.value.PackageListResultDetail.map(item => {
          const payType = DEPOSIT_TYPE_LIST.find(el => el.id === item.PayTypeID)
          // Apple Pay 限制條件只在safari瀏覽器才顯示
          if (payType?.type === 'apple-pay' && !isSafari) return null
          return payType
        }).filter(Boolean) // 移除 null 或 undefined

        // 優先排序（type)
        const priorityOrder = ['apple-pay', 'card', 'atm', 'webATM']
        const priorityItems = priorityOrder.map(type => list.find(item => item.type === type)).filter(Boolean)
        const restItems = list.filter(item => !priorityOrder.includes(item.type))
        return [...priorityItems, ...restItems]
      })

      const route = useRoute()
      const router = useRouter()
      const loading = ref(false)
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
        return nowTypeListData.value.find(item => item.PackageGroupID === name) ?? {}
      })
      const nowPayTypeID = ref(0)
      const nowPayDetail = computed(() => {
        if (nowPayTypeID.value)
          return nowPackageDetail.value?.PackageListResultDetail.find(item => item.PayTypeID === nowPayTypeID.value)
        return nowPackageDetail.value?.PackageListResultDetail?.[0]
      })

      const changePayTypeID = payType => {
        event('shopping_package_click', { click: payType })
        nowPayTypeID.value = payType
      }
      // 預設顯示的付款類型ID
      watch(nowPackageDetail, val => {
        if (!nowPayTypeID.value) nowPayTypeID.value = val?.PackageListResultDetail?.[0]?.PayTypeID ?? 0
      })

      const currency = computed(() => {
        const target = DEPOSIT_TYPE_LIST.find(item => item.id === nowPayTypeID.value)
        return target && [6, 7].includes(target.id) ? target.label : CURRENCY
      })
      provide('currency', currency)

      /**
       * @param {String} documentsTypeChose 目前選擇的發票類型
       * @param {String} documentsTypeChose 目前選擇的捐贈類型
       * @param {Object} deviceData 載具-信箱資料、手機資料、自然人憑證資料
       * @param {String} deviceItemChose 載具-選擇載具類型
       * @param {Object} uniformData 統編資料
       * @param {Number} telecomType 目前選擇的電信商
       */
      const submitData = reactive({
        documentsTypeChose: 'donate',
        donateItemChose: { id: 'gswf', value: '' },
        mail: '',
        deviceData: {
          phone: '',
          certificate: ''
        },
        deviceItemChose: 'phone',
        uniformData: {
          buyerName: '',
          buyerIdentifier: ''
        },
        telecomType: null,
        count: 1
      })
      provide('submitData', submitData)

      // 檢查輸入內容是否合規則
      const form = reactive({
        donateValue: computed(() =>
          submitData.donateItemChose.id === 'gswf' ? DONATE_LIST[0].value : submitData.donateItemChose.value
        ),
        mail: computed(() => submitData.mail),
        phone: computed(() => submitData.deviceData.phone),
        certificate: computed(() => submitData.deviceData.certificate),
        telecomSelect: computed(() => submitData.telecomType),
        buyerName: computed(() => submitData.uniformData.buyerName),
        buyerIdentifier: computed(() => submitData.uniformData.buyerIdentifier)
      })
      const rules = computed(() => {
        const target = {}

        if (nowPayTypeID.value === 5) {
          target.telecomSelect = {
            required: required()
          }
        }

        target.mail = {
          required: required(),
          email: email()
        }
        switch (submitData.documentsTypeChose) {
          case 'donate':
            target.donateValue = {
              required: required(),
              donate: donate()
            }
            break
          case 'device':
            if (submitData.deviceItemChose === 'phone') {
              target.phone = {
                required: required(),
                barcode: barcode()
              }
            } else if (submitData.deviceItemChose === 'certificate') {
              target.certificate = {
                required: required(),
                certificate: certificate()
              }
            } else return {}
            break
          case 'uniform':
            target.buyerName = {
              required: required()
            }
            target.buyerIdentifier = {
              required: required(),
              uniform: uniform()
            }
            break
        }

        return target
      })
      const v$ = useValidator(rules, form)

      const close = () => {
        const { depositPackageGroupID, ...restParams } = route.params
        router.push({ name: route.name, params: restParams })
        setPackagePop(false)
      }

      const ruleCheck = () => {
        let errMsg = ''
        v$.value.$reset()

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submitData.mail)) {
          errMsg = '信箱錯誤'
          v$.value.mail.$touch()
        }

        switch (submitData.documentsTypeChose) {
          case 'donate':
            const v = submitData.donateItemChose
            if (submitData.donateItemChose.id === 'other' && !/^[0-9]{3,7}$/.test(submitData.donateItemChose.value)) {
              errMsg = '愛心碼錯誤'
              v$.value.donateValue.$touch()
            }
            break
          case 'device':
            const data = submitData.deviceData
            if (submitData.deviceItemChose === 'phone' && !/^\/[\dA-Z+-.]{7}$/.test(`/${data.phone}`)) {
              errMsg = '手機條碼錯誤'
              v$.value.phone.$touch()
            } else if (
              submitData.deviceItemChose === 'certificate' &&
              !/^[A-Z]{2}[0-9]{14}$/.test(`/${data.certificate}`)
            ) {
              errMsg = '自然人憑證錯誤'
              v$.value.certificate.$touch()
            }
            break
          case 'uniform':
            if (!submitData.uniformData.buyerName.trim()) {
              errMsg = '抬頭名稱請勿空白'
              v$.value.buyerName.$touch()
            }
            if (!rawUniform(submitData.uniformData.buyerIdentifier)) {
              errMsg = '統編格式錯誤'
              v$.value.buyerIdentifier.$touch()
            }
            break
        }

        return Boolean(errMsg)
      }

      const submit = async () => {
        if (ruleCheck() || loading.value) return false
        loading.value = true

        let newPage = null
        if (isOpenAnotherWebPage()) newPage = window.open()

        const chosePaymentType = DEPOSIT_TYPE_LIST.find(item => item.id === nowPayDetail.value.PayTypeID)

        const input = {
          packageID: nowPayDetail.value.PackageID,
          paymentTypeName: chosePaymentType.type,
          itemName: nowPackageDetail.value.PackageName,
          price: nowPayDetail.value.ActuallyPayAmount,
          uniformInvoiceInfo: {
            donateMark: DONATE_MARK_LIST.find(item => item.type === submitData.documentsTypeChose)?.id
          },
          quantity: parseInt(submitData.count)
        }

        if (input.paymentTypeName === 'little') input.telecomCarrier = submitData.telecomType

        switch (submitData.documentsTypeChose) {
          case 'donate':
            input.uniformInvoiceInfo = {
              ...input.uniformInvoiceInfo,
              npoban:
                submitData.donateItemChose.id === 'gswf' ? DONATE_LIST[0].value : submitData.donateItemChose.value,
              buyerEmailAddress: submitData.mail
            }
            break
          case 'device':
            input.uniformInvoiceInfo = {
              ...input.uniformInvoiceInfo,
              carrierId:
                (submitData.deviceItemChose === 'phone' ? '/' : '') + submitData.deviceData[submitData.deviceItemChose],
              carrierType: DEVICE_LIST.find(item => item.id === submitData.deviceItemChose).code,
              buyerEmailAddress: submitData.mail
            }
            break
          case 'uniform':
            input.uniformInvoiceInfo = {
              ...input.uniformInvoiceInfo,
              ...submitData.uniformData,
              buyerEmailAddress: submitData.mail
            }
            break
        }

        if ([6, 7].includes(nowPayTypeID.value)) {
          delete input.uniformInvoiceInfo
        }

        try {
          const response = await postElectronicMallBuyPackage(input)
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

          // const res = {
          //   Data: {
          //     AmtUrl: 'https://gate.pepay.com.tw/pepay/paysel_amt.php',
          //     PayselInfo: null,
          //     PackageGot: null
          //   },
          //   WanPayInfoData: null,
          //   PHPGOInfoData: null,
          //   EcPayInfoData: {
          //     Url: 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5',
          //     order_id: '127637',
          //     Request: {
          //       MerchantID: '3002607',
          //       MerchantTradeNo: 'PLAYBUZTW',
          //       MerchantTradeDate: '2025/06/24 02:23:43',
          //       PaymentType: 'aio',
          //       TotalAmount: 160,
          //       TradeDesc: '',
          //       ItemName: '初級儲值點數包',
          //       ReturnURL: 'https://cash-flow-qa.tw.playbuz.app/ECPay/Receive',
          //       ClientBackURL: 'https://qa.tw.playbuz.app/center/record?type=order',
          //       OrderResultURL: 'https://qa.tw.playbuz.app/center/record?type=order',
          //       ChoosePayment: 'Credit',
          //       ChooseSubPayment: null,
          //       CheckMacValue: '48E612129FC4C5363FB1BDED96AF265DBC5D2E401A4E2FC0B61753FE2E668087',
          //       EncryptType: '1',
          //       Remark: null
          //     }
          //   },
          //   Status: {
          //     Code: '0',
          //     Message: 'Success',
          //     Timestamp: 1750731823,
          //     TraceCode: null
          //   }
          // }

          const transId = ref(null)

          // 回應連結類型處理
          if (response?.PHPGOInfoData || response?.WanPayInfoData) {
            const infoData = response?.PHPGOInfoData || response?.WanPayInfoData
            transId.value = infoData.order_id
            if (newPage) newPage.location = infoData.Url
            else window.location = infoData.Url
          }
          // 綠界金流EcPayInfoData
          else if (response?.EcPayInfoData) {
            if (!response.EcPayInfoData?.Url || !response.EcPayInfoData?.Request) {
              throw Object.assign(new Error(), { Code: 1 })
            }
            transId.value = response.EcPayInfoData.order_id
            const requestParams = response.EcPayInfoData.Request
            const form = newPage.document.createElement('form')
            form.method = 'POST'
            form.action = response.EcPayInfoData.Url
            for (const key in requestParams) {
              const value = requestParams[key]

              const input = newPage.document.createElement('input')
              input.type = 'hidden'
              input.name = key
              input.value = value
              form.appendChild(input)
            }
            newPage.document.body.appendChild(form)
            form.submit()
          } else if (response?.Data?.AmtUrl && response?.Data?.PayselInfo) {
            transId.value = response.Data.PayselInfo.ORDER_ID
            const donate = DONATE_TEMPLATE({
              url: response.Data.AmtUrl,
              info: response.Data.PayselInfo
            })
            if (newPage) {
              // 這邊要close才會觸發
              newPage.document.write(donate)
              newPage.document.close()
            } else {
              // 若無法另開新頁 則當頁開啟
              document.write(donate)
              document.close()
            }
          } else {
            newPage.close()
          }

          router.replace({ name: 'deposit-complete', query: { transId: transId.value } })
        } catch (err) {
          console.error(err)
          newPage.close()
          const errorCodeList = {
            7002: '購買次數不足',
            7007: '購買數量已達上限',
            1: '未收到正確的綠界金流資訊'
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

      // 浮點數乘法運算
      const multiplication = (payAmount, count) => {
        if (!payAmount) return 0
        if (Math.floor(payAmount) === payAmount) return payAmount * count

        const decimalPlaces = 10 ** (payAmount.toString().split('.')[1].length || 0)
        return (Math.floor(payAmount * decimalPlaces) * count) / decimalPlaces
      }
      provide('multiplication', multiplication)

      onMounted(() => {
        nextTick(() => {
          event('shopping_package_show', { show: '' })
          store.dispatch('platform/setCover', true)
          init()
        })
      })

      onUnmounted(() => {
        event('shopping_package_leave', { leave: '' })
        store.dispatch('platform/setCover', false)
      })
      return {
        submitData,
        DONATE_MARK_LIST,
        DONATE_LIST,
        DEVICE_LIST,
        MAIL_TEAMPLETE,
        IDENTIFIER_LIST,
        TELECOM_CARRIER_LIST,
        v$,
        nowPayTypeID,
        nowPayDetail,
        nowPackageDetail,
        REFUND_NOTICE_I18N,
        lang,
        // fn
        setStyleMaskImage,
        close,
        submit,
        changePayTypeID,
        //===
        menuList
      }
    }
  }
</script>

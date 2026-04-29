<template>
<div
  class="onsiteqrcode__wrap"
  :class="tw([
  'flex',
  'flex-col',
  'items-center',
  ])"
>
  <template v-if="!isUseOrderTip">
    <div
      class="qrcode__show__wrap"
      :class="tw([
      'w-[674px]',
      'h-[300px]',
      'bg-[#28252B]',
      'rounded-[20px]',
      'flex',
      'flex-col',
      'justify-center',
      'items-center',
      'mb-[24px]',
      { 'w-[370px]' : isMobile },
      ])"
    >
      <span
        :class="tw([
        'text-white',
        'text-[18px]',
        'mb-[22px]',
        ])"
      >
        {{ $t('請出示條碼供端點人員掃描兌換') }}
      </span>
      <canvas
        class="qrcode__show"
        :class="tw([
        'w-[150px]',
        'h-[150px]',
        'mb-[22px]',
        ])"
      >
      </canvas>
      <div
        class="qrcode__text"
        :class="tw([
        'flex',
        ])"
      >
        <div
          class="qrcode__time"
          :class="tw([
          'text-[16px]',
          'text-[#f00]',
          'mr-[10px]',
          ])"
        >
          {{minute}}:{{second}}
        </div>
        <div
          class="qrcode__reset"
          :class="tw([
          'text-[12px]',
          limitTimerSecond ? 'text-[#535353]' : 'text-white',
          'mt-[3px]',
          limitTimerSecond ? 'cursor-not-allowed' : 'cursor-pointer',
          'flex',
          'items-center',
          ])"
          @click="init()"
        >
          <span>{{ limitTimerSecond ? $t('再次更新') + limitTimerSecond : $t('更新') }}</span>
          <img
            v-if="!limitTimerSecond"
            :class="tw([
            'w-[14px]',
            'ml-[6px]',
            ])"
            :src="require('./images/i_reupdate.svg')"
          />
        </div>
      </div>
    </div>
    <div
      class="qrcode__content__wrap"
      :class="tw([
      'flex',
      'flex-col',
      'justify-center',
      'items-center',
      'mb-[34px]',
      ])"
    >
      <span
        :class="tw([
        'text-[#9B75CC]',
        'text-[18px]',
        'mb-[10px]',
        ])"
      >
        {{ $t('兌換內容') }}
      </span>
      <div
        class="qrcode__content"
        :class="tw([
        'bg-[#28252B]',
        'w-[674px]',
        'rounded-[20px]',
        'py-[20px]',
        'px-[50px]',
        { 'w-[370px] px-[36px] py-[20px]' : isMobile },
        ])"
      >
        <div
          class="qrcode__content__text"
          v-for="(items, index) in convertList"
          :key="index"
          :class="tw([
          'flex',
          'justify-between',
          'text-white',
          'text-[16px]',
          'border-dashed',
          'border-b-1',
          'px-[6px]',
          'pb-[12px]',
          'mb-[12px]',
          ])"
        >
          <span>{{items.ItemName}}</span>
          <span>x{{items.Quantity}}</span>
        </div>
      </div>
    </div>
    <div
      class="order__bottom-content"
      :class="tw([
        'flex',
        'flex-col',
        'md:flex-row',
        'items-center',
        'justify-center',
      ])"
    >
      <div
        class="order__button"
        v-for="item of buttonList"
        :key="item.id"
        :class="tw([
          'rounded-full',
          'bg-[#51455E]',
          'py-8px',
          'md:py-6px',
          'min-w-[240px]',
          'w-full',
          'md:w-auto',
          'text-center',
          'mx-[12px]',
          'mb-[12px]',
          'md:mb-0',
          'text-[#fff]',
          'cursor-pointer',
          { 'bg-depositBtn': item.id === 'primary' },
        ])"
        @click="action(item.id)"
      >
        {{ $t(item.label) }}
      </div>
    </div>
  </template>
  <div
    class="qrcode-non__wrap"
    v-else
    :class="tw([
    'w-[230px]',
    'h-[270px]',
    'bg-[#28252B]',
    'rounded-[20px]',
    'flex',
    'flex-col',
    'justify-center',
    'items-center',
    ])"
  >
    <div
      class="order-non__icon"
      :class="tw([
        'mt-14px',
        'mb-36px',
        'mx-auto',
        orderObject.Items && orderObject.Items.StatusId === 1 ? 'bg-[#3ee259]' : 'bg-white',
        'h-[80px]',
        'w-[80px]',
      ])"
      :style="{
        '-webkit-mask':  orderObject.Items && orderObject.Items.StatusId === 1 ? setStyleMaskImage(require('./images/i_system_info_ok.svg')) : setStyleMaskImage(require('./images/i_system_info_note.svg')),
        'mask':  orderObject.Items && orderObject.Items.StatusId === 1 ? setStyleMaskImage(require('./images/i_system_info_ok.svg')) : setStyleMaskImage(require('./images/i_system_info_note.svg')),
      }"
    >
    </div>
    <span
      :class="tw([
      'text-[15px]',
      'text-white',
      'mt-[64px]',
      ])"
    >
      {{ $t(orderObject.Items && orderObject.Items.StatusId === 1 ? '兌換完成' : '查無兌換資訊') }}
    </span>
  </div>
  <popup
    :display="displayPopup"
    :id="orderObject?.QrCode?.OrderID.toString() ?? ''"
    @close="displayPopup = false"
  />
</div>
</template>

<script>
import { computed, nextTick, onUnmounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import store from '@/store'
import popup from './popup'
import { getOnSiteOrder, postCouponOrderCheck } from '@/api/member'
import QRCode from 'qrcode'
import dayjs from 'dayjs'

export default {
  components: {
    popup,
  },

  setup () {
    const route = useRoute()
    const router = useRouter()
    const orderObject = ref({})
    const isUseOrderTip = ref(false)
    const isMobile = computed(() => store.getters['platform/isMobile'])
    const displayPopup = ref(false)
    const loading = ref(false)

    const buttonList = reactive([
      {
        id: 'secondary',
        label: '取消兌換',
      },
    ])

    const convertList = computed(() => {
      if (!Object.keys(orderObject.value).length) return []
      return orderObject.value.Items.Product
    })

    const setStyleMaskImage = (url) => {
      return `url(${url}) no-repeat center /contain`
    }

    // 預防連續點擊
    const limitDefaultSecond = ref(10)
    const limitTimerSecond = ref(0)
    const limitTimer = ref(null)

    //
    const action = async (id) => {
      if (loading.value) return false

      switch (id) {
        case 'primary':
          init()
          break
        case 'secondary':
          displayPopup.value = true
          break
      }
    }

    const timeStart = ref(0)
    const minute = ref('00')
    const second = ref('00')
    const convertTimer = ref(null)
    const timeBack = (timeStart) => {
      timeStart.value = timeStart.value - 1
      minute.value = (Math.floor(timeStart.value / 60)).toString().padStart(2, '0')
      second.value = (timeStart.value % 60).toString().padStart(2, '0')
      if (timeStart.value <= 0) {
        init()
      }
    }

    const orderStatusTimer = ref(null)

    const init = async () => {
      if (limitTimerSecond.value !== 0) return false

      const orderID = route.query.orderID

      // 未有id則轉跳至首頁。
      if (!orderID) return router.push({ name: 'home' })

      try {
        loading.value = true
        if (convertTimer.value !== null) {
          clearInterval(convertTimer.value)
          minute.value = '00'
          second.value = '00'
          convertTimer.value = null
          limitTimerSecond.value = JSON.parse(JSON.stringify(limitDefaultSecond.value))
          limitTimer.value = setInterval(() => {
            limitTimerSecond.value--
            if (limitTimerSecond.value <= 0) clearInterval(limitTimer.value)
          }, 1000)
        }

        const response = await getOnSiteOrder({ orderID: orderID })
        orderObject.value = response.Data

        // 沒有輸入的單號時
        if (Object.values(orderObject.value).includes(null) || [1].includes(orderObject.value.Items.StatusId)) {
          isUseOrderTip.value = true
          return false
        }

        // 當非待處理(-2)與完成(1)時，則轉跳至訂單
        if (![-2, 1].includes(orderObject.value.Items.StatusId)) {
          router.push({ name: 'center/record', query: { type: 'coupon' } })
          return false
        }

        orderStatusTimer.value = setInterval(async () => {
          const res = await postCouponOrderCheck({ orderID })
          orderObject.value.Items.StatusId = res.Data.OrderStatus
          if ([1].includes(orderObject.value.Items.StatusId)) {
            isUseOrderTip.value = true
            clearInterval(convertTimer.value)
            clearInterval(limitTimer.value)
            clearInterval(orderStatusTimer.value)
            convertTimer.value = null
            limitTimer.value = null
            orderStatusTimer.value = null
            return false
          }
        }, 3000)

        nextTick(() => {
          timeStart.value = dayjs(orderObject.value.ExpireTime).unix() - dayjs().unix()
          QRCode.toCanvas(document.querySelector('.qrcode__show'),
            JSON.stringify({ orderId: orderObject.value.QrCode.OrderID, hash: orderObject.value.QrCode.Hash }),
            { toSJISFunc: QRCode.toSJIS },
            () => {},
          )
          convertTimer.value = setInterval(timeBack, 1000, timeStart)
        })
      } catch {
      } finally {
        loading.value = false
      }
    }

    init()

    onUnmounted(() => {
      clearInterval(convertTimer.value)
      clearInterval(limitTimer.value)
      clearInterval(orderStatusTimer.value)
      convertTimer.value = null
      limitTimer.value = null
      orderStatusTimer.value = null
    })

    return {
      buttonList,
      orderObject,
      displayPopup,
      isMobile,
      convertList,
      timeStart,
      minute,
      second,
      limitTimerSecond,
      isUseOrderTip,
      // fn
      action,
      init,
      setStyleMaskImage,
    }
  },
}
</script>

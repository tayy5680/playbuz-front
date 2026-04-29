<template>
<div
  class="order__wrap"
  :class="tw([
    'w-full',
  ])"
>
  <div
    class="order__container"
    :class="tw([
      'max-w-[676px]',
      'md:w-full',
      'mx-mobileSpace',
      'md:mx-auto',
    ])"
  >
    <div class="order-non__wrap" v-if="!orderData || [0, 1, 2].includes(orderData.StatusID)">
      <div
        class="non__container"
        :class="tw([
          'relative',
          'bg-navBgHover',
          'text-white',
          'p-30px',
          'rounded-20px',
          'flex',
          'flex-col',
          'items-center',
          'justify-center',
          'w-full',
          'max-w-[360px]',
          'h-[360px]',
          'mx-auto',
          'my-[50px]',
        ])"
      >
        <div
          class="order-non__icon"
          :class="tw([
            'mt-14px',
            'mb-36px',
            'mx-auto',
            'bg-white',
            'h-[80px]',
            'w-[80px]',
          ])"
          :style="{
            '-webkit-mask':  setStyleMaskImage(require('./images/i_system_info_note.svg')),
            'mask':  setStyleMaskImage(require('./images/i_system_info_note.svg')),
          }"
        >
        </div>
        <div
          class="order-non__text"
        >
          {{ $t(orderData === null ? '查無兌換資訊' : orderData.StatusID === 2 ? '兌換訂單已取消' : orderData.StatusID !== '-2' ? '兌換處理中' : '') }}
        </div>
      </div>
    </div>
    <template v-else>
      <div
        class="order__main"
        :class="tw([
          'mb-[45px]',
        ])"
      >
        <div
          class="order__main-content"
          :class="tw([
            'md:grid',
            'md:grid-cols-2',
            'bg-[#242030]',
            'py-[36px]',
            'px-[30px]',
            'md:py-[45px]',
            'rounded-20px',
          ])"
        >
          <template
            v-for="(items, index) of mainContent"
            :key="items.id"
          >
            <div
              class="order__main-class"
              :class="tw([
                { 'border-b': items.line },
                { 'border-[#554D6E]': items.line },
                { 'border-dashed': items.line },
                'py-[12px]',
                { 'col-span-2': (mainContent.length % 2 !== 0 && mainContent.length - 1 === index) || items.isFull },
              ])"
            >
              <div
                class="order__main-label"
                :class="tw([
                  'text-[#9B75CC]',
                ])"
              >
                {{ $t(items.label) }}
              </div>
              <div
                class="order__main-text"
                :class="tw([
                  'mt-[6px]',
                ])"
              >
                <template v-for="(item, index) of items.content" :key="index">
                  <span
                    v-if="item.type === 'label'"
                    :class="tw([
                      'block',
                      'text-[#FFF]',
                    ])"
                  >
                    {{ item.text }}
                  </span>
                  <div class="input" v-if="['text', 'number'].includes(item.type)">
                    <input
                      v-model="item.input"
                      :type="item.type"
                      :class="tw([
                        'block',
                        'rounded-[3px]',
                        'text-[#9B75CC]',
                        'placeholder-[#AC9BC3]',
                        'py-[4px]',
                        'px-[10px]',
                        'w-full',
                        item.isFull ? 'md:w-full' : 'md:w-auto md:max-w-[96%]',
                        { 'border border-[#FF6767]': v$?.[item.id]?.$error },
                      ])"
                      :placeholder="$t(item.placeholder)"
                    />
                    <span
                      v-if="v$?.[item.id]?.$error"
                      :class="tw([
                        'my-[2px]',
                        'text-[#FF6767]',
                        'text-[12px]',
                      ])"
                    >
                      {{ $t(v$?.[item.id].$errors?.[0]?.$message) }}
                    </span>
                  </div>
                  <div
                    class="select"
                    v-if="item.type === 'select'"
                    :class="tw([
                      'inline-block',
                      'w-[45%]',
                      'mr-[3%]',
                      'md:w-auto',
                      'md:mr-[12px]',
                      'mb-[12px]',
                    ])"
                  >
                    <selectView
                      :list="item.list"
                      @action="setChose"
                      :error="v$?.[item.id]?.$error"
                      :activeID="item.input"
                      :placeholder="$t('請選擇')"
                    />
                    <span
                      v-if="v$?.[item.id]?.$error"
                      :class="tw([
                        'my-[2px]',
                        'text-[#FF6767]',
                        'text-[12px]',
                      ])"
                    >
                      {{ $t(v$?.[item.id].$errors?.[0]?.$message) }}
                    </span>
                  </div>
                  <div class="textarea" v-if="item.type === 'textarea'">
                    <textarea
                      :class="tw([
                        'w-full',
                        'rounded-[3px]',
                        'focus:outline-none',
                        'resize-none',
                        'py-[4px]',
                        'px-[10px]',
                        'text-[#9B75CC]',
                        'placeholder-[#AC9BC3]',
                      ])"
                      :placeholder="$t(item.placeholder)"
                      v-model="item.input"
                      rows="6"
                    >
                    </textarea>
                    <span
                      v-if="v$?.[item.id]?.$error"
                      :class="tw([
                        'my-[2px]',
                        'text-[#FF6767]',
                        'text-[12px]',
                      ])"
                    >
                      {{ $t(v$?.[item.id].$errors?.[0]?.$message) }}
                    </span>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="order__minor">
        <div
          class="order__minor-title"
          :class="tw([
            'text-[18px]',
            'text-[#9B75CC]',
            'text-center',
            'mb-8px',
            'md:mb-8px',
          ])"
        >
          {{ $t('兌換內容') }}
        </div>
        <div
          class="order__minor-content"
          :class="tw([
            'bg-[#242030]',
            'py-[36px]',
            'md:py-[45px]',
            'px-[30px]',
            'rounded-20px',
            'grid',
            'grid-cols-3',
            'md:grid-cols-4',
          ])"
        >
          <template
            v-for="(item, index) of minorContent"
            :key="item.id"
          >
            <div
              class="order__minor-label"
              :class="tw([
                'text-[#9B75CC]',
                { 'border-b': minorContent.length - 1 !== index },
                { 'border-[#554D6E]': minorContent.length - 1 !== index },
                { 'border-dashed': minorContent.length - 1 !== index },
                'py-[12px]',
              ])"
            >
              {{ $t(item.label) }}
            </div>
            <div
              class="order__minor-text"
              :class="tw([
                'text-[#FFF]',
                { 'border-b': minorContent.length - 1 !== index },
                { 'border-[#554D6E]': minorContent.length - 1 !== index },
                { 'border-dashed': minorContent.length - 1 !== index },
                'py-[12px]',
                'col-span-2',
                'md:col-span-3',
              ])"
            >
              {{ item.text }} {{ item.id === 3 ? $t('金幣') : '' }}
            </div>
          </template>
        </div>
      </div>
      <div
        class="order__bottom"
        :class="tw([
          'mt-[38px]',
        ])"
      >
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
      </div>
    </template>
    <popup
      :display="displayPopup"
      :id="orderID"
      @close="displayPopup = false"
    />
  </div>
</div>
</template>

<script>
import { computed, reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import store from '@/store'

import selectView from '@/components/ui/select-view'
import popup from './popup'

import { useNotice } from '@/utils/use-notice'
import { pointFormatter } from '@/utils/formatters'
import { useValidator, required } from '@/utils/use-validator'

import {
  getCouponGetOrder,
  postCouponUpdateOrder,
  getCouponCityGet,
} from '@/api/member'

export default {
  name: 'coupon-order',

  components: {
    selectView,
    popup,
  },

  setup () {
    const route = useRoute()
    const router = useRouter()

    const info = computed(() => store.state.member.info)
    const isMobile = computed(() => store.getters['platform/isMobile'])
    const lang = computed(() => store.state.member.languageCode)

    const displayPopup = ref(false)
    const loading = ref(false)

    const headerMenuList = ref([
      { id: 0, label: '寄件資訊', route: { name: 'coupon' } },
    ])
    onMounted(() => {
      store.dispatch('platform/setPageMenuList', headerMenuList.value)
    })

    const mainContent = reactive([
      {
        id: 0,
        label: '會員名稱',
        content: [
          { type: 'label', text: computed(() => info.value?.NickName || '') },
        ],
        line: computed(() => !isMobile.value),
      }, {
        id: 1,
        label: '會員名ID',
        content: [
          { type: 'label', text: computed(() => info.value?.MemberID || '') },
        ],
        line: true,
      }, {
        id: 2,
        label: '收件者姓名',
        content: [
          { id: 'name', type: 'text', input: null, placeholder: '請輸入收件者姓名' },
        ],
      }, {
        id: 3,
        label: '聯絡電話',
        content: [
          { id: 'phone', type: 'number', input: info.value?.PhoneNumber ? info.value?.PhoneNumber.replace('+886', '0') : '', placeholder: '請輸入聯絡電話' },
        ],
      }, {
        id: 4,
        label: '收件地址',
        content: [
          { id: 'city', type: 'select', input: null, list: computed(() => cityData.value) },
          {
            id: 'area',
            type: 'select',
            input: null,
            list: computed(() => {
              const target = cityData.value.find(item => item.id === mainContent[4].content[0].input)
              return target?.list || []
            }),
          },
          { id: 'address', type: 'text', input: null, placeholder: '請輸入路街道', isFull: true },
        ],
        isFull: true,
      }, {
        id: 5,
        label: '備註',
        content: [
          { type: 'textarea', input: null, placeholder: '', isFull: true },
        ],
        isFull: true,
      },
    ])

    const form = reactive({
      name: computed(() => mainContent[2].content[0].input),
      phone: computed(() => mainContent[3].content[0].input),
      city: computed(() => mainContent[4].content[0].input),
      area: computed(() => mainContent[4].content[1].input),
      address: computed(() => mainContent[4].content[2].input),
    })

    const rules = computed(() => {
      const ruleData = {}
      for (const item of Object.keys(form)) {
        ruleData[item] = {
          required: required(),
        }
      }

      return ruleData
    })

    const v$ = useValidator(rules, form)

    const minorContent = reactive([
      {
        id: 0,
        label: '編號',
        text: computed(() => orderData.value?.OID ?? ''),
      }, {
        id: 1,
        label: '產品名稱',
        text: computed(() => orderData.value?.Product?.[0]?.ItemName ?? ''),
      }, {
        id: 2,
        label: '數量',
        text: computed(() => {
          const target = orderData.value?.Product?.[0]?.Quantity ?? 0
          return pointFormatter(target)
        }),
      }, {
        id: 3,
        label: '運費',
        text: computed(() => {
          const target = orderData.value?.ShippingFee ?? 0
          return pointFormatter(target)
        }),
      },
    ])

    const buttonList = reactive([
      {
        id: 'primary',
        label: '確認兌換',
      }, {
        id: 'secondary',
        label: '取消兌換',
      },
    ])

    const action = async (id) => {
      if (loading.value) return false
      switch (id) {
        case 'primary':
          try {
            v$.value.$touch()
            if (v$.value.$error) {
              useNotice({ type: 'error', message: '輸入內容有誤' })
              return false
            }

            loading.value = true
            const playerNote = mainContent.find(item => item.id === 5)
            const recipientsName = mainContent.find(item => item.id === 2)
            const recipientsPhoneNumber = mainContent.find(item => item.id === 3)
            const address = mainContent.find(item => item.id === 4)
            const city = cityData.value.find(item => item.id === mainContent[4].content[0].input) ?? ''
            const cityArea = city?.list?.find(item => item.id === mainContent[4].content[1].input) ?? ''
            await postCouponUpdateOrder({
              orderID: orderID.value,
              recipientsName: recipientsName.content[0].input,
              recipientsPhoneNumber: recipientsPhoneNumber.content[0].input,
              zipCode: mainContent[4].content[1].input.toString(),
              city: city.label,
              cityArea: cityArea.label,
              address: address.content[2].input,
              playerNote: playerNote.content[0].input || '',
            })
            router.push({ name: 'center/record', query: { type: 'coupon' } })
            useNotice({ type: 'info', message: '訂單填寫完成' })
          } catch (err) {
            const errorCodeList = {
              6400: '錢包餘額不足',
            }
            const errorMessage = errorCodeList[err.Code] ?? '發生錯誤，請稍後再試，或洽客服人員'
            useNotice({ type: 'error', message: errorMessage })
          } finally {
            loading.value = false
          }

          break
        case 'secondary':
          displayPopup.value = true
          break
      }
    }

    const setStyleMaskImage = (url) => {
      return `url(${url}) no-repeat center /contain`
    }

    const orderID = ref('')
    const orderData = ref({})
    const cityData = ref([])

    const setChose = (id) => {
      const target = cityData.value.find(item => item.id === id)

      if (target?.list) {
        mainContent[4].content[0].input = id
        mainContent[4].content[1].input = ''
      } else mainContent[4].content[1].input = id
    }

    const init = async () => {
      loading.value = true

      orderID.value = route.query.orderID

      if (!orderID.value) {
        orderData.value = null
        return false
      }

      try {
        const response = await Promise.all([
          getCouponGetOrder({
            orderID: orderID.value,
            locale: lang.value,
          }),
          getCouponCityGet({
            locale: lang.value,
          }),
        ])

        orderData.value = response[0].Data?.[0] || null
        if (orderData.value.StatusID !== -2) {
          router.push({ name: 'center/record', query: { type: 'coupon' } })
          return false
        }
        cityData.value = response[1].Data.reduce((acc, cur) => {
          const code = acc.map(item => item.id)
          if (!code.includes(cur.CityCode)) {
            acc.push({
              id: cur.CityCode,
              label: cur.CityName,
              list: [],
            })
          }

          const choseCityIndex = acc
            .map(item => item.id)
            .indexOf(cur.CityCode)

          acc[choseCityIndex].list.push({
            id: cur.ZipCode,
            label: cur.TownName,
          })

          return acc
        }, [])
      } catch (err) {
        orderData.value = null
        useNotice({ type: 'error', message: '發生錯誤，請稍後再試，或洽客服人員' })
      } finally {
        loading.value = false
      }
    }

    init()

    return {
      isMobile,
      orderData,
      orderID,
      mainContent,
      minorContent,
      buttonList,
      displayPopup,
      v$,
      // fn
      action,
      setStyleMaskImage,
      setChose,
    }
  },
}
</script>

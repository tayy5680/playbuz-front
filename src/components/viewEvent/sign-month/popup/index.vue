<template>
  <div
    class="popup__wrap"
    v-if="formatReward.length"
    :class="tw([
      'fixed',
      'top-0',
      'left-0',
      'w-full',
      'h-full',
    ])"
    @click="closeReward"
  >
    <div
      class="popup__container"
      :class="tw([
        'relative',
        'z-event',
        'w-full',
        'h-full',
        'bg-eventMaskBg',
        'flex',
        'items-center',
        'justify-center',
      ])"
    >
      <div
        class="popup__message"
        :class="tw(['relative'])"
      >
        <div
          class="reward__animate"
          ref="rewardAnimate"
        ></div>
        <div
          class="reward"
          :class="tw([
            'w-full',
            'z-30',
            'flex',
            'flex-col',
            'items-center',
            'transition',
          ])"
        >
          <div
            class="reward__label"
            :class="tw([
              'text-[#ffee7e]',
              'text-[30px]',
              'text-center',
              'w-[256px]',
            ])"
            v-html="rewardTipText"
          ></div>
          <template v-for="(item, index) of formatReward">
            <div
              class="reward__count"
              v-if="item.count"
              :key="index"
              :class="tw([
                'text-white',
                'text-[22px]',
                'whitespace-nowrap',
              ])"
            >
              {{ $t(item.text) }} {{ pointFormatter(item.count) }}
              <span
                class="reward__fragments__count"
                v-if="item.id === 6"
                :class="tw([
                  'text-[#ab00ff]',
                ])"
              >
                {{ rewardItemTotal }}
              </span>
            </div>
          </template>
          <div
            class="reward__label"
            :class="tw([
              'text-[#ffee7e]',
              'text-[16px]',
              'w-[256px]',
              'mt-6',
              'text-center',
            ])"
            v-html="rewardBottomText"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, nextTick, onMounted, computed, reactive, inject } from 'vue'
import { pointFormatter } from '@/utils/formatters'

import lottie from 'lottie-web'
import { useI18n } from 'vue-i18n'

export default {
  name: 'reward-pop',

  props: {
    reward: {
      type: Object,
      default: () => {},
    },
  },

  setup (props) {
    const { t } = useI18n()
    const rewardAnimate = ref(null)
    const rewardLottie = ref(null)

    const stepLabel = ref('')

    const rewardDataList = reactive([
      { id: 1, code: 'GoldPoint', text: '金幣' },
      { id: 2, code: 'SilverPoint', text: '銀幣' },
      { id: 6, code: 'hasItem', text: '頭像框碎片x' },
    ])

    const rewardIconList = reactive([
      { sort: [2, 6], img: 'act_month12_show02.png', timeFrame: [289, 337] },
      { sort: [1, 6], img: 'act_month12_show04.png', timeFrame: [384, 432] },
      { sort: [1, 2], img: 'act_signin_money_both.png', timeFrame: [192, 240] },
      { sort: [1], img: 'act_signin_money_gold.png', timeFrame: [97, 145] },
      { sort: [2], img: 'act_signin_money_silver.png', timeFrame: [0, 48] },
    ])

    /**
     * @param {number} GoldPoint - 金幣獲得數
     * @param {number} SilverPoint - 銀幣獲得數
     * @param {number} hasItem - 頭像框碎片獲得數
     * @param {number} hasItemTotal - 頭像框碎片已累積數量
     * @param {number} CurrectItemState - 1得到金幣或銀幣、2得到頭像框碎片，並已收集1-4個、3得到頭像框碎片並已集5個、4得到頭像框碎片，並已集完整
     * @param {number} SwapGoldPoint - 頭像框碎片兌換金幣
     * @param {number} SwapSilverPoint - 頭像框碎片兌換銀幣
     */
    const rewardObject = computed(() => {
      return props.reward
    })

    const rewardIconItem = computed(() => {
      if (!rewardObject?.value) return ''

      const keys = Object
        .keys(rewardObject.value)
        .map(items => rewardDataList.find(item => item.code === items && rewardObject.value[item.code]))
        .filter(item => item)
        .map(item => item.id)
        .filter((value, index, array) => array.indexOf(value) === index)

      const target = rewardIconList.find(items => {
        if (items.sort.length !== keys.length) return false

        const chose = items.sort.filter(item => keys.includes(item))
        return chose.length === items.sort.length
      })

      return target ?? {}
    })

    const init = () => {
      setTimeout(() => {
        if (!stepLabel.value) closeReward()
      }, 6000)
    }

    onMounted(() => {
      nextTick(() => {
        init()
      })

      let url = JSON.parse(JSON.stringify(require('./lottie/ani_month01_getitem.json')))

      const changeImages = url
        .assets.map(unit => {
          if (unit.u === 'images/') unit.u = ''

          if (unit.p) unit.p = require(`./lottie/images/${unit.p}`)

          return unit
        })

      url = { ...url, ...changeImages }

      rewardLottie.value = lottie.loadAnimation({
        container: rewardAnimate.value,
        animationData: url,
        renderer: 'svg',
        loop: true,
        autoplay: true,
      })
      if (rewardIconItem.value?.timeFrame) rewardLottie.value.playSegments(rewardIconItem.value.timeFrame, true)
    })

    const closeReward = inject('closeReward')

    // 碎片獲得比例
    const rewardItemTotal = computed(() => {
      if (!rewardObject.value) return ''
      return ` (${rewardObject.value.hasItemTotal}/5)`
    })

    // 上方顯示文字
    const rewardTipText = computed(() => {
      if (!rewardObject.value) return t('恭喜！') + t('今日簽到獲得')
      return rewardObject.value.CurrectItemState === 4 && rewardObject.value.hasItem
        ? t('已擁有頭像框!<br>碎片轉換為') : t('恭喜！') + t('今日簽到獲得')
    })

    // 下方顯示文字
    const rewardBottomText = computed(() => {
      if (!rewardObject.value) return ''
      return rewardObject.value.CurrectItemState === 3 ? t('星光閃閃頭像框已收集完成！<br>請至會員中心＞頭像框＞活動查看') : ''
    })

    const formatReward = computed(() => {
      if (!rewardObject.value || !Object.keys(rewardObject.value).length) return []

      const list = rewardDataList
        .map(item => { return { ...item, count: 0 } })
        .reduce((acc, cur) => {
          if (cur.code === 'GoldPoint') {
            cur.count = rewardObject.value.CurrectItemState === 4
              ? rewardObject.value.GoldPoint + rewardObject.value.SwapGoldPoint || 0
              : rewardObject.value.GoldPoint || 0
          } else if (cur.code === 'SilverPoint') {
            cur.count = rewardObject.value.CurrectItemState === 4
              ? rewardObject.value.SilverPoint + rewardObject.value.SwapSilverPoint || 0
              : rewardObject.value.SilverPoint || 0
          } else if (cur.code === 'hasItem') {
            cur.count = rewardObject.value.CurrectItemState !== 4 ? rewardObject.value.hasItem : 0
          }
          return acc.concat(cur)
        }, [])

      return list
    })

    return {
      rewardAnimate,
      stepLabel,
      formatReward,
      pointFormatter,
      closeReward,

      rewardTipText,
      rewardBottomText,
      rewardItemTotal,
    }
  },
}
</script>

<template>
  <div
    class="item__wrap"
    :class="tw([
      'flex',
      'items-center',
      'justify-center',
      'rounded-[3px]',
      isToday
        ? item.isSignIn ? 'bg-[#690BAF]' : 'bg-[#FFCC00]'
        : item.isSignIn ? 'bg-[#690BAF]'
          : item.bonusList ? 'bg-[#F3F3F3]' : '',
      'h-[43px]',
      'xs:h-[55px]',
      'md:h-[65px]',
      'w-[40px]',
      'xs:w-[45px]',
      'md:w-[55px]',
      isTodayBefore && !item.isSignIn && !isToday ? 'opacity-40' : '',
    ])"
  >
    <div
      :class="tw([
        'flex-1',
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'h-full',
        'w-full',
      ])"
    >
      <div
        class="item__bg"
        :class="tw([
          'relative',
          'h-[38px]',
          'w-[38px]',
          'xs:h-[34px]',
          'xs:w-[34px]',
        ])"
      >
        <div
          class="item__day"
          :class="tw([
            'absolute',
            'top-1/2',
            'left-1/2',
            '-translate-1/2',
            'text-22px',
            'font-bold',
            item.bonusList ? 'text-white' : 'text-[#D5D5D5]',
          ])"
        >
          {{ item.createDay ? '' : item.label }}
        </div>
        <div
          class="item__bg"
          :class="tw(['absolute'])"
        >
          <img class="item__img" :src="setIcon" />
        </div>
      </div>
      <div
        class="item__reward__list"
        :class="tw([
          'relative',
          'h-[32px]',
          'mt-[-10px]',
          'flex',
          'flex-col',
          'justify-end',
        ])"
      >
        <div
          class="item__reward__item"
          v-for="(sub, index) of item.bonusList"
          :key="index"
        >
          <div
            class="reward__label"
            :class="tw([
              'text(12px center)',
              'xs:text-14px',
              'rounded-full',
              'px-1',
              'py-px',
              'leading-none',
              sub.bonusTypeID === 1
                ? isTodayBefore && !isToday && !item.isSignIn
                  ? 'bg-[#FFDA91]' : 'bg-[#FFAA00] text-white'
                : isToday
                  ? 'text-white' : item.isSignIn
                  ? 'bg-[#690BAF] text-white' : isTodayBefore
                  ? 'text-[#DBDBDB]' : ''
            ])"
          >
            {{ pointFormatter(sub.bonusNumber) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, reactive } from 'vue'
import { pointFormatter } from '@/utils/formatters'
import { TODAY } from '@/configs'

export default {
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },

  setup (props) {
    // 獎勵類型
    const rewardIconList = reactive([
      { sort: [1, 2], img: require('./images/i_money_both.png') },
      { sort: [1], img: require('./images/i_money_gold.png') },
      { sort: [2], img: require('./images/i_money_silver.png') },
    ])

    const setIcon = computed(() => {
      if (!props.item.bonusList) return ''

      const keys = props.item.bonusList
        .map(item => item.bonusTypeID)

      const target = rewardIconList.find(items => {
        if (items.sort.length !== keys.length) return false

        const chose = items.sort.filter(item => keys.includes(item))
        return chose.length === items.sort.length
      })

      return target ? target.img : ''
    })

    const setStyleMaskImage = (url) => {
      return `url(${url}) no-repeat center /contain`
    }

    const isTodayBefore = computed(() => TODAY.subtract(6, 'hour').isAfter(props.item.createDay))
    const isToday = computed(() => TODAY.subtract(6, 'hour').format('YYYY-MM-DD') === props.item.createDay)

    return {
      pointFormatter,
      TODAY,
      setIcon,
      setStyleMaskImage,
      isTodayBefore,
      isToday,
    }
  },
}
</script>

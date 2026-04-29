<template>
  <div
    class="reward__wrap"
    :class="tw([
      'flex-1',
      'flex',
      'w-full',
      'px-[14%]',
    ])"
  >
    <div
      class="reward__container"
      :class="tw([
        'flex-1',
        'flex',
        'flex-col',
        'pb-20px',
        'md:pb-0',
      ])"
    >
      <div
        class="reward__picture"
        :class="tw([
          'relative',
          'flex',
          'mt-auto',
          'items-center',
          'justify-center',
          'mb-20px',
        ])"
      >
        <img
          class="reward__icon"
          v-for="(item, index) of iconImageList"
          :key="index"
          :src="item"
          :class="tw([
            'w-[69px]',
            'rounded-full',
            index ? '-ml-30px' : '',
          ])"
        />
      </div>
      <div class="reward__list">
        <div
          class="reward__item"
          v-for="item of rewardList"
          :key="item.id"
          :class="tw([
            'text(22px presentGold center)',
            'font-bold',
          ])"
        >
          <template v-if="item.count">
            <span>{{ $t(item.label) }}</span>
            <span
              v-if="item.id !== 'JKFPicture'"
              :class="tw(['ml-2px'])"
            >
              {{ item.count }}
            </span>
          </template>
        </div>
      </div>
      <div
        class="reward__tips"
        :class="tw([
          'text(center white)',
          'my-20px',
        ])"
      >
        {{ $t('恭喜獲得註冊禮包！') }}
      </div>
      <div
        class="reward__button"
        :class="tw([
          'cursor-pointer',
          'bg-purpleBtn',
          'block',
          'mt-auto',
          'w-full',
          'text(white 18px center)',
          'rounded-full',
          'p-8px',
        ])"
        @click="submit"
      >
        {{ $t('領取禮包') }}
      </div>
    </div>
  </div>
</template>

<script>
import { computed, inject, ref } from 'vue'
import { pointFormatter } from '@/utils/formatters'

export default {
  setup () {
    const thirdObject = inject('thirdObject')

    const iconImageList = ref([
      require('./images/i_shop.svg'),
      require('./images/i_money_silver.svg'),
      require('./images/i_money_gold.svg'),
      require('./images/avatar_jkf01.png'),
    ])

    const rewardList = computed(() => {
      const target = [
        { id: 'SilverPoint', label: '銀幣' },
        { id: 'GoldPoint', label: '金幣' },
        { id: 'JKFPicture', label: 'JKF頭像貼', count: 1 },
      ]

      if (!thirdObject?.value) return target

      for (const [key, value] of Object.entries(thirdObject.value)) {
        for (const item of target) if (item.id === key && value) item.count = pointFormatter(value)
      }

      return target
    })

    const thirdChangeStep = inject('thirdChangeStep')

    const submit = () => {
      thirdChangeStep('viewComplete')
    }

    return {
      iconImageList,
      rewardList,
      submit,
    }
  },
}
</script>

<template>
  <div
    class="award__wrap"
    :class="tw([
      'flex',
      'flex-col',
      'w-4/5',
      'h-full',
      'mx-auto',
      'justify-around',
      'text-center',
      'py-8',
      'tablet:w-3/5',
    ])"
  >
    <div
      class="award__container"
      :class="tw(['h-3/5'])"
    >
      <div
        class="award__icons__list"
        :class="tw(['mt-6'])"
      >
        <img
          v-for="(item, index) of awardIconTitleTheme"
          :key="index"
          :src="item.src"
          :width="item.width"
          :class="tw([
            item.width !== 72 ? '-ml-8' : '',
            item.width === 72 ? 'mt-2' : '',
            '-mr-8',
            'inline-block',
          ])"
        />
        <table
          :class="tw([
            'text-presentGold',
            'text-xl',
            'mt-0.5',
            'mx-auto',
            'text-left',
            'border-separate',
          ])"
        >
          <template v-for="(item, index) of awardList" :key="index">
            <tr v-if="item.value">
              <td :class="tw('text-right')">{{ $t(item.label) }}</td>
              <td>{{ item.count }}</td>
            </tr>
          </template>
        </table>
      </div>
      <p
        :class="tw([
          'text-BaseColor',
          'text-sm',
          'pt-3.5',
        ])"
      >
        {{ $t('恭喜獲得夥伴禮包！') }}
      </p>
    </div>
    <button
      :class="tw([
        'bg-redBtn',
        'block',
        'h-11',
        'text-white',
        'rounded-full',
        'mt-12',
        'focus:outline-none',
      ])"
      @click="close"
    >
      {{ $t('開始遊戲') }}
    </button>
  </div>
</template>

<script>
import { inject, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import store from '@/store'

import { POPULAR_CODE_LIST } from '@/configs'
import { pointFormatter } from '@/utils/formatters'
import {
  getMemberInfo,
} from '@/api/member'

export default {
  name: 'thread-award',

  setup () {
    const router = useRouter()
    const route = useRoute()

    const enableShow = inject('enableShow')

    const awardIconTitleTheme = [
      { id: 0, src: require('./images/i_shop.svg'), width: 110 },
      { id: 1, src: require('./images/i_money_silver.svg'), width: 72 },
      { id: 2, src: require('./images/i_money_gold.svg'), width: 72 },
    ]

    const awardList = ref({
      GoldPoint: { label: '金幣' },
      SilverPoint: { label: '銀幣' },
      CanQuantity: { label: '罐頭' },
      Exp: { label: '經驗' },
    })

    const close = inject('close')

    const init = async () => {
      enableShow.value = false
      try {
        const res = await store.dispatch('login/acceptMemberLine')
        const useKeyList = ['GoldPoint', 'SilverPoint', 'CanQuantity', 'Exp']

        for (const [key, value] of Object.entries(res.Data)) {
          if (!useKeyList.includes(key)) continue

          awardList.value[key].value = value
          awardList.value[key].count = pointFormatter(value)
        }
        await getMemberInfo()
        store.dispatch('member/logIn')
      } catch {
        close()
      } finally {
        const query = JSON.parse(JSON.stringify(route.query))
        for (const item of POPULAR_CODE_LIST) delete query[item]
        router.replace({ query })
      }
      enableShow.value = true
    }

    init()

    return {
      awardIconTitleTheme,
      awardList,
      enableShow,
      // fn
      close,
    }
  },
}
</script>

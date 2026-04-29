<template>
<popView
  class="probability__wrap"
  @close="$emit('close')"
  :viewWidth="'360px'"
  :viewHeight="'540px'"
>
  <template #top>
    <div
      class="probability__top"
      :class="tw([
        'text-white',
        'mx-auto',
        'pl-[18px]',
      ])"
    >
      {{ $t('獎項列表') }}
    </div>
  </template>
  <template #container>
    <div
      v-if="formatProbabilityList.length"
      class="probability__container"
      :class="tw([
        'border-[#e5e7eb]',
        'border-1',
        'overflow-hidden',
        'rounded-t-[6px]',
      ])"
    >
      <table
        :class="tw([
          'bg-[#242424]',
          'text-14px',
          'text-center',
          'w-full',
        ])"
      >
        <tr class="probability__tr">
          <th
            class="probability__item title"
            v-for="(item, index) of probabilityTitle"
            :key="index"
            :class="tw([
              { 'border-r-1' : index % 2 === 0 },
              'border-[#e5e7eb]',
              'p-8px',
              'text-white',
              'bg-[#3D215B]',
            ])"
          >
            {{ $t(item) }}
          </th>
        </tr>
        <tr
          class="probability__tr"
          v-for="(item, index) of formatProbabilityList"
          :key="index"
        >
          <td
            class="probability__item td"
            :class="tw([
              'border-t-1',
              'border-r-1',
              'border-[#e5e7eb]',
              'p-8px',
              'text-[#FFDE72]',
              { 'bg-[#343434]' : index % 2 !== 0 },
            ])"
          >
            {{item.VoucherName}} {{item.ItemQuantity}}
          </td>
          <td
            class="probability__item td"
            v-if="item.DrawlotsPercent"
            :class="tw([
              'border-[#e5e7eb]',
              'border-t-1',
              'p-8px',
              'text-white',
              { 'bg-[#343434]' : ((item.row + index) || (1 + index)) % 2 === 0 },
            ])"
            :rowspan="item.row || 1"
          >
            {{ `${item.DrawlotsPercent}%` }}
          </td>
        </tr>
      </table>
    </div>
    <div class="probability__notice" :class="tw(['text(white 13px)', 'my-3', 'leading-6'])">
      <div>{{ $t('*各品項機率顯示為：') }}</div>
      <div>{{ $t('獎項數/總獎項數計算至小數點第2位') }}</div>
      <div>{{ $t('*如僅以除不盡之機率加總，有可能產生不足100％之現象。') }}</div>
      <div>{{ $t('不影響實際發放總數。') }}</div>
    </div>
  </template>
</popView>
</template>

<script>
import popView from '@/components/ui/pop-view'
import { computed } from '@vue/runtime-core'
import { getPackagePercent } from '@/api/deposit'
import { pointFormatter } from '@/utils/formatters'
import { ref } from 'vue'
import store from '@/store'
export default {
  components: {
    popView,
  },

  props: {
    id: {
      type: Number,
      default: () => 0,
    },
  },

  setup (props) {
    const probabilityTitle = ['獎項', '機率']
    const formatProbabilityList = computed(() => {
      if (!probabilityList.value.Data) return []
      return probabilityList.value.Data.reduce((acc, cur, index, arr) => {
        const target = {}
        target.VoucherName = cur.VoucherName
        target.ItemQuantity = cur.ItemQuantity > 1 ? `x${pointFormatter(cur.ItemQuantity)}` : ''
        // 計算合併欄位
        if (cur.DrawlotsPercent !== arr[index - 1]?.DrawlotsPercent) {
          target.row = 0
          while (cur.DrawlotsPercent === arr[index + target.row]?.DrawlotsPercent) target.row++
          target.DrawlotsPercent = cur.DrawlotsPercent
        }
        return acc.concat(target)
      }, [])
    })
    const probabilityList = ref({})
    const check = ref(false)
    const init = async () => {
      if (check.value) return
      try {
        check.value = true
        probabilityList.value = await getPackagePercent({ drawlotsActivityId: props.id, locale: store.state.member.languageCode })
      } catch (err) {
      }
    }
    init()
    return {
      formatProbabilityList,
      probabilityTitle,
    }
  },
}
</script>

<template>
<div>
  <div>
    <div
      v-for="(item, index) of historyData"
      :key="index"
      :class="tw([
        'flex',
        'flex-col',
        'mt-[10px]',
        'mx-[20px]',
        'py-[14px]',
        'border-b-1',
        'border-[#424242]',
      ])"
    >
      <div
        :class="tw([
          'flex',
          'justify-between',
          'items-center',
          'mx-[10px]',
        ])"
      >
        <div
          :class="tw([
            'flex',
            'flex-col',
          ])"
        >
          <div
            :class="tw([
              'text-[18px]',
              'mt-[4px]',
            ])"
          >
            {{item.TourName}}
          </div>
          <div
            v-if="isMobile"
            :class="tw([
              'mr-[16px]',
              'text-[12px]',
              index === openIndex ? 'opacity-100' : 'opacity-30',
            ])"
          >
            {{ dayjs(item.StartTime).format('YYYY/MM/DD') + '~' + dayjs(item.EndTime).format('YYYY/MM/DD') }}
          </div>
        </div>
        <div
          :class="tw([
            'flex',
            'items-center',
          ])"
        >
          <div
            v-if="!isMobile"
            :class="tw([
              'mr-[16px]',
              'text-[12px]',
              index === openIndex ? 'opacity-100' : 'opacity-30',
            ])"
          >
            {{ dayjs(item.StartTime).format('YYYY/MM/DD') + '~' + dayjs(item.EndTime).format('YYYY/MM/DD') }}
          </div>
          <div
            class="button"
            :class="tw([
              'border-[1px]',
              'h-[max-content]',
              'px-[26px]',
              'py-[4px]',
              'cursor-pointer',
              'text-[14px]',
              index === openIndex ? 'bg-[#6a12bf] border-[#6a12bf]' : '',
            ])"
            @click="action(index)"
          >
            {{ index === openIndex ? '收起' : '詳細'}}
          </div>
        </div>
      </div>
      <div
        :class="[
          'mainDiv',
          tw([
            'flex',
            'flex-col',
            'mt-[10px]',
            'overflow-hidden',
            'transition-all',
            'duration-300',
          ])
        ]"
        :style="{ maxHeight: ( index === openIndex && oppnIndexHeight ) ? `${oppnIndexHeight}px` : 0 }"
      >
        <div
          v-for="(item_data, index) of item.Winner"
          :key="index"
          :class="tw([
            'flex',
            'mt-[10px]',
            'items-center',
          ])"
        >
          <div
            :class="tw([
              'w-[28px]',
              'md:h-[28px]',
              'h-[26px]',
              'border-[1px]',
              'border-[#AE9656]',
              'rounded-full',
              'flex',
              'justify-center',
              'items-center',
              'mr-[6px]',
              'text-[15px]',
              index > 2 ? 'text-[#AE9656]' : 'text-[#000] bg-[#AE9656]',

            ])"
          >
            {{item_data.Ranking}}
          </div>
          <div
            :class="tw([
              'w-full',
              'flex',
              'justify-between',
              'items-center',
              'px-[10px]',
              'py-[2px]',
              'text-[15px]',
              index > 2 ? 'text-[#AE9656]' : 'text-[#000] bg-[#AE9656] rounded-full',
            ])"
          >
            <div>
              {{item_data.NickName}}
            </div>
            <div
              :class="tw([
                'text-[15px]',
              ])"
            >
              {{pointFormatter(item_data.TotalBetPoint)}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<viewNoData v-if="historyData.length === 0" />
</template>
<script>
import { ref, computed } from 'vue'
import store from '@/store'
import { pointFormatter } from '@/utils/formatters'
import { getTicketTourHistoryRanking } from '@/api/ticket'
import { useNotice } from '@/utils/use-notice'
import viewNoData from './noData'
import dayjs from 'dayjs'
export default {
  name: 'champion-history-item',
  components: {
    viewNoData,
  },
  setup () {
    const isMobile = computed(() => store.getters['platform/isMobile'])
    const historyDataDetailShow = ref(false)
    const openIndex = ref(null)
    const oppnIndexHeight = ref(0)
    const historyData = ref([])
    const action = (index) => {
      openIndex.value = openIndex.value === index ? null : index
      oppnIndexHeight.value = document.querySelectorAll('.mainDiv')[index].scrollHeight
    }
    const init = async () => {
      try {
        const target = await getTicketTourHistoryRanking()
        historyData.value = target.Data
      } catch (err) {
        const errorCodeList = {
          9404: '目前尚無資料。',
        }
        const errorMessage = errorCodeList[err.Code] ?? '發生錯誤，請稍後再試，或洽客服人員'
        useNotice({ type: 'error', message: errorMessage })
      }
    }
    init()
    return {
      historyDataDetailShow,
      openIndex,
      oppnIndexHeight,
      historyData,
      isMobile,
      // fn
      pointFormatter,
      action,
      dayjs,
    }
  },
}
</script>

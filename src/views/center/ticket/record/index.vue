<template>
  <div class="order__wrap">
    <div class="order__container">
      <el-table
        :data="tableData"
        :empty-text="$t('您目前沒有任何訂單資訊！')"
      >
        <el-table-column
          :label="`${$t('日期')+'/'+$t('時間')}`"
          align="left"
          width="250px"
        >
          <template #="scope">
            <div
              :class="tw([
                'flex',
                'flex-col',
              ])"
            >
              <span>{{ scope.row.date }}</span>
              <span>{{ scope.row.time }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('內容')"
          width="250px"
          align="left'"
        >
          <template #="scope">
            <div
              :class="tw([
                'flex',
                'flex-col',
              ])"
            >
              <span>{{ scope.row.ticketName }}</span>
              <ul
                style="list-style-type: disc;"
                :class="tw([
                  'text-[#FFDE72]',
                  'ml-[22px]',
                ])"
              >
                <li
                  v-for="item in scope.row.ticketItems"
                  :key="item.id"
                >
                  {{item.ItemName}}{{pointFormatter(item.Quantity)}}
                </li>
              </ul>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          width="90px"
          :label="$t('數量')"
          align="left"
        >
          <template #="scope">
            <div>{{ scope.row.quantity }}</div>
          </template>
        </el-table-column>
        <el-table-column
          width="240px"
          :label="$t('備註')"
          align="left"
        >
          <template #="scope">
            <div v-if="scope.row.SenderName && scope.row.ticketStatus === 2">
              {{ $t('收到贈禮來自') + scope.row.SenderName }}
            </div>
            <div
              :class="tw([
                'flex',
                'items-center',
              ])"
            >
              <i
                :class="tw([
                  'w-[14px]',
                  'h-[14px]',
                  'mr-[6px]',
                  'inline-block',
                ])"
                :style="{
                  '-webkit-mask': setStyleMaskImage(require('./images/i_tick3.svg')),
                  'mask': setStyleMaskImage(require('./images/i_tick3.svg')),
                  'backgroundColor': scope.row.color,
                }"
              ></i>
              <div
                :style="{
                  'color': scope.row.color,
                }"
              >
                {{ scope.row.ticketStatus }}
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 可能會不見的東西 -->
    <!-- 備註彈窗 -->
    <!-- <teleport to="body">
      <transition name="fade">
        <remarkPop v-if="remarkDisplay" @close="remarkDisplay = false" />
      </transition>
    </teleport> -->
    <!-- 遮罩 -->
    <!-- <teleport to="body">
      <transition name="fade">
        <div
          class="cover"
          v-if="remarkDisplay"
          :class="tw([
            'fixed',
            'top-0',
            'left-0',
            'w-full',
            'h-full',
            'bg-bg',
            'bg-opacity-80',
            'z-mask',
          ])"
        >
        </div>
      </transition>
    </teleport> -->
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import store from '@/store'
import { TICKET_STATUS_LIST } from '../configs'
// import remarkPop from './pop.vue'
import { getTicketUsageRecord } from '@/api/ticket'
import dayjs from 'dayjs'
import { pointFormatter } from '@/utils/formatters'

export default {
  name: 'ticket-list',

  components: {
    // remarkPop,
  },

  setup () {
    const isMobile = computed(() => store.getters['platform/isMobile'])
    // const remarkDisplay = ref(false)
    const action = () => {
    }
    const tableData = ref([])
    const init = async () => {
      const target = await getTicketUsageRecord({ sDate: dayjs().subtract(1, 'year').format(), eDate: dayjs().format() })
      tableData.value = target.Data.map(item => {
        return {
          date: dayjs(item.CreateTime).format('YYYY/MM/DD'),
          time: dayjs(item.CreateTime).format('HH:mm'),
          ticketId: item.TicketId,
          ticketName: item.TicketName,
          ticketItems: item.TicketItems,
          quantity: item.Quantity,
          ticketStatusID: item.TicketStatusID,
          ticketStatus: TICKET_STATUS_LIST.find(items => items.id === item.TicketStatusID)?.label || item.TicketStatusID,
          ticketStatusIcon: TICKET_STATUS_LIST.find(items => items.id === item.TicketStatusID)?.img || require('./images/i_tick3.svg'),
          color: TICKET_STATUS_LIST.find(items => items.id === item.TicketStatusID)?.color || 'white',
        }
      })
    }
    init()
    const setStyleMaskImage = (url) => {
      return `url(${url}) no-repeat center /contain`
    }

    return {
      // data
      isMobile,
      tableData,
      // remarkDisplay,
      // fn
      action,
      dayjs,
      pointFormatter,
      setStyleMaskImage,
    }
  },
}
</script>

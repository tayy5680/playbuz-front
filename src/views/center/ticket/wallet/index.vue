<template>
  <div class="order__wrap">
    <div class="order__container">
      <el-table
        :data="tableData"
        :empty-text="$t('您目前沒有任何票匣！')"
      >
        <el-table-column
          :label="`${$t('票卷名稱')}`"
          align="left"
          width="212px"
        >
          <template #="scope">
            <div
              :class="tw([
                'mx-[10px]',
              ])"
            >
              {{ scope.row.TicketName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('內容')"
          align="left'"
          min-width="300px"
        >
          <template #="scope">
            <div
              :class="tw([
                'mx-[10px]',
                'text-[#9D9D9D]',
              ])"
            >
              <div v-for="(item, index) in scope.row.TicketList" :key="index">
                <span>{{ item.TicketStatus + ' x' + item.Quantity }}</span>
              </div>
            </div>
            <br/>
            <ul
              style="list-style-type: disc;"
              :class="tw([
                'text-[#FFDE72]',
                'ml-[32px]',
              ])"
            >
              <li
                v-for="item in scope.row.TicketItems"
                :key="item.id"
              >
                {{item.ItemName}} {{pointFormatter(item.Quantity)}}
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('備註')"
          align="left"
          width="130px"
        >
          <template #="scope">
            <div>
              <div
                :class="tw([
                  'flex',
                  'text-[12px]',
                  'text-white',
                  'mt-[12px]',
                ])"
              >
                <a :href="scope.row.OpenGameUrl">
                  <div
                    :class="tw([
                      'flex',
                      'justify-center',
                      'items-center',
                      'bg-blurPurpleBtn',
                      'px-[20px]',
                      'rounded-full',
                      'mr-[12px]',
                      'cursor-pointer',
                    ])"
                  >
                    {{$t('參賽')}}
                  </div>
                </a>
                <!-- <div
                  :class="tw([
                    'flex',
                    'justify-center',
                    'items-center',
                    'px-[20px]',
                    'rounded-full',
                    'border-[1px]',
                    'cursor-pointer',
                  ])"
                >
                  {{$t('贈送')}}
                </div> -->
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import store from '@/store'
import { getTicketTicketBox } from '@/api/ticket'
import { pointFormatter } from '@/utils/formatters'

export default {
  name: 'ticket-list',

  setup () {
    const isMobile = computed(() => store.getters['platform/isMobile'])

    const tableData = ref([])
    const init = async () => {
      const target = await getTicketTicketBox()
      tableData.value = target.Data
    }
    init()
    return {
      // data
      isMobile,
      tableData,
      // fn
      pointFormatter,
    }
  },
}
</script>

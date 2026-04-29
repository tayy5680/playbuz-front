<template>
  <el-table :data="tableData">
    <template v-if="!isMobile">
      <el-table-column
        :label="`${$t('日期')}/${$t('單號')}`"
        align="center"
      >
        <template #="scope">
          <div
            :class="tw([
              'flex',
              'flex-col',
              'items-start',
            ])"
          >
            <div>{{ timeFormatter(scope.row.CreateTime, { format: 'YYYY-MM-DD' }) }}</div>
            <div>{{ timeFormatter(scope.row.CreateTime, { format: 'HH:mm:ss' }) }}</div>
            <div>{{ scope.row.OID }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :label="`${$t('內容')}/${$t('數量')}`"
        align="center"
      >
        <template #="scope">
          <div
            :class="tw([
              'flex',
              'flex-col',
              'items-start',
            ])"
          >
            <template
              v-for="(item, index) of scope.row?.Product"
              :key="index"
            >
              <div>{{ item.ItemName }}({{ pointFormatter(item.Quantity) }})</div>
            </template>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :label="`${$t('寄貨資訊')}/${$t('貨運單號')}`"
        align="center"
      >
        <template #="scope">
          <div>{{ scope.row.ShippingCompany ?? '-' }}</div>
          <div>{{ scope.row.ShippingID ?? '-' }}</div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('備註')">
        <template #="scope">
          <div>{{ scope.row.Note ?? '-' }}</div>
        </template>
      </el-table-column>
      <el-table-column
        :label="`${$t('狀態')}/${$t('更新時間')}`"
        align="center"
      >
        <template #="scope">
          <div
            :class="tw([
              'flex',
              'flex-col',
              'items-start',
            ])"
          >
            <div
              :class="tw([
                [0, 1].includes(scope.row.StatusID) ? 'text-lakeGreen' : 'text-navColor',
                'flex',
                'items-center',
              ])"
            >
              <i
                :class="tw([
                  'inline-block',
                  'w-15px',
                  'h-15px',
                  'mr-4px',
                  [0, 1].includes(scope.row.StatusID) ? 'bg-lakeGreen' : 'bg-navColor',
                ])"
                :style="{
                  '-webkit-mask': [0, 1].includes(scope.row.StatusID) ? setStyleMaskImage(require('../images/i_tick3.svg')) : setStyleMaskImage(require('../images/i_system_info2.svg')),
                  'mask': [0, 1].includes(scope.row.StatusID) ? setStyleMaskImage(require('../images/i_tick3.svg')) : setStyleMaskImage(require('../images/i_system_info2.svg')),
                }"
              ></i>
              {{ $t(formatCouponStatus(scope.row.StatusID)) }}
            </div>
            <div>{{ timeFormatter(scope.row.UpdateTime) }}</div>
            <router-link
              class="cancal"
              v-if="scope.row.StatusID === -2"
              :class="tw([
                'cursor-pointer',
                'px-[12px]',
                'py-[2px]',
                'bg-blurPurpleBtn',
                'text-sm',
                'rounded-full',
                'text-[12px]',
                'text-white',
                'mt-[4px]',
              ])"
              :to="{
                name: scope.row.OrderTypeId === 2 ? 'onsiteqrcode' : scope.row.OrderTypeId === 1 ? 'order' : '',
                query: { orderID: scope.row.OID }
              }"
            >
              {{ $t(scope.row.OrderTypeId === 2 ? '開啟訂單' : scope.row.OrderTypeId === 1 ? '編輯訂單' : '') }}
            </router-link>
          </div>
        </template>
      </el-table-column>
    </template>
    <template v-else>
      <el-table-column
        :label="`${$t('日期')}/${$t('單號')}/${$t('內容')}`"
        align="center"
      >
        <template #="scope">
          <div
            :class="tw([
            'flex',
            'flex-col',
            'items-start',
          ])"
          >
            <div>{{ timeFormatter(scope.row.CreateTime) }}</div>
            <div>{{ scope.row.OID }}</div>
            <div
              :class="tw([
                'flex',
                'flex-col',
                'items-start',
              ])"
            >
              <template
                v-for="(item, index) of scope.row?.Product"
                :key="index"
              >
                <div>{{ item.ItemName }}({{ pointFormatter(item.Quantity) }})</div>
              </template>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :label="`${$t('寄件資訊')}/${$t('狀態')}`"
        align="center"
      >
        <template #="scope">
          <div
            :class="tw([
              'flex',
              'flex-col',
              'items-start',
              'text-left',
            ])"
          >
            <div v-if="scope.row.ShippingCompany">{{ scope.row.ShippingCompany }}</div>
            <div>{{ scope.row.ShippingID ?? '-' }}</div>
            <div v-if="scope.row.Note">{{ scope.row.Note }}</div>
            <div
              :class="tw([
                [0, 1].includes(scope.row.StatusID) ? 'text-lakeGreen' : 'text-navColor',
                'flex',
                'items-center',
              ])"
            >
              <i
                :class="tw([
                  'inline-block',
                  'w-15px',
                  'h-15px',
                  'mr-4px',
                  [0, 1].includes(scope.row.StatusID) ? 'bg-lakeGreen' : 'bg-navColor',
                ])"
                :style="{
                  '-webkit-mask': [0, 1].includes(scope.row.StatusID) ? setStyleMaskImage(require('../images/i_tick3.svg')) : setStyleMaskImage(require('../images/i_system_info2.svg')),
                  'mask': [0, 1].includes(scope.row.StatusID) ? setStyleMaskImage(require('../images/i_tick3.svg')) : setStyleMaskImage(require('../images/i_system_info2.svg')),
                }"
              ></i>
              {{ $t(formatCouponStatus(scope.row.StatusID)) }}
            </div>
            <div>{{ timeFormatter(scope.row.UpdateTime) }}</div>
            <router-link
              v-if="scope.row.StatusID === -2"
              :class="tw([
                'cursor-pointer',
                'px-[12px]',
                'py-[2px]',
                'bg-blurPurpleBtn',
                'text-sm',
                'rounded-full',
                'text-[12px]',
                'text-white',
                'mt-[4px]',
              ])"
              :to="{
                name: scope.row.OrderTypeId === 2 ? 'onsiteqrcode' : scope.row.OrderTypeId === 1 ? 'order' : '',
                query: { orderID: scope.row.OID }
              }"
            >
              {{ $t(scope.row.OrderTypeId === 2 ? '開啟訂單' : scope.row.OrderTypeId === 1 ? '編輯訂單' : '') }}
            </router-link>
          </div>
        </template>
      </el-table-column>
    </template>
    <template #empty>
      <span v-if="!loading">{{ $t('您目前沒有任何訂單資訊！') }}</span>
      <gpgLoading v-show="loading" />
    </template>
  </el-table>
</template>

<script>
import { computed, ref, inject, watch } from 'vue'
import store from '@/store'

import gpgLoading from '@/components/gpg-loading'

import { useNotice } from '@/utils/use-notice'
import { COUPON_STATUS_LIST } from '../configs.js'
import { getCouponGetOrder } from '@/api/member'
import {
  timeFormatter,
  pointFormatter,
} from '@/utils/formatters'

export default {
  name: 'view-coupon',

  components: {
    gpgLoading,
  },

  setup () {
    const loading = ref(false)

    const isMobile = computed(() => store.getters['platform/isMobile'])

    const selectRangeItem = inject('selectRangeItem')
    watch(selectRangeItem, () => {
      handleFetch()
    })

    const setStyleMaskImage = (url) => {
      return `url(${url}) no-repeat center /contain`
    }

    const formatCouponStatus = (id) => {
      const target = COUPON_STATUS_LIST.find(item => item.id === id)
      return target?.label ?? id
    }

    // 呈現資料相關
    const tableData = ref([])
    const handleFetch = async () => {
      if (loading.value) return false

      if (!Object.keys(selectRangeItem.value).length) return false

      const inputData = {
        StartDate: selectRangeItem.value.start,
        EndDate: selectRangeItem.value.end,
        Skip: 0,
        Show: 9999,
        locale: store.state.member.languageCode,
      }

      try {
        loading.value = true
        const res = await getCouponGetOrder(inputData)
        tableData.value = res.Data
      } catch {
        tableData.value = []
        useNotice({ type: 'error', message: '發生錯誤，請稍後再試，或洽客服人員' })
      } finally {
        loading.value = false
      }
    }
    handleFetch()

    return {
      loading,
      isMobile,
      tableData,
      // fn
      setStyleMaskImage,
      formatCouponStatus,
      timeFormatter,
      pointFormatter,
    }
  },
}
</script>

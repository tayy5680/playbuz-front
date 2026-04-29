<template>
  <div class="order__wrap">
    <div class="order__container">
      <el-table
        v-if="isMobile"
        :data="tableData"
        :empty-text="$t('您目前沒有任何訂單資訊！')"
      >
        <el-table-column :label="`${$t('日期')}/${$t('單號')}/${$t('名稱')}`" align="left">
          <template #="scope">
            <div>{{ timeFormatter(scope.row.CreateTime) }}</div>
            <div>{{ scope.row.TransID }}</div>
            <div>{{ `${scope.row.PackageName}x${scope.row.BuyQuantity}` }}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('內容')" align="left" >
          <template #="scope">
            <div
              v-for="item of scope.row.PackageItems"
              :key="item.ItemID"
              :class="tw([
                'flex',
                'items-center',
              ])"
            >
              <span>{{ `${item.ItemName} x${pointFormatter(item.ItemQuantity*scope.row.BuyQuantity)}` }}</span>
            </div>
            <div v-if="scope.row.ActuallyPayAmount">
              {{ currencyFormatter(currency, scope.row.ActuallyPayAmount) }} {{ $t(depositTypeFormatter(scope.row.PayTypeID)) }}
            </div>
            <div
              :class="tw([
                scope.row.StoredStatusID === 1 ? 'text-lakeGreen' : 'text-navColor',
                'flex',
                'items-center',
              ])"
            >
              <div
                class="stored__status__serial"
                v-if="scope.row.PackageSeries"
                :class="tw([
                  'bg-ordernoBtn',
                  'rounded-xl',
                  'inline-block',
                  'px-3',
                  'text-white',
                  'cursor-pointer',
                ])"
                @click="useSerial(scope.row)"
              >
                {{`${$t('使用序號')}：${scope.row.PackageSeries}` }}
              </div>
              <div v-else class="stored__status">
                <i
                  :class="tw([
                    'inline-block',
                    'w-15px',
                    'h-15px',
                    'mr-4px',
                    scope.row.StoredStatusID === 1 ? 'bg-lakeGreen' : 'bg-navColor',
                  ])"
                  :style="{
                    '-webkit-mask': [2, 3].includes(scope.row.StoredStatusID) ? setStyleMaskImage(require('../images/i_system_info2.svg')) : setStyleMaskImage(require('../images/i_tick3.svg')),
                    'mask': [2, 3].includes(scope.row.StoredStatusID) ? setStyleMaskImage(require('../images/i_system_info2.svg')) : setStyleMaskImage(require('../images/i_tick3.svg')),
                  }"
                ></i>
                {{ $t(formatStoreStatus(scope.row.StoredStatusID)) }}
              </div>
            </div>
            <div
              v-if="scope.row.StoredStatusID === 0"
              :class="tw([
                'flex',
                'items-center',
              ])"
            >
              <div
                :class="tw([
                  'cursor-pointer',
                  'px-[12px]',
                  'py-[2px]',
                  'bg-blurPurpleBtn',
                  'text-sm',
                  'rounded-full',
                  'text-[12px]',
                  'text-white',
                ])"
                @click="isDisplayOrderDeleteID = scope.row.TransID"
              >
                {{ $t('取消訂單') }}
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-else
        :data="tableData"
        :empty-text="$t('您目前沒有任何訂單資訊！')"
      >
        <el-table-column
          :label="`${$t('日期')}/${$t('單號')}`"
          align="left"
        >
          <template #="scope">
            <div>{{ timeFormatter(scope.row.CreateTime) }}</div>
            <div>{{ scope.row.TransID }}</div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('名稱')"
          align="left'"
        >
          <template #="scope">
            <div>{{ `${scope.row.PackageName}x${scope.row.BuyQuantity}` }}</div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('內容')"
          align="left"
        >
          <template #="scope">
            <div
              v-for="item of scope.row.PackageItems"
              :key="item.ItemID"
              :class="tw([
                'flex',
                'items-center',
              ])"
            >
              <span>{{ `${item.ItemName} x${pointFormatter(item.ItemQuantity*scope.row.BuyQuantity)}` }}</span>
            </div>
            <div v-if="scope.row.ActuallyPayAmount">
              {{ currencyFormatter(currency, scope.row.ActuallyPayAmount) }} {{ $t(depositTypeFormatter(scope.row.PayTypeID)) }}
            </div>
            <div
              :class="tw([
                scope.row.StoredStatusID === 1 ? 'text-lakeGreen' : 'text-navColor',
                'flex',
                'items-center',
              ])"
            >
              <div
                class="stored__status__serial"
                v-if="scope.row.PackageSeries"
                :class="tw([
                  'bg-ordernoBtn',
                  'rounded-xl',
                  'inline-block',
                  'px-3',
                  'text-white',
                  'cursor-pointer',
                ])"
                @click="useSerial(scope.row)"
              >
                {{`${$t('使用序號')}：${scope.row.PackageSeries}` }}
              </div>
              <div v-else class="stored__status">
                <i
                  :class="tw([
                    'inline-block',
                    'w-15px',
                    'h-15px',
                    'mr-4px',
                    scope.row.StoredStatusID === 1 ? 'bg-lakeGreen' : 'bg-navColor',
                  ])"
                  :style="{
                    '-webkit-mask': [2, 3].includes(scope.row.StoredStatusID) ? setStyleMaskImage(require('../images/i_system_info2.svg')) : setStyleMaskImage(require('../images/i_tick3.svg')),
                    'mask': [2, 3].includes(scope.row.StoredStatusID) ? setStyleMaskImage(require('../images/i_system_info2.svg')) : setStyleMaskImage(require('../images/i_tick3.svg')),
                  }"
                ></i>
                <span>{{ $t(formatStoreStatus(scope.row.StoredStatusID)) }}</span>
              </div>
              <div
                v-if="scope.row.StoredStatusID === 0"
                :class="tw([
                  'flex',
                  'items-center',
                ])"
              >
                <span :class="tw(['mx-[8px]'])"> - </span>
                <div
                  class="cancal"
                  :class="tw([
                    'cursor-pointer',
                    'px-[12px]',
                    'py-[2px]',
                    'bg-blurPurpleBtn',
                    'text-sm',
                    'rounded-full',
                    'text-[12px]',
                    'text-white',
                  ])"
                  @click="isDisplayOrderDeleteID = scope.row.TransID"
                >
                  {{ $t('取消訂單') }}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <teleport to="body">
      <viewPopup
        v-if="isDisplayOrderDeleteID"
        @close="isDisplayOrderDeleteID = null"
      >
        <template v-slot:context>
          <div class="info">
            <div
              class="img"
              :class="tw([
                'mt-14px',
                'mb-36px',
                'mx-auto',
                'text-center',
                'bg-blurPurpleBtn',
                'h-[80px]',
                'w-[80px]',
              ])"
              :style="{
                '-webkit-mask':  setStyleMaskImage(require('../images/i_system_info_note.svg')),
                'mask':  setStyleMaskImage(require('../images/i_system_info_note.svg')),
              }"
            ></div>
            <div
              class="text"
              :class="tw([
                'flex-1',
                'flex',
                'flex-col',
                'items-center',
              ])"
            >
              <div>{{ $t('是否刪除訂單') }}</div>
              <div :class="tw(['mt-[12px]'])">{{ $t(isDisplayOrderLabel) }}</div>
            </div>
          </div>
        </template>
        <template v-slot:bottom>
          <div
            class="btn"
            :class="tw([
              'text(white center)',
            ])"
          >
            <div
              class="btn"
              :class="tw([
                'cursor-pointer',
                'bg-depositBtn',
                'rounded-full',
                'mb-8px',
                'p-8px',
              ])"
              @click="actionMemberOrderDel()"
            >
              {{ $t('確認') }}
            </div>
            <div
              class="btn"
              :class="tw([
                'cursor-pointer',
                'bg-giftBtnInactive',
                'rounded-full',
                'p-8px',
              ])"
              @click="isDisplayOrderDeleteID = null"
            >
              {{ $t('取消') }}
            </div>
          </div>
        </template>
      </viewPopup>
    </teleport>
    <teleport to="body">
      <viewPopup
        v-if="serialInfo"
        @close="serialInfo = null"
      >
        <template v-slot:context>
          <howToUseView
            :serial="serialInfo.packageSeries"
            :gameData="serialInfo.gameData"
          />
        </template>
        <template v-slot:bottom>
          <buttonView
            v-if="serialInfo.url"
            type="primary"
            :class="tw([
              'p-8px',
              'mt-16px',
              'text(center 18px)',
              'leading-6 ',
              'w-full',
              'text-white',
            ])"
            @click="actionStartGame(serialInfo.url)"
          >
            {{ $t('開始遊戲') }}
          </buttonView>
        </template>
      </viewPopup>
    </teleport>
  </div>
</template>

<script>
import { ref, computed, inject, watch } from 'vue'
import store from '@/store'

import viewPopup from '@/components/popup'

import { STORE_STATUS_LIST } from '../configs.js'
import { postMemberOrderDel } from '@/api/deposit'
import { getOrderRecord } from '@/api/records'
import { useNotice } from '@/utils/use-notice'
import {
  timeFormatter,
  currencyFormatter,
  pointFormatter,
  depositTypeFormatter,
} from '@/utils/formatters'
import howToUseView from '@/views/deposit/howToUse.vue'
import buttonView from '@/components/ui/button-view'
import uaParser from 'ua-parser-js'
import { useRouter } from 'vue-router'

export default {
  name: 'order-list',

  components: {
    viewPopup,
    howToUseView,
    buttonView,
  },

  setup () {
    const router = useRouter()
    const ua = uaParser()
    const currency = computed(() => store.getters['member/currency'])
    const loading = ref(false)

    const isMobile = computed(() => store.getters['platform/isMobile'])
    const selectRangeItem = inject('selectRangeItem')
    watch(selectRangeItem, () => {
      handleFetch()
    })

    const tableData = ref([])
    const handleFetch = async () => {
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
        const res = await getOrderRecord(inputData)
        tableData.value = res.Data
      } catch {
        tableData.value = []
        useNotice({ type: 'error', message: '發生錯誤，請稍後再試，或洽客服人員' })
      } finally {
        loading.value = false
      }
    }
    handleFetch()
    const lang = computed(() => store.state.member.languageCode)
    watch(lang, () => {
      handleFetch()
    })

    const setStyleMaskImage = (url) => {
      return `url(${url}) no-repeat center /contain`
    }

    const isDisplayOrderDeleteID = ref(null)
    const isDisplayOrderLabel = computed(() => {
      const target = tableData.value.find(item => item.TransID === isDisplayOrderDeleteID.value)
      return target.PackageName ?? isDisplayOrderDeleteID.value
    })

    const actionMemberOrderDel = async () => {
      if (loading.value) return false

      try {
        loading.value = true
        await postMemberOrderDel({ transId: isDisplayOrderDeleteID.value })
        handleFetch()
        isDisplayOrderDeleteID.value = null
      } catch {
      } finally {
        loading.value = false
      }
    }
    const formatStoreStatus = (val) => {
      const target = STORE_STATUS_LIST.find(item => item.id === val)
      return target?.label ?? val
    }

    const serialInfo = ref(null)
    const useSerial = (val) => {
      serialInfo.value = {
        packageSeries: val.PackageSeries,
        url: '',
        gameData: {
          gameId: val.GameId,
          gameName: val.GameName,
        },
      }

      switch (ua.os.name.toLowerCase()) {
        case 'android':
          serialInfo.value.url = val.UrlAndroid ?? ''
          break
        case 'ios':
          serialInfo.value.url = val.UrlIOS ?? ''
          break
        default:
          serialInfo.value.url = val.UrlWeb ?? ''
      }
      if (!serialInfo.value.url) {
        const target = store.state.game.gameList.some(item => item.GameID === val.GameId)
        serialInfo.value.url = target ? { name: 'game/detail', params: { gameID: val.GameId } } : ''
      }
    }
    const actionStartGame = (url) => {
      if (typeof url === 'string') window.open(url)
      else router.push(url)
    }

    return {
      // data
      loading,
      isMobile,
      tableData,
      isDisplayOrderDeleteID,
      isDisplayOrderLabel,
      currency,
      serialInfo,
      // fn
      formatStoreStatus,
      currencyFormatter,
      pointFormatter,
      timeFormatter,
      depositTypeFormatter,
      setStyleMaskImage,
      actionMemberOrderDel,
      useSerial,
      actionStartGame,
    }
  },
}
</script>

<template>
  <div class="present__wrap">
    <div class="present__container">
      <el-table
        :data="tableData"
        :empty-text="$t('您目前沒有任何訂單資訊！')"
      >
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
              <div>{{ timeFormatter(scope.row.CreateTime) }}</div>
              <div>{{ scope.row.TID }}</div>
              <template v-if="isMobile">
                <div
                  v-if="scope.row.StatusID === 1"
                  :class="tw([,
                    'text-lakeGreen',
                  ])"
                >
                  {{ scope.row.AcceptNickName }}
                </div>
                <!-- 對方未接收, StatusID: 0 -->
                <div
                  v-if="scope.row.StatusID === 0"
                  :class="tw([
                    'cursor-pointer',
                    'inline-block',
                    'bg-ordernoBtn',
                    'text-white',
                    'rounded-10px',
                    'py-4px',
                    'px-18px',
                  ])"
                  @click="setLocked(scope.row)"
                >
                  {{ $t('禮包序號') }}
                </div>
              </template>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('內容')"
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
                  scope.row.PointTypeID === 1 ? 'text-lightYellow' : 'text-violet',
                ])"
              >
                {{ $t(formatCoinLabel(scope.row.PointTypeID)) }} {{ pointFormatter(scope.row.Point) }}
              </div>
              <div>
                {{ $t('包裝費') }} {{ $t(formatCoinLabel(scope.row.PointTypeID)) }} {{ pointFormatter(scope.row.FeePoint) }}
              </div>
              <template v-if="isMobile">
                <div
                  :class="tw([
                    scope.row.StatusID === 1 ? 'text-lakeGreen' : 'text-recordMaskLockText',
                    'flex',
                    'items-center',
                  ])"
                >
                  <div
                    class="icon"
                    :class="tw([
                      'w-15px',
                      'h-15px',
                      'mr-4px',
                      'flex-shrink-0',
                      scope.row.StatusID === 1
                        ? 'bg-lakeGreen'
                        : !scope.row.MTCodeDisclosed
                          ? 'bg-recordMaskLockText'
                          : '',
                    ])"
                    :style="{
                      '-webkit-mask': scope.row.StatusID === 1 ? setStyleMaskImage(require('../images/i_tick3.svg')) : setStyleMaskImage(require('../images/i_lock.svg')),
                      'mask': scope.row.StatusID === 1 ? setStyleMaskImage(require('../images/i_tick3.svg')) : setStyleMaskImage(require('../images/i_lock.svg')),
                    }"
                  ></div>
                  <div class="text">
                    {{ scope.row.StatusID === 1 ? $t('已完成') : !scope.row.MTCodeDisclosed ? $t('保管中') : '' }}
                  </div>
                </div>
              </template>
            </div>
          </template>
        </el-table-column>
        <template v-if="!isMobile">
          <el-table-column
            :label="$t('備註')"
            align="left"
          >
            <template #="scope">
              <!-- 對方已接收, StatusID: 1 -->
              <div
                v-if="scope.row.StatusID === 1"
                :class="tw([,
                  'text-lakeGreen',
                ])"
              >
                {{ scope.row.AcceptNickName }}
              </div>
              <!-- 對方未接收, StatusID: 0 -->
              <div
                v-if="scope.row.StatusID === 0"
                :class="tw([
                  'cursor-pointer',
                  'inline-block',
                  'bg-ordernoBtn',
                  'text-white',
                  'rounded-10px',
                  'py-4px',
                  'px-18px',
                ])"
                @click="setLocked(scope.row)"
              >
                {{ $t('禮包序號') }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('狀態')"
            align="center"
          >
            <template #="scope">
              <div
                :class="tw([
                  scope.row.StatusID === 1
                    ? 'text-lakeGreen'
                    : 'text-recordMaskLockText',
                  'flex',
                  'items-center',
                ])"
              >
                <div
                  class="icon"
                  :class="tw([
                    'w-15px',
                    'h-15px',
                    'mr-4px',
                    'flex-shrink-0',
                    scope.row.StatusID === 1
                      ? 'bg-lakeGreen'
                      : !scope.row.MTCodeDisclosed
                        ? 'bg-recordMaskLockText' : '',
                  ])"
                  :style="{
                    '-webkit-mask': scope.row.StatusID === 1 ? setStyleMaskImage(require('../images/i_tick3.svg')) : setStyleMaskImage(require('../images/i_lock.svg')),
                    'mask': scope.row.StatusID === 1 ? setStyleMaskImage(require('../images/i_tick3.svg')) : setStyleMaskImage(require('../images/i_lock.svg')),
                  }"
                ></div>
                <div class="text">
                  {{ scope.row.StatusID === 1 ? $t('已完成') : !scope.row.MTCodeDisclosed ? $t('保管中') : '' }}
                </div>
              </div>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
    <viewPopup
      v-if="displayPopup"
      @close="() => { displayPopup = false }"
    >
      <template v-slot:context>
        <div class="info">
          <div
          class="present__pop__anim"
            :class="tw([
              '-mt-5',
              'text-center',
            ])"
          >
          <div ref="giftAnim"
            :class="tw([
              'w-[170px]',
              'h-auto',
              'mx-auto',
            ])"
          ></div>
          </div>
          <div
            class="text"
            v-if="choseRecordData.MTCode"
            :class="tw([
              'flex-1',
              'text-footerTipsText',
            ])"
          >
            <div
              class="title"
              :class="tw([
                'text(center)',
                'mb-4px',
              ])"
            >
              {{ $t('禮包序號') }}
            </div>
            <div
              class="context"
              :class="tw([
                'text(center)',
                'break-all',
              ])"
            >
              {{ choseRecordData.MTCode }}
            </div>
          </div>
          <div
            v-else
            class="text"
            :class="tw([
              'flex-1',
            ])"
          >
            {{ $t('禮物的序號即將轉交給您保管，請謹慎評估贈禮對象資訊，為了您的權益，勿輕易將序號贈與來路不明的玩家喔！') }}
          </div>
        </div>
      </template>
      <template v-slot:bottom>
        <div
          class="btn"
          :class="tw([
            'text-center',
          ])"
        >
          <template v-if="choseRecordData.MTCode">
            <div
              class="tips"
              :class="tw([
                'text-18px',
              ])"
            >
              {{ $t('已複製禮包序號!') }}
            </div>
          </template>
          <template v-else>
            <div
              class="btn"
              :class="tw([
                'cursor-pointer',
                'bg-depositBtn',
                'rounded-full',
                'mb-8px',
                'p-8px',
              ])"
              @click="chose(true)"
            >
              {{ $t('保管序號並查看') }}
            </div>
            <div
              class="btn"
              :class="tw([
                'cursor-pointer',
                'bg-giftBtnInactive',
                'rounded-full',
                'p-8px',
              ])"
              @click="chose(false)"
            >
              {{ $t('暫時由系統保管') }}
            </div>
          </template>
        </div>
      </template>
    </viewPopup>
  </div>
</template>

<script>
import { ref, computed, inject, watch, nextTick } from 'vue'
import store from '@/store'
import { useRoute } from 'vue-router'

import viewPopup from '@/components/popup'
import lottie from 'lottie-web'

import { useNotice } from '@/utils/use-notice'

import {
  timeFormatter,
  pointFormatter,
} from '@/utils/formatters'
import { getTransactionRecord, getDiscloseSerialNo } from '@/api/records'
import { COIN_TYPE } from '@/configs'

export default {
  name: 'present-list',

  components: {
    viewPopup,
  },

  setup () {
    const route = useRoute()
    const loading = ref(false)
    const isMobile = computed(() => store.getters['platform/isMobile'])

    // 選單變更
    const selectRangeItem = inject('selectRangeItem')
    watch(selectRangeItem, (newVal) => {
      if (Object.keys(newVal).length) handleFetch()
    })

    // 月份變更
    const selectTypeID = inject('selectTypeID')
    watch(selectTypeID, (newVal) => {
      if (['give', 'receive'].includes(newVal)) handleFetch()
    })

    const tableData = ref([])
    const handleFetch = async () => {
      if (!Object.keys(selectRangeItem.value).length || !selectTypeID.value) return false

      const inputData = {
        StartDate: selectRangeItem.value.start,
        EndDate: selectRangeItem.value.end,
        Skip: 0,
        Show: 9999,
        locale: store.state.member.languageCode,
      }

      // 判斷是贈禮還是收禮
      if (route.query.type === 'give') inputData.RecordType = 1
      else if (route.query.type === 'receive') inputData.RecordType = 2

      try {
        const res = await getTransactionRecord(inputData)
        tableData.value = res.Data
      } catch (error) {
        tableData.value = []
        useNotice({ type: 'error', message: '發生錯誤，請稍後再試，或洽客服人員' })
      } finally {
      }
    }
    handleFetch()

    const setStyleMaskImage = (url) => {
      return `url(${url}) no-repeat center /contain`
    }

    // pop
    const choseRecordData = ref(null)
    const setLocked = async (obj) => {
      choseRecordData.value = obj
      if (obj.MTCode) {
        await navigator.clipboard.writeText(obj.MTCode)
          .then(() => {
            useNotice({ type: 'success', message: '複製成功' })
          })
          .catch(() => {
            useNotice({ type: 'error', message: '複製失敗' })
          })
      }
      displayPopup.value = true
    }

    const giftAnim = ref(null)
    const displayPopup = ref(false)
    watch(displayPopup, (bool) => {
      if (bool) {
        nextTick(() => {
          lottie.loadAnimation({
            container: giftAnim.value,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: require('../images/ani_giftonly.json'),
          }).setSpeed(0.7)
        })
      }
    })

    const chose = async (bol = false) => {
      if (loading.value) return false

      if (!bol) {
        displayPopup.value = false
        return false
      }

      try {
        loading.value = true
        await getDiscloseSerialNo({ TID: choseRecordData.value.TID })
        await handleFetch()
      } catch (err) {
        const errorCodeList = {
        }
        const errorMessage = errorCodeList[err.Code] ?? '發生錯誤，請稍後再試，或洽客服人員'
        useNotice({ type: 'error', message: errorMessage })
      } finally {
        loading.value = false
        displayPopup.value = false
      }
    }

    const formatCoinLabel = (id) => {
      const target = COIN_TYPE.find(item => item.id === id)
      return target?.label ?? id
    }

    return {
      // data
      route,
      tableData,
      giftAnim,
      // fn
      pointFormatter,
      timeFormatter,
      setStyleMaskImage,
      setLocked,
      displayPopup,
      choseRecordData,
      chose,
      isMobile,
      formatCoinLabel,
    }
  },
}
</script>

<template>
  <teleport to="body">
    <div class="record__wrap" :class="tw(['fixed top-0 left-0', 'z-30', 'w-screen', 'h-screen', 'bg-eventMaskBg'])">
      <div
        class="record__window"
        :class="
          tw([
            'absolute top-1/2 left-1/2 transform -translate-1/2',
            'z-30',
            'w-11/12',
            'h-5/6',
            'tablet:w-4/5',
            'tablet:h-5/6',
            'pt-4',
            'pb-3',
            'px-2.5',
            'tablet:py-6',
            'tablet:px-12',
            'bg-popupBg',
            'rounded-xl',
            'flex',
            'flex-col'
          ])
        "
      >
        <div
          class="record__close"
          :class="tw(['cursor-pointer', 'w-20px', 'h-20px', 'bg-white', 'absolute', 'top-7', 'right-7'])"
          :style="{
            '-webkit-mask': setStyleMaskImage(require('./images/i_close.svg')),
            mask: setStyleMaskImage(require('./images/i_close.svg'))
          }"
          @click="close"
          v-audio="'close'"
        ></div>
        <h3 :class="tw(['text(center white lg)'])">{{ $t('轉移紀錄') }}</h3>
        <!-- 篩選收合區塊 -->
        <div
          class="filter__block"
          :class="
            tw([
              isFilterExpand ? 'h-60 tablet:h-40' : 'h-0',
              'overflow-hidden',
              'transform',
              'transition-all',
              isFilterExpand ? 'duration-150' : 'duration-100',
              'ease-in',
              'mt-3',
              'px-2',
              'tablet:px-0',
              'w-full',
              'text(white base)',
              'tablet:text(sm)'
            ])
          "
        >
          <label :class="tw(['tablet:inline-block'])">
            {{ $t('轉移時間') }}
            <br />
            <p :class="tw(['w-full', 'tablet:w-auto', 'flex', 'items-end', 'justify-between', 'tablet:justify-start'])">
              <el-config-provider :locale="datePickerLocale">
                <el-date-picker
                  v-model="dateRange[0]"
                  type="date"
                  placeholder="yyyy/mm/dd"
                  popper-class="date__range__box"
                  :editable="false"
                  :disabled-date="disabledStartDate"
                  @change="onPickDate"
                ></el-date-picker>
              </el-config-provider>
              <!-- 分隔icon -->
              <img src="./images/i_arrow_right.svg" class="arrow_right" :class="tw(['w-3', 'mb-3', 'tablet:mx-3'])" />
              <el-config-provider :locale="datePickerLocale">
                <el-date-picker
                  v-model="dateRange[1]"
                  type="date"
                  placeholder="yyyy/mm/dd"
                  popper-class="date__range__box"
                  :editable="false"
                  :disabled-date="disabledEndDate"
                  @change="onPickDate"
                ></el-date-picker>
              </el-config-provider>
            </p>
          </label>
          <!-- 下排 -->
          <div :class="tw(['w-full', 'my-3', 'tablet:flex'])">
            <!-- 轉出/轉入 -->
            <div :class="tw(['w-full', 'tablet:w-auto', 'flex', 'items-end', 'justify-between'])">
              <label class="wallet__from" :class="tw(['w-5/12', 'tablet:w-auto'])">
                {{ $t('轉出錢包') }}
                <br />
                <el-select
                  class="selector__button"
                  v-model="option.from"
                  popper-class="select__box select__box__from"
                  :class="tw(selectorStyle)"
                >
                  <el-option class="selector__before" disabled :value="false">
                    {{ $t('請選擇轉出錢包') }}
                  </el-option>
                  <el-option
                    class="selector__button"
                    v-for="w in walletList"
                    :key="w.id"
                    :value="w.id"
                    :label="w.name"
                  ></el-option>
                </el-select>
              </label>
              <!-- 分隔icon -->
              <img
                src="./images/i_arrow_right.svg"
                class="arrow_right"
                :class="tw(['w-3', 'mb-3', 'tablet:ml-2', 'tablet:mr-3'])"
              />
              <label class="wallet__to" :class="tw(['w-5/12', 'tablet:w-auto'])">
                {{ $t('轉入錢包') }}
                <br />
                <el-select
                  class="selector__button"
                  v-model="option.to"
                  popper-class="select__box select__box__to"
                  :class="tw(selectorStyle)"
                >
                  <el-option class="selector__before" disabled :value="false">
                    {{ $t('請選擇轉入錢包') }}
                  </el-option>
                  <el-option
                    class="selector__button"
                    v-for="w in walletList.filter(item => option.from === -1 || item.id !== option.from)"
                    :key="w.id"
                    :value="w.id"
                    :label="w.name"
                  >
                    {{ w.name }}
                  </el-option>
                </el-select>
              </label>
            </div>
            <div :class="tw(['ml-auto', 'flex', 'justify-between', 'items-end'])">
              <label :class="tw(['mt-3', 'tablet:mt-0', 'w-5/12'])">
                {{ $t('幣別') }}
                <br />
                <el-select
                  :class="tw([`${selectorStyle} tablet:w-24`, 'w-5/12'])"
                  v-model="option.coin"
                  :placeholder="$t('全部')"
                  popper-class="select__box select__box__coin"
                >
                  <el-option class="selector__before" disabled :value="false">
                    {{ $t('請選擇幣別') }}
                  </el-option>
                  <el-option class="selector__button" v-for="c in coins" :key="c.id" :value="c.id" :label="$t(c.name)">
                    {{ $t(c.name) }}
                  </el-option>
                </el-select>
              </label>
              <button
                :class="
                  tw([
                    'inline-block',
                    'align-baseline',
                    'ml-1',
                    'w-5/12',
                    'tablet:w-28',
                    'h-10',
                    'bg-recordSearchBtn',
                    'rounded'
                  ])
                "
                @click="update"
              >
                {{ $t('搜索') }}
                <img src="/img/icons/i_m_view.svg" :class="tw(['inline-block', 'ml-3'])" />
              </button>
            </div>
          </div>
        </div>
        <!-- 展開按鈕 -->
        <button
          :class="
            tw([
              'btn-switch-filter-block',
              'bg-sort',
              'rounded-full',
              'text-white',
              'text-base',
              'tablet:text-base',
              'tablet:w-full',
              'h-10',
              'tablet:h-8',
              'flex',
              'items-center',
              'justify-center'
            ])
          "
          @click.stop="isFilterExpand = !isFilterExpand"
        >
          <img
            src="./images/i_arrow_d.svg"
            :class="tw(['mr-2', 'tablet:mr-4', 'origin-center transform', isFilterExpand ? 'rotate-0' : 'rotate-180'])"
          />
          <span>{{ $t(isFilterExpand ? '收起篩選' : '展開篩選') }}</span>
        </button>
        <!-- 表格內容 -->
        <div
          class="record__table"
          ref="tableWrap"
          :class="tw(['mt-5', 'text(white base)', 'flex-1', 'overflow-y-scroll'])"
        >
          <el-table ref="table" style="width: 100%;" :empty-text="$t('查詢結果為空')" :data="renderData">
            <el-table-column :label="$t('日期')" min-width="30%" header-align="center">
              <template #default="scope">
                <div>{{ scope.row.time }}</div>
                <div :class="tw([scope.row.currency === 'gold' ? 'text-lightYellow' : 'text-recordTableSilver'])">
                  {{ $t('幣別') }}:{{ $t(scope.row.currencyText) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('轉移')" min-width="40%" header-align="center" align="left">
              <template #default="scope">
                <div :class="tw(['break-words'])">
                  <span :class="tw(['whitespace-nowrap'])">{{ scope.row.fromWallet }}&nbsp;>&nbsp;</span>
                  <span :class="tw(['whitespace-nowrap'])">{{ scope.row.toWallet }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('內容')" min-width="30%" header-align="center" align="right">
              <template #default="scope">
                <div :class="tw(['mr-1'])">{{ pointFormatter(scope.row.amount) }}</div>
                <div
                  :class="
                    tw([
                      'border-1',
                      'rounded',
                      'inline-block',
                      'mt-1',
                      'mr-1',
                      'px-1',
                      'tablet:px-6',
                      'text-sm',
                      scope.row.result === -1 ? 'border-gray-500 text-gray-500' : '',
                      scope.row.result === 0 ? 'border-lakeGreen text-lakeGreen' : '',
                      scope.row.result === 1 ? 'border-red-500 text-red-500' : ''
                    ])
                  "
                >
                  {{ $t(resultTag(scope.row.result).label) }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 翻頁 -->
        <div class="page-btn" :class="tw(['flex', 'justify-center', 'pt-2'])">
          <button
            :class="
              tw([
                'transform rotate-180',
                'bg-recordPager',
                'rounded-full',
                'w-7',
                'h-7',
                'flex',
                'justify-center',
                'items-center',
                'disabled:bg-recordPagerDisabled',
                'disabled:filter disabled:brightness-50'
              ])
            "
            :disabled="pager.current === 1"
            @click="pager.flipBackward"
          >
            <img src="./images/i_arrow01_right.svg" :class="tw('w-2')" />
          </button>
          <p :class="tw(['px-3', 'text-white'])">{{ pager.current }} / {{ pager.total }}</p>
          <button
            :class="
              tw([
                'bg-recordPager',
                'rounded-full',
                'w-7',
                'h-7',
                'flex',
                'justify-center',
                'items-center',
                'disabled:bg-recordPagerDisabled',
                'disabled:filter disabled:brightness-50'
              ])
            "
            :disabled="pager.total === 0 || pager.current === pager.total"
            @click="pager.flipForward"
          >
            <img src="./images/i_arrow01_right.svg" :class="tw('w-2')" />
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
  import { ref, reactive, nextTick, watch, computed, onMounted, onUnmounted } from 'vue'
  import request from '@/api/request'
  import { postWalletTransferRecord } from '@/api/wallet'
  import store from '@/store'
  import { COIN_TYPE } from '@/configs'
  import { RECORD_STATUS, PAGER_PER } from './configs'
  import { ELEMENT_PLUS_LOCALE } from '@/configs/element_plus'
  import './style.scss'
  import dayjs from 'dayjs'
  import { useI18n } from 'vue-i18n'
  import { pointFormatter } from '@/utils/formatters'
  dayjs.extend(require('dayjs/plugin/localeData'))
  dayjs.extend(require('dayjs/plugin/utc'))
  dayjs.extend(require('dayjs/plugin/timezone'))
  dayjs.tz.setDefault('Asia/Taipei')
  dayjs.extend(require('dayjs/plugin/isBetween'))

  export default {
    name: 'record',

    setup() {
      const isFilterExpand = ref(false)
      const loading = ref(false)
      const shouldFetch = ref(false)
      const { t } = useI18n()
      const walletList = computed(() => {
        if (!store.state.wallet.walletList) return []
        const target = Object.values(store.state.wallet.walletList).flat()
        return target.reduce((acc, cur, index) => {
          // 初始新增全部選項
          if (index === 0) acc.push({ name: t('全部'), id: -1 })

          // 過濾掉重複項目
          if (acc.map(item => item.id).includes(cur.WalletID)) return acc

          return acc.concat({ id: cur.WalletID, name: cur.WalletName })
        }, [])
      })

      // 選中參數
      const option = reactive({
        coin: 0,
        from: walletList.value[0].id,
        to: walletList.value[0].id
      })
      // 參數項目
      const coins = COIN_TYPE.reduce(
        (accumulator, currentValue) => {
          return accumulator.concat({
            id: currentValue.id,
            name: currentValue.label
          })
        },
        [{ id: 0, name: '全部' }]
      )

      const table = ref(null)
      const tableWrap = ref(null)
      const dateRange = ref([
        dayjs()
          .subtract(31, 'd')
          .format(),
        dayjs().format()
      ])

      const disabledStartDate = time => {
        const now = dayjs()
        const end = dayjs(dateRange.value[1])
          .subtract(1, 'day')
          .endOf('day')
        const begin = dayjs(now)
          .subtract(1, 'month')
          .startOf('day')
        return !dayjs(time).isBetween(begin, end, 'd', '[]')
      }
      const disabledEndDate = time => {
        const now = dayjs()
        const begin = dayjs(dateRange.value[0])
          .subtract(-1, 'day')
          .endOf('day')
        const lastSecond = now
          .hour(23)
          .minute(59)
          .second(59)
        return !dayjs(time).isBetween(begin, lastSecond, 'd', '[]')
      }
      const onPickDate = () => {
        const now = dayjs()
        const start = now.subtract(31, 'd')
        if (!dayjs(dateRange.value[0]).isBetween(start, now, 'd')) dateRange.value[0] = now.subtract(31, 'd')
        if (!dayjs(dateRange.value[1]).isBetween(start, now, 'd')) dateRange.value[1] = now
        if (dayjs(dateRange.value[0]).isAfter(dateRange.value[1]))
          dateRange.value = [dateRange.value[1], dateRange.value[0]]
      }

      const pager = ref({
        per: PAGER_PER,
        current: 1,
        total: 0,
        flipForward: function() {
          if (this.current < this.total) {
            this.current++
            tableWrap.value.scrollTop = 0
          }
        },
        flipBackward: function() {
          if (this.current > 1) {
            this.current--
            tableWrap.value.scrollTop = 0
          }
        }
      })
      const recordData = ref([])
      const walletTransferRecord = async () => {
        try {
          const input = {
            pointTypeID: option.coin,
            fromWalletID: option.from,
            toWalletID: option.to,
            sDate: dayjs()
              .subtract(31, 'd')
              .format(),
            eDate: dayjs().format()
          }
          const res = await postWalletTransferRecord(input)
          recordData.value = res.Data || []
          shouldFetch.value = false
        } catch (e) {
          recordData.value = []
          shouldFetch.value = true
        }
      }

      const renderData = ref([])
      const update = async () => {
        if (loading.value) return
        loading.value = true

        if (shouldFetch.value) await walletTransferRecord()

        renderData.value = recordData.value?.reduce((accumulator, currentValue) => {
          if (
            !dayjs(currentValue.CreateTime).isBetween(
              dateRange.value[0],
              dayjs(dateRange.value[1])
                .hour(23)
                .minute(59)
                .second(59)
            )
          )
            return accumulator
          if (option.coin !== 0 && option.coin !== currentValue.PointTypeID) return accumulator

          return accumulator.concat({
            time: dayjs(currentValue.CreateTime).format('YYYY/MM/DD HH:mm:ss'),
            currencyText: COIN_TYPE.find(item => item.id === currentValue.PointTypeID).label,
            currency: COIN_TYPE.find(item => item.id === currentValue.PointTypeID).type,
            fromWallet: currentValue.FromWalletName,
            toWallet: currentValue.ToWalletName,
            amount: currentValue.ChangePoint,
            result: currentValue.StatusID
          })
        }, [])

        pager.value.current = 1
        pager.value.total = Math.ceil(renderData.value.length / pager.value.per)

        // 收合篩選區域
        isFilterExpand.value = false
        tableWrap.value.scrollTop = 0
        loading.value = false
      }

      const resultTag = resultId => {
        return {
          type: RECORD_STATUS[resultId].type,
          label: RECORD_STATUS[resultId].label
        }
      }

      const setStyleMaskImage = url => {
        return `url(${url}) no-repeat center /contain`
      }

      const close = () => {
        store.dispatch('wallet/setEnableRecord', false)
      }

      watch(
        () => ({ ...option }),
        (newValue, oldValue) => {
          if (newValue.from !== oldValue.from || newValue.to !== oldValue.to) shouldFetch.value = true
          if (option.from !== -1 && option.from === option.to) {
            option.to = walletList.value[0].id
            shouldFetch.value = true
          }
        }
      )

      onMounted(async () => {
        await walletTransferRecord()
        update()
        nextTick(() => {
          document.body.style.overflow = 'hidden'
        })
      })
      onUnmounted(() => {
        document.body.style.overflow = ''
      })

      const lang = computed(() => store.state.member.languageCode)
      const datePickerLocale = ELEMENT_PLUS_LOCALE(lang.value)
      return {
        datePickerLocale,
        option,
        tableWrap,
        table,
        coins,
        walletList,
        selectorStyle: 'mt-1 mr-1 w-full tablet:w-36 h-10 rounded',
        dateRange,
        isFilterExpand,
        recordData,
        renderData: computed(() =>
          renderData.value.filter((item, index) => {
            const rangeEnd = pager.value.per * pager.value.current
            const rangeStart = rangeEnd - pager.value.per
            return index + 1 > rangeStart && index + 1 <= rangeEnd
          })
        ),
        pager,
        // fn
        disabledStartDate,
        disabledEndDate,
        onPickDate,
        close,
        setStyleMaskImage,
        update,
        resultTag,
        pointFormatter
      }
    }
  }
</script>

<style lang="scss" scoped>
  :deep(.el-table) {
    color: #fff;
    background: transparent;

    &::before {
      background: transparent;
    }

    th,
    th.is-leaf {
      padding: 0 3px;
      font-size: 14px;
      font-weight: 300;
      color: #fff;
      background: transparent;
      border: 0;

      .cell {
        background: #39334b;
        border-radius: 3px;
      }
    }

    tr {
      background: transparent;

      &:hover > td {
        background: transparent;
      }

      td {
        font-size: 0.875rem;
        line-height: 1.25rem;
        border-bottom: 0.75px dashed #51455e;
      }
    }

    .el-table__body tr.hover-row > td,
    .el-table__body tr:hover > td {
      background: transparent;
    }

    .el-table__empty-text {
      width: 100%;
    }
  }

  // el-select
  :deep(.el-input) {
    ::selection {
      background: none;
    }

    .el-input__inner {
      width: 100%;
      color: #fff;
      background: #51455e;
      border: none;
    }

    &.is-focus {
      .el-input__inner {
        background: #3d215b;
      }
    }

    .el-input__suffix {
      .el-input__suffix-inner {
        pointer-events: none;

        i.el-select__caret {
          &::before {
            content: '';
            position: absolute;
            top: 50%;
            right: 10px;
            transform: translate(8px, -10px);
            width: 0;
            border: 6px solid white;
            border-color: transparent transparent white transparent;
            pointer-events: none;
          }
        }
      }
    }
  }

  // el-date-picker
  :deep(.el-date-editor--date) {
    &.el-date-editor {
      width: 41.666667%;
      height: 2.5rem;
      background: #51455e;
      border-radius: 0.25rem;
      cursor: pointer;
    }

    .el-input__inner {
      padding: 0 10px 0 0;
      text-align: center;
    }

    .el-icon-date::before {
      display: none;
    }

    &.el-date-editor--daterange.is-active {
      input.el-range-input {
        background: #3d215b;
      }
    }

    .el-range-input {
      margin-top: 0.25rem;
      font-size: 1rem;
      color: #fff;
      line-height: 1.5rem;
      background: transparent;
    }

    @media all and (min-width: 768px) {
      &.el-input__inner {
        height: 2.5rem;
      }

      input.el-range-input {
        width: 12rem;
      }
    }
  }
</style>

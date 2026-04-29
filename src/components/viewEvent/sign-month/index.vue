<template>
  <Content>
    <template v-slot:board>
      <div
        class="month__wrap"
        v-if="!loading"
        :class="tw(['relative', 'w-full', 'flex', 'flex-col', 'items-center', 'justify-center'])"
      >
        <div
          class="event__bg"
          :class="
            tw([
              'block',
              'h-auto',
              'w-auto',
              'object-contain',
              'mt-[2svh]',
              'rounded-t-xl',
              'bg-white',
              'max-w-[96svw]',
              'sm:max-w-[600px]'
            ])
          "
        >
          <div
            class="month__container"
            :class="
              tw([
                'flex',
                'flex-col',
                'items-center',
                'justify-center',
                'max-w-[464px]',
                'w-full',
                'my-1',
                'xs:my-2',
                'md:my-7',
                'xs:px-3',
                'md:px-8',
                'top-[3svh]',
                'xs:top-[5svh]',
                'md:top-[8svh]'
              ])
            "
          >
            <div
              class="event__weekend"
              :class="
                tw([
                  'grid',
                  'grid-cols-7',
                  'gap-1px',
                  'md:gap-4px',
                  'auto-cols-fr',
                  'mb-4px',
                  'text-14px',
                  'text-[#A1A1A1]',
                  'text-center'
                ])
              "
            >
              <div
                class="event__day"
                v-for="(count, index) of 7"
                :key="count"
                :class="tw(['h-auto', 'w-[40px]', 'xs:w-[45px]', 'md:w-[60px]'])"
              >
                {{ formatDayLabel[index] }}
              </div>
            </div>
            <div class="event__list" :class="tw(['grid', 'grid-cols-7', 'gap-1px', 'md:gap-4px', 'auto-cols-fr'])">
              <Item v-for="(item, index) of dayList" :key="index" :item="item" />
            </div>
          </div>
        </div>
        <div
          class="signin__bg"
          :class="
            tw([
              'block',
              'h-auto',
              'w-full',
              'object-contain',
              'rounded-b-xl',
              'bg-[#DCDCDC]',
              'max-w-[96svw]',
              'sm:max-w-[600px]',
              'mb-4',
              'md:mb-5',
              'flex',
              'flex-col',
              'items-center',
              'justify-center'
            ])
          "
        >
          <div
            class="signin__tips"
            :class="
              tw([
                'h-auto',
                'text-12px',
                'md:text-16px',
                'text-[#515151]',
                'text-center',
                'flex',
                'items-center',
                'justify-center',
                'mt-2.5',
                'mb-5'
              ])
            "
          >
            ※{{ $t('簽到與活動重置時間為每日 AM6:00') }}
          </div>
          <div
            class="signin__button__constainer"
            :class="
              tw([
                'h-auto',
                'flex',
                'w-full',
                'items-end',
                'justify-center',
                'mb-[-20px]',
                'px-3',
                'xs:px-5',
                'md:px-0'
              ])
            "
          >
            <div
              class="signin__button__item"
              :class="
                tw([
                  'cursor-pointer',
                  'bg-[#9B564E]',
                  'rounded-full',
                  'w-full',
                  'max-w-[160px]',
                  'md:max-w-[170px]',
                  'p-3',
                  'text(white 16px center)'
                ])
              "
              @click="closeEvent"
            >
              {{ $t('關閉') }}
            </div>
            <div
              class="signin__button__item"
              :class="
                tw([
                  'cursor-pointer',
                  isSignToday ? 'bg-[#505050]' : 'bg-ordernoBtn',
                  'rounded-full',
                  'w-full',
                  'max-w-[160px]',
                  'md:max-w-[170px]',
                  'p-3',
                  'text(white 16px center)',
                  'ml-5',
                  'md:ml-7'
                ])
              "
              @click="action"
            >
              {{ $t(isSignToday ? '已領取' : '簽到') }}
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:mask>
      <Popup v-if="!loading && Object.keys(rewardObject).length" :reward="rewardObject" />
    </template>
  </Content>
</template>

<script>
  import store from '@/store'
  import { ref, computed, inject, provide } from 'vue'

  import Content from '../content'
  import Popup from './popup'
  import Item from './item'

  import { TODAY } from '@/configs'
  import { EVENT_GA_VALUE, MONTH_SIGN_VALUE } from './config'
  import { useNotice } from '@/utils/use-notice'
  import { getActivityNormalSignInMonthList, postActivityNormalSignInMonth } from '@/api/event'
  import dayjs from 'dayjs'
  import { event } from 'vue-gtag-next'
  import weekday from 'dayjs/plugin/weekday'

  dayjs.extend(weekday)

  const name = 'sign-month'

  export default {
    name,

    components: {
      Content,
      Popup,
      Item
    },

    setup() {
      const isMobile = computed(() => store.getters['platform/isMobile'])
      const formatDayLabel = ref(['一', '二', '三', '四', '五', '六', '日'])

      const enableContainer = inject('enableContainer')
      const getActivityRedDotAction = inject('getActivityRedDotAction')
      const specify = computed(() => store.state.event.specify)
      const close = inject('close')
      const closeEvent = () => {
        close(name)
      }

      // 禮包陣列包
      const inputData = {
        Month: MONTH_SIGN_VALUE
      }
      const activityNormalSignInMonthList = ref({})
      const actionActivityNormalSignInMonthList = () => {
        return getActivityNormalSignInMonthList(inputData)
          .then(res => {
            activityNormalSignInMonthList.value = res.Data
          })
          .catch(() => {
            // 當進入錯誤時則先關閉當前活動。
            closeEvent()
          })
      }

      const formatNormalSignInMonthList = computed(() => {
        if (!activityNormalSignInMonthList.value || !Object.keys(activityNormalSignInMonthList.value).length) return {}

        const target = activityNormalSignInMonthList.value.reduce((acc, cur) => {
          if (!acc[cur.Days]) {
            acc[cur.Days] = {
              createDay: cur.CreateDay,
              days: cur.Days,
              isSignIn: cur.IsSignIn,
              signInTime: cur.SignInTime,
              bonusList: []
            }
          }

          acc[cur.Days].bonusList.push({
            bonusNumber: cur.BonusNumber,
            bonusType: cur.BonusType,
            bonusTypeID: cur.BonusTypeID
          })

          return acc
        }, {})

        return target
      })

      const isSignToday = computed(() => {
        if (!formatNormalSignInMonthList.value || !Object.keys(formatNormalSignInMonthList.value).length) return false

        // 簽到範圍為當日的早上6:00至隔日的5:59
        const signDay = TODAY.subtract(6, 'hour').format('YYYY-MM-DD')
        const todayObj = Object.values(formatNormalSignInMonthList.value).find(
          item => dayjs(item.createDay).format('YYYY-MM-DD') === signDay
        )
        return todayObj?.isSignIn || false
      })

      const actionLoading = ref(false)
      const action = async () => {
        if (actionLoading.value) return false
        actionLoading.value = true
        await actionPostActivityNormalSignInMonth()
        actionLoading.value = false
      }

      const closeReward = () => {
        rewardObject.value = {}
      }
      provide('closeReward', closeReward)

      const loading = ref(false)
      const init = async () => {
        loading.value = true

        if (specify.value) event('event_show', { event: EVENT_GA_VALUE })

        await actionActivityNormalSignInMonthList()
        for (const item of Object.values(formatNormalSignInMonthList.value)) {
          if (!TODAY.isSame(item.createDay, 'day')) continue
          if (item.signInTime === '') break
          else if (!specify.value) closeEvent()
        }
        enableContainer.value = true
        loading.value = false
      }
      init()

      // 簽到
      const rewardObject = ref({})
      const actionPostActivityNormalSignInMonth = async () => {
        if (isSignToday.value) {
          closeEvent()
          return false
        }

        const list = formatNormalSignInMonthList.value
        if (!Object.keys(list).length) return false

        await postActivityNormalSignInMonth(inputData)
          .then(res => {
            rewardObject.value = res.Data.GiftContent
          })
          .catch(err => {
            // 已簽到過(code 4001)則不顯示任何提示。
            if (err.Code === '4001') return false

            const errorCodeList = {
              416: '簽到日期有誤'
            }
            const errorMessage = errorCodeList[err.Code] ?? '發生錯誤，請稍後再試，或洽客服人員'
            useNotice({ type: 'error', message: errorMessage })
          })
        await getActivityRedDotAction()
        await actionActivityNormalSignInMonthList()
      }

      const dayList = computed(() => {
        // 當月日期
        const dayList = []
        const dayLength = parseInt(
          TODAY.add(1, 'month')
            .date(0)
            .format('D')
        )
        for (let index = 0; index < dayLength; index++) {
          const label = index + 1
          dayList.push({
            label: label,
            ...formatNormalSignInMonthList.value[label]
          })
        }

        // 前一個月日期
        const dayBeforeList = []
        const dayFirstWeekendIndex =
          TODAY.date(1).weekday() - 1 > -1 ? TODAY.date(1).weekday() - 1 : 7 + TODAY.date(1).weekday() - 1
        const dayBeforeMonthLastCount = TODAY.date(0).format('D')
        for (let index = 0; index < dayFirstWeekendIndex; index++)
          dayBeforeList.push({ label: parseInt(dayBeforeMonthLastCount) - index })

        // 下個月日期
        const dayAfterList = []
        const dayLastWeekendIndex =
          7 -
          TODAY.add(1, 'month')
            .date(0)
            .weekday()
        const dayAfterMonthFirstCount = TODAY.add(1, 'month')
          .date(1)
          .format('D')
        for (let index = 0; index < dayLastWeekendIndex; index++)
          dayAfterList.push({ label: index + parseInt(dayAfterMonthFirstCount) })
        const target = [...dayBeforeList.reverse(), ...dayList, ...dayAfterList]
        return target
      })

      return {
        isMobile,
        rewardObject,
        formatNormalSignInMonthList,
        isSignToday,
        loading,
        dayList,
        formatDayLabel,
        // fn
        action,
        closeEvent
      }
    }
  }
</script>

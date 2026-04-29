<template>
  <teleport to="body">
    <div
      class="event__entry"
      v-if="event"
      :class="
        tw([
          'fixed',
          'w-full',
          'h-full',
          'w-full',
          'md:top-0',
          'overflow-x-hidden',
          'overflow-y-auto',
          'max-h-[100svh]',
          'flex',
          'items-center',
          'justify-center',
          openState ? 'visible' : 'invisible'
        ])
      "
    >
      <div
        class="event__mask"
        :class="tw(['absolute', 'top-0', 'left-0', 'w-full', 'h-full', 'bg-eventMaskBg'])"
        @click="close(event)"
      ></div>
      <!-- 活動 -->
      <div class="event__container" :class="tw(['relative', 'w-full', 'flex', 'items-center', 'justify-center'])">
        <div
          class="event__view"
          :class="
            tw([
              'relative',
              'h-full',
              'w-full',
              'md:top-0',
              'max-h-[100svh]',
              'flex',
              'items-center',
              'justify-center',
              'flex-col',
              'items-center',
              'min-w-[300px]',
              'min-h-[300px]'
            ])
          "
          @click.self="close(event)"
        >
          <viewSwitch v-if="specify" />
          <component :is="event" :newsList="newsList" />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
  import { ref, watch, computed, provide, onBeforeUnmount } from 'vue'
  import store from '@/store'

  import viewSwitch from './switch'
  import Seven from './seven'
  import Billboard from './billboard'
  import SignMonth from './sign-month'
  import { MONTH_SIGN_VALUE } from './sign-month/config'
  import { TODAY } from '@/configs'
  import dayjs from 'dayjs'
  import weekOfYear from 'dayjs/plugin/weekYear'
  import { cloneDeep } from 'lodash'

  dayjs.extend(weekOfYear)

  export default {
    name: 'view-event',

    components: {
      viewSwitch,
      Seven,
      Billboard,
      SignMonth
    },

    setup() {
      const pointer = ref(-1)
      const news = computed(() => store.state.event.news)
      const lang = computed(() => store.state.member.languageCode)
      const todayDate = computed(() => dayjs().format('YYYY-MM-DD'))
      const isMobile = computed(() => store.getters['platform/isMobile'])

      const specify = computed(() => store.state.event.specify)
      const event = computed(() => {
        return eventList.value[pointer.value]?.id || ''
      })
      const info = computed(() => store.state.member.info ?? {})
      const isAllowedMember = computed(() => Object.keys(info.value).length > 0 && !info.value?.IsGuest)
      const openState = computed(() => (eventList.value?.length ? store.state.event.openState : false))
      const page = computed(() =>
        store.state.platform.page ? (store.state.platform.page === 'home' ? '/' : `/${store.state.platform.page}`) : ''
      )
      const enableContainer = ref(false)
      provide('enableContainer', enableContainer)
      watch(enableContainer, bol => {
        store.dispatch('event/setOpenState', bol)
      })

      watch(lang, async (n, o) => {
        await setNewsData(n)
      })

      const setNewsData = async () => {
        const payload = {
          lang: lang.value,
          isMobile: isMobile
        }
        await store.dispatch('event/setNews', payload)
      }

      const newsList = ref([])
      // 換頁監聽訊息
      watch(page, async (newValue, oldValue) => {
        if (!oldValue) {
          await setNewsData()
        }
        // 過濾佈告欄是否有訊息，和是否有此頁資料
        if (!Object.keys(news.value).length || !news.value[newValue]) return
        newsList.value = await getNewList(newValue)
        const openIndex = () => {
          let data = eventList.value

          if (!data.length) return -1

          data = specify.value
            ? data.findIndex(item => item.id === specify.value) ?? -1
            : data.findIndex(item => item.autoOpen) ?? -1
          return data
        }
        const OpenState = () => {
          if (newsList.value.length) {
            store.dispatch('event/setOpenState', true)
          }
        }

        pointer.value = await openIndex()
        await OpenState()
      })

      /**
       * 彈跳佈告欄顯示清單
       * @param {string} page 執行頁面
       */
      const getNewList = async (page = '/') => {
        // 判斷今日是否顯示彈窗
        const hideUntil = localStorage.getItem('hideBillboardUntil')
        const today = new Date().toISOString().split('T')[0]

        // 尚未過期 → 不顯示
        if (hideUntil && today < hideUntil) return []
        // 過期 → 顯示
        else localStorage.removeItem('hideBillboardUntil')

        // 取得符合此頁面的資料
        const originList = [...news.value[page]]

        // 判斷是否顯示個別資料
        const STORAGE_EVENTID_KEY = 'hideBillboardEventList'
        let hideIdList = []
        try {
          const storeHideList = JSON.parse(localStorage.getItem(STORAGE_EVENTID_KEY) || '[]')
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          hideIdList = storeHideList.filter(item => {
            const showDate = new Date(item.showAgainDate)
            return showDate >= today
          })
          localStorage.setItem(STORAGE_EVENTID_KEY, JSON.stringify(hideIdList))
        } catch (error) {
          console.error('解析 localStorage 數據失敗:', error)
          localStorage.removeItem(STORAGE_EVENTID_KEY)
          hideIdList = []
        }
        if (!hideIdList.length) return originList

        const newList = originList.filter(item => !hideIdList.some(h => Number(h.id) === item.NewsId))
        return newList
      }

      const eventList = computed(() => {
        const list = store.state.event.eventList
        // 七日簽到活動
        const defaultList = []

        // todo 優化：原先是一天取得一次訊息，目前調整為切換頁面取得訊息，會導致每次切換頁面都會呼叫API，可考慮調整為一天呼叫一次API，或重構將每日簽到與彈跳視窗拆開
        // if (isAllowedMember.value) {
        //   defaultList.push({
        //     id: 'seven',
        //     autoOpen: true,
        //   })
        // }

        if (newsList.value.length) {
          defaultList.push({
            id: 'billboard',
            autoOpen: true
          })
        }

        const hasMonthKey = list.findIndex(item => item.id === 'sign-month')
        if (!MONTH_SIGN_VALUE && hasMonthKey !== -1) list.splice(hasMonthKey, 1)
        return specify.value ? list : defaultList.concat(list).reverse()
      })
      provide('eventList', eventList)

      const storeDate = item => {
        let newDate = ''
        const now = new Date()
        switch (item.TriggerType) {
          case 'Once':
            // 給一個以後不再出現的日期
            newDate = '3000-12-12'
            break
          case 'Daily':
            now.setDate(now.getDate() + 1)
            newDate = now.toISOString().split('T')[0]
            break
          case 'Weekly':
            now.setDate(now.getDate() + 7)
            newDate = now.toISOString().split('T')[0]
            break
          case 'Monthly':
            now.setMonth(now.getMonth() + 1)
            newDate = now.toISOString().split('T')[0]
            break
          case 'EveryTime':
            newDate = ''
            break
        }
        return newDate
      }

      // 全部關閉
      const close = (e, isTodayRead = null) => {
        // 如果送入的關閉與當前不相同則直接跳出
        if (e !== event.value) return false

        // 將並非每日出現的newsID進行存儲處理
        // 判斷是否顯示個別資料
        const STORAGE_EVENTID_KEY = 'hideBillboardEventList'
        const today = new Date().toISOString().split('T')[0]
        let keyIdList = []
        try {
          keyIdList = JSON.parse(localStorage.getItem(STORAGE_EVENTID_KEY) || '[]')
        } catch (error) {
          console.error('解析 localStorage 數據失敗:', error)
          localStorage.removeItem(STORAGE_EVENTID_KEY)
          keyIdList = []
        }
        newsList.value.forEach(item => {
          const idx = keyIdList.findIndex(k => k.id === item.NewsId)
          const existing = keyIdList[idx]
          const expired = existing && existing.showAgainDate <= today
          // 若不存在或已過期才更新下次顯示日期
          if (isTodayRead === true && (!existing || expired)) {
            if (expired) keyIdList.splice(idx, 1)
            const newDate = storeDate(item)
            if (newDate) keyIdList.push({ id: item.NewsId, showAgainDate: newDate })
          } else {
            // console.log('略過：今日不顯示/已有儲存且日期未到')
          }
        })
        localStorage.setItem(STORAGE_EVENTID_KEY, JSON.stringify(keyIdList))

        store.dispatch('event/setOpenState', false)
        pointer.value = 0
      }
      provide('close', close)

      watch(specify, newVal => {
        if (newVal) {
          getActivityRedDotAction()
          const index = eventList.value.findIndex(item => item.id === newVal)
          if (parseInt(index) !== 'NaN' && index !== -1) pointer.value = index

          // 當指定活動為包含在list內
          if (!event.value) {
            store.commit('event/UNSET_EVENT')
            store.dispatch('event/setOpenState', false)
            const openIndex = eventList.value.findIndex(item => item.autoOpen)
            pointer.value = openIndex
          }
        }
      })

      watch(eventList, () => {
        getActivityRedDotAction()
      })

      // 再次刷新活動狀態時間點(主要為了在跨活動時間時可以正常彈出提示視窗)
      const date = ref(null)
      const timer = ref(null)
      const actionDateline = () => {
        timer.value = setInterval(() => {
          date.value = TODAY.subtract(6, 'hour').format('YYYY-MM-DD')
        }, 60000)
      }
      watch(date, (newVal, oldVal) => {
        if (oldVal && newVal !== oldVal) init()
      })

      watch(isAllowedMember, bol => {
        if (bol) init()
      })

      const getActivityRedDotAction = () => {
        store.dispatch('event/setReceiveObject')
      }

      provide('getActivityRedDotAction', getActivityRedDotAction)

      const init = async () => {
        clearInterval(timer.value)
        actionDateline()

        if (!isAllowedMember.value) return false
        getActivityRedDotAction()
      }

      init()

      onBeforeUnmount(() => {
        pointer.value = 0

        clearInterval(timer.value)
      })

      return {
        openState,
        event,
        specify,
        eventList,
        pointer,
        enableContainer,
        newsList,
        // fn
        close
      }
    }
  }
</script>

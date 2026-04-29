<template>
  <div class="event_wrap" :class="tw(['relative', 'z-10'])">
    <div class="event__container" :class="tw(['mt-26px', 'mb-30px', 'mx-mobileSpace', 'md:mx-0'])">
      <div
        class="event__list"
        :class="
          tw(['grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-x-20px', 'md:gap-x-16px', 'md:gap-y-16px', 'gap-y-30px'])
        "
      >
        <div
          class="event__item"
          v-for="(item, index) of formatEventList"
          :id="item.id"
          :key="item.id"
          :class="
            tw([
              'relative',
              'text-white',
              'rounded-20px',
              'py-18px',
              'px-24px',
              'rounded-20px',
              'flex',
              'min-h-160px',
              'cursor-pointer',
              'group',
              index === formatEventList.length - 1 && !isEven ? 'md:col-span-2' : ''
            ])
          "
          :style="{ background: `${item.bgColor}` }"
          @click="action(item)"
        >
          <div class="event__text" :class="tw(['relative', 'flex', 'flex-col', 'w-2/3'])">
            <div
              class="event__block"
              :class="tw(['flex-1', 'flex', 'flex-col', 'items-start', 'justify-center', 'z-10'])"
            >
              <div
                class="event__tips"
                :class="tw(['rounded-full', 'border', 'border(1 white)', 'text-12px', 'py-4px', 'px-12px'])"
              >
                {{ $t(item.tips) }}
              </div>
              <div
                class="event__label"
                v-html="$t(item.title)"
                :class="tw(['mt-1', 'text-18px', 'font-bold', 'whitespace-pre-line'])"
              ></div>
            </div>
            <div class="event__sub" :class="tw(['relative', 'z-10', 'flex', 'items-center'])">
              <template v-if="item.button">
                <div :id="item.id" :class="[tw(['w-[124px]']), 'button__lottie']"></div>
              </template>
              <template v-else>
                <span :class="tw(['mr-4px'])">
                  {{ isLogin ? (item.loginSub ? $t(item.loginSub) : $t(item.sub)) : $t(item.sub) }}
                </span>
                <img
                  :src="require('./images/i_next_arrow.svg')"
                  :class="tw(['relative', 'left-0', 'w-20px', 'h-20px', 'group-hover:left-10px', 'transition-all'])"
                  :alt="isLogin ? (item.loginSub ? $t(item.loginSub) : $t(item.sub)) : $t(item.sub)"
                />
              </template>
            </div>
          </div>
          <div class="event__picture" :class="tw(['flex-1', 'absolute', 'bottom-0', 'right-0'])">
            <div
              class="event__lottie"
              v-if="item.lottie"
              :class="
                tw([
                  'h-180px',
                  'max-h-[45svw]',
                  'md:max-h-full',
                  'group-hover:scale-110',
                  'rounded-br-20px',
                  'origin-bottom-right',
                  'transition-transform'
                ])
              "
            ></div>
            <img
              class="event__picture"
              v-else-if="item.img"
              :class="
                tw([
                  'h-[168px]',
                  'md:h-180px',
                  'group-hover:scale-110',
                  'rounded-br-20px',
                  'origin-bottom-right',
                  'transition-transform'
                ])
              "
              :src="require(`./images/${item.img}`)"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- 彈窗 -->
    <viewPopup
      v-if="displayPopup"
      @close="
        () => {
          displayPopup = false
        }
      "
    >
      <template v-slot:context>
        <div class="info">
          <div class="img" :class="tw(['mt-14px', 'mb-36px', 'text(white center xl)'])">
            <img :class="tw(['mx-auto', 'mb-6', 'w-28'])" :src="require(`@/assets/img/logo/logo_PlayBUZ_only.png`)" />
            | {{ $t('敬請期待') }}
          </div>
        </div>
        <p :class="tw(['text(center lg)'])">
          {{ $t(displayText) }}
        </p>
      </template>
    </viewPopup>
  </div>
</template>

<script>
  import { ref, computed, nextTick, onMounted } from 'vue'
  import store from '@/store'
  import { useRouter } from 'vue-router'
  import { event } from 'vue-gtag-next'

  import viewPopup from '@/components/popup'

  import { TODAY } from '@/configs'
  import { EVENT } from '@/configs/event'
  import lottie from 'lottie-web'
  import dayjs from 'dayjs'

  dayjs.extend(require('dayjs/plugin/isBetween'))
  dayjs.extend(require('dayjs/plugin/isSameOrAfter'))
  dayjs.tz.setDefault('Asia/Taipei')

  export default {
    name: 'event',

    components: {
      viewPopup
    },

    setup() {
      const router = useRouter()
      const isLogin = computed(() => store.getters['member/isLogin'])

      const isEven = computed(() => formatEventList.value.length % 2 === 0)

      const formatEventList = computed(() => {
        const target = EVENT.reduce((acc, cur) => {
          // 取得活動期間是否在時間範圍內。
          const deadlineLength = Object.values(cur.deadline)
          if (!deadlineLength || !TODAY.isBetween(deadlineLength[0], deadlineLength[deadlineLength.length - 1]))
            return acc

          let start = null
          let end = null
          const timing = [cur.deadline.before, cur.deadline.start, cur.deadline.end, cur.deadline.after]
          const formatTiming = timing.filter(item => item)
          start = formatTiming[0]
          end = formatTiming[formatTiming.length - 1]
          if (formatTiming.length < 2 || !start || !end) return acc

          let status = null
          if (cur.activity) {
            if (cur.deadline.end && TODAY.isSameOrAfter(dayjs(cur.deadline.end))) {
              status = cur.activity.after
              status.type = 'after'
            } else if (cur.deadline.start && TODAY.isSameOrAfter(dayjs(cur.deadline.start))) {
              status = cur.activity.progress
              if (cur.activity.progress && Array.isArray(cur.activity.progress))
                status = status.map(item => {
                  return { ...item, type: 'progress' }
                })
              else status.type = 'progress'
            } else {
              if (Array.isArray(cur.activity.before)) status = cur.activity.before[0]
              else status = cur.activity.before

              status.start = cur.deadline.start
              status.type = 'before'
            }
          }

          if (Array.isArray(status)) {
            acc.push(...status)
            return acc
          } else {
            return acc.concat({
              id: cur.id,
              ...status
            })
          }
        }, [])

        // 每次最多只取出兩筆顯示。
        return target.filter(item => item.title).splice(0, 2)
      })

      // 暫時拿掉
      // const renderLottie = () => {
      //   for (const value of Object.values(formatEventList.value)) {
      //     if (!value.lottie) continue

      //     lottie.loadAnimation({
      //       container: document.getElementById(value.id).querySelector('.event__lottie'),
      //       path: `/lottie/event/${value.lottie}`,
      //       renderer: 'svg',
      //       loop: true,
      //       autoplay: true,
      //     })
      //   }

      //   for (const value of Object.values(formatEventList.value)) {
      //     if (!value.button || !value.button.lottie) continue

      //     lottie.loadAnimation({
      //       container: document.getElementById(value.id).querySelector('.button__lottie'),
      //       path: `/lottie/event/${value.button.lottie}`,
      //       renderer: 'svg',
      //       loop: true,
      //       autoplay: true,
      //     })
      //   }
      // }

      // onMounted(() => {
      //   nextTick(() => {
      //     renderLottie()
      //   })
      // })

      const displayPopup = ref(null)
      const displayText = ref('')
      const action = obj => {
        if (obj.type === 'before') {
          if (obj.action?.type === 'game') router.push({ name: 'game/detail', params: { gameID: obj.action.gameID } })
          else {
            const dict = {
              am: '早上',
              pm: '晚間'
            }
            const timer = dayjs(obj.start)
            displayPopup.value = true
            displayText.value = `活動於${timer.format('MM月DD日')}${dict[timer.format('a')] ||
              timer.format('a')}${timer.format('HH點')}開始`
          }
        } else {
          if (obj.action?.type === 'game') router.push({ name: 'game/detail', params: { gameID: obj.action.gameID } })
          else if (obj.action?.type === 'router') router.push(obj.action.router)
          else if (obj.action?.type === 'href') {
            const url = ref(obj.action?.url.indexOf('http') < 0 ? location.href + obj.action.url : obj.action.url)
            // params
            if (obj.action?.params) {
              url.value += '?'
              for (const item in obj.action.params) {
                if (item === 'token') url.value += `${item}=${localStorage.getItem(obj.action.params[item])}&`
                else url.value += `${item}=${obj.action.params[item]}&`
              }
            }
            if (!isLogin.value) store.commit('sign/UPDATE_DRAWER_STATE', true)
            else window.open(url.value)
          } else {
            if (obj.id === 'gpg-mine') {
              event('mine_click', { click: 'event' })
              store.dispatch('sign/loginProxy', { binding: true, action: 'goMine' })
            } else store.dispatch('sign/loginProxy', { binding: true, action: 'goEvent', event: obj.id })
          }
        }
      }

      const imgUrl = ref(process.env.VUE_APP_IMG_URL)

      return {
        isEven,
        isLogin,
        formatEventList,
        imgUrl,
        action,
        displayPopup,
        displayText
      }
    }
  }
</script>

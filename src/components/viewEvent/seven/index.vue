<template>
  <Content>
    <template v-slot:board>
      <div
        class="event__seven"
        v-if="!loading"
        :class="
          tw([
            'relative',
            'w-360px',
            'h-full',
            'md:h-463px',
            'max-h-[80svh]',
            'max-w-[100svw]',
            'tablet:w-900px',
            'tablet:h-510px'
          ])
        "
      >
        <img
          class="event__bg"
          :src="require(`./images/${lang === 'zh-TW' ? 'zh-TW' : 'en-US'}/xpg_${isMobile ? 'mobile' : 'web'}.png`)"
          :class="tw(['md:w-900px'])"
        />
        <div
          class="event__seven__content"
          :class="
            tw(['absolute', 'top-0', 'left-0', 'w-full', 'px-5', 'text-center', 'text-white', 'pt-40', 'tablet:pt-52'])
          "
        >
          <h2 :class="tw(['text-18px', 'tablet:text-2xl', 'font-semibold'])">
            {{ $t('新手禮包每日領，神遊路上不孤單') }}
          </h2>
          <h4 :class="tw(['text-16px', 'tablet:text-lg'])">
            {{ $t('超萌礦獸陪你一同神遊！G幣領到手軟！') }}
          </h4>
          <div class="event__list" :class="tw(['flex', 'flex-wrap', 'mx-auto', 'mt-1', 'justify-center'])">
            <div
              v-for="(item, index) of days"
              :key="index"
              :class="
                tw([
                  'border-sevenDayItemBorder',
                  item.IsToday ? 'bg-sevenDayItemTodayBg' : 'bg-sevenDayItemBg',
                  'w-78px',
                  'h-80px',
                  'tablet:w-86px',
                  'tablet:h-90px',
                  'mx-0.5',
                  'my-1.5',
                  'rounded-xl',
                  'relative',
                  item.IsSignIn && !item.IsToday ? 'border-2 border-sevenDayItemSigned' : ''
                ])
              "
            >
              <div
                class="event__today__light"
                v-if="item.IsToday"
                style="background-image: url('./img/activity/act_eff01.png');"
                :class="
                  tw([
                    'absolute -top-4 left-1/2',
                    '-ml-50px',
                    'w-100px',
                    'h-100px',
                    'bg-center bg-cover',
                    'animate-spin'
                  ])
                "
              ></div>
              <img
                class="item__pic"
                v-if="item.BonusTypeID === 0"
                src="./images/act_img_item101.png"
                :class="tw(['relative', 'w-14', '-mt-2', 'mx-auto', 'tablet:w-20', 'tablet:-mt-3'])"
              />
              <img
                class="item__pic"
                v-else-if="item.BonusTypeID === 4"
                src="./images/act_img_item102.png"
                :class="tw(IMG_STYLE)"
              />
              <img class="item__pic" v-else src="./images/act_img_moneys.png" :class="tw(IMG_STYLE)" />
              <span
                class="item__text"
                v-if="item.BonusTypeID === 0"
                :class="
                  tw(`${TEXT_STYLE} ${item.IsToday ? 'text-black' : item.IsSignIn ? 'text-white' : 'text-violet'}`)
                "
              >
                {{ $t('礦機GO') }}
              </span>
              <span
                class="item__text"
                v-else-if="item.BonusTypeID === 4"
                :class="tw(`${TEXT_STYLE} ${item.IsToday ? 'text-black' : 'text-violet'}`)"
              >
                {{ $t('升級罐罐') }}
              </span>
              <span
                class="item__text"
                v-else
                :class="tw(`${TEXT_STYLE} ${item.IsToday ? 'text-black' : 'text-violet'}`)"
              >
                {{ item.BonusNumber }}
              </span>
            </div>
          </div>
        </div>
        <button
          class="seven__button"
          v-if="!loading"
          :class="
            tw([
              'relative',
              'mx-auto',
              'block',
              'md:mt-[-100px]',
              'h-11',
              'bg-redBtn',
              'rounded-full',
              'text(white lg)',
              'w-4/5',
              'tablet:w-80'
            ])
          "
          @click="closeEvent"
        >
          {{ $t('簽到') }}
        </button>
      </div>
    </template>
    <template v-slot:mask>
      <div
        v-if="!loading && reward"
        :class="tw(['fixed', 'top-0', 'left-0', 'w-full', 'h-full'])"
        @click.stop="closeReward"
      >
        <div
          class="event__reward"
          :class="tw(['absolute', 'top-0', 'left-0', 'z-event', 'relative', 'w-full', 'h-full'])"
        ></div>
        <div
          :class="
            tw(['relative', 'z-event', 'w-full', 'h-full', 'bg-eventMaskBg', 'flex', 'items-center', 'justify-center'])
          "
        >
          <div
            :class="
              tw([
                'relative',
                'w-40',
                'h-40',
                'bg-sevenDayItemTodayBg',
                'rounded-2xl',
                'z-event',
                'shadow-sevenDayItemReward'
              ])
            "
          >
            <div
              class="event__reward__text"
              :class="
                tw(['absolute left-1/2 transform -translate-x-1/2', '-top-16', 'w-full', 'text(center white xl)'])
              "
            >
              {{ $t('恭喜！') }}
              <br />
              {{ $t('今日簽到獲得') }}
            </div>
            <div
              class="event__reward__light"
              :class="
                tw([
                  'absolute -top-6 left-1/2',
                  '-ml-101px',
                  'tablet:-ml-100px',
                  'w-200px',
                  'h-200px',
                  'bg-center bg-cover',
                  'animate-spin-slow'
                ])
              "
              style="background-image: url('./img/activity/act_eff01.png');"
            ></div>
            <div :class="tw(['absolute left-1/2 top-1/2 transform -translate-x-1/2', '-mt-80px', 'w-full'])">
              <img
                class="item__pic"
                v-if="reward.BonusTypeID === 0"
                src="./images/act_img_item101.png"
                :class="tw(['mt-2', 'w-24', 'mx-auto', 'z-50', 'tablet:w-24', 'tablet:mt-4'])"
              />
              <img
                class="item__pic"
                v-else-if="reward.BonusTypeID === 4"
                src="./images/act_img_item102.png"
                :class="tw(['mt-5', 'w-24', 'mx-auto', 'z-50', 'tablet:w-24', 'tablet:mt-6'])"
              />
              <img
                class="item__pic"
                v-else
                src="./images/act_img_moneys.png"
                :class="tw(['mt-5', 'w-24', 'mx-auto', 'z-50', 'tablet:w-24', 'tablet:mt-6'])"
              />
            </div>
            <div
              :class="
                tw(['absolute left-1/2 bottom-4 transform -translate-x-1/2', '-mt-80px', 'w-full', 'text-center'])
              "
            >
              <span class="item__text" v-if="reward.BonusTypeID === 0" :class="tw(['text(black lg)', 'font-medium'])">
                {{ $t('礦機GO') }}
              </span>
              <span
                class="item__text"
                v-else-if="reward.BonusTypeID === 4"
                :class="tw(['text(black lg)', 'font-medium'])"
              >
                {{ $t('升級罐罐') }}
              </span>
              <span class="item__text" v-else :class="tw(['text(black lg)', 'font-medium'])">
                {{ reward.BonusNumber?.toLocaleString() }}
              </span>
            </div>
            <div
              class="bling"
              :class="
                tw([
                  'absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2',
                  '-mt-24px',
                  'w-192px',
                  'h-192px',
                  'bg-center bg-contain'
                ])
              "
            ></div>
          </div>
        </div>
      </div>
    </template>
  </Content>
</template>

<script>
  import { ref, inject, computed } from 'vue'
  import store from '@/store'

  import Content from '../content'

  import { getSeven, getActivityNoviceSignIn7th } from '@/api/event'
  import { TODAY } from '@/configs'
  import dayjs from 'dayjs'

  const name = 'seven'

  export default {
    name,

    components: {
      Content
    },

    setup() {
      const loading = ref(false)
      const lang = computed(() => store.state.member.languageCode)

      const isMobile = computed(() => store.getters['platform/isMobile'])

      const close = inject('close')
      const closeEvent = () => {
        close(name)
      }

      const IMG_STYLE = 'w-16 -mt-1 mx-auto tablet:w-28 tablet:-mt-2 relative'
      const TEXT_STYLE = 'absolute bottom-1.5 w-full left-0 text(center sm) tablet:text(base)'

      const signDay = ref(-1)
      const days = ref({})
      const reward = ref(null)

      const getData = () => {
        return getSeven().then(res => {
          days.value = res
          signDay.value = res.find(item => item.IsToday)?.Days || -1
          reward.value = res.find(item => item.IsToday)
        })
      }

      const closeReward = () => {
        reward.value = null
        signDay.value = -1
      }

      const enableContainer = inject('enableContainer')

      const init = async () => {
        loading.value = true

        let isSignInTime = null

        await getSeven().then(res => {
          const isSignToday = res
            .map(item => dayjs(item.SignInTime).format('YYYY-MM-DD'))
            .includes(TODAY.subtract(6, 'hour').format('YYYY-MM-DD'))

          const isSignFrequency = res.map(item => item.SignInTime).includes('')

          // 需要沒有今天簽到且還有次數
          isSignInTime = isSignToday || !isSignFrequency
        })

        if (isSignInTime) return closeEvent()

        await getActivityNoviceSignIn7th().catch(() => {
          // error code 201 重複簽到
        })
        await getData()
        enableContainer.value = true
        loading.value = false
      }

      init()

      return {
        loading,
        isMobile,
        IMG_STYLE,
        TEXT_STYLE,
        lang,

        days,
        signDay,
        reward,

        // fn
        closeEvent,
        closeReward
      }
    }
  }
</script>

<style lang="scss" scoped>
  .bling {
    animation: bling 2s linear 0s infinite;
    background-image: url('images/star_bling_frame/efx_04_01.png');
  }

  @keyframes bling {
    0% {
      background-image: url('images/star_bling_frame/efx_04_01.png');
    }

    8% {
      background-image: url('images/star_bling_frame/efx_04_02.png');
    }

    10% {
      background-image: url('images/star_bling_frame/efx_04_03.png');
    }

    20% {
      background-image: url('images/star_bling_frame/efx_04_04.png');
    }

    30% {
      background-image: url('images/star_bling_frame/efx_04_05.png');
    }

    40% {
      background-image: url('images/star_bling_frame/efx_04_06.png');
    }

    50% {
      background-image: url('images/star_bling_frame/efx_04_07.png');
    }

    60% {
      background-image: url('images/star_bling_frame/efx_04_08.png');
    }

    70% {
      background-image: url('images/star_bling_frame/efx_04_09.png');
    }

    80% {
      background-image: url('images/star_bling_frame/efx_04_10.png');
    }

    90% {
      background-image: url('images/star_bling_frame/efx_04_11.png');
    }

    100% {
      background-image: url('images/star_bling_frame/efx_04_12.png');
    }
  }
</style>

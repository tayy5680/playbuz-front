<template>
  <div
    class="game-info__wrap"
    :class="
      tw([
        'relative',
        'md:absolute',
        'md:top-0',
        'md:-translate-x-1/2',
        'md:-translate-y-full',
        'md:left-1/2',
        'z-20',
        'w-full',
        'mt-[-160px]',
        'md:mt-[-28px]',
        'px-mobileSpace',
        'md:px-[65px]'
      ])
    "
  >
    <div class="game-info__container" v-if="Object.keys(info).length" :class="tw(['relative', 'z-10'])">
      <div class="game-detail__banner__label" :class="tw(['flex', 'items-center', 'md:pb-[39px]'])">
        <el-image
          class="game-detail__banner__icon"
          lazy
          :src="`${gameSiteURL}/game/${deviceLabel}/type_short/${info.GameID}.jpg`"
          :class="tw(['w-64px', 'h-64px', 'rounded-10px', 'mr-12px'])"
          :alt="info.GameName"
        >
          <template #error>
            <div :class="tw(['flex', 'justify-center', 'items-center', 'h-full', 'bg-[#333]'])"></div>
          </template>
          <template #placeholder>
            <el-skeleton-item variant="image" style="height: 100%;"></el-skeleton-item>
          </template>
        </el-image>
        <div class="game-detail__banner__label" :class="tw(['text-white'])">
          <div class="game-detail__banner__title" :class="tw(['text-28px', 'font-bold'])">
            {{ info.GameName }}
          </div>
          <div
            class="game-detail__sort__list"
            v-if="sortList.length > 0"
            :class="
              tw(['inline-flex', 'items-center', 'border', 'border(1 white)', 'rounded-6px', 'text-12px', 'p-4px'])
            "
          >
            <div class="game-detail__sort__item" v-for="(item, index) of sortList" :key="item.id">
              {{ $t(item.label) }}
              <i v-if="index < sortList.length - 1" :class="tw(['mx-4px'])">
                /
              </i>
            </div>
          </div>
        </div>
      </div>
      <div
        class="game-detail__banner__data"
        :class="tw(['flex', 'flex-col', 'md:flex-row', 'justify-end', 'items-center', 'w-full'])"
      >
        <div
          class="game-detail__data"
          :class="
            tw([
              'bg-bg',
              'rounded-10px',
              'bg-opacity-70',
              'md:p-4px',
              'flex',
              'items-stretch',
              'md:items-center',
              'flex-col-reverse',
              'md:flex-row',
              'w-full',
              'md:w-auto',
              'mt-30px',
              'md:mt-0'
            ])
          "
        >
          <!-- 2026/1/8 特殊： 礦寵顯示即將推出 -->
          <div
            v-if="info.GameID === 5001"
            class="game-detail__play"
            :class="
              tw([
                'bg-[gray]',
                'rounded-10px',
                'text-white',
                'p-12px',
                'row-span-3',
                'flex',
                'items-center',
                'justify-center',
                'font-bold',
                'min-w-189px',
                'w-full',
                'md:w-auto',
                'text-26px',
                'md:text-16px'
              ])
            "
          >
            {{ $t('即將推出') }}
          </div>
          <div
            v-else
            class="game-detail__play"
            v-audio="isMaintenanceStatus ? 'none' : 'playNowButton'"
            :class="
              tw([
                isMaintenanceStatus ? 'cursor-not-allowed' : 'cursor-pointer',
                isMaintenanceStatus ? 'bg-gray-500' : 'bg-link',
                'rounded-10px',
                'text-white',
                'p-12px',
                'row-span-3',
                'flex',
                'items-center',
                'justify-center',
                'font-bold',
                'min-w-189px',
                'w-full',
                'md:w-auto',
                'text-26px',
                'md:text-16px'
              ])
            "
            @click="open"
          >
            {{ isMaintenanceStatus ? $t('遊戲維護中') : $t('立即遊玩') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { computed, nextTick, onMounted, ref, watch } from 'vue'
  import store from '@/store'

  import { GAME_SORT_LIST, GAME_SORT_TYPE } from '@/configs/game'
  import { useI18n } from 'vue-i18n'

  export default {
    props: {
      info: {
        type: Object,
        default: () => {}
      },

      loading: {
        type: Boolean,
        default: () => false
      }
    },

    emits: ['open'],

    setup(props, { emit }) {
      const { t } = useI18n()
      const isMobile = computed(() => store.getters['platform/isMobile'])
      const deviceLabel = computed(() => (isMobile.value ? 'mobile' : 'pc'))
      const isMaintenanceStatus = computed(
        () => !!props.info?.MaintenanceStatus || !!props.info?.Vendor.MaintenanceStatus
      )
      const gameSiteURL = process.env.VUE_APP_IMG_URL + '/img'

      const supportList = ref({
        APP: ['ios', 'android'],
        H5: ['h5'],
        WinForm: ['window']
      })

      const sortList = computed(() => {
        const id = props.info.GameID
        if (!id) return []

        const target = GAME_SORT_TYPE[props.info.GameID]
        if (!target) return []

        return target.reduce((acc, cur) => {
          const chose = GAME_SORT_LIST.find(item => item.id === cur)
          return acc.concat(chose)
        }, [])
      })

      const rangeCount = (string, key, value) => {
        let count = null
        switch (key) {
          case 'volatility':
            count = 0
            if (value) {
              const base = ['低', '中低', '中', '中高', '高']
              const match = new Array(base.length).fill(0)
              let max = 0
              for (const index in base) {
                if (base[index].split('').every(char => value.includes(char)))
                  match[index] = base[index].split('').length
                if (max < match[index]) max = match[index]
              }
              if (max) count = ((match.findIndex(item => item === max) + 1) * 360) / base.length
            }
            break
          case 'returnRate':
            count = (value / 100) * 360
            break
          case 'highestMultiple':
            // 超過5248預設顯示為100%
            count = value < 5248 ? (value / (5248 - 70)) * 360 : 360
            break
        }
        if (string === 'right') return count < 180 ? count : 180
        else if (string === 'left') return count > 180 ? count - 180 : 0
      }
      const rangeDisplay = ref(false)
      const timeDisplay = ref(1000)

      const open = () => {
        if (props.info.GameID === 5001) store.dispatch('sign/loginProxy', { binding: true, action: 'goMine' })
        else if (!isMaintenanceStatus.value) emit('open')
      }

      onMounted(() => {
        nextTick(() => {
          setTimeout(() => {
            rangeDisplay.value = true
          }, 2000)
        })
      })

      const gameID = computed(() => props.info.GameID)

      watch(gameID, val => {
        if (!val) return false
        rangeDisplay.value = false
        setTimeout(() => {
          rangeDisplay.value = true
        }, 2000)
      })

      const setRangeValue = value => {
        return Array.from(value)
          .map(item => (isNaN(Number(item)) ? t(item) : item))
          .join(' ')
      }
      return {
        supportList,
        sortList,
        rangeDisplay,
        timeDisplay,
        deviceLabel,
        isMaintenanceStatus,
        gameSiteURL,
        // fn
        open,
        rangeCount,
        setRangeValue
      }
    }
  }
</script>

<style lang="scss" scoped>
  @media screen and (min-width: 768px) and (max-width: 1020px) {
    .game-detail__data {
      flex-direction: column;
      width: 100%;
      max-width: 189px;

      .game-detail__play {
        width: 100%;
        min-width: 124px;
      }
    }
  }
</style>

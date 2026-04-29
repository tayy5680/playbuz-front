<template>
  <div
    class="game__short__wrap"
    :class="tw(['mb-42px'])"
  >
    <div class="game__short__container">
      <gameSkeletonList v-if="loading" />
      <gameSwiperList v-else-if="isSwiper" />
      <gameGridList v-else />
    </div>
  </div>
</template>

<script>
import { computed, provide } from 'vue'
import store from '@/store'

import gameSkeletonList from './skeleton'
import gameSwiperList from './swiper'
import gameGridList from './grid'

export default {
  name: 'view-game-short-list',

  components: {
    gameSkeletonList,
    gameSwiperList,
    gameGridList,
  },

  props: {
    isLoading: {
      type: Boolean,
      default: () => false,
    },

    count: {
      type: Number,
      default: () => 0,
    },

    list: {
      type: Array,
      default: () => [],
    },

    sub: {
      type: Object,
      default: () => {},
    },

    isDisplayText: {
      type: Boolean,
      default: () => true,
    },

    isSwiper: {
      type: Boolean,
      default: () => true,
    },

    isUseMaintenance: {
      type: Boolean,
      default: () => true,
    },

    isDisplayName: {
      type: Boolean,
      default: () => true,
    },
  },

  setup (props) {
    const count = computed(() => props.count)
    provide('count', count)

    const isDisplayName = computed(() => props.isDisplayName)
    provide('isDisplayName', isDisplayName)

    const loading = computed(() => (props.isLoading))
    provide('loading', loading)

    const isDisplayText = computed(() => props.isDisplayText)
    provide('isDisplayText', isDisplayText)

    const isUseMaintenance = computed(() => props.isUseMaintenance)
    provide('isUseMaintenance', isUseMaintenance)

    const formatGameList = computed(() => {
      if (!store.state.game.gameList || !store.state.game.gameList.length) return []

      return props.list.reduce((acc, cur) => {
        // 排除需過濾的遊戲ID(e.g. 礦寵)
        const exclude = []
        if (exclude.includes(cur)) return acc

        const target = store.state.game.gameList.find(item => item.GameID === cur)
        if (target) {
          return acc.concat({
            ...target,
            maintenance: !!cur.MaintenanceStatus || !!cur.Vendor?.MaintenanceStatus,
            sub: props.sub?.[cur],
          })
        } else return acc
      }, [])
    })
    provide('formatGameList', formatGameList)

    return {
      loading,
    }
  },
}
</script>

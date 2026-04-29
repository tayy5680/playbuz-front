<template>
  <div class="game__list__wrap" :class="tw(['relative', 'container-mo-main', 'md:mx-auto'])">
    <viewGameList :list="filterList" :loading="loading" />
  </div>
</template>

<script>
  import { computed, ref, watch } from 'vue'
  import store from '@/store'

  import { GAME_SORT_TYPE } from '@/configs/game'

  import viewGameList from '@/components/view-game-list'

  export default {
    components: {
      viewGameList
    },

    props: {
      sortID: {
        type: Number,
        default: () => 0
      },

      gameType: {
        type: String,
        default: () => ''
      },

      list: {
        type: Array,
        default: () => []
      },

      search: {
        type: String,
        default: () => ''
      }
    },

    setup(props) {
      const loading = ref(false)

      const isMobile = computed(() => store.getters['platform/isMobile'])

      const filterList = computed(() => {
        if (props.search !== '') {
          const list = props.list.filter(
            res =>
              res.GameName.toLowerCase().includes(props.search.toLowerCase()) &&
              !res.IsStatic &&
              (res.GameType.toLowerCase() === props.gameType || props.gameType === 'all')
          )
          if (list) {
            return Object.values(list).map(item => item.GameID)
          } else return
        }
        return props.list.reduce((acc, cur) => {
          // 過濾遊戲類型
          if (props.gameType !== 'all' && props.gameType !== '' && props.gameType !== cur.GameType.toLowerCase())
            return acc

          // 過濾遊戲分類
          if (props.sortID === 0) return acc.concat(cur.GameID)
          if (GAME_SORT_TYPE?.[cur.GameID]?.includes(props.sortID)) {
            return acc.concat(cur.GameID)
          } else return acc
        }, [])
      })

      watch(
        () => props.list,
        () => {
          loading.value = false
        }
      )

      const init = () => {
        if (!props.list.length) loading.value = true
      }

      init()

      return {
        loading,
        filterList,
        isMobile
      }
    }
  }
</script>

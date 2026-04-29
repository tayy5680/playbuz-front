<template>
  <UISwitch :list="list" :activeID="activeID" lineStyle="border-solid border-b-2 border-AccentColor" @action="action" />
</template>

<script>
  import { computed } from 'vue'
  import store from '@/store'

  import UISwitch from '@/components/ui/switch'

  export default {
    name: 'game-menu',

    components: {
      UISwitch
    },

    setup() {
      const list = computed(() => store.state.platform.pageMenuList)
      const activeID = computed(() => store.state.game.gameMeunId)

      const action = obj => {
        activeID.value = obj.id
        store.commit('game/SET_GAME_MENU_ID', obj.id)
      }

      return {
        list,
        activeID,

        // fn
        action
      }
    }
  }
</script>

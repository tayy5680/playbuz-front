<template>
  <div
    class="game-short__list"
    :class="tw([
      'grid',
      'grid-cols-2',
      'gap-x-[29px]',
      'gap-y-[20px]',
    ])"
  >
    <gameItem
      v-for="item of formatGameList"
      :item="item"
      :key="item.GameID"
    />
  </div>
</template>

<script>
import { inject } from 'vue'

import gameItem from './item'

export default {
  name: 'game-grid-list',

  components: {
    gameItem,
  },

  setup () {
    const formatGameList = inject('formatGameList')

    return {
      formatGameList,
    }
  },
}
</script>

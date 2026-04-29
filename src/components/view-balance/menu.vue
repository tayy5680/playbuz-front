<template>
  <div class="wallet-menu__wrap">
    <viewMenu
      #="slotProps"
      :list="list"
      :activeID="choseID"
      :classNames="`!px-[30px]`"
      :isCenter="true"
      @action="action"
    >
      <div :class="tw(['flex', 'items-center'])">
        <img :src="slotProps.row.img" :class="tw(['mr-[4px]', 'block'])" :alt="$t(slotProps.row.label) + ' icon'" />
        <div>{{ $t(slotProps.row.label) }}</div>
      </div>
    </viewMenu>
  </div>
</template>

<script>
  import { computed, ref } from 'vue'
  import store from '@/store'

  import viewMenu from '@/components/viewMenu'
  import { COIN_TYPE } from '@/configs'

  export default {
    components: {
      viewMenu
    },

    setup() {
      const list = ref()
      list.value = COIN_TYPE.map(item => {
        return {
          id: item.id,
          label: item.label,
          img: item.icon
        }
      })

      const choseID = computed(() => store.state.wallet.displayBalanceType)
      const action = id => {
        store.dispatch('wallet/setDisplayBalanceType', id)
      }

      return {
        list,
        choseID,
        action
      }
    }
  }
</script>

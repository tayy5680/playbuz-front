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
      <p
        :class="tw([
          'flex',
          'items-center',
        ])"
      >
        <img
          :src="slotProps.row.img"
          :class="tw([
            'mr-[4px]',
          ])"
        />
        <span>{{ $t(slotProps.row.label) }}</span>
      </p>
    </viewMenu>
  </div>
</template>

<script>
import { computed } from 'vue'
import store from '@/store'

import viewMenu from '@/components/viewMenu'
import { COIN_TYPE } from '@/configs'

export default {
  components: {
    viewMenu,
  },

  setup () {
    const list = computed(() => {
      let coinArray = []

      if (store.state.wallet.wallectStatus?.supportedPointTypeID?.length) {
        coinArray = COIN_TYPE.reduce((acc, cur) => {
          if (!store.state.wallet.wallectStatus.supportedPointTypeID.includes(cur.id)) return acc

          const target = {
            id: cur.id,
            label: cur.label,
            img: cur.icon,
          }

          return acc.concat(target)
        }, [])
      } else {
        coinArray = COIN_TYPE.map(item => {
          return {
            id: item.id,
            label: item.label,
            img: item.icon,
          }
        })
      }

      return coinArray
    })

    const choseID = computed(() => store.state.wallet.displayBalanceType)

    const action = (id) => {
      store.dispatch('wallet/setDisplayBalanceType', id)
    }

    return {
      list,
      choseID,
      action,
    }
  },
}
</script>

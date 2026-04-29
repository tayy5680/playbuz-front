<template>
  <div
    class="wallet__warp"
    v-if="Object.keys(wallet).length"
    :class="tw([
      'absolute',
      'top-0',
      'left-1/2',
      '-translate-1/2',
      '-translate-y-12',
      'px-4',
      'pt-0.5',
      'w-full',
      'h-11',
      'text-base',
      'bg-white',
      'rounded-[24px]',
      'font-medium',
      'grid',
      'grid-cols-2',
    ])"
  >
    <div
      class="wallet__item"
      v-for="(item, index) of wallet"
      :key="index"
      :class="tw([
        'flex',
        'items-center',
      ])"
    >
      <img
        :class="tw([
          'mr-[8px]',
          'flex-shrink-0',
          'h-[24px]',
          'w-[24px]',
        ])"
        :src="item.icon"
      />
      <span
        :class="tw([
          `text-[${item.color}]`,
        ])"
      >
        {{ item.count }}
      </span>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import store from '@/store'

import { COIN_TYPE } from '@/configs'
import { pointFormatter } from '@/utils/formatters'

export default {
  name: 'wallet-plate',

  setup () {
    const wallet = computed(() => {
      if (!store.state.wallet?.walletList) return {}

      const coinType = COIN_TYPE.map(item => item.id)
      const target = Object.values(store.state.wallet.walletList)
        .flat()
        .filter(item => coinType.includes(item.WalletPointTypeID))
        .reduce((acc, cur) => {
          const themes = COIN_TYPE.find(item => item.id === cur.WalletPointTypeID)
          const target = {
            color: themes.color,
            icon: themes.icon,
            count: pointFormatter(cur.Balance),
          }
          return acc.concat(target)
        }, [])

      return target
    })

    return {
      wallet,
    }
  },
}
</script>

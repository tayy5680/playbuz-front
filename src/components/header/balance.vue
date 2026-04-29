<template>
  <div class="balance__wrap">
    <div class="balance__container">
      <div class="balance__list" :class="tw(['mt-15px', 'mb-18px'])">
        <div
          class="balance__item"
          v-for="(item, index) in walletTable"
          :class="tw(['mt-[9px]', 'bg-[#1A1A1D]', 'rounded-full', 'mx-auto', 'flex', 'max-w-[300px]', 'p-1', 'pl-3'])"
          :key="index"
          @click="openWallet(item.id)"
        >
          <img :src="item.img" :alt="$t(item.label)" />
          <div class="navbar__wallet__gold" :class="tw(['w-full', item.textClass])">
            {{ item.point }}
          </div>
        </div>
      </div>
      <div class="button__wrap" :class="tw(['flex', 'items-center', 'mb-8px', 'max-w-[300px]', 'mx-auto'])">
        <div
          class="button__item"
          :class="
            tw([
              'flex-1',
              'rounded-full',
              'bg-depositBtn',
              'text(white center)',
              'p-4px',
              'mx-8px max-w-[150px]',
              'cursor-pointer'
            ])
          "
          @click="openBalance"
        >
          {{ $t('轉移') }}
        </div>
        <div
          class="button__item"
          :class="
            tw([
              'flex-1',
              'rounded-full',
              'border',
              'border-[#AFA0BE]',
              'text-center',
              'text-[#AFA0BE]',
              'p-4px',
              'mx-8px',
              'max-w-[150px]',
              'cursor-pointer'
            ])
          "
          @click="openRecord"
        >
          {{ $t('轉移紀錄') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { computed } from 'vue'
  import store from '@/store'
  import { pointFormatter } from '@/utils/formatters'
  import { COIN_TYPE } from '@/configs'

  export default {
    name: 'header-balance',

    props: {
      closeWindow: {
        type: Function
      }
    },

    setup(props) {
      const walletTable = computed(() => {
        return COIN_TYPE.reduce((acc, cur) => {
          return acc.concat({
            id: cur.id,
            img: cur.icon,
            label: cur.label,
            point: pointFormatter(store.getters['wallet/walletTotal']?.[cur.type] || 0),
            textClass: 'text-[' + cur.color + ']'
          })
        }, [])
      })
      const setStyleMaskImage = url => {
        return `url(${url}) no-repeat center /contain`
      }

      const enableBalance = computed(() => store.state.wallet.enableBalance)

      const openBalance = () => {
        store.dispatch('wallet/setEnableBalance', true)
        props.closeWindow()
      }

      const openWallet = id => {
        store.dispatch('wallet/setDisplayBalanceType', id)
        store.dispatch('wallet/setEnableWallet', true)
        props.closeWindow()
      }

      const openRecord = () => {
        store.dispatch('wallet/setEnableRecord', true)
        props.closeWindow()
      }

      return {
        walletTable,
        enableBalance,
        // fn
        setStyleMaskImage,
        openWallet,
        openBalance,
        openRecord,
        pointFormatter
      }
    }
  }
</script>

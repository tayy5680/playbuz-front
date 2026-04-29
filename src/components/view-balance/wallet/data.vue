<template>
  <div
    class="wallet-data__wrap"
    :class="tw([
      'px-60px',
      'md:border-r',
      'md:border-r-2',
      'md:border-purpleLine',
    ])"
  >
    <div class="wallet-data__container">
      <div
        class="wallet-data__main"
        v-if="walletTypeTemplete"
        :class="tw([
          'flex',
          'flex-col',
          'items-start',
        ])"
      >
        <div
          class="wallet-data__main__label"
          :class="tw(['text(white opacity-40 15px)'])"
        >
          {{ $t(walletTypeTemplete.label) }}{{ $t('主錢包') }}
        </div>
        <div
          class="wallet-data__main__count"
          :class="tw([
            `text-[${walletTypeTemplete.color}]`,
            'text-20px',
            'mt-2px',
            'mb-12px',
          ])"
        >
          {{ pointFormatter(mainWalletCount) }}
        </div>
        <div
          class="wallet-data-all__back"
          v-if="!isNonWalletDataAllBackButtoon"
          :class="tw([
            'cursor-pointer',
            'bg-[#FFCC00]',
            'py-4px',
            'px-32px',
            'mb-38px',
            'rounded-full',
            'overflow-hidden',
          ])"
          v-loading="loading || !canUsePostTransferBack || buttonAllLoading"
          @click="postTransferBack"
        >
          {{ $t('一鍵轉回主錢包') }}
        </div>
      </div>
      <div class="wallet-data__game">
        <div
          class="wallet-data__game__item"
          v-for="item of formatGameWalletCountList"
          :key="item.id"
          :class="tw([
            'flex',
            'items-center',
            'text-18px',
            'mb-24px',
          ])"
        >
          <div
            class="wallet-data__game__label"
            :class="tw([
              'text-violet',
              'flex-1',
            ])"
          >
            {{ item.label }}
          </div>
          <div
            class="wallet-data__game__count"
            :class="tw([
              item.maintenance ? 'text-[#FF0057]' : 'text-white',
              'flex-1',
            ])"
          >
            {{ item.maintenance ? $t('遊戲廠商維護中') : pointFormatter(item.balance) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, inject, ref } from 'vue'
import store from '@/store'

import {
  postWalletTransferBack,
} from '@/api/wallet'
import {
  pointFormatter,
} from '@/utils/formatters'
import { useNotice } from '@/utils/use-notice'

export default {
  setup () {
    const loading = ref(false)

    // 是否不顯示一鍵取回
    const isNonWalletDataAllBackButtoon = ref(false)

    const walletTypeTemplete = inject('walletTypeTemplete')
    const mainWalletCount = inject('mainWalletCount')
    const gameWalletCountList = inject('gameWalletCountList')
    const buttonAllLoading = inject('buttonAllLoading')

    const formatGameWalletCountList = computed(() => {
      if (!gameWalletCountList.value) return []

      return gameWalletCountList.value.reduce((acc, cur) => {
        // 過濾掉主錢包
        if (cur.WalletPointTypeID === walletTypeTemplete.value.id) return acc

        const target = {
          id: cur.WalletPointTypeID,
          label: cur.WalletName,
          balance: cur.Balance,
          maintenance: cur.MaintenanceID,
        }
        return acc.concat(target)
      }, [])
    })

    const canUsePostTransferBack = ref(true)
    const waitPostTransferBackTimer = () => {
      setTimeout(() => {
        canUsePostTransferBack.value = true
      }, 3000)
    }
    const postTransferBack = async () => {
      if (loading.value || !canUsePostTransferBack.value) return false

      try {
        loading.value = true
        canUsePostTransferBack.value = false
        buttonAllLoading.value = true
        waitPostTransferBackTimer()
        const inputData = {
          PointTypeID: walletTypeTemplete.value.id,
        }
        await postWalletTransferBack(inputData)
        await new Promise(resolve => setTimeout(resolve, 3000))
        await store.dispatch('wallet/updateAllWallet')
      } catch {
        useNotice({ type: 'error', message: '發生錯誤，請稍後再試，或洽客服人員' })
      } finally {
        loading.value = false
        buttonAllLoading.value = false
      }
    }

    return {
      loading,
      canUsePostTransferBack,
      pointFormatter,
      walletTypeTemplete,
      mainWalletCount,
      formatGameWalletCountList,
      postTransferBack,
      buttonAllLoading,
      isNonWalletDataAllBackButtoon,
    }
  },
}
</script>

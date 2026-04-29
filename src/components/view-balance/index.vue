<template>
  <transition name="fade">
    <div class="balance-view-wrap" :class="{ mobile: isMobile }">
      <div class="balance__container">
        <!-- <div class="balance__menu" :class="tw(['px-20px'])">
          <viewMenu />
        </div> -->

        <div class="balance-flex-top">
          <div class="balance-title">{{ $t('錢包') }}</div>
          <div class="balance-main">
            <div class="coin">
              <div class="label">{{ $t('金幣') }}{{ $t('主錢包') }}</div>
              <div class="count">{{ pointFormatter(wallet.gold) }}</div>
            </div>
            <button class="deposit-btn" @click="goToDeposit">
              <img :src="require('./images/i_cashplus2.svg')" />
              <div class="label">{{ $t('儲值') }}</div>
            </button>
            <button class="transfer-btn" @click="openWallet">
              <img :src="require('./images/i_transfer00.svg')" />
              <div class="label">{{ $t('轉移') }}</div>
            </button>
          </div>
        </div>

        <div class="balance-close" @click="close" v-audio="'close'">
          <i class="bi bi-x-lg"></i>
        </div>
        <div class="balance-list">
          <div class="balance-list-item" v-for="item of minorWalletList" :key="item.id">
            <div class="label">{{ item.label }}</div>
            <div class="count" :class="tw([item.isMaintenance ? 'text-[#FF176E]' : 'text-[#374151]'])">
              {{ item.isMaintenance ? $t('遊戲廠商維護中') : pointFormatter(item.balance) }}
            </div>
          </div>
        </div>
        <div class="balance-flex-bottom">
          <div class="record-btn" @click="openRecord">
            <img :src="require('./images/i_ghistory.svg')" />
            <div class="mobile-record__label">{{ $t('轉移紀錄') }}</div>
          </div>
          <div
            class="all-wallet-btn"
            v-if="!isNonWalletDataAllBackButtoon"
            v-loading="loading || !canUsePostTransferBack"
            @click="postTransferBack"
          >
            <img :src="require('./images/i_balance_transfer_click.svg')" />
            <div class="label">{{ $t('一鍵轉回主錢包') }}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { computed, onBeforeUnmount, ref, watch } from 'vue'
  import store from '@/store'
  import { useRoute, useRouter } from 'vue-router'

  import { COIN_TYPE } from '@/configs'
  import { pointFormatter } from '@/utils/formatters'
  import { postWalletTransferBack } from '@/api/wallet'
  import viewMenu from './menu'
  import { useNotice } from '@/utils/use-notice'

  export default {
    name: 'balance',

    components: {
      viewMenu
    },
    emit: ['closePCBalance'],

    setup(props, { emit }) {
      const route = useRoute()
      const router = useRouter()

      // 是否不顯示一鍵取回
      const isNonWalletDataAllBackButtoon = ref(false)

      const isMobile = computed(() => store.getters['platform/isMobile'])

      // menu
      const walletType = computed(() => store.state.wallet.displayBalanceType)
      const wallet = computed(() => store.getters['wallet/walletTotal'])
      // coin templete
      const walletTypeTemplete = computed(() => {
        const target = COIN_TYPE.find(item => item.id === walletType.value)
        return target
      })

      const gameWalletCountList = computed(() => {
        const target = store.state.wallet.walletList
        if (!Object.keys(target).length) return []
        return target[walletType.value]
      })

      const mainWalletData = computed(() => {
        if (!gameWalletCountList.value) return {}

        return gameWalletCountList.value.find(item => item.WalletPointTypeID === walletType.value)
      })

      const minorWalletList = computed(() => {
        if (!gameWalletCountList.value) return []

        return gameWalletCountList.value.reduce((acc, cur) => {
          if (cur.WalletPointTypeID === walletTypeTemplete.value.id) return acc

          const target = {
            id: cur.WalletPointTypeID,
            label: cur.WalletName,
            balance: cur.Balance,
            isMaintenance: !!cur.MaintenanceID
          }
          return acc.concat(target)
        }, [])
      })

      const setStyleMaskImage = url => {
        return `url(${url}) no-repeat center center /contain`
      }

      const close = () => {
        emit('closePCBalance')
        store.dispatch('wallet/setEnableBalance', false)
      }

      const goToDeposit = () => {
        close()
        if (route.name !== 'deposit') router.push({ name: 'deposit' })
      }

      const openWallet = () => {
        close()
        store.dispatch('wallet/setDisplayBalanceType', walletTypeTemplete.value.id)
        store.dispatch('wallet/setEnableWallet', true)
      }

      const openRecord = () => {
        close()
        store.dispatch('wallet/setEnableRecord', true)
        // store.dispatch('platform/setCover', false)
      }

      const loading = ref(false)
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
          waitPostTransferBackTimer()
          const inputData = {
            PointTypeID: walletTypeTemplete.value.id
          }
          await postWalletTransferBack(inputData)
          await new Promise(resolve => setTimeout(resolve, 3000))
          await store.dispatch('wallet/updateAllWallet')
        } catch {
          useNotice({ type: 'error', message: '發生錯誤，請稍後再試，或洽客服人員' })
        } finally {
          loading.value = false
        }
      }

      onBeforeUnmount(() => {
        store.dispatch('wallet/setWalletActionObject', null)
        store.dispatch('wallet/setIsDisplayViewData', true)
      })

      return {
        isMobile,
        setStyleMaskImage,
        walletTypeTemplete,
        mainWalletData,
        minorWalletList,
        pointFormatter,
        loading,
        canUsePostTransferBack,
        isNonWalletDataAllBackButtoon,
        wallet,

        // fn
        openWallet,
        openRecord,
        goToDeposit,
        close,
        postTransferBack
      }
    }
  }
</script>
<style lang="scss" scoped>
  $bg-color: white;
  .balance-view-wrap {
    width: 100%;
    max-width: 380px;
    border-radius: 20px;
    background-color: $bg-color;
    padding: 16px;
    .balance__container {
      color: #374151;
      max-height: 80svh;
      overflow: scroll;

      .balance-flex-top {
        position: sticky;
        background-color: white;
        top: 0;
        padding-bottom: 16px;
        .balance-main {
          background: linear-gradient(147.53deg, #525a68 -57.93%, #242931 68.47%);
          border-radius: 10px;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          color: white;
          gap: 16px;

          .coin {
            flex-grow: 1;
            .label {
              font-size: 12px;
            }
            .count {
              padding-top: 3px;
              color: #ffb61d;
              font-size: 24px;
              word-break: break-all;
              line-height: 24px;
            }
          }
          .deposit-btn,
          .transfer-btn {
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 64px;
            height: 64px;
            border-radius: 10px;
            img {
              width: 30px;
              height: 30px;
            }
            .label {
              font-size: 12px;
            }
          }
          .transfer-btn {
            background: linear-gradient(160.4deg, #ffdc7b -48.87%, #ffad00 86.87%);
          }
        }
        .balance-title {
          font-size: 20px;
          margin-bottom: 34px;
          text-align: center;
          position: sticky;
          top: 0;
        }
      }

      .balance-list {
        color: #374151;
        display: flex;
        flex-direction: column;
        gap: 25px;
        padding: 24px 0;

        .balance-list-item {
          border-bottom: 1px solid #e3e3e3;
          font-size: 18px;
          display: flex;
          .label {
            flex-grow: 1;
          }
          .count {
            flex-shrink: 0;
          }
        }
      }

      .balance-close {
        position: absolute;
        top: 16px;
        right: 16px;
        line-height: 30px;
        font-size: 26px;
        cursor: pointer;
      }
      .balance-flex-bottom {
        position: sticky;
        background-color: white;
        bottom: 0;
        padding-top: 16px;

        .record-btn,
        .all-wallet-btn {
          transition: 0.2s all ease;
          font-size: 18px;
          height: 48px;
          cursor: pointer;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          img {
            width: 32px;
            height: 32px;
          }
          &:hover {
            opacity: 0.7;
          }
        }
        .record-btn {
          background-color: #374151;
          color: white;
          margin-bottom: 8px;
        }
        .all-wallet-btn {
          background-color: #ffc800;
          color: #374151;
        }
      }
    }
  }
</style>

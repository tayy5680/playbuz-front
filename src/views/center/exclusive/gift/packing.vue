<template>
  <div class="gift-packing__wrap" :class="tw(['h-full', 'flex-1'])">
    <div
      class="gift-packing__container"
      :class="tw(['mx-auto', 'h-full', 'w-full', 'flex', 'flex-col', 'items-center', 'justify-between'])"
    >
      <div
        class="gift-packing__coin"
        :class="tw(['relative', 'mt-[40px]', 'w-full', 'flex', 'items-center', 'justify-center'])"
      >
        <img
          :class="tw(['absolute', 'top-0', 'left-0', 'h-[26px]', 'w-[26px]', 'cursor-pointer'])"
          src="./images/i_chooseback.svg"
          @click="setupIndex--"
        />
        <img :class="tw(['w-16'])" :src="walletObject.icon" />
        <img :class="tw(['mx-5', 'w-12'])" src="./images/i_arrow_sendcash.svg" />
        <img
          :class="
            tw([
              'w-14',
              transitionBase,
              {
                'filter grayscale':
                  (parseInt(giftObject.count) || 0) < walletObject.packing.minLimit ||
                  (parseInt(giftObject.count) || 0) > parseInt(walletObject.Balance)
              }
            ])
          "
          src="./images/i_gift.svg"
        />
      </div>
      <div class="packing__input">
        <div
          class="packing__number"
          :class="
            tw([
              'flex',
              'justify-between',
              'items-stretch',
              'relative',
              'bg-bg',
              'rounded-full',
              'text(white 26px)',
              'border',
              'border-giftBtnInactive',
              'px-22px',
              'py-6px'
            ])
          "
        >
          <div
            class="minus"
            :class="tw(['w-20px', 'cursor-pointer', 'flex-shrink-0'])"
            :style="{
              background: 'url(' + require('./images/i_money_less.svg') + ') no-repeat center center /contain'
            }"
            @click="onCalculateAction('minus')"
          ></div>
          <input
            id="number__input"
            v-model="giftObject.count"
            type="tel"
            pattern="d*"
            inputmode="numeric"
            @change="setCalculate"
            @focus="setCalculate"
            @blur="setCalculate"
            @input="setCalculate"
            @keyup.delete="setCalculate"
            :placeholder="
              `${$t('最低贈禮為')}${pointFormatter(walletObject.packing.minLimit)}${$t(walletObject.label)}`
            "
            :class="tw(['bg-transparent', 'text(center 18px)', 'focus:outline-none'])"
          />
          <div
            class="plus"
            :class="tw(['w-20px', 'cursor-pointer', 'flex-shrink-0'])"
            :style="{
              background: 'url(' + require('./images/i_money_add.svg') + ') no-repeat center center /contain'
            }"
            @click="onCalculateAction('plus')"
          ></div>
        </div>
        <div class="gift-packing__quick-list" :class="tw(['flex', 'mt-[16px]'])">
          <button
            class="gift-packing__quick-item"
            v-for="item in walletObject.packing.quick"
            :key="item"
            :class="
              tw([
                walletObject.type,
                'p-[13px]',
                'border-2',
                'border-[#4C4256]',
                'rounded-[10px]',
                'text-18px',
                'text-white',
                'select-none',
                'leading-none',
                'mx-[2.5px]',
                'focus:outline-none',
                parseInt(walletObject.Balance) >= (parseInt(giftObject.count) || 0) + item
                  ? 'cursor-pointer hover:bg-giftQuickButton hover:border-giftQuickButton active:border-giftBtnInactive active:bg-giftQuickButtonActive'
                  : 'cursor-not-allowed bg-purpleLine text-confirmBtnText border-purpleLine'
              ])
            "
            @click="onQuickAction(item)"
          >
            {{ pointFormatter(item) }}
          </button>
        </div>
      </div>
      <hr :class="tw(['border-purpleLine', 'w-full'])" />
      <div class="packing__totel" :class="tw(['mt-0', 'border-giftBtnInactive', 'text-footerTipsText', 'w-full'])">
        <div class="packing__tips">
          {{ `${$t('您將付出禮物包裝費')} ${feePercent}%` }}
        </div>
        <div
          class="packing__count"
          :class="tw([parseInt(giftObject.count) < walletObject.packing.minLimit ? 'text-red-500' : '', 'break-all'])"
          v-text="
            (parseInt(giftObject.count) || 0) < walletObject.packing.minLimit
              ? `${$t('最低贈禮為')}${pointFormatter(walletObject.packing.minLimit)}${$t(walletObject.label)}`
              : `${$t('總共')}${$t(walletObject.label)} ${pointFormatter(totalAmount) || 0}`
          "
        ></div>
      </div>
      <button
        class="packing__submit"
        :class="
          tw([
            (parseInt(giftObject.count) || 0) < walletObject.packing.minLimit ||
            (parseInt(giftObject.count) || 0) > parseInt(walletObject.Balance)
              ? 'cursor-not-allowed bg-giftBtnInactive'
              : 'cursor-pointer bg-giftBtnBg',
            'block',
            'w-full',
            'text-[18px]',
            'text-white',
            'text-center',
            'rounded-full',
            'focus:outline-none',
            'py-8px',
            transitionBase
          ])
        "
        v-loading="loading"
        @click="onSubmit"
      >
        {{ $t('完成') }}
      </button>
    </div>
  </div>
</template>

<script>
  import { ref, inject, computed, watch } from 'vue'
  import store from '@/store'

  import { COIN_TYPE } from '@/configs'
  import { postTransactionEstimateFee, postTransactionSubmitRewardPoint } from '@/api/gift'
  import { useNotice } from '@/utils/use-notice'
  import { debounce } from 'lodash'
  import { pointFormatter } from '@/utils/formatters'

  export default {
    name: 'gift-packing',

    setup() {
      const loading = ref(false)
      const setupIndex = inject('setupIndex')
      const giftObject = inject('giftObject')
      const apiPackingList = inject('apiPackingList')

      watch(
        () => giftObject.count,
        val => {
          giftObject.count = val.toString().replace(/(\s)|[^0-9]/g, '')
        }
      )

      const walletObject = computed(() => {
        const target = COIN_TYPE.find(item => item.id === giftObject.id)

        const wallet = Object.values(store.state.wallet.walletList)
          .flat()
          .find(item => item.WalletPointTypeID === target?.id)

        // 如果有從api取得資料，將packing更新。
        if (apiPackingList.value?.[target.type]) target.packing = apiPackingList.value[target.type]

        return target ? { ...wallet, ...target } : {}
      })

      const feePercent = ref(0)
      const totalAmount = computed(() => {
        return feePercent.value > 0 ? giftObject.count + giftObject.count * feePercent.value * 0.01 : giftObject.count
      })

      // 快速按鈕
      const onQuickAction = count => {
        if (parseInt(walletObject.value.Balance) < (parseInt(giftObject.count) || 0) + count) return false

        giftObject.count = giftObject.count !== '' ? (parseInt(giftObject.count) + count).toString() : count.toString()

        setCalculate()
      }

      // 加減符號
      const onCalculateAction = action => {
        const count =
          action === 'minus'
            ? -walletObject.value.packing.setp
            : action === 'plus'
            ? +walletObject.value.packing.setp
            : 0

        if (parseInt(walletObject.value.Balance) < (parseInt(giftObject.count) || 0) + count) return false
        if (action === 'minus' && parseInt(giftObject.count) + count <= 0) return false

        giftObject.count = giftObject.count ? (parseInt(giftObject.count) + count).toString() : count.toString()

        setCalculate()
      }

      const setCalculate = debounce(async () => {
        const count = parseInt(giftObject.count)
        if (!/^\d+$/.test(count)) return false

        try {
          const response = await postTransactionEstimateFee({
            point: count
          })
          feePercent.value = response.Data.TransactionFeePercentage
        } catch {
          useNotice({ type: 'error', message: '發生錯誤，請稍後再試，或洽客服人員' })
        }
      }, 1200)

      const onSubmit = async () => {
        if (loading.value) return false
        if (parseInt(walletObject.value.Balance) < (parseInt(giftObject.count) || 0)) return false
        if ((parseInt(giftObject.count) || 0) < walletObject.value.packing.minLimit) return false

        try {
          loading.value = true
          await postTransactionSubmitRewardPoint({
            transactionPassword: giftObject.password,
            pointTypeID: walletObject.value.id,
            point: parseInt(giftObject.count)
          })
          await store.dispatch('member/logIn')
          setupIndex.value++
        } catch (err) {
          const errorCodeList = {
            401: '無交易權限',
            403: '點數或權限異常',
            998: '未進入交易模式',
            1001: '密碼錯誤',
            3001: '超過交易金額上／下限',
            3002: '餘額不足',
            3003: '目前無法交易',
            3004: '超過交易金額上／下限',
            3007: '主錢包餘額不足'
          }
          const errorMessage = errorCodeList[err.Code] ?? '發生錯誤，請稍後再試，或洽客服人員'
          useNotice({ type: 'error', message: errorMessage })
        } finally {
          loading.value = false
        }
      }

      const init = () => {
        giftObject.count = walletObject.value?.packing?.quick?.[0].toString() || ''
      }

      init()

      return {
        loading,
        setupIndex,
        walletObject,
        giftObject,

        feePercent,
        totalAmount,
        // fn
        onQuickAction,
        onSubmit,
        setCalculate,
        onCalculateAction,
        pointFormatter
      }
    }
  }
</script>

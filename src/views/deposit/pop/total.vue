<template>
  <div class="deposit-total__container">
    <div class="deposit-total__item" :class="tw(['flex', 'items-center', 'justify-between', 'my-[14px]'])">
      <div class="deposit-total__label" :class="tw(['text-[#afa0be]', 'text-[12px]'])">
        {{ $t('數量') }}
      </div>
      <div class="deposit-total__count" :class="tw(['flex', 'items-center', 'justify-between', 'select-none'])">
        <div
          class="deposit-total__less"
          v-if="conditionQuantityRemains !== 1"
          :class="
            tw([
              'w-[55px]',
              'h-[32px]',
              'rounded-[3px]',
              'flex',
              'items-center',
              'justify-center',
              'cursor-pointer',
              transitionBase,
              parseInt(submitData.count) <= 1 ? 'bg-[#48424e]' : 'bg-[#8149D4]'
            ])
          "
          @click="action('less')"
        >
          <img :class="tw(['w-[16px]', 'h-[16px]'])" :src="require('./images/i_money_less.svg')" />
        </div>
        <input
          class="deposit-total__input"
          v-model="submitData.count"
          :disabled="conditionQuantityRemains === 1"
          type="tel"
          pattern="\d*"
          inputmode="numeric"
          :class="tw(['w-[48px]', 'h-[32px]', 'rounded-[3px]', 'mx-[12px]', 'text-center'])"
        />
        <div
          class="deposit-total__add"
          v-if="conditionQuantityRemains !== 1"
          :class="
            tw([
              'w-[55px]',
              'h-[32px]',
              'rounded-[3px]',
              'flex',
              'items-center',
              'justify-center',
              'bg-[#48424e]',
              'cursor-pointer',
              transitionBase,
              parseInt(submitData.count) < 1 ? 'bg-[#48424e]' : 'bg-[#8149D4]'
            ])
          "
          @click="action('add')"
        >
          <img :class="tw(['w-[16px]', 'h-[16px]'])" :src="require('./images/i_money_add.svg')" />
        </div>
      </div>
    </div>
    <div class="deposit-total__item" :class="tw(['flex', 'items-center', 'justify-between', 'my-[14px]'])">
      <div class="deposit-total__label" :class="tw(['text-[#afa0be]', 'text-[12px]'])">
        {{ $t('總計') }}
      </div>
      <div class="deposit-total__final" :class="tw(['text-[#fff]'])">
        <span :class="tw(['text-[20px]'])">
          {{ currency }}
        </span>
        <span :class="tw(['text-[26px]', 'ml-[10px]'])">
          {{ pointFormatter(total) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import { computed, inject, watch } from 'vue'
  import { pointFormatter } from '@/utils/formatters'

  export default {
    props: {
      nowPayDetail: {
        type: Object,
        default: () => {}
      },
      conditionQuantityRemains: {
        type: Number,
        default: () => 0
      }
    },
    setup(props) {
      const currency = inject('currency')
      const submitData = inject('submitData')
      const multiplication = inject('multiplication')

      const total = computed(() => {
        const target = props.nowPayDetail?.ActuallyPayAmount ?? 0
        const count = parseInt(submitData.count) ?? 1

        return multiplication(target, count)
      })

      watch(submitData, () => {
        if (submitData.count) submitData.count = parseInt(submitData.count.toString().replace(/[^\d]/g, ''))
        else submitData.count = 1

        if (props.conditionQuantityRemains && parseInt(submitData.count) > props.conditionQuantityRemains) {
          submitData.count = props.conditionQuantityRemains
        }

        if (parseInt(submitData.count) < 1) {
          submitData.count = 1
          return false
        } else if (parseInt(submitData.count) > 2147483647) {
          // 目前欄位最大數字為2147483647
          submitData.count = 2147483647
          return false
        }
      })

      const action = (act = null) => {
        if (!act) return false

        switch (act) {
          case 'add':
            submitData.count++
            break
          case 'less':
            submitData.count--
            break
        }
      }

      return {
        currency,
        total,
        submitData,
        // fn
        action,
        pointFormatter
      }
    }
  }
</script>

<template>
  <div
    class="deposit-pop__title"
    :class="tw(['relative', 'bg-sort', 'px-[30px]', 'py-[12px]', 'rounded-[10px]', 'mt-[10px]'])"
  >
    <div
      v-if="showDifference"
      class="difference"
      :class="
        tw([
          'absolute',
          'top-0',
          'left-16px',
          '-translate-y-1/2',
          'translate-x-0',
          'text-12px',
          'bg-depositDifferenceBg',
          'rounded-full',
          'leading-none',
          'py-4px',
          'px-16px',
          'text-white'
        ])
      "
    >
      {{ `${$t('優惠再加贈')} ${showDifference}` }}
    </div>
    <div class="data" :class="tw(['flex', 'justify-between', 'items-end', 'mb-14px'])">
      <div class="title" :class="tw(['text-white'])">
        {{ nowPackageDetail?.PackageName ?? '' }}
      </div>
      <div class="price" :class="tw(['text-white'])">
        <span :class="tw(['text-20px'])">{{ currency }}</span>
        <span :class="tw(['text-26px', 'ml-10px'])">
          {{ pointFormatter(multiplication(nowPayDetail?.ActuallyPayAmount, submitData.count)) ?? 0 }}
        </span>
      </div>
    </div>
    <!-- 金、銀幣、經驗 -->
    <div class="amount__group__coin" v-if="nowPayDetail?.PackageItems?.length" :class="tw(['flex', 'items-center'])">
      <div
        class="amount__item"
        v-for="(item, index) of mainGiftList"
        :key="index"
        :class="tw([item.type, 'flex', 'items-center', 'mr-22px', 'text-13px', `text-white`])"
      >
        <img :src="item.icon" :class="tw(['w-16px', 'h-16px', 'mr-4px'])" />
        <span>{{ item.count }}</span>
      </div>
    </div>
    <!-- 其他內容物 -->
    <div class="amount__group__other" :class="tw(['flex', 'items-center', 'mt-2', 'text-[#D7BE96]', 'text-13px'])">
      {{ otherGiftList }}
    </div>
  </div>
</template>

<script>
  import { inject, computed } from 'vue'
  import { pointFormatter } from '@/utils/formatters'
  import store from '@/store'
  import { useI18n } from 'vue-i18n'

  export default {
    name: 'deposit-pop-title',

    props: {
      nowPayTypeID: {
        type: Number
      },
      nowPackageDetail: {
        type: Object,
        default: () => {}
      }
    },

    setup(props) {
      const { t } = useI18n()
      const currency = inject('currency')
      const submitData = inject('submitData')
      const multiplication = inject('multiplication')

      const nowPayDetail = computed(() => {
        if (props.nowPayTypeID)
          return props.nowPackageDetail.PackageListResultDetail?.find(item => item.PayTypeID === props.nowPayTypeID)
        return props.nowPackageDetail?.PackageListResultDetail?.[0] ?? {}
      })
      // 金幣銀幣活動幣、經驗
      const mainGiftList = computed(() => {
        if (!Object.keys(nowPayDetail.value).length) return []

        const coinData = {
          gold: props.nowPackageDetail.GoldPoint + nowPayDetail.value.GoldDifference,
          silver: props.nowPackageDetail.SilverPoint + nowPayDetail.value.GoldDifference
        }
        const target = []
        for (const item of store.getters['wallet/walletPointList']) {
          if (!item.display) continue
          target.push({
            type: item.type,
            icon: item.img,
            color: item.color,
            count: pointFormatter(multiplication(coinData?.[item.type] ?? 0, submitData.count))
          })
        }
        target.push({
          icon: '/img/coin/i_vip_color.svg',
          color: '#fff',
          count: `+${pointFormatter(multiplication(props.nowPackageDetail.Exp, submitData.count))}`
        })

        return target
      })

      // 其他內容物
      const otherGiftList = computed(() => {
        if (!Object.keys(nowPayDetail.value?.PackageItems ?? []).length) return ''
        return nowPayDetail.value.PackageItems.filter(item => ![16, 17, 18].includes(item.ItemID))
          .map(item => `${item.ItemName} x${item.ItemQuantity * submitData.count}`)
          .join('、')
      })

      // 優惠差異
      const showDifference = computed(() => {
        if (!nowPayDetail.value?.GoldDifference && !nowPayDetail.value?.SilverDifference) return ''
        const { GoldDifference, SilverDifference } = nowPayDetail.value
        const goldStr = GoldDifference ? `${t('金幣')} ${GoldDifference}` : ''
        const silverStr = SilverDifference ? `${t('銀幣')} ${SilverDifference}` : ''

        return GoldDifference && SilverDifference ? `${goldStr} / ${silverStr}` : goldStr || silverStr
      })

      return {
        currency,
        submitData,
        nowPayDetail,
        showDifference,
        mainGiftList,
        otherGiftList,
        // fn
        pointFormatter,
        multiplication
      }
    }
  }
</script>

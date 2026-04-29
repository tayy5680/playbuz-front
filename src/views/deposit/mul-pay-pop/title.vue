<template>
<div
  class="deposit-mul-pay-pop__title"
  :class="tw(['relative', 'bg-sort', 'px-[30px]', 'py-[12px]', 'rounded-[10px]','mt-[10px]'])"
>

  <div class="data" :class="tw(['flex', 'justify-between','items-end','mb-14px'])">

    <!-- 禮包名稱 -->
    <div class="title" :class="tw(['text-white'])">
      {{ nowPackageDetail?.PackageName ?? '' }}
    </div>

    <!-- 禮包金額 -->
    <div class="price" :class="tw(['text-white'])">
      <span>{{ currency }}</span>
      <span :class="tw(['text-26px','ml-12px'])">
        {{ pointFormatter(multiplication(nowPayDetail?.ActuallyPayAmount , submitData.count)) ?? 0 }}
      </span>
    </div>

  </div>
</div>
</template>

<script>
import { inject, computed } from 'vue'

// utils
import { pointFormatter } from '@/utils/formatters'

export default {
  name: 'deposit-pop-title',

  props: {
    nowPackageDetail: { type: Object, default: () => {} },
  },

  setup (props) {
    const currency = inject('currency')
    const submitData = inject('submitData')
    const multiplication = inject('multiplication')

    const nowPayDetail = computed(() => props.nowPackageDetail?.PackageListResultDetail?.[0] ?? {})

    return {
      currency,
      submitData,
      nowPayDetail,

      // fn
      pointFormatter,
      multiplication,
    }
  },
}
</script>

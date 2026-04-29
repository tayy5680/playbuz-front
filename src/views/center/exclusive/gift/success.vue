<template>
  <div class="gift-success__wrap" :class="tw(['h-full', 'flex-1'])">
    <div
      class="gift-success__container"
      :class="tw(['mx-auto', 'h-full', 'w-full', 'flex', 'flex-col', 'items-center', 'justify-between'])"
    >
      <div ref="giftSuccessAnim"></div>
      <div class="gift-success__label" :class="tw(['text-[24px]'])">
        {{ `${$t(wallet.label)} ${pointFormatter(giftObject.count)}` }}
      </div>
      <hr :class="tw(['border-purpleLine', 'w-full'])" />
      <div class="gift-success__tips" :class="tw('w-full', 'text-[16px]', 'text-footerTipsText')">
        {{ $t('已成功打包禮物！') }}
        <br />
        {{ $t('送禮紀錄可在訂單查看。') }}
      </div>
      <div
        class="gift-success__button"
        :class="
          tw([
            'bg-redBtn',
            'cursor-pointer',
            'block',
            'w-full',
            'text-[18px]',
            'text-white',
            'text-center',
            'rounded-full',
            'focus:outline-none',
            'py-8px'
          ])
        "
        @click="action"
      >
        {{ $t('前往查看') }}
      </div>
    </div>
  </div>
</template>

<script>
  import { inject, computed, onMounted, nextTick, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import lottie from 'lottie-web'

  import { COIN_TYPE } from '@/configs'
  import { pointFormatter } from '@/utils/formatters'

  export default {
    name: 'gift-success',

    setup() {
      const giftObject = inject('giftObject')
      const onClose = inject('onClose')
      const router = useRouter()

      const wallet = computed(() => {
        return COIN_TYPE.find(item => item.id === giftObject.id)
      })

      const action = () => {
        router.push({ name: 'center/record', query: { type: 'give' } })
        onClose()
      }
      const giftSuccessAnim = ref(null)

      onMounted(() => {
        nextTick(() => {
          // 只有金幣/銀幣動畫 => gold/silver，其他都屬於other
          const animDataType = ref('other')
          if (['gold', 'silver'].includes(wallet.value.type)) {
            animDataType.value = wallet.value.type
          }
          lottie.loadAnimation({
            container: giftSuccessAnim.value,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: require(`./images/ani_packgift_${animDataType.value}.json`)
          })
        })
      })

      return {
        giftObject,
        wallet,
        giftSuccessAnim,
        // fn
        pointFormatter,
        action
      }
    }
  }
</script>

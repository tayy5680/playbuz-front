<template>
  <div :class="tw(['flex', 'flex-col', 'items-center', 'justify-between', 'h-full', 'pt-10'])">
    <div :class="tw(['flex', 'flex-col', 'items-center', 'mx-auto', 'w-5/6'])">
      <!-- 光芒 logo 區塊 -->
      <div ref="logo" :class="tw(['-my-6', 'w-full'])"></div>
    </div>
    <div :class="tw(['h-44', 'text-center', 'text-presentGold'])">
      <h3 :class="tw(['text-lg'])">{{ $t('恭喜您註冊成功') }}</h3>
      <p :class="tw(['mt-1', 'mb-4', 'text-sm'])">
        {{ $t('新用戶獎勵已發送!') }}
      </p>
      <p :class="tw(['text-white', 'text-sm'])">
        {{ $t('恭喜您成為 {name} 的夥伴', { name: codeUserNickname }) }}
      </p>
    </div>
    <div :class="tw(['flex', 'justify-between', 'w-4/5', 'tablet:w-4/6', 'mb-1'])">
      <button
        v-if="!returnUrl"
        :class="
          tw([
            'border-1',
            'border-violet',
            'block',
            'text-base',
            'w-1/2',
            'h-12',
            'tablet:text-sm',
            'tablet:h-11',
            'mr-2',
            'text-violet',
            'rounded-full',
            'focus:outline-none'
          ])
        "
        @click="close"
      >
        {{ $t('先逛逛') }}
      </button>
      <button
        :class="
          tw([
            'block',
            returnUrl ? 'w-full' : 'w-1/2',
            'h-12',
            'text-base',
            'text-white',
            'bg-redBtn',
            'tablet:text-sm',
            'tablet:h-11',
            'rounded-full',
            'focus:outline-none'
          ])
        "
        @click="goStore"
      >
        {{ $t(returnUrl ? '回到活動頁' : '前往商城') }}
      </button>
    </div>
    <div
      v-if="description"
      :class="
        tw([
          'flex',
          'justify-between',
          'w-4/5',
          'tablet:w-4/6',
          'my-3.5',
          'pt-3.5',
          'px-2',
          'border-t-1',
          'border-purpleLine'
        ])
      "
    >
      <p :class="tw(['text-lakeGreen', 'text-sm'])">
        <img src="../images/i_shop3.svg" :class="tw(['-mt-1', 'mr-2', 'inline-block'])" />
        <span :class="tw(['mr-3', 'align-middle'])"> {{ $t('您已獲得夥伴獎勵') }}: {{ description }} </span>
      </p>
    </div>
  </div>
</template>

<script>
  import { ref, onMounted, inject, computed } from 'vue'
  import store from '@/store'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import lottie from 'lottie-web'
  import { getJson } from '@/utils/get-Url-Data'

  export default {
    name: 'introduceSuccess',

    setup() {
      const { t } = useI18n()
      const router = useRouter()
      const logo = ref(null)
      const codeUserNickname = inject('codeUserNickname')
      const close = inject('close')
      const returnUrl = computed(() => store.state.platform.returnUrl)
      const i18nAnim = inject('i18nAnim')
      const description = computed(() => {
        const reward = store.getters['login/signupReward']
        if (!reward) return ''
        let text = ''
        if (reward.GoldPoint) text += `${t('金幣')} ${reward.GoldPoint.toLocaleString()}`
        if (reward.SilverPoint) text += `${t('銀幣')} ${reward.SilverPoint.toLocaleString()}`
        if (reward.CanQuantity) text += t('狗罐頭 {quantity} 個', { quantity: reward.CanQuantity })
        if (reward.Exp) text += t('經驗值 {exp} 點', { exp: reward.Exp })
        return text
      })
      const goStore = () => {
        if (returnUrl.value)
          location.href = returnUrl.value + (returnUrl.value.includes('?') ? '&' : '?') + 'autoSignIn=true'
        else router.push('/deposit').then(close)
      }

      onMounted(async () => {
        const animUrl = codeUserNickname.value ? '/lottie/login/logintop.json' : '/lottie/login/logo.json'
        const json = await getJson(animUrl)
        lottie.loadAnimation({
          container: logo.value,
          assetsPath: '/lottie/login/img/login/lottie_logo/',
          animationData: JSON.parse(i18nAnim(JSON.stringify(json))),
          renderer: 'svg',
          loop: true,
          autoplay: true
        })
      })

      return {
        logo,
        codeUserNickname,
        description,
        returnUrl,
        // fn
        close,
        goStore
      }
    }
  }
</script>

<style lang="scss" scoped>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type='number'] {
    -moz-appearance: textfield;
  }

  .code__input:focus {
    border-color: #7a4baa;
  }
</style>

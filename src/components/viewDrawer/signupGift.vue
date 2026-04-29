<template>
  <div
    :class="
      tw([
        'flex',
        'flex-col',
        'w-4/5',
        'h-full',
        'mx-auto',
        'justify-around',
        'text-center',
        'py-8',
        'tablet:w-3/5',
        'text-BaseColor'
      ])
    "
  >
    <div class="upper__box" :class="tw(['h-3/5'])">
      <div class="gift__icons" :class="tw(['mt-6'])">
        <img src="./images/i_shop.svg" width="110" :class="tw(['-mr-8'])" />
        <img src="./images/i_money_gold.svg" width="72" :class="tw(['mt-2', '-ml-3'])" />
        <table :class="tw(['text-presentGold', 'text-xl', 'mt-0.5', 'mx-auto', 'text-left', 'border-separate'])">
          <tr v-if="gifts.gold">
            <td :class="tw('text-right')">{{ $t('金幣') }}</td>
            <td>{{ gifts.gold.toLocaleString() }}</td>
          </tr>
          <tr v-if="gifts.silver">
            <td :class="tw('text-right')">{{ $t('銀幣') }}</td>
            <td>{{ gifts.silver.toLocaleString() }}</td>
          </tr>
          <tr v-if="gifts.can">
            <td :class="tw('text-right')">{{ $t('罐頭') }}</td>
            <td>{{ gifts.can }}</td>
          </tr>
          <tr v-if="gifts.exp">
            <td :class="tw('text-right')">{{ $t('經驗') }}</td>
            <td>{{ gifts.exp }}</td>
          </tr>
        </table>
      </div>
      <p :class="tw(['text-sm', 'pt-3.5'])">
        {{ isGuest ? $t('恭喜獲得訪客禮包！') : $t('恭喜獲得註冊禮包！') }}
      </p>
    </div>
    <button
      :class="
        tw([
          !userCode ? 'bg-purpleBtn' : 'bg-redBtn',
          'block',
          'h-11',
          'text-white',
          'rounded-full',
          'mt-12',
          'focus:outline-none'
        ])
      "
      @click="submit"
    >
      {{ userCode ? $t('兌換禮包') : returnUrl ? $t('回到活動頁') : $t('開始遊戲') }}
    </button>
    <hr :class="tw(['my-4', 'tablet:my-0', 'border-purpleLine'])" />
    <p v-if="isGuest" :class="tw(['text-sm'])">
      {{ $t('訪客獎勵已發送！') }}
    </p>
    <!--
    div(v-if='!isGuest' :class="tw([\
      'relative',\
    ])")
    span.placeholder(
      v-if='otherGift === ""'
      :class="tw([\
        'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',\
        'w-full',\
        'z-10',\
      ])"
      @click.stop='focus'
    )
      img(src='./images/i_shop4.svg' :class="tw([\
        '-mt-1',\
        'mr-2',\
        'w-7',\
        'inline-block',\
      ])")
      span(:class="tw([\
        'mr-3',\
        'align-middle',\
        'text-violet',\
        'text-sm',\
      ])") {{ userCode || '輸入夥伴禮包序號' }}
    input(
      type='text'
      v-model='otherGift'
      :disabled="!!userCode"
      @keydown.enter='submit'
      :class="tw([\
        'relative z-20',\
        'block',\
        'w-full',\
        'h-10',\
        'rounded-full',\
        'text-center',\
        'text-white',\
        'text-base',\
        'border-1',\
        'bg-transparent',\
        error ? 'placeholder-red-500' : '',\
        error ? 'border-red-500' : 'border-nicknameBorder',\
      ])"
    ) -->
  </div>
</template>

<script>
  import { ref, inject, computed } from 'vue'
  import store from '@/store'

  import { event } from 'vue-gtag-next'

  export default {
    name: 'signup-gift',

    setup() {
      const close = inject('close')
      const userCode = computed(() => store.state.login.agmCode || store.state.login.mgmCode)
      const info = computed(() => store.state.member.info)
      const returnUrl = computed(() => store.state.platform.returnUrl)
      const error = ref('')
      const gifts = computed(() => {
        const reward = store.getters['login/signupReward']
        if (!reward) return {}
        return {
          gold: reward.GoldPoint,
          silver: reward.SilverPoint,
          can: reward.CanQuantity,
          exp: reward.Exp
        }
      })

      const submit = () => {
        if (returnUrl.value)
          location.href = returnUrl.value + (returnUrl.value.includes('?') ? '&' : '?') + 'autoSignIn=true'
        else {
          event('signup_promote_code', { success: false })
          close()
        }
      }

      return {
        gifts,
        returnUrl,
        error,
        userCode,
        isGuest: computed(() => info.value?.IsGuest ?? true),
        // fn
        submit
      }
    }
  }
</script>

<style lang="scss" scoped>
  .register-gift-box {
    background: white;
  }

  .gift__icons img {
    display: inline-block;
  }
</style>

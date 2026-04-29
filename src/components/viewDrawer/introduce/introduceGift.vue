<template>
  <div
    :class="
      tw(['flex', 'flex-col', 'w-4/5', 'h-full', 'mx-auto', 'justify-around', 'text-center', 'py-8', 'tablet:w-3/5'])
    "
  >
    <div class="upper__box" :class="tw(['h-3/5'])">
      <div class="gift__icons" :class="tw(['mt-6'])">
        <img src="../images/i_shop.svg" width="110" :class="tw(['-mr-8'])" />
        <img src="../images/i_money_gold.svg" width="72" :class="tw(['mt-2', '-ml-3'])" />
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
      <p :class="tw(['text-white', 'text-sm', 'pt-3.5'])">
        {{ $t('恭喜獲得註冊禮包！') }}
      </p>
    </div>
    <button
      :class="tw(['bg-purpleBtn', 'block', 'h-11', 'text-white', 'rounded-full', 'mt-12', 'focus:outline-none'])"
      @click="submit"
    >
      {{ $t('領取禮包') }}
    </button>
    <hr :class="tw(['my-4', 'border-purpleLine'])" />
    <p :class="tw(['text-lakeGreen', 'text-sm'])">
      <img src="../images/i_shop3.svg" :class="tw(['-mt-1', 'mr-2', 'inline-block'])" />
      <span :class="tw(['mr-3', 'align-middle'])"> {{ $t('夥伴禮包序號') }} {{ agmCode }} </span>
    </p>
  </div>
</template>

<script>
  import { inject, computed } from 'vue'
  import store from '@/store'

  export default {
    name: 'introduceGift',

    setup() {
      const agmCode = computed(() => store.getters['login/agmCode'])
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
      const changeView = inject('changeView')
      const submit = () => {
        changeView('introduceSuccess')
      }

      return {
        gifts,
        agmCode,
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

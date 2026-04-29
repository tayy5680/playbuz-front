<template>
  <div class="personal_wrap">
    <div class="personal_container">
      <div
        class="personal_label"
        :class="tw([
          'flex-col',
          'flex',
          'items-center',
          'mb-30px',
          'md:mb-10px',
          'text-[24px]'])">
        <div class="info_level">
          {{ `LV. ${info.level}` }}
        </div>
        <div :class="tw(['flex', 'items-baseline', 'relative'])"
        @click="renameDisplay=true">
          <div
            class="info_name"
            :class="tw([
              'truncate',
              'overflow-ellipsis',
              'flex-1',
              'md:pl-[4px]',
            ])"
          >
            {{ info.name }}
          </div>
          <div :class="tw(['absolute', '-right-12', 'cursor-pointer'])">
            <img :src="require('@/assets/img/icons/edit.svg')" :class="tw(['w-7', 'ml-4'])" >
          </div>
        </div>
      </div>
      <div class="personal-vip_container"
        :class="tw(['pb-[12px]', 'md:py-[4px]'])">
        <div class="info-vip_progress"
          :class="tw([
            'h-[8px]',
            'mb-1',
            'rounded-full',
            'bg-[#232323]',
            'overflow-hidden'])" >
          <div class="info-vip_progress-pointer"
            :class="tw([
              `w-[${info.exp /info.expNext * 100}%]`,
              'h-full',
              'bg-centerPercentBar',
              'rounded-full'])" />
        </div>
        <div class="info-vip_progress-label"
          :class="tw([
            'text-18px',
            'text-[#6A6273]',
            'text-right',
            'whitespace-nowrap',
            'text-right'])">
          {{ `${info.exp} / ${info.expNext}` }}
        </div>
      </div>
      <div class="info-balance__container" :class="tw(['min-w-[300px]', 'mb-10'])">
        <div
          class="info-balance__item"
          v-for="item of wallet"
          :key="item.id"
          :class="tw([
            'bg-[#F5F2F2]',
            'rounded-full',
            'mb-[8px]',
            'md:mb-[2px]',
            'py-[4px]',
            'px-[12px]',
            'md:p-[4px]',
            'md:pr-[18px]',
            'flex',
            'items-center',
            'cursor-pointer',
            'w-full'
          ])"
          @click.stop="actionBalance(item.id)"
        >
          <img
            class="info-balance__img"
            :src="item.img"
            :class="tw([
              'w-[30px]',
              'h-[30px]',
              'md:w-[24px]',
              'md:h-[24px]',
            ])"
          />
          <div
            class="info-balance__count"
            :class="tw([
              'mx-12px',
              'flex-1',
              `text-[${item.color}]`,
              'text-18px',
            ])"
          >
            {{ item.count }}
          </div>
          <div
            class="icon"
            :class="tw([
              'bg-[#B5B2A4]',
              'w-8px',
              'h-8px',
            ])"
            :style="{
              '-webkit-mask': setStyleMaskImage(require('./images/i_triangle_fillet.svg')),
              'mask': setStyleMaskImage(require('./images/i_triangle_fillet.svg')),
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
  <teleportItem>
    <renameView v-if="renameDisplay" @close="renameDisplay = false" />
  </teleportItem>
</template>

<script>
import { computed, ref } from 'vue'
import store from '@/store'

import teleportItem from '@/components/ui/teleport-item'
import renameView from '@/views/center/edit/rename.vue'

import { pointFormatter } from '@/utils/formatters'
import { COIN_TYPE } from '@/configs'

export default {
  name: 'center-info',

  components: {
    teleportItem,
    renameView,
  },

  setup () {
    const renameDisplay = ref(false)
    const info = computed(() => {
      const target = store.state.member.info
      return {
        name: target?.NickName || '',
        level: target?.VIP?.Level || 0,
        exp: target?.VIP?.Experience || 0,
        expNext: target?.VIP?.NextExperience || 0,
        progress: target?.VIP?.Experience / target?.VIP?.NextExperience * 100 || 0,
      }
    })

    const wallet = computed(() => {
      return COIN_TYPE.reduce((acc, cur) => {
        return acc.concat({
          id: cur.id,
          img: cur.icon,
          color: cur.color,
          count: pointFormatter(store.getters['wallet/walletTotal']?.[cur.type] || 0),
        })
      }, [])
    })

    const actionBalance = (id) => {
      store.dispatch('wallet/setDisplayBalanceType', id)
      store.dispatch('wallet/setEnableBalance', !store.state.wallet.enableBalance)
    }

    const setStyleMaskImage = (url) => {
      return `url(${url}) no-repeat center /contain`
    }

    return {
      info,
      wallet,
      renameDisplay,

      // fn
      actionBalance,
      setStyleMaskImage,
    }
  },
}
</script>

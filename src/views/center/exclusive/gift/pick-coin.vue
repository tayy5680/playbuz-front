<template>
  <div
    class="pick-coin__wrap"
    :class="tw([
      'h-full',
      'flex-1',
    ])"
  >
    <div
      class="pick-coin__container"
      :class="tw([
        'mx-auto',
        'h-full',
        'w-full',
        'flex',
        'flex-col',
        'items-center',
        'justify-between',
      ])"
    >
      <div
        class="pick-coin__title"
        :class="tw([
          'text(20px center)',
          'mb-6px',
        ])"
      >
        {{ $t('請選擇幣別') }}
      </div>
      <div
        class="pick-coin__container"
        :class="tw([
          'flex',
          'items-center',
        ])"
      >
        <div
          class="pick-coin__item"
          v-for="item in COIN_TYPE"
          :key="item.id"
          :class="tw([
            'group',
            'relative',
            'rounded-xl',
            'cursor-pointer',
            'mx-4px',
          ])"
          @click="onChoose(item.id)"
        >
          <img
            :src="item.icon"
            :class="tw([
              item.id === giftObject.id ? 'bg-[#39343E]' : 'bg-none',
              'group-hover:bg-[#39343E]',
              'w-[130px]',
              'h-[130px]',
              'rounded-[20px]',
              'p-[30px]',
              transitionBase,
            ])"
          />
          <div
            class="pick-coin__text"
            :class="tw([
              'w-full',
              item.id === giftObject.id ? 'text-[#ffd500]' : 'text-[#AFA0BE]',
              'text-[16px]',
              'text-center',
              'mt-6px',
              transitionBase,
            ])"
          >
            {{ $t(item.label) }}
          </div>
          <img
            :class="tw([
              'absolute',
              'w-[34px]',
              'h-[34px]',
              '-top-2',
              '-left-2',
              item.id === giftObject.id ? 'opacity-100' : 'opacity-0',
              transitionBase,
            ])"
            src='./images/i_tick3.svg'
          />
        </div>
      </div>
      <button
        :class="tw([
          'bg-purpleBtn',
          'cursor-pointer',
          'block',
          'w-full',
          'text-[18px]',
          'text-white',
          'text-center',
          'rounded-full',
          'focus:outline-none',
          'py-8px',
        ])"
        @click="onSubmit"
      >
        {{ $t('下一步') }}
      </button>
    </div>
  </div>
</template>

<script>
import { inject } from 'vue'

import { COIN_TYPE } from '@/configs'

export default {
  name: 'gift-pick-coin',

  setup () {
    const setupIndex = inject('setupIndex')
    const giftObject = inject('giftObject')

    const onChoose = (id) => {
      giftObject.id = id
    }

    const onSubmit = () => {
      setupIndex.value++
    }

    return {
      COIN_TYPE,
      giftObject,
      // fn
      onChoose,
      onSubmit,
    }
  },
}
</script>

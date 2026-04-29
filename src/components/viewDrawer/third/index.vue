<template>
  <div
    class="third__wrap"
    :class="tw([
      'flex',
      'flex-col',
      'h-full',
    ])"
  >
    <div
      class="third__top"
      :class="tw([
        'relative',
        'min-h-[120px]',
      ])"
    >
      <img
        class="jkf__bg"
        :src="require('./images/bg_jkf01.jpg')"
        :class="tw([
          'rounded-t-20px',
          'absolute',
          'md:relative',
        ])"
        :style="{
          '-webkit-mask': 'linear-gradient(to top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 34%)',
          'mask': 'linear-gradient(to top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 34%)',
        }"
      />
      <img
        class="jkf__logo"
        :src="require('./images/jkf_titlelogo.png')"
        :class="tw([
          'absolute',
          'top-[-20px]',
          'left-1/2',
          '-translate-x-1/2',
          '-mt-38px',
          'mx-auto',
          'max-w-[280px]',
        ])"
      />
    </div>
    <div
      class="third__container"
      :class="tw([
        'flex-1',
        'relative',
        'flex',
        'justify-center',
        'items-end',
        'flex-col',
      ])"
    >
      <component :is="thirdStep" />
    </div>
  </div>
</template>

<script>
import { onBeforeUnmount, provide, ref } from 'vue'

import { event } from 'vue-gtag-next'

import viewSetProfile from './set-profile'
import viewReward from './reward'
import viewComplete from './complete'
import viewSelectLoginType from './selectLoginType.vue'
import viewInputValidate from '../inputValidate.vue'

export default {
  name: 'third-sign-in',

  components: {
    viewSetProfile,
    viewReward,
    viewComplete,
    viewSelectLoginType,
    viewInputValidate,
  },

  setup () {
    const loading = ref(false)
    provide('loading', loading)

    const thirdLoginObject = ref({})
    provide('thirdLoginObject', thirdLoginObject)

    const thirdObject = ref({})
    provide('thirdObject', thirdObject)

    const thirdStep = ref('viewSelectLoginType')
    const thirdChangeStep = (name) => {
      thirdStep.value = name
    }
    provide('thirdChangeStep', thirdChangeStep)

    onBeforeUnmount(() => {
      if (thirdStep.value === 'viewInputValidate') event('signup_leave', { leave: 'phone_verify' })
      else if (thirdStep.value === 'viewSetProfile') event('signup_leave', { leave: 'photo_nickname' })
    })
    return {
      thirdLoginObject,
      thirdStep,
    }
  },
}
</script>

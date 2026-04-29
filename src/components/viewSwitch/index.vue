<template>
<div class="switch__wrap">
  <div
    class="switch__container"
    :class="tw([
      'relative',
    ])"
  >
    <div
      class="switch__label"
      :class="tw([
        'relative',
        'text-center',
        'bg-switchMobileBg',
        'p-12px',
        'rounded-full',
        'leading-none',
        'font-bold',
        'shadow-switchList',
        'md:hidden',
        transitionBase,
        isActive && 'bg-switchLabelBg',
      ])"
      @click="isActive = !isActive"
    >
      <div
        :class="tw([
          'flex-1',
          'text(20px white)',
          isActive && 'text-footerTipsText',
        ])"
      >
        {{ $t(label ?? '')}}
      </div>
      <i
        :class="tw([
          'block',
          'absolute',
          'top-1/2',
          'right-28px',
          '-translate-y-1/2',
          'w-12px',
          'h-12px',
          'bg-white',
          'transform',
          isActive && 'rotate-180 bg-footerTipsText',
        ])"
        :style="{
          '-webkit-mask':
            `url(${require('./images/icon_triangle_drop.svg')}) no-repeat center /contain`,
          'mask':
            `url(${require('./images/icon_triangle_drop.svg')}) no-repeat center /contain`,
        }"
      >
      </i>
    </div>
    <transition name="expand">
      <div
        class="switch__list"
        v-if="isActive || !isMobile"
        :class="tw([
          'w-full',
          'flex',
          'flex-col',
          'md:flex-row',
          'bg-switchBg',
          'md:bg-transparent',
          'rounded-10px',
          'overflow-hidden',
          'absolute',
          'md:static',
          'top-full',
          'mt-6px',
          'z-10',
          center && 'justify-center',
        ])"
      >
        <div
          class="switch__tips"
          :class="tw([
            'text(14px center footerTipsText)',
            'p-12px',
            'leading-none',
            'md:hidden',
          ])"
        >
          {{ $t('請選擇分類')}}
        </div>
        <div
          class="switch__item"
          v-for="(item, index) of list"
          :key="item.id"
          :class="tw([
            'py-14px',
            'md:py-4px',
            'px-20px',
            'w-full',
            'md:w-auto',
            'md:rounded-full',
            'md:border',
            'text-center',
            'md:text-left',
            'cursor-pointer',
            'leading-none',
            'text-white',
            transitionBase,
            list.length - 1 > index && 'mr-12px',
            activeID === item.id ? 'font-bold md:font-normal' : '',
            themes === 'dark' ?
              activeID === item.id ? 'bg-switchMobileBg md:bg-sort md:border-sort' : 'md:text-sort md:border-sort' :
              activeID === item.id ? 'md:text-sort md:border-sort' : 'border-transparent' ,
          ])"
          @click="action(item)"
        >
          {{ $t(item.label) }}
        </div>
      </div>
    </transition>
  </div>
</div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import store from '@/store'

export default {
  name: 'view-switch',

  props: {
    list: {
      type: Array,
      default: () => [],
    },

    activeID: {
      type: [String, Number],
      default: () => '',
    },

    center: {
      type: Boolean,
      default: () => false,
    },

    themes: {
      type: String,
      default: () => 'dark',
    },
  },

  emit: ['action'],

  setup (props, { emit }) {
    const label = ref(null)
    const isActive = ref(false)

    const active = () => {
      isActive.value = true
    }

    const action = (obj) => {
      label.value = obj.label
      emit('action', obj.id)
      isActive.value = false
    }

    const init = () => {
      const target = props.list.find(item => item.id === props.activeID)
      label.value = target?.label ?? ''
    }

    const isMobile = computed(() => store.getters['platform/isMobile'])

    watch(() => props.activeID, () => {
      init()
    })

    onMounted(() => {
      init()
    })

    return {
      active,
      label,
      isActive,
      action,
      isMobile,
    }
  },
}
</script>

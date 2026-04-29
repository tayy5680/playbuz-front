<template>
<div
  class="select__wrap"
  :class="tw([
    'w-full',
    'relative',
    'my-4',
  ])"
>
  <div
    class="switch__container"
    :class="tw([
      'relative',
      'bg-[#1E1C20]',
      'rounded-xl',
      'border',
      error ? 'border-red-600' : 'border-depositInputLine',
    ])"
  >
    <label
      class="switch__display"
      :class="tw([
        'relative',
        'block',
        'text(center 16px)',
        'p-8px',
        'leading-none',
        'cursor-pointer',
        transitionBase,
      ])"
      @click="open"
    >
      <div
        class="select__label"
        :class="tw([
          'flex-1',
          'leading-none',
          'text-white',
        ])"
      >
        {{ $t(label || placeholder) }}
      </div>
      <i
        class="select__label"
        :class="tw([
          'block',
          'absolute',
          'top-1/2',
          'right-28px',
          '-translate-y-1/2',
          'w-13px',
          'h-13px',
          'transform',
          `bg-white`,
        ])"
        :style="{
          '-webkit-mask':
            `url(${require('./images/i_triangle_fillet2.svg')}) no-repeat center /contain`,
          'mask':
            `url(${require('./images/i_triangle_fillet2.svg')}) no-repeat center /contain`,
        }"
      >
      </i>
    </label>
    <div
      class="select__list"
      v-if="isActive"
      :class="tw([
        'w-full',
        'flex',
        'flex-col',
        'bg-[#1B1A1D]',
        'rounded-10px',
        'overflow-hidden',
        'absolute',
        'top-full',
        'mt-6px',
        'z-10',
        'p-10px',
        'leading-none',
        'text(center 20px)',
      ])"
    >
      <div
        class="switch__tips"
        :class="tw([
          'p-12px',
          'text-[#7B7B7B]',
        ])"
      >
        {{ $t(placeholder) }}
      </div>
      <div
        class="switch__item"
        v-for="item of list"
        :key="item.value"
        :class="tw([
          'p-8px',
          'w-full',
          'cursor-pointer',
          'text-white',
          'mb-16px',
          activeID === item.value ? `text-white` : 'text-[#CFCFCF]',
          transitionBase,
        ])"
        @click="action(item)"
      >
        {{ $t(item.label) }}
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import store from '@/store'

export default {
  name: 'selector-main',

  /**
  * @param { array } list 項目列表。
  * @param { string, number } activeID 選中的項目ID。
  * @param { string } placeholder 預設替代文字。
  */

  props: {
    list: {
      type: Array,
      default: () => [],
    },

    activeID: {
      type: [String, Number],
      default: () => '',
    },

    placeholder: {
      type: String,
      default: () => '請選擇轉入錢包',
    },

    disabled: {
      type: Boolean,
      default: () => false,
    },

    error: {
      type: Boolean,
      default: () => false,
    },
  },

  emit: ['action'],

  setup (props, { emit }) {
    const selectElementID = ref(null)
    const label = ref(null)
    const isActive = ref(false)

    const active = () => {
      isActive.value = true
    }

    const action = (obj) => {
      label.value = obj.label
      emit('action', obj.value)
      isActive.value = false
    }

    watch(selectElementID, (val) => {
      emit('action', val)
    })

    const init = () => {
      selectElementID.value = props.activeID
      const target = props.list.find(item => item.value === props.activeID)
      label.value = target?.label ?? ''
    }

    const selectElement = ref(null)
    const open = () => {
      if (props.disabled) return false

      else isActive.value = !isActive.value
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
      selectElementID,
      open,
      selectElement,
    }
  },
}
</script>

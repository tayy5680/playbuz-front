<template>
<div class="select__wrap">
  <div
    class="switch__container"
    :class="tw([
      'relative',
    ])"
  >
    <label
      class="switch__display"
      :class="tw([
        'block',
        'relative',
        'text-center',
        disabled ? 'bg-purpleLine' : themes === 2 ? 'bg-dropDownBlueBg' : 'bg-switchMobileBg',
        'p-8px',
        'rounded-full',
        'leading-none',
        'font-bold',
        'shadow-switchList',
        isActive ? themes === 2 ? 'bg-dropDownBlueHoverBg' : 'bg-switchLabelBg' : '',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        transitionBase,
      ])"
      @click="open"
    >
      <div
        class="select__label"
        :class="tw([
          'flex-1',
          'text(18px white)',
          'leading-none',
          disabled ? 'text-confirmBtnText' : isActive ? themes === 2 ? 'text-dropDownBlueHoverText' : 'text-footerTipsText' : '',
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
          'w-12px',
          'h-12px',
          disabled ? 'bg-confirmBtnText' : 'bg-white',
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
    </label>
    <transition name="expand">
      <div
        class="select__list"
        v-if="isActive && !isMobile"
        :class="tw([
          'w-full',
          'flex',
          'flex-col',
          themes === 2 ? 'bg-dropDownBluePop' : 'bg-switchBg',
          'rounded-10px',
          'overflow-hidden',
          'absolute',
          'top-full',
          'mt-6px',
          'z-10',
        ])"
      >
        <div
          class="switch__tips"
          :class="tw([
            'text(14px center)',
            themes === 2 ? 'text-dropDownBlueHoverText' : 'text-footerTipsText',
            'p-12px',
            'leading-none',
          ])"
        >
          {{ $t('請選擇分類') }}
        </div>
        <div
          class="switch__item"
          v-for="(item, index) of list"
          :key="item.id"
          :class="tw([
            'py-14px',
            'px-20px',
            'w-full',
            'text-center',
            'cursor-pointer',
            'leading-none',
            'text-white',
            transitionBase,
            list.length - 1 > index && 'mr-12px',
            activeID === item.id ? 'font-bold md:font-normal' : '',
            'border-transparent',
            themes === 2 ? 'hover:bg-dropDownBlueBg' : 'hover:bg-switchMobileBg',
            activeID === item.id ? themes === 2 ? 'bg-dropDownBlueBg' : 'bg-switchMobileBg' : '',
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
  name: 'drop-down',

  /**
  * @param { array } list 項目列表。
  * @param { string, number } activeID 選中的項目ID。
  * @param { string } placeholder 預設替代文字。
  * @param { number } themes 樣式類別(1預設紫、2銀幣藍)。
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
      default: () => '請選擇分類',
    },

    themes: {
      type: Number,
      default: () => 1,
    },

    disabled: {
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
      emit('action', obj.id)
      isActive.value = false
    }

    watch(selectElementID, (val) => {
      emit('action', val)
    })

    const init = () => {
      selectElementID.value = props.activeID
      const target = props.list.find(item => item.id === props.activeID)
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

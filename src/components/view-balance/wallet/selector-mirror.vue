<template>
  <div
    class="select__wrap"
    :class="tw([
      'w-full',
      'relative',
    ])"
  >
    <div
      class="switch__container"
      :class="tw(['relative'])"
    >
      <label
        class="switch__display"
        :class="tw([
          'block',
          'relative',
          'text-center',
          'p-8px',
          'leading-none',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          transitionBase,
          'bg-deepBlackPurple',
          'rounded-10px',
        ])"
        @click="open"
      >
        <div
          class="select__label"
          :class="tw([
            'flex-1',
            'text(20px white)',
            'font-extralight',
            'leading-none',
          ])"
        >
          {{ label || placeholder }}
        </div>
        <i
          class="select__label"
          :class="tw([
            'block',
            'absolute',
            'top-1/2',
            'right-28px',
            '-translate-y-1/2',
            'w-14px',
            'h-14px',
            'transform',
            'bg-white',
          ])"
          :style="{
            '-webkit-mask':
              `url(${require('./images/i_triangle_fillet2.svg')}) no-repeat center /contain`,
            'mask':
              `url(${require('./images/i_triangle_fillet2.svg')}) no-repeat center /contain`,
          }"
        ></i>
      </label>
      <div
        class="select__list"
        v-if="isActive && !isMobile"
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
          {{ placeholder }}
        </div>
        <div
          class="switch__item"
          v-for="item of list"
          :key="item.id"
          :class="tw([
            'p-8px',
            'w-full',
            'cursor-pointer',
            'text-white',
            'mb-16px',
            'hover:bg-[#26252A]',
            activeID === item.id ? 'bg-[#26252A]' : '',
            activeID === item.id ? `text-[${walletTypeTemplete.color}]` : 'text-[#CFCFCF]',
            transitionBase,
          ])"
          @click="action(item)"
        >
          {{ item.label }}
        </div>
      </div>
      <select
        v-if="!disabled"
        ref="selectElement"
        v-model="selectElementID"
        :class="tw([
          'absolute',
          'top-0',
          'left-0',
          'w-full',
          'h-full',
          'opacity-0',
          'md:hidden',
        ])"
      >
        <option
          v-for="item of list"
          :key="item.id"
          :value="item.id"
        >
          {{ item.label }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, inject } from 'vue'
import store from '@/store'

export default {
  name: 'selector-mirror',

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

    const walletTypeTemplete = inject('walletTypeTemplete')

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

      if (isMobile.value) selectElement.value.focus()
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
      walletTypeTemplete,
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

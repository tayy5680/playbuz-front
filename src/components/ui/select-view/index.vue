<template>
  <div class="select_wrap" :class="tw(['w-full', 'relative', 'group'])" >
    <div class="select_container" :class="tw(['relative'])" >
      <label class="select_label"
        :class="tw([
          'flex',
          'relative',
          'items-center',
          'py-[8px]',
          'px-[10px]',
          'md:min-w-[150px]',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          transitionBase,
          'bg-[#F5F2F2]',
          'rounded-full',
          transitionBase,
          { 'border border-[#FF6767]': error }])"
        @click="open" >
        <div class="select_label"
          :class="tw([
            'flex-1',
            'text-center',
            'leading-none',
            'pr-[8px]'])">
          <span :class="tw(['text-left', 'inline-block'])" >
            {{ $t(selectItem?.label || placeholder) }}
          </span>
        </div>
        <i class="select_label"
          :class="tw([
            'block',
            'w-6px',
            'h-6px',
            'bg-BaseColor',
          ])"
          :style="{
            '-webkit-mask':
              `url(${require('./images/i_triangle_fillet.svg')}) no-repeat center /contain`,
            'mask':
              `url(${require('./images/i_triangle_fillet.svg')}) no-repeat center /contain`,
          }" />
      </label>
      <transition name="fade">
        <div class="select_list"
          v-if="isDisplaySelectList"
          :class="tw([
            'w-full',
            'flex',
            'flex-col',
            'bg-[#F5F2F2]',
            'rounded-[3px]',
            'overflow-hidden',
            'absolute',
            'top-full',
            'mt-6px',
            'z-10',
            'py-[4px]',
            'leading-none',
            'text-center'])" >
          <div class="select_item"
            v-for="item of list"
            :key="item.id"
            :class="tw([
              'p-8px',
              'w-full',
              'cursor-pointer',
              'hover:text-AccentColor',
              { 'text-AccentColor': selectItem.id === item.id },
              transitionBase])"
            @click="selectItemID = item.id" >
            <span :class="tw(['text-left', 'inline-block'])">
              {{ $t(item.label) }}
            </span>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import store from '@/store'

export default {
  name: 'selector-view',

  /**
  * @param { string } placeholder 預設替代文字。
  * @param { array } list 項目選單列表。
  * @param { string, number } activeID 選中的項目ID。
  * @param { boolean } disabled 是否可以選取。
  */

  props: {
    placeholder: {
      type: String,
      default: () => '',
    },

    list: {
      type: Array,
      default: () => [],
    },

    activeID: {
      type: [String, Number],
      default: () => '',
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
    const isDisplaySelectList = ref(false)
    const activeID = computed(() => props.activeID ?? null)
    const selectItemID = ref(activeID.value)
    const selectItem = computed(() => {
      const target = props.list.find(item => item.id === selectItemID.value)
      return target ?? {}
    })
    const selectElement = ref(null)

    const isMobile = computed(() => store.getters['platform/isMobile'])

    watch(activeID, (val) => {
      if (!val) return false

      if (selectItemID.value !== val) {
        const target = props.list.find(item => item.id === val)
        selectItemID.value = target.id ?? null
      }
    })

    watch(selectItemID, (val, o) => {
      emit('action', val)
      if (o !== null) touchListener()
    })

    const touchListener = () => {
      isDisplaySelectList.value = !isDisplaySelectList.value
      if (!isDisplaySelectList.value) document.body.removeEventListener('click', touchListener)
    }

    const open = () => {
      if (props.disabled) return false
        document.body.addEventListener('click', touchListener)
    }

    const init = () => {
      if (props.activeID) {
        const target = props.list.find(item => item.id === props.activeID)
        selectItemID.value = target.id ?? null
      }
    }

    init()

    return {
      isMobile,
      isDisplaySelectList,
      selectItem,
      selectItemID,
      selectElement,
      // fn
      open,
    }
  },
}
</script>

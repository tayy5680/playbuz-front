<template>
  <button
    class="button__wrap"
    :class="tw([
      'relative',
      'leading-none',
      'overflow-hidden',
      'z-10',
      'group',
      { 'py-[8px]': size === 'large' },
      'focus:outline-none',
      style,
      transitionBase,
    ])"
  >
    <div
      class="button__bg"
      v-if="!outline"
      :class="tw([
        'absolute',
        'top-0',
        'left-0',
        'group-hover:-left-[100%]',
        'w-[200%]',
        'h-full',
        'z--1',
        bg,
        transitionBase,
      ])"
    ></div>
    <slot class="button__label"></slot>
  </button>
</template>

<script>
import { apply } from 'twind'

export default {
  props: {
    /**
      * @param {string} type 種類: primary: 紫, secondary: 綠, finish: 紅紫, gray: 灰
      * @param {string} size 種類: large: 大, small: 小
      * @param {string} width 寬度
      * @param {boolean} outline 是否為線
      * @param {boolean} rounded 是否為全圓角
      * @param {boolean} disabled 是否為不可點選狀態
     */

    type: {
      type: String,
      default: () => 'primary',
    },

    size: {
      type: String,
      default: () => 'large',
    },

    outline: {
      type: Boolean,
      default: () => false,
    },

    width: {
      type: Number,
      default: () => null,
    },

    rounded: {
      type: Boolean,
      default: () => true,
    },

    disabled: {
      type: Boolean,
      default: () => false,
    },
  },

  setup (props) {
    // 外圍
    const style = () => {
      const target = []

      if (props.outline) {
        target.push(...[
          'border-1',
          'hover:border-white',
          'hover:text-white',
        ])

        switch (props.type) {
          case 'primary':
            target.push(...[
              'border-bannerBg',
              'text-bannerBg',
            ])
            break
        }
      } else {
        switch (props.type) {
          case 'primary':
          case 'secondary':
          case 'finish':
            target.push(...[
              'text-white',
            ])
            break
        }
      }

      switch (props.size) {
        case 'large':
          target.push(...[
            'min-w-[189px]',
          ])
          break
        case 'small':
          target.push(...[
            'min-w-[100px]',
            'md:min-w-0',
            'px-18px',
            'py-8px',
            'md:py-6px',
            'text-16px',
            'md:text-12px',
          ])
          break
        default:
      }

      if (props.rounded) target.push('rounded-full')
      else target.push('rounded-10px')

      return apply`${target.join(' ')}`
    }

    // 背景色
    const bg = () => {
      if (props.outline) return false
      const target = []

      switch (props.type) {
        case 'primary':
          target.push(...[
            'bg-purple',
          ])
          break
        case 'secondary':
          target.push(...[
            'bg-green',
          ])
          break
        case 'finish':
          target.push(...[
          ])
          break
        case 'opacity':
        target.push(...[
          'bg-[#ffffff00]',
        ])
        break
      }

      return apply`${target.join(' ')}`
    }

    return {
      style,
      bg,
    }
  },
}
</script>

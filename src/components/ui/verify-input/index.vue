<template>
  <div class="verify__wrap" :class="tw(['flex', 'justify-center', 'relative', 'w-full'])">
    <input
      class="verify__input"
      type="tel"
      pattern="\d*"
      inputmode="numeric"
      :maxlength="count"
      :value="code"
      :class="tw(['absolute', 'top-0', 'left-0', 'w-full', 'h-full', 'opacity-0', 'focus:outline-none', 'z-10'])"
      ref="numInput"
    />
    <div
      class="verify__fake"
      v-for="(_, index) in count"
      :key="index"
      :class="[
        tw([
          'flex',
          'items-center',
          'justify-center',
          'w-[44px]',
          'h-[60px]',
          'rounded-[6px]',
          'mx-[3px]',
          'text-[30px]',
          'text-white',
          'bg-codeBox',
          'border',
          code.length === index ? 'border-nicknameBorder' : code[index] ? 'border-codeBox' : 'border-[#4C4256]'
        ])
      ]"
    >
      {{ code.length === index ? '_' : index < code.length ? (isUseFormat ? specialCode[index] ?? '*' : '*') : '' }}
    </div>
  </div>
</template>

<script>
  import { nextTick } from 'vue'
  import { ref } from '@vue/reactivity'
  import { onMounted } from '@vue/runtime-core'
  export default {
    props: {
      code: {
        type: String,
        default: () => ''
      },

      count: {
        type: Number,
        default: () => 6
      }
    },

    setup(props) {
      const formatCodeList = [
        '𓀞',
        '𓀟',
        '𓀠',
        '𓀡',
        '𓀢',
        '𓀣',
        '𓀤',
        '𓀥',
        '𓀦',
        '𓀧',
        '𓀨',
        '𓀩',
        '𓀪',
        '𓀫',
        '𓀬',
        '𓀁',
        '𓀂',
        '𓀃',
        '𓀄',
        '𓀅',
        '𓀆',
        '𓀇',
        '𓀈',
        '𓀉',
        '𓀊',
        '𓀋',
        '𓀌',
        '𓀍',
        '𓀎',
        '𓀏',
        '𓀑',
        '𓀒',
        '𓀓',
        '𓀔',
        '𓀕',
        '𓀖',
        '𓀗',
        '𓀘',
        '𓀙',
        '𓀚',
        '𓀛',
        '𓀜',
        '𓀝',
        '𓁁',
        '𓁂',
        '𓁃',
        '𓁄',
        '𓁅',
        '𓁆',
        '𓁇',
        '𓁈',
        '𓁉',
        '𓁊',
        '𓁋',
        '𓁌',
        '𓁍',
        '𓁎',
        '𓁏',
        '𓁐',
        '𓁑',
        '𓁒',
        '𓁓',
        '𓁔',
        '𓁕',
        '𓁖',
        '𓁗',
        '𓁘',
        '𓁙',
        '𓀭',
        '𓀮',
        '𓀯',
        '𓀰',
        '𓀱',
        '𓀲',
        '𓀳',
        '𓀴',
        '𓀵',
        '𓀶',
        '𓀷',
        '𓀸',
        '𓀹',
        '𓀺',
        '𓀻',
        '𓀼',
        '𓀽',
        '𓀾',
        '𓀿',
        '𓁀',
        '𓁲',
        '𓁚',
        '𓁛',
        '𓁜',
        '𓁝',
        '𓁞',
        '𓁟',
        '𓁠',
        '𓁡',
        '𓁢',
        '𓁣',
        '𓁤',
        '𓁥',
        '𓁦',
        '𓁧',
        '𓁨',
        '𓁩',
        '𓁪',
        '𓁫',
        '𓁬',
        '𓁭',
        '𓁮',
        '𓁯',
        '𓁰',
        '𓁱',
        '𓁳',
        '𓁴',
        '𓁵'
      ]
      const specialCode = ref([])
      const isUseFormat = Math.random() >= 0.9
      const numInput = ref(null)

      const formatCode = () => {
        const randomIndex = Math.floor(Math.random() * (115 - 0 + 1) + 0)
        return formatCodeList[randomIndex]
      }

      const init = () => {
        if (isUseFormat) {
          for (let i = 0; i < props.count; i++) specialCode.value.push(formatCode())
        }

        nextTick(() => {
          numInput.value.focus()
        })
      }

      onMounted(() => {
        init()
      })

      return {
        specialCode,
        isUseFormat,
        numInput
      }
    }
  }
</script>

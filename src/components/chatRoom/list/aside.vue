<template>
  <div
    class="chat-aside__wrap"
    :class="tw([
      'mx-26px',
      'mb-20px',
    ])"
  >
    <div class="chat-aside__container">
      <div
        class="chat-aside__list"
        :class="tw([
          'flex',
          'items-center',
        ])"
      >
        <div
          class="chat-aside__item"
          v-for="item of list"
          :key="item.id"
          :class="tw([
            'cursor-pointer',
            'flex-1',
            'text-center',
            'group',
          ])"
          @click="action(item.id)"
        >
          <div
            class="chat-aside__icon"
            :class="tw([
              'w-[37px]',
              'h-[37px]',
              'mx-auto',
              'mb-8px',
            ])"
            :style="{
              '-webkit-mask': setStyleMaskImage(item.img),
              'mask': setStyleMaskImage(item.img),
            }"
          >
            <div
              class="chat-aside__bg"
              :class="tw([
                'group-hover:bg-AccentColor',
                activeID === item.id ? 'bg-AccentColor' : 'bg-BaseColor',
                transitionBase,
                'w-full',
                'h-full',
              ])"
            ></div>
          </div>
          <div
            class="chat-aside__label"
            :class="tw([
              'group-hover:text-AccentColor',
              activeID === item.id ? 'text-AccentColor' : 'text-BaseColor',
              transitionBase,
            ])"
          >
            {{ $t(item.label) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, inject } from 'vue'

export default {
  name: 'chat-aside',

  setup () {
    const list = ref([
      { id: 'search', label: '搜尋', img: require('./images/i_search.svg') },
      { id: 'barcodes', label: '行動條碼', img: require('./images/i_qr_code.svg') },
    ])

    const activeID = ref(null)
    const setSearchType = inject('setSearchType')

    const action = (value) => {
      activeID.value = value
      setSearchType(value)
    }

    const init = () => {
      const id = list.value[0].id
      action(id)
    }

    init()

    const setStyleMaskImage = (url) => {
      return `url(${url}) no-repeat center /contain`
    }

    return {
      list,
      activeID,
      // fn
      setStyleMaskImage,
      action,
    }
  },
}
</script>

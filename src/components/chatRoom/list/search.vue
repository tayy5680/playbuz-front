<template>
  <div class="chat-search__wrap" :class="tw(['mx-20px', 'mb-24px', 'sticky', 'top-0', 'left-0'])">
    <div class="chat-search__container">
      <div
        class="chat-search__input"
        :class="tw(['bg-deepBlackPurple', 'rounded-full', 'py-6px', 'px-18px', 'flex', 'items-center'])"
      >
        <div
          class="chat-search__icon"
          :class="tw(['bg-violet', 'h-20px', 'w-20px', 'mr-8px'])"
          :style="{
            '-webkit-mask': `url(${require('./images/i_search.svg')}) no-repeat center /contain`,
            mask: `url(${require('./images/i_search.svg')}) no-repeat center /contain`
          }"
        ></div>
        <input
          class="chat-search__input"
          :class="tw(['bg-transparent', 'text-white', 'placeholder-violet'])"
          :value="value"
          :placeholder="placeholder"
          @input="e => $emit('chgFilterText', e.target.value)"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import { event } from 'vue-gtag-next'

  export default {
    name: 'list-search',

    props: {
      placeholder: {
        type: String,
        default: () => ''
      },

      value: {
        type: String,
        default: () => ''
      }
    },

    setup() {
      const init = () => {
        console.log('message_search_friend')
        event('message_search_friend', { success: '' })
      }

      init()
    }
  }
</script>

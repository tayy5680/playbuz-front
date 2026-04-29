<template>
  <transition name="fade">
    <div class="view_setting_condition" v-if="showPop" :class="tw(['absolute', 'right-0'])">
      <viewMiniPop>
        <template v-slot:context>
          <viewBalance />
        </template>
      </viewMiniPop>
    </div>
  </transition>
</template>

<script>
  import store from '@/store'
  import viewMiniPop from '@/components/miniPop/miniPop.vue'
  import viewBalance from '@/components/view-balance'

  export default {
    name: 'view-balance',

    props: {
      showPop: {
        type: Boolean,
        default: false
      }
    },

    components: {
      viewMiniPop,
      viewBalance
    },

    setup(props) {
      const audioControlWindow = () => {
        store.dispatch('audio/setIsShowWindow', true)
      }
      const languageWindow = () => {
        store.dispatch('member/setEnableLanguage', true)
      }

      const list = [
        { id: 'music', label: '音效設定', action: audioControlWindow },
        { id: 'language', label: '語系設定', action: languageWindow }
      ]
      return {
        list,

        // fn
        audioControlWindow,
        languageWindow
      }
    }
  }
</script>

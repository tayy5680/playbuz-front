<template>
  <div class="view_setting_condition" v-if="showPop" :class="tw(['absolute', 'right-0'])" >
    <viewMiniPop>
      <template v-slot:context>
          <ul class="view_setting_Menu" :class="[tw('transition', 'whitespace-nowrap', 'leading-10')]" >
            <li
              v-for="(item, index) in list"
              v-audio="'asideMenu'"
              :key="index"
              :class="tw(['cursor-pointer', 'text-BaseColor', 'hover:text-AccentColor'])"
              @click.stop='item.action'>
              <span>{{ $t(item.label) }}</span>
            </li>
          </ul>
      </template>
    </viewMiniPop>
  </div>
</template>

<script>
import store from '@/store'
import viewMiniPop from '@/components/miniPop/miniPop.vue'

export default {
  name: 'view-setting',

  props: {
    showPop: {
      type: Boolean,
      default: false,
    },
  },

  components: {
    viewMiniPop,
  },

  setup () {
  const audioControlWindow = () => {
      store.dispatch('audio/setIsShowWindow', true)
    }
    const languageWindow = () => {
      store.dispatch('member/setEnableLanguage', true)
    }

    const list = [
      { id: 'music', label: '音效設定', action: audioControlWindow },
      { id: 'language', label: '語系設定', action: languageWindow },
    ]
    return {
      list,

      // fn
      audioControlWindow,
      languageWindow,
    }
  },
}
</script>

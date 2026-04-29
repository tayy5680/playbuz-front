<template>
  <div
    class="chatRoom__header"
    :class="tw(['flex', 'items-center', 'justify-between', 'pt-20px', 'px-20px', 'relative', 'z-20', 'mb-20px'])"
  >
    <img
      class="logo"
      v-if="enableLogo"
      :src="require(`@/assets/img/logo/logo_PlayBUZ.svg`)"
      :class="tw(['w-100px'])"
      :alt="SITE_NAME"
    />
    <div
      class="back"
      v-if="enableBack"
      :class="tw(['cursor-pointer', 'bg-white', 'w-18px', 'h-18px', 'flex-shrink-0'])"
      :style="{
        '-webkit-mask': setStyleMaskImage(require('./images/btn_back_chat.svg')),
        mask: setStyleMaskImage(require('./images/btn_back_chat.svg'))
      }"
      @click="back"
    ></div>
    <div
      class="label"
      v-if="enableLabel"
      :class="tw(['text-white', 'overflow-ellipsis', 'overflow-hidden', 'whitespace-nowrap', 'px-16px'])"
    >
      {{ label }}
    </div>
    <div
      class="close"
      v-if="enableClose"
      v-audio="'close'"
      :class="tw(['cursor-pointer', 'flex-shrink-0'])"
      @click="close"
    >
      <maskPicture :img="require('@/assets/img/icons/i_close.svg')" size="18" :bg-color="enableBack ? 'white' : ''" />
    </div>
  </div>
</template>

<script>
  import { computed, inject } from 'vue'
  import store from '@/store'
  import { postInitUnReadCount } from '@/api/chat'
  import maskPicture from '@/components/maskPicture/maskPicture.vue'
  import { useI18n } from 'vue-i18n'

  export default {
    props: {
      label: {
        type: String,
        default: () => ''
      }
    },

    components: {
      maskPicture
    },

    setup() {
      const { t } = useI18n()
      const SITE_NAME = computed(() => t(process.env.VUE_APP_SITE_NAME))

      const setStyleMaskImage = url => {
        return `url(${url}) no-repeat center /contain`
      }

      const chatTextID = inject('chatTextID')
      const hasChatTextID = computed(() => chatTextID.value)
      const chatTextInfo = computed(() => !!Object.keys(inject('chatTextInfo').value).length)

      const enableBack = computed(() => chatTextInfo.value || hasChatTextID.value)
      const enableLogo = computed(() => !chatTextInfo.value && !hasChatTextID.value)
      const enableLabel = computed(() => hasChatTextID.value)
      const enableClose = computed(() => !(chatTextInfo.value && !hasChatTextID.value))

      const close = () => {
        store.dispatch('platform/setEnableTalk', false)
      }

      const enterChatInfo = inject('enterChatInfo')
      const chgChatTextID = inject('chgChatTextID')
      const back = async () => {
        if (chatTextID.value && chatTextInfo.value) {
          await postInitUnReadCount({ body: { groupID: chatTextID.value } })
          store.dispatch('platform/setChatRoomLis')
          store.dispatch('platform/setFriendList')
          store.dispatch('platform/setFriendCheckList')
        }

        enterChatInfo({})
        chgChatTextID()
      }

      return {
        chatTextInfo,
        enableBack,
        enableLogo,
        enableLabel,
        enableClose,
        SITE_NAME,
        back,
        close,
        setStyleMaskImage
      }
    }
  }
</script>

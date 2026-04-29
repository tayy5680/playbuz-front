<template>
  <div
    class="chat-message__wrap"
    :class="
      tw(['pt-18px', 'px-22px', 'bg-navBgHover', 'rounded-t-20px', 'overflow-auto-y', 'overflow-hidden-x', 'flex-1'])
    "
  >
    <div class="chat-message__container" :class="tw(['relative', 'min-h-full', 'flex', 'flex-col'])">
      <viewList />
      <div
        class="chat-message__bottom"
        :class="tw(['sticky', 'bottom-0', 'left-0', 'bg-navBgHover', 'flex', 'items-center', 'pt-20px', 'pb-34px'])"
      >
        <!--
        todo: 後續打包禮包時可用上的按鈕，目前沒使用隱藏先
        img.chat-message__gift(
          :class="tw([
            'mr-10px',
          ])"
          :src="require('./images/btn_sendgift.svg')"
        )
      -->
        <div
          class="chat-message__send"
          v-if="enableChatInput"
          v-loading="loading"
          :class="
            tw([
              'overflow-hidden',
              'bg-deepBlackPurple',
              'flex',
              'flex-1',
              'items-center',
              'py-8px',
              'px-20px',
              'rounded-full'
            ])
          "
        >
          <input
            class="chat-message__input"
            v-model="inputText"
            v-on:keypress.enter="sendChatText"
            :class="
              tw([
                'placeholder-violet',
                'bg-transparent',
                'flex-1',
                'w-[100px]',
                'text-white',
                'mr-4px',
                'leading-none'
              ])
            "
            :placeholder="$t('在這裡輸入訊息')"
          />
          <img
            class="chat-message__icon"
            :src="require('./images/i_gpgchat.svg')"
            :class="tw(['cursor-pointer'])"
            @click="sendChatText"
            :alt="$t('發送聊天訊息')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
  import store from '@/store'
  import { postSendChatText, getChatRoomText, postInitUnReadCount } from '@/api/chat'

  import viewList from './list'

  export default {
    name: 'message',

    components: {
      viewList
    },

    setup() {
      const loading = ref(false)
      const inputText = ref('')
      const chatTextID = inject('chatTextID')
      const enterChatRoom = inject('enterChatRoom')
      const chatTextInfo = inject('chatTextInfo')
      const chatTextList = inject('chatTextList')

      const enableChatInput = computed(() => chatTextInfo.value?.id > 0 && chatTextInfo.value?.IsFriendSate)

      const fontLengthLimit = 50
      watch(inputText, val => {
        if (val <= fontLengthLimit) return false
        inputText.value = val.substr(0, fontLengthLimit)
      })

      const sendChatText = async () => {
        if (!inputText.value || loading.value) return false
        loading.value = true

        const body = {
          groupID: chatTextID.value,
          content: inputText.value
        }

        try {
          await postSendChatText({ body })
          inputText.value = ''
          await chatRoomText()
          await enterChatRoom(chatTextInfo.value, false)
        } catch {}
        loading.value = false
      }

      const timer = ref(null)
      onMounted(() => {
        init()
        timer.value = setInterval(() => {
          chatRoomText()
        }, 2800)
      })

      const chatRoomTextTimestamp = ref(0)
      const chatRoomText = () => {
        return getChatRoomText({ body: { groupID: chatTextID.value } })
          .then(res => {
            if (chatRoomTextTimestamp.value < res.Status.Timestamp) {
              chatRoomTextTimestamp.value = res.Status.Timestamp
              chatTextList.value = res.Data.reverse()
            }
          })
          .catch(err => {
            console.warn(err)
          })
      }

      onBeforeUnmount(() => {
        clearInterval(timer.value)
      })

      const init = () => {
        store.dispatch('platform/setChatRoomLis')
        store.dispatch('platform/setFriendList')
        store.dispatch('platform/setFriendCheckList')
        postInitUnReadCount({ body: { groupID: chatTextID.value } })
      }

      return {
        inputText,
        sendChatText,
        chatTextID,
        enableChatInput,
        loading
      }
    }
  }
</script>

<template>
  <div
    class="chatRoom__wrap"
    :class="
      tw([
        !Object.keys(chatTextInfo).length ? 'bg-navBgHover' : 'bg-bg',
        'fixed',
        'top-1/2',
        'md:right-3',
        '-translate-y-1/2',
        'md:max-w-360px',
        'w-full',
        'z-30',
        'md:rounded-20px',
        'md:max-h-600px',
        'h-full',
        'overflow-hidden',
        'flex',
        'flex-col'
      ])
    "
  >
    <charHeader
      :label="chatHeaderLabel"
      :class="tw([Object.keys(chatTextInfo).length && !chatTextID ? 'absolute top-0 left-0 w-full' : ''])"
    />
    <div
      class="chatRoom__container"
      ref="scrollElement"
      :class="tw(['flex-1', 'h-full', 'overflow-y-auto', 'flex', 'flex-col', 'items-stretch'])"
    >
      <chatMessage v-if="chatTextID" />
      <chatList v-else />
      <chatInfo v-if="Object.keys(chatTextInfo).length && !chatTextID" />
    </div>
  </div>
</template>

<script>
  import { ref, provide, computed, watch, onUnmounted } from 'vue'
  import { getChatGroup, getChatRoomText } from '@/api/chat'

  import charHeader from './header'
  import chatList from './list'
  import chatInfo from './info'
  import chatMessage from './message'
  import { useNotice } from '@/utils/use-notice'
  import { event } from 'vue-gtag-next'
  import store from '@/store'

  export default {
    name: 'chat',

    components: {
      charHeader,
      chatList,
      chatInfo,
      chatMessage
    },

    setup() {
      const loading = ref(false)
      provide('loading', loading)

      const chatTextID = ref(0)
      provide('chatTextID', chatTextID)

      const chgChatTextID = () => {
        chatTextID.value = null
        nowChatRoomParam.value = null
      }
      provide('chgChatTextID', chgChatTextID)

      const friendObject = ref(null)
      provide('friendObject', friendObject)

      const chatTextInfo = ref({})
      provide('chatTextInfo', chatTextInfo)

      const chatTextList = ref([])
      provide('chatTextList', chatTextList)

      const nowChatRoomParam = ref(null)
      const enterChatRoom = async (obj, clear = true) => {
        loading.value = true
        if (!obj.id) return false

        if (clear) chatTextList.value = []
        nowChatRoomParam.value = {
          obj: obj,
          clear: clear
        }
        // 特例: 客服系統(id: -998)沒有group id，且戳了取得API會反饋非正常狀態，可直接使用id進入。
        if (obj.id === -998) {
          chatTextID.value = obj.id
          enterChatInfo(obj)
        } else {
          await getChatGroup({ body: { friendID: obj.id } })
            .then(res => {
              enterChatInfo(obj)
              chatTextID.value = res.GroupID
            })
            .catch(err => {
              const errorCodeList = {
                400: '發生錯誤，請稍後再試，或洽客服人員'
              }
              const errorMessage = errorCodeList[err.Code] ?? '發生錯誤，請稍後再試，或洽客服人員'
              useNotice({ type: 'error', message: errorMessage })
            })
        }

        await getChatRoomText({ body: { groupID: chatTextID.value } })
          .then(res => {
            chatTextList.value = res.Data.reverse()
          })
          .catch(err => {
            console.warn(err)
          })
      }

      provide('enterChatRoom', enterChatRoom)

      const enterChatInfo = obj => {
        chatTextInfo.value = obj
      }
      const chatHeaderLabel = computed(() => chatTextInfo?.value.label ?? '')
      provide('chatHeaderLabel', chatHeaderLabel)
      provide('enterChatInfo', enterChatInfo)

      // 控制聊天視窗置頂或置底。
      const scrollElement = ref(null)
      const scrollElementDirection = ({ direction = 'top', smooth = true }) => {
        const top = direction === 'bottom' ? scrollElement.value.scrollHeight : 0
        const behavior = smooth ? 'smooth' : 'instant'
        if (scrollElement.value) scrollElement.value.scrollTo({ top, behavior })
      }
      provide('scrollElementDirection', scrollElementDirection)

      const init = () => {
        event('message_show', { show: location.pathname })
        store.dispatch('platform/setRecommendList')
      }
      const lang = computed(() => store.state.member.languageCode)
      watch(lang, () => {
        store.dispatch('platform/setChatRoomLis')
        store.dispatch('platform/setFriendList')
        store.dispatch('platform/setFriendCheckList')
        if (nowChatRoomParam.value) enterChatRoom(nowChatRoomParam.value.obj, nowChatRoomParam.value.clear)
      })

      init()
      onUnmounted(() => {
        nowChatRoomParam.value = null
      })

      return {
        loading,
        chatTextID,
        chatTextInfo,
        scrollElement,
        nowChatRoomParam,
        chatHeaderLabel
      }
    }
  }
</script>
<style lang="scss" scoped>
  .chatRoom__wrap {
    box-shadow: 0 0 5px #00000040;
  }
</style>

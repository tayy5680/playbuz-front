<template>
  <div class="chat-message__list" :class="tw(['flex-1'])">
    <div
      class="chat-message__item"
      v-for="(item, index) of formatList"
      :key="index"
      :class="tw(['flex', 'items-end', item.memberID === memberID ? 'justify-end' : 'justify-start', 'mb-32px'])"
    >
      <div class="chat-message__picture" v-if="item.memberID !== memberID">
        <img
          class="chat-message__img"
          :src="item.src"
          :class="tw(['w-36px', 'h-36px', 'rounded-full', 'object-cover', 'flex-shrink-0', 'mr-16px'])"
          :onerror="nonImage"
          :alt="$t('{name}的頭像', { name: item.name })"
        />
      </div>
      <div
        class="chat-message__context"
        :class="tw(['flex', 'flex-col', item.memberID === memberID ? 'items-end' : 'items-start'])"
      >
        <div class="chat-message__date" :class="tw(['text(14px confirmBtnText)'])">
          {{ item.date }}
        </div>
        <div
          class="chat-message__text"
          :class="
            tw([
              item.memberID === memberID ? 'bg-chatroomMessageBg2' : 'bg-chatroomMessageBg',
              'text(white 13px)',
              'p-14px',
              'rounded-t-30px',
              'break-all',
              item.memberID === memberID ? 'rounded-bl-30px' : 'rounded-br-30px'
            ])
          "
        >
          {{ item.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { computed, inject, nextTick, onMounted, onUnmounted, watch } from 'vue'
  import dayjs from 'dayjs'
  import store from '@/store'

  export default {
    name: 'message-list',

    setup() {
      const memberID = computed(() => store.state.member?.info?.MemberID ?? 0)
      const list = inject('chatTextList')
      const scrollElementDirection = inject('scrollElementDirection')

      onMounted(() => {
        nextTick(() => {
          scrollElementDirection({ direction: 'bottom', smooth: false })
        })
      })

      onUnmounted(() => {
        store.dispatch('platform/setChatRoomLis')
        store.dispatch('platform/setFriendList')
        store.dispatch('platform/setFriendCheckList')
        scrollElementDirection({ direction: 'top' })
      })

      watch(list, (newVal, oldVal) => {
        nextTick(() => {
          if (oldVal?.length) scrollElementDirection({ direction: 'bottom' })
          else scrollElementDirection({ direction: 'bottom', smooth: false })
        })
      })

      const formatList = computed(() => {
        if (!list.value) return []
        return list.value.reduce((acc, cur) => {
          const target = {}
          target.memberID = cur.MemberID
          target.name = cur.NickName
          target.src = cur.Photo.Url
          target.text = cur.MessageContent
          target.date = dayjs(cur.SendTime).format('YYYY/MM/DD HH:mm')
          return acc.concat(target)
        }, [])
      })

      const nonImage = ele => {
        ele.target.src = `${require('../images/preset_avatar00.png')}`
        return true
      }

      return {
        memberID,
        formatList,
        nonImage
      }
    }
  }
</script>

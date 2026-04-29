<template>
  <div
    class="chat-info__wrap"
    :class="
      tw([
        'fixed',
        'left-0',
        'top-0',
        'w-full',
        'h-full',
        'h-full',
        'flex',
        'flex-col',
        'justify-around',
        'items-center',
        'z-10',
        'bg-navBgHover'
      ])
    "
  >
    <img
      class="chat-info__bg"
      :src="infoData.img.picture"
      :class="tw(['absolute', 'top-0', 'left-0', 'h-full', 'w-full', 'object-cover', 'opacity-30', 'z--1'])"
      :onerror="nonImage"
      :alt="$t('{name}的背景', { name: infoData.name })"
    />
    <div class="chat-info__container" :class="tw(['flex', 'flex-col', 'justify-center', 'items-center', 'w-full'])">
      <div class="chat-info__img" :class="tw(['relative'])">
        <img
          class="chat-info__picture"
          :src="infoData.img.picture"
          :class="tw(['w-80px', 'h-80px', 'rounded-full', 'object-cover', 'bg-black', 'bg-opacity-80'])"
          :onerror="nonImage"
          :alt="$t('{name}的頭像', { name: infoData.name })"
        />
        <img
          v-if="infoData.img.skin"
          class="chat-info__cover"
          :src="infoData.img.skin"
          :class="tw(['w-134px', 'absolute', 'top-1/2', 'left-1/2', '-translate-1/2', 'max-w-max'])"
          :alt="$t('{name}的頭像框', { name: infoData.name })"
        />
        <img
          class="chat-item__JKF"
          v-if="infoData.isJKF"
          :class="
            tw([
              'text(white 12px)',
              'absolute',
              'bottom-0',
              'right-0',
              'translate-y-0',
              'translate-x-1/2',
              'w-28px',
              'h-28px',
              'rounded-full',
              'z-10'
            ])
          "
          :src="require('../images/avatar_jkf01.png')"
          :alt="$t('JKF頭像')"
        />
      </div>
      <div class="chat-info__label" :class="tw(['my-18px', 'text(20px)', infoData.label ? '' : 'opacity-60'])">
        {{ chatHeaderLabel }}
      </div>
    </div>
    <div
      class="chat-info__btn"
      :class="tw(['cursor-pointer', 'flex', 'flex-col', 'items-center', 'justify-center'])"
      @click="action(infoData.IsFriendSate)"
    >
      <template v-if="(infoData.IsFriendSate && isFriend) || infoData.id < 0">
        <div
          class="caht-info__talk__icon"
          :class="tw(['bg-BaseColor', 'h-[28px]', 'w-[28px]'])"
          :style="{
            '-webkit-mask': `url(${require('./images/i_gpgchat.svg')}) no-repeat center /contain`,
            mask: `url(${require('./images/i_gpgchat.svg')}) no-repeat center /contain`
          }"
        />
        <div class="caht-info__talk__label">{{ $t('聊天') }}</div>
      </template>
      <template v-else-if="!infoData.IsFriendSate && isFriend"> </template>
      <template v-else>
        <img class="caht-info__talk__icon" :src="require('./images/i_friend.svg')" alt="" />
        <div class="caht-info__talk__label">{{ $t('加入好友') }}</div>
      </template>
    </div>
  </div>
</template>

<script>
  import { inject, ref } from 'vue'
  import { getSearchFriend } from '@/api/chat'

  export default {
    name: 'chat-info',

    setup() {
      const infoData = inject('chatTextInfo')
      const enterChatRoom = inject('enterChatRoom')
      const friendObject = inject('friendObject')
      const chatHeaderLabel = inject('chatHeaderLabel')

      const isFriend = ref(true)

      if (infoData.value) {
        getSearchFriend({ body: { searchKeyword: infoData.value.label } })
          .then(res => {
            isFriend.value = res.Data[0]?.IsFriend ?? false
          })
          .catch(err => console.warn(err))
      }

      const action = bol => {
        if (bol) enterChatRoom(infoData.value)
        else {
          infoData.value.method = 'add'
          friendObject.value = infoData.value
        }
      }

      const nonImage = ele => {
        ele.target.src = `${require('../images/preset_avatar00.png')}`
        return true
      }

      return {
        infoData,
        chatHeaderLabel,
        isFriend,
        nonImage,
        // fn
        action
      }
    }
  }
</script>

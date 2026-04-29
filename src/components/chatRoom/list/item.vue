<template>
  <div
    class="chat-item__wrap"
    v-if="Object.keys(user).length"
    :class="tw(['cursor-pointer', 'px-26px', 'py-10px', 'text-BaseColor'])"
  >
    <div class="chat-item__container" :class="tw(['flex', 'items-center'])">
      <div class="chat-item__img" :class="tw(['flex-shrink-0'])" @click="enterChatInfo(user)">
        <div class="chat-item__picture" :class="tw(['relative'])">
          <div
            class="chat-item__background"
            :class="tw(['w-50px', 'h-50px', 'object-cover', 'rounded-full', 'bg-bg', 'bg-opacity-80'])"
          ></div>
          <img
            class="chat-item__picture"
            :src="user.img.picture"
            :class="tw(['absolute', 'top-0', 'left-0', 'w-full', 'h-full', 'object-cover', 'rounded-full'])"
            :onerror="nonImage"
            :alt="$t('{name}的頭像', { name: user.name })"
          />
          <img
            v-if="user.img.skin"
            class="chat-item__cover"
            :src="user.img.skin"
            :class="
              tw(['absolute', 'top-1/2', 'left-1/2', '-translate-x-1/2', '-translate-y-1/2', 'max-w-none', 'scale-28'])
            "
            :alt="$t('{name}的頭像框', { name: user.name })"
          />
          <img
            class="chat-item__JKF"
            v-if="user.isJKF"
            :class="
              tw([
                'text(12px)',
                'absolute',
                'bottom-0',
                'right-0',
                'translate-y-0',
                'translate-x-1/2',
                'w-24px',
                'h-24px',
                'rounded-full'
              ])
            "
            :src="require('../images/avatar_jkf01.png')"
            :alt="$t('JKF頭像')"
          />
        </div>
      </div>
      <div
        class="chat-item__content"
        :class="tw(['ml-22px', 'flex-1', 'flex', 'flex-col', 'w-10'])"
        @click="actionEnterChat(user)"
      >
        <div class="chat-item__label" :class="tw(['flex', 'items-center', 'w-full', 'text-[#707070]'])">
          <img
            v-if="user.id < 0 ? true : false"
            :src="require('./images/i_official.svg')"
            :class="tw(['w-14px', 'mr-6px'])"
            :alt="$t('官方圖示')"
          />
          <div class="chat-item__name" :class="tw(['overflow-ellipsis', 'overflow-hidden', 'whitespace-nowrap'])">
            {{ user.label }}
          </div>
        </div>
        <div class="chat-item__message" :class="tw(['text(13px [#a2a2cf])'])">
          {{ user.context }}
        </div>
      </div>
      <div
        class="chat-item__btn"
        v-if="!user.IsFriendSate && menuType === 0 && user.id > 0"
        @click="actionaAgree(user)"
        :class="
          tw([
            'border',
            'border-[#a2a2cf]',
            'leading-none',
            'ml-auto',
            'px-20px',
            'py-4px',
            'text(12px [#a2a2cf])',
            'rounded-full',
            'flex-shrink-0',
            'overflow-hidden',
            'cursor-pointer'
          ])
        "
      >
        {{ $t('接受邀請') }}
      </div>
      <img
        :src="getImageUrl('/img/icons/i_delect.svg')"
        v-if="menuType === 0 && user.id > 0 && user.IsFriendSate"
        @click="actionDel(user)"
        :class="tw(['text(12px violet)'])"
        :alt="$t('刪除')"
      />
      <div
        class="chat-item__unread"
        v-if="user.unread"
        :class="tw(['text(12px)', 'bg-chatroomUnreadBg', 'rounded-full', 'py-4px', 'px-6px', 'leading-none'])"
      >
        {{ user.unread }}
      </div>
      <div
        class="chat-item__btn"
        v-if="!user.IsFriend && menuType === 2"
        :class="
          tw([
            'border',
            'border-violet',
            'leading-none',
            'ml-auto',
            'px-20px',
            'py-4px',
            'text(12px violet)',
            'rounded-full',
            'flex-shrink-0',
            'overflow-hidden',
            AddingAvailable && AddingQuotaLeft > 0 ? 'cursor-pointer' : 'cursor-default'
          ])
        "
        @click="AddingAvailable && AddingQuotaLeft > 0 ? actionAdd(user) : topAction()"
        @mouseleave="switchExplainPop ? topAction() : ''"
        @touchend="switchExplainPop ? topAction() : ''"
      >
        +{{ $t('好友') }}
      </div>
    </div>
  </div>
</template>

<script>
  import { inject, computed } from 'vue'
  import store from '@/store'

  export default {
    name: 'list-item',

    props: {
      user: {
        type: Object,
        default: () => {}
      }
    },

    inject: ['enterChatInfo', 'enterChatRoom', 'topAction', 'switchExplainPop'],

    setup() {
      const menuType = inject('choseMenuID')
      const friendObject = inject('friendObject')
      const AddingQuotaLeft = computed(() => store.state.platform.talkData.recommendList.AddingQuotaLeft)
      const AddingAvailable = computed(() => store.state.platform.talkData.recommendList.AddingAvailable)

      const actionAdd = async obj => {
        obj.method = 'add'
        friendObject.value = obj
      }

      const actionDel = async obj => {
        obj.method = 'delete'
        friendObject.value = obj
      }

      const actionaAgree = async obj => {
        obj.method = 'agree'
        friendObject.value = obj
      }

      const nonImage = ele => {
        ele.target.src = `${require('../images/preset_avatar00.png')}`
        return true
      }

      const getImageUrl = url => {
        return url
      }

      const enterChatRoom = inject('enterChatRoom')
      const enterChatInfo = inject('enterChatInfo')
      const actionEnterChat = obj => {
        if (!obj.IsFriendSate && menuType.value === 2) enterChatInfo(obj)
        else enterChatRoom(obj)
      }

      return {
        menuType,
        AddingQuotaLeft,
        AddingAvailable,
        // fn
        actionAdd,
        actionDel,
        actionaAgree,
        nonImage,
        getImageUrl,
        actionEnterChat
      }
    }
  }
</script>

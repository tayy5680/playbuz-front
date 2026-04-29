<template>
  <div
    class="refer-pop__wrap"
    :class="tw(['absolute', 'top-0', 'left-0', 'w-full', 'h-full', 'flex', 'items-center', 'justify-center', 'z-20'])"
  >
    <div
      class="refer-pop__mask"
      :class="tw(['fixed', 'top-0', 'left-0', 'w-full', 'h-full', 'bg-bg', 'bg-opacity-80'])"
    ></div>
    <div
      class="refer-pop__container"
      :class="
        tw([
          'relative',
          'bg-PopBackground',
          'rounded-20px',
          'px-[40px]',
          'md:px-[25px]',
          'py-[15px]',
          'md:py-[22px]',
          'm-[44px]',
          'md:m-[25px]',
          'md:max-w-[290px]',
          'min-h-[307px]',
          'w-full',
          'flex',
          'flex-col',
          'animate-scale'
        ])
      "
    >
      <div
        class="refer__picture"
        :class="tw(['absolute', 'top-0', 'left-1/2', '-translate-1/2'])"
        :src="displayFriendObject.img"
        :onerror="nonImage"
      >
        <img
          :class="tw(['w-[90px]', 'h-[90px]', 'object-cover', 'rounded-full'])"
          :src="displayFriendObject.img"
          :onerror="nonImage"
          :alt="$t('{name}的頭像', { name: displayFriendObject.name })"
        />
        <img
          v-if="displayFriendObject.skin"
          :class="tw(['absolute', 'top-1/2', 'left-1/2', '-translate-1/2', 'w-[164px]', 'max-w-none'])"
          :src="displayFriendObject.skin"
          :alt="$t('{name}的頭像框', { name: displayFriendObject.name })"
        />
        <img
          class="chat-item__JKF"
          v-if="displayFriendObject.isJKF"
          :class="tw(['text(12px)', 'absolute', 'bottom-0', 'right-[-6px]', 'w-[30px]', 'h-[30px]', 'rounded-full'])"
          :src="require('../images/avatar_jkf01.png')"
          :alt="$t('JKF頭像')"
        />
      </div>
      <div
        class="refer__label"
        :class="tw(['text(center 16px)', 'pt-[80px]'])"
        v-html="displayFriendObject.label"
      ></div>
      <div class="refer__button__wrap" :class="tw(['mt-auto'])">
        <div
          class="refer__button"
          v-loading="loading"
          v-for="item of filterButtonList"
          :key="item.id"
          :class="
            tw([
              'rounded-full',
              'cursor-pointer',
              `bg-${item.class}`,
              'text(white 18px center)',
              'p-8px',
              'w-full',
              'mt-18px',
              'md:mt-10px',
              'leading-tight',
              'overflow-hidden'
            ])
          "
          @click="action(item.id)"
        >
          {{ $t(item.label) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { computed, inject, ref } from 'vue'
  import store from '@/store'
  import { useI18n } from 'vue-i18n'

  import { event } from 'vue-gtag-next'
  import { useReCaptcha } from 'vue-recaptcha-v3'
  import { RECAPTCHA } from '@/configs'
  import { postFriendAdd, delFriendDel, checkFriend } from '@/api/chat'
  import { useNotice } from '@/utils/use-notice'

  export default {
    setup() {
      const { t } = useI18n()
      const { executeRecaptcha, recaptchaLoaded } = useReCaptcha()

      const loading = ref(false)

      const friendObject = inject('friendObject')
      const setIsFriend = inject('setIsFriend')

      const isFriend = computed(() => friendObject.value?.isFriend)

      const displayFriendObject = computed(() => {
        const user = friendObject.value?.label
        const label = () => {
          if (friendObject.value.method === 'add') {
            return isFriend.value
              ? `${user}<br>${t('已經是您的好友囉！')}`
              : `${t('是否確認將')}<br>${user}${t('加為好友？')}`
          }
          if (friendObject.value.method === 'delete') {
            return `${t('是否確認將')}<br>${user}${t('從好友中移除？')}`
          }
          if (friendObject.value.method === 'agree') {
            return `${user}<br>${t('向您發送好友邀請，是否將')}<br>${user} ${t('加為好友？')}`
          }
        }

        return {
          label: label(),
          name: user,
          img: friendObject.value?.img.picture,
          skin: friendObject.value?.img.skin,
          isJKF: friendObject.value?.isJKF
        }
      })

      const filterButtonList = computed(() => {
        const non = [
          { id: 'submit', class: 'depositBtn', label: '確定' },
          { id: 'cancel', class: 'SubColor', label: '取消' }
        ]

        const has = [{ id: 'confirm', class: 'depositBtn', label: '確認' }]

        return friendObject.value.method === 'add' ? (isFriend.value ? has : non) : non
      })

      const action = async id => {
        let recaptcha = ''
        switch (id) {
          case 'submit':
            try {
              loading.value = true

              if (friendObject.value.method === 'add') {
                event('message_add_friend', { success: '' })
                await recaptchaLoaded()
                recaptcha = await executeRecaptcha(RECAPTCHA.actionList.addFriend)
                await postFriendAdd({
                  body: {
                    friendID: friendObject.value.id,
                    recaptcha: recaptcha
                  }
                })
                setIsFriend(friendObject.value.id)
              }

              if (friendObject.value.method === 'delete') {
                event('message_del_friend', { success: '' })
                await delFriendDel({ body: { friendID: friendObject.value.id } })
              }
              if (friendObject.value.method === 'agree') {
                event('message_agree_friend', { success: '' })
                await checkFriend({ body: { friendID: friendObject.value.id } })
              }

              await Promise.all([
                store.dispatch('member/logIn'),
                store.dispatch('platform/setChatRoomLis'),
                store.dispatch('platform/setFriendList'),
                store.dispatch('platform/setFriendCheckList')
              ])
              friendObject.value = null
              loading.value = false
            } catch (err) {
              if (friendObject.value.method !== 'add') return
              const errorCodeList = {
                1015: '會員不存在',
                1016: '好友不存在',
                1017: '已有關係存在',
                1034: '新增好友功能已鎖定',
                3001: '超過新增好友的數量限制'
              }
              const errorMessage = errorCodeList[err?.Code] ?? '發生錯誤，請稍後再試，或洽客服人員'
              useNotice({ type: 'error', message: errorMessage })
            } finally {
              loading.value = false
            }
            break
          case 'cancel':
          case 'confirm':
            friendObject.value = null
            break
        }
      }

      const nonImage = ele => {
        ele.target.src = `${require('../images/preset_avatar00.png')}`
        return true
      }

      return {
        displayFriendObject,
        filterButtonList,
        friendObject,
        nonImage,
        loading,
        // fn
        action
      }
    }
  }
</script>

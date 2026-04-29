<template>
  <div class="chat-list__wrap" :class="tw(['flex-1', 'flex', 'flex-col'])">
    <chatMenu />
    <div
      class="chat-list__line"
      v-if="[2].includes(choseMenuID)"
      :class="tw(['bg-[#544F5B]', 'h-px', 'mx-26px', 'mb-[36px]'])"
    />
    <chatAside v-if="[2].includes(choseMenuID)" />
    <chatSearch
      v-if="[0, 2].includes(choseMenuID) && searchType !== 'barcodes'"
      :placeholder="choseMenuID === 0 ? $t('好友名字搜尋') : $t('請輸入名字搜尋')"
      :value="filterText"
      @chgFilterText="setFilterText"
    />
    <div class="chat-list__count" v-if="choseMenuID === 0" :class="tw(['text-confirmBtnText', 'pb-8px', 'mx-26px'])">
      {{ `${$t('全部好友')}(${friendListLength})` }}
    </div>
    <div class="chat-list__container" :class="tw(['flex-1', 'flex', 'flex-col'])">
      <div
        class="chat-list__line"
        v-if="![2].includes(choseMenuID)"
        :class="tw(['bg-[#544F5B]', 'h-px', 'mx-26px'])"
      ></div>
      <div
        class="qr-code__label"
        v-if="searchType === 'barcodes'"
        :class="tw(['flex-1', 'flex', 'items-center', 'justify-center', 'text(confirmBtnText center)'])"
      >
        {{ $t('即將推出') }}
      </div>
      <div
        class="refer__label"
        v-if="[2].includes(choseMenuID) && !filterText.length && searchType !== 'barcodes'"
        :class="tw(['font-bold', 'px-20px'])"
      >
        <div class="refer__label" v-if="[2].includes(choseMenuID) && !filterText.length && searchType !== 'barcodes'">
          {{ $t('推薦好友') }}
        </div>
        <div v-if="choseMenuID === 2" :class="tw(['flex', 'mt-10px', 'items-center', 'text(12px violet)', 'relative'])">
          <img
            :src="getImageUrl('/img/icons/i_note2.svg')"
            @click="topAction()"
            @mouseover="topAction()"
            @mouseleave="topAction()"
            @touchend="topAction()"
            :class="tw(['cursor-pointer', 'mr-1'])"
            alt=""
          />
          <div :class="tw(['absolute', 'top-[21px]', 'left-[-5px]'])">
            <explainPop v-if="switchExplainPop" :message="message" :action="topAction" />
          </div>
          {{ $t(`今日可加好友 ({AddingQuotaLeft}/{AddingQuotaPerDay})`, { AddingQuotaLeft, AddingQuotaPerDay }) }}
        </div>
      </div>
      <div
        class="chat-list"
        v-if="searchType !== 'barcodes'"
        :class="tw(['flex-1', 'overflow-y-auto', 'overflow-x-hidden', 'h-300px', 'py-15px'])"
      >
        <chatItem v-for="(item, index) of formatChatList" :key="index" :user="item" />
        <div
          class="chat-non"
          v-if="!formatChatList.length && filterText"
          :class="tw(['text(confirmBtnText center)', 'p-28px'])"
        >
          {{ $t('找不到會員') }}
        </div>
      </div>
    </div>
  </div>
  <transition name="fade">
    <friendPop v-if="friendObject" />
  </transition>
</template>

<script>
  import { ref, computed, provide, watch, inject } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { debounce } from 'lodash'
  import store from '@/store'

  import chatMenu from './menu'
  import chatSearch from './search'
  import chatAside from './aside'
  import chatItem from './item'
  import friendPop from './pop'

  import { getSearchFriend } from '@/api/chat'
  import explainPop from '@/components/explainPop/explainPop.vue'

  export default {
    name: 'chat',

    components: {
      chatMenu,
      chatSearch,
      chatAside,
      chatItem,
      friendPop,
      explainPop
    },

    setup() {
      const { t } = useI18n()
      const friendObject = inject('friendObject')
      const chatTextInfo = inject('chatTextInfo')

      const switchExplainPop = ref(false)

      const topAction = () => {
        switchExplainPop.value = !switchExplainPop.value
      }

      provide('switchExplainPop', switchExplainPop)
      provide('topAction', topAction)

      const friendListLength = computed(() => {
        let friendConut = 0
        if (store.state.platform.talkData.friendList.length) {
          friendConut = store.state.platform.talkData.friendList.filter(item => item.FriendID > 0).length
        }

        return friendConut
      })

      // menu
      const choseMenuID = ref(1)
      provide('choseMenuID', choseMenuID)
      const menu = ref([
        { id: 0, label: '好友' },
        { id: 1, label: '聊天' },
        { id: 2, label: '加入好友' }
      ])
      provide('menu', menu)
      const chgMenuID = id => {
        choseMenuID.value = id
        searchFriendList.value = []
      }
      provide('chgMenuID', chgMenuID)

      // 搜尋好友
      const searchFriendList = ref([])
      const getSearchFriendList = debounce(() => {
        if (!filterText.value.length) {
          searchFriendList.value = []
          return false
        }

        getSearchFriend({ body: { searchKeyword: filterText.value } })
          .then(res => {
            searchFriendList.value = res.Data.map(item => {
              const isFriendSate = store.state.platform.talkData.friendList.find(e => e.FriendID === item.FriendID)
              return {
                ...item,
                FriendNickname: `${item.RegisterSource?.toLowerCase()}_${item.FriendNickname}`,
                IsFriendSate: !!isFriendSate
              }
            })
          })
          .catch(err => console.warn(err))
      }, 1200)
      provide('getSearchFriendList', getSearchFriendList)

      // 推薦好友
      const recommendList = computed(() => store.state.platform.talkData.recommendList)

      // 剩餘可加入好友數/可加入好友總數
      const AddingQuotaLeft = computed(() => store.state.platform.talkData.recommendList.AddingQuotaLeft)
      const AddingQuotaPerDay = computed(() => store.state.platform.talkData.recommendList.AddingQuotaPerDay)

      const message = computed(() =>
        t(
          '每日新加好友人數為最多{AddingQuotaPerDay}人，若連續兩日都加滿{AddingQuotaPerDay}人；則暫時無法增加新好友。',
          { AddingQuotaPerDay: AddingQuotaPerDay.value }
        )
      )

      const setIsFriend = id => {
        if (filterText.value) {
          const index = searchFriendList.value.findIndex(item => item.FriendID === id)
          searchFriendList.value[index].IsFriend = true
          recommendList.value.AddingQuotaLeft -= 1
          if (Object.keys(chatTextInfo.value).length) chatTextInfo.value = formatChatList.value[index]
        } else {
          const index = recommendList.value.Data.findIndex(item => item.FriendID === id)
          if (index > -1) {
            recommendList.value.Data[index].IsFriend = true
            recommendList.value.AddingQuotaLeft -= 1
            if (Object.keys(chatTextInfo.value).length) chatTextInfo.value = formatChatList.value[index]
          }
        }
      }
      provide('setIsFriend', setIsFriend)

      // 列表
      const chatList = computed(() => {
        const friendList = store.state.platform.talkData.friendList
        const chatList = store.state.platform.talkData.chatList
        const friendObject = store.getters['platform/isformatFriend']
        if (choseMenuID.value === 0) {
          if (!filterText.value) return friendObject
          return friendList.filter(item => item.FriendNickname.includes(filterText.value))
        }

        if (choseMenuID.value === 1 && Object.keys(chatList).length) {
          return [...chatList.Member, ...chatList.Service]
        }

        if (choseMenuID.value === 2) {
          if (filterText.value) {
            searchFriendList.value.forEach(e => {
              const IsFriendList = friendObject.find(item => item.FriendID === e.FriendID && !item.IsFriend)
              if (IsFriendList) {
                e.IsFriendList = true
              }
            })
            return searchFriendList.value
          }
          return recommendList.value.Data
        }

        return []
      })

      const formatChatList = computed(() => {
        if (!chatList.value?.length) return []

        return chatList.value.reduce((acc, cur) => {
          const target = {}
          target.id = cur.MemberID ?? cur.FriendID
          target.groupID = cur?.GroupID ?? null
          target.name = cur?.GroupName ?? cur.FriendNickname ?? cur.FriendNickName
          target.label = target.name
          target.img = {}
          target.img.picture = cur.Photo?.Url ?? cur.FriendAvatarPath ?? ''
          target.img.skin = cur.Photo?.Frame ?? cur.FriendAvatarFrame ?? cur.FriendAvatarPathFrame
          target.context = cur.MessageContent ?? ''
          target.unread = cur.UnReadCount ?? 0
          target.isJKF = cur?.RegisterSource === 'JKF'
          target.IsFriend = cur?.IsFriend ?? true
          target.IsFriendSate = cur?.IsFriendSate ?? false
          return acc.concat(target)
        }, [])
      })

      const filterText = ref('')
      const setFilterText = (val = '') => {
        filterText.value = val
      }
      watch(choseMenuID, () => setFilterText())

      watch(filterText, () => {
        if (!filterText.value) {
          filterText.value = ''
          return false
        }

        if (choseMenuID.value === 2) getSearchFriendList()
      })

      const searchType = ref(null)
      const setSearchType = val => {
        searchType.value = val
      }
      provide('setSearchType', setSearchType)

      watch(choseMenuID, (newVal, oldVal) => {
        if (oldVal === 2) searchType.value = null
      })

      const getImageUrl = url => {
        return url
      }

      return {
        friendObject,
        setFilterText,
        choseMenuID,
        friendListLength,
        formatChatList,
        searchType,
        filterText,
        recommendList,
        AddingQuotaLeft,
        AddingQuotaPerDay,
        switchExplainPop,
        message,
        topAction,
        getImageUrl
      }
    }
  }
</script>

<template>
  <div class="game__wrap">
    <div class="game__container" :class="tw(['relative'])">
      <div :class="tw(['container-mo-main', 'md:flex', 'md:items-center', 'md:mx-0'])">
        <div class="game__container__top" :class="tw(['relative', 'mb-20px', 'md:mb-0'])">
          <input
            class="serial__input"
            :placeholder="
              $t(`在{type}遊戲中搜尋`, { type: headerMenuList.find(x => x.type === gameType)?.label ?? gameType })
            "
            v-model="gameSearch"
            :class="
              tw([
                'rounded-full',
                'bg-[#f8f8f8]',
                'border-[#7c7ed7]',
                'border-2',
                'text-[#707070]',
                'placeholder-[#7c7ed7]',
                'px-20px',
                'w-full',
                'md:w-48',
                'h-36px',
                'md:h-30px'
              ])
            "
          />
          <i
            class="bi bi-search"
            :class="tw(['absolute', 'md:leading-[30px]', 'leading-[35px]', 'right-[13px]', 'text-[#7c7ed7]'])"
            style="text-shadow: #7c7ed7 0 0.5px 0px, #7c7ed7 -0.5px 0px 0px;"
          ></i>
        </div>
        <div class="game__sort__wrap" v-if="gameType === 'slot'" :class="tw(['sticky', 'z-10', 'md:ml-10px'])">
          <UISwitch :list="formatGameSortList" :activeID="sortID" @action="action" />
        </div>
      </div>
      <list
        :sortID="sortID"
        :gameType="gameType"
        :search="gameSearch"
        :list="list"
        :class="tw(['mt-[20px]', 'md:mt-4'])"
      />
    </div>
    <viewPopup
      v-if="displaycoinPopup"
      @close="
        () => {
          displaycoinPopup = false
        }
      "
    >
      <template v-slot:context>
        <div class="info" :class="tw(['flex', 'flex-col', 'justify-center', 'items-center', 'h-[200px]'])">
          <img :src="COIN_TYPE[0].imgLine" :class="tw(['font-extralight', 'w-1/4', 'h-1/4'])" />
          <div :class="tw(['font-extralight', 'pt-5'])">
            <div>
              {{ $t('Hi,訪客您好！') }}
            </div>
            <div>
              {{ $t('提醒您,金幣符號的遊戲限定會員遊玩喔！快加入會員玩更多遊戲！') }}
            </div>
          </div>
        </div>
      </template>
      <template v-slot:bottom>
        <div class="btn" :class="tw(['text(white center)'])">
          <div
            class="btn"
            @click="actionAddMember"
            :class="tw(['cursor-pointer', 'bg-blurPurpleBtn', 'rounded-full', 'mb-8px', 'p-8px'])"
          >
            {{ $t('加入會員') }}
          </div>
          <div
            class="btn"
            @click="displaycoinPopup = false"
            :class="tw(['cursor-pointer', 'bg-giftBtnInactive', 'rounded-full', 'p-8px'])"
          >
            {{ $t('我知道了') }}
          </div>
        </div>
      </template>
    </viewPopup>
  </div>
</template>

<script>
  import { computed, provide, watch, onMounted, ref, onUnmounted } from 'vue'
  import store from '@/store'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import { GAME_SORT_LIST } from '@/configs/game'
  import { COIN_TYPE } from '@/configs'
  import { event } from 'vue-gtag-next'

  import UISwitch from '@/components/ui/switch'
  import list from './list'
  import viewPopup from '@/components/popup'

  export default {
    name: 'game',

    components: {
      list,
      UISwitch,
      viewPopup
    },

    setup() {
      const { t } = useI18n()
      const route = useRoute()
      const router = useRouter()
      const displaycoinPopup = ref(false)
      const isGuest = computed(() => store.state.member.info?.IsGuest ?? true)
      const headerMenuList = computed(() => {
        const target = store.state.game.gameList.map(item => item.GameType?.toLowerCase())
        const sort = Array.from(new Set(target))
        const list = store.getters['game/gameTypeList'].filter(item => sort.includes(item.type))
        list.unshift({
          id: 0,
          type: 'all',
          label: t('全部'),
          route: { name: 'game', params: { gameType: 'all' } }
        })
        return list
      })

      const gameSearch = ref('')

      watch(headerMenuList, val => {
        if (val.length) {
          store.dispatch('platform/setPageMenuList', val)
        }
      })

      onMounted(() => {
        if (headerMenuList.value.length) {
          store.dispatch('platform/setPageMenuList', headerMenuList.value)
        }
        init()
      })
      onUnmounted(() => {
        store.dispatch('platform/setPageMenuList', [])
      })
      const list = computed(() => (!store.state.game.gameList?.length ? [] : store.state.game.gameList))

      const sortID = computed(() => {
        const target = GAME_SORT_LIST.find(item => item.class === route.params.gameClass)
        return target ? target.id : 0
      })
      provide('sortID', sortID)

      const formatGameSortList = GAME_SORT_LIST

      const gameType = computed(() => route.params?.gameType ?? '')

      if (route.name === 'game' && isGuest.value) displaycoinPopup.value = true

      const init = () => {
        const pageMenuList = store.state.platform.pageMenuList ?? []
        const isValidGameType = pageMenuList.some(item => item.type === route.params.gameType)

        const hasClass = GAME_SORT_LIST.map(item => item.class).includes(route.params.gameClass)
        const routeParams = { gameType: isValidGameType ? route.params.gameType : 'all', gameClass: '' }

        if (!isValidGameType || !hasClass) {
          if (!hasClass) routeParams.gameClass = GAME_SORT_LIST[0].class
          // router.replace({
          //   name: route.name,
          //   params: {
          //     ...(routeParams.gameClass ? { gameType: routeParams.gameClass } : {}),
          //     gameType: routeParams.gameType
          //   }
          // })

          event('game_click', { click: 'game_type' })
          event('game_click', { click: 'game_class' })
        }

        // 完成後步驟後把選擇存入store
        if (store.state.platform.pageMenuList?.length) {
          const target = store.state.platform.pageMenuList.find(item => item.type === routeParams.gameType)
          store.dispatch('platform/setPageMenuID', target?.id ?? 0)
        }
      }

      const action = obj => {
        gameSearch.value = ''
        router.replace({
          name: route.name,
          params: { gameType: route.params.gameType, gameClass: obj.class }
        })
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }

      const actionAddMember = () => {
        displaycoinPopup.value = false
        store.commit('sign/UPDATE_DRAWER_STATE', true)
      }

      watch(
        () => route.params.gameType,
        val => {
          gameSearch.value = ''
          if (store.state.platform.pageMenuList?.length) {
            const target = store.state.platform.pageMenuList.find(item => item.type === val)
            store.dispatch('platform/setPageMenuID', target?.id ?? 0)
          }
        }
      )

      return {
        list,
        sortID,
        gameType,
        formatGameSortList,
        gameSearch,
        displaycoinPopup,
        COIN_TYPE,
        headerMenuList,
        // fn
        action,
        actionAddMember
      }
    }
  }
</script>

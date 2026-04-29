<template>
  <div class="rank__wrap" :class="tw(['min-h-screen', 'text-white', 'md:pr-5'])">
    <UISwitch :list="menuList" :activeID="activeID.toString()" @action="action" :class="tw(['ml-[5%]', 'md:ml-0'])" />
    <div class="rank__container" :class="tw(['relative', 'w-full', 'justify-center', 'top-[20px]', 'md:top-4'])">
      <viewList
        :activeID="activeID"
        :rankData="rankData"
        :subMenu="menuList[activeID].subMenu"
        :loading="loading"
        :menuListItem="menuList[activeID]"
      />
      <div class="rank__go__top" :class="tw(['pt-5', 'px-[5%]', 'md:px-0', 'mx-auto'])">
        <img
          @click="scrollTop()"
          :class="tw(['cursor-pointer', 'ml-auto', 'w-[50px] h-[50px]'])"
          :src="require(`./images/i_backtop.svg`)"
        />
      </div>
      <button></button>
    </div>
  </div>
</template>

<script>
  import { ref, computed, onMounted } from 'vue'
  import store from '@/store'
  import UISwitch from '@/components/ui/switch'
  import viewList from './list'
  import { getGameDonateRankStreamer, getGameDonateRankPlayer } from '@/api/game'
  import { useRoute } from 'vue-router'
  import { getRankingTotalWalletPoint, getRankingBetCache } from '@/api/member'
  import { useNotice } from '@/utils/use-notice'
  import dayjs from 'dayjs'
  import { HOME_HEADER_MENU, COIN_TYPE } from '@/configs'

  export default {
    components: {
      viewList,
      UISwitch
    },

    setup() {
      const route = useRoute()
      const userInfo = computed(() => store.state.member.info)
      const activeID = ref(parseInt(route.query.activeId ?? 0))
      const lang = computed(() => store.state.member.languageCode)
      const headerMenuList = ref(HOME_HEADER_MENU)

      const rankData = ref({})
      onMounted(() => {
        store.dispatch('platform/setPageMenuList', headerMenuList.value)
        store.dispatch('platform/setPageMenuID', headerMenuList.value[1].id)
      })
      const loading = ref(false)

      const subMenu = computed(() => {
        return COIN_TYPE.map((item, index) => {
          return {
            id: index,
            label: item.label + '排行',
            file: item.icon,
            listName: item.type
          }
        })
      })
      const menuList = ref([
        { id: 0, label: '收禮榜', subMenu: subMenu },
        { id: 1, label: '送禮榜', subMenu: subMenu }
        // { id: 2, label: '瀏覽榜', subMenu: subMenu }
      ])
      const action = obj => {
        activeID.value = obj.id
        init()
      }
      const init = async () => {
        loading.value = true
        switch (activeID.value) {
          case 0:
            await getRankGame()
            break
          case 1:
            await getRankBetCache()
            break
          case 2:
            await getRankWalletPoint()
            break
        }
      }

      // 遊戲排行=>收禮榜
      const getRankGame = async () => {
        try {
          loading.value = true
          let input = { reportMonth: dayjs().format('YYYY-MM') }
          const resMonth = await getGameDonateRankStreamer(input)
          const resDay = await getGameDonateRankStreamer({ ...input, reportDay: dayjs().format('D') })
          rankData.value = {
            activeId: activeID.value,
            day: resDay?.Data ?? [],
            month: resMonth?.Data ?? []
          }
          loading.value = false
        } catch (e) {
          rankData.value = {
            activeId: activeID.value,
            day: [],
            month: []
          }
          loading.value = false
        }
      }
      // 活躍度排行=>送禮榜
      const getRankBetCache = async () => {
        try {
          loading.value = true
          let input = { reportMonth: dayjs().format('YYYY-MM') }
          const resMonth = await getGameDonateRankPlayer(input)
          const resDay = await getGameDonateRankPlayer({ ...input, reportDay: dayjs().format('D') })
          rankData.value = {
            activeId: activeID.value,
            day: resDay?.Data ?? [],
            month: resMonth?.Data ?? []
          }
          loading.value = false
        } catch (e) {
          rankData.value = {
            activeId: activeID.value,
            day: [],
            month: []
          }
          loading.value = false
        }
      }
      // 玩家排行
      const getRankWalletPoint = () => {
        getRankingTotalWalletPoint({
          top: 10
        })
          .then(res => {
            rankData.value = {
              activeId: activeID.value,
              gold: res.Data?.GoldResult ?? [],
              silver: res.Data?.SilverResult ?? []
            }
          })
          .catch(() => {
            useNotice({ type: 'error', message: '發生錯誤，請稍後再試，或洽客服人員' })
          })
          .finally(() => {
            loading.value = false
          })
      }
      init()
      const scrollTop = () => {
        document.querySelector('#app').scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        })
      }
      return {
        UISwitch,
        viewList,
        menuList,
        rankData,
        activeID,
        loading,
        action,
        scrollTop
      }
    }
  }
</script>

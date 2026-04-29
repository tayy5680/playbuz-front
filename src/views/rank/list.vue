<template>
  <div
    class="game__wrap"
    :class="tw(['w-[90%]', 'md:w-full', 'bg-[#202020]', 'py-5', 'md:px-4', 'rounded-xl', 'mx-auto'])"
  >
    <div class="game__sub__header" :class="tw(['relative', 'w-full', 'flex', { 'mb-[100px]': loading }])">
      <div
        class="sub_header_item"
        :class="tw(['flex', 'flex-grow', 'justify-between', 'pt-0', 'pb-5', 'text-[#5D6D8B]', 'items-center'])"
      >
        <h5 :class="tw(['text-[28px]'])">{{ $t(menuListItem.label) }}</h5>
        <div class="filter-type">
          <button
            v-for="(item, index) in RANK_FILTER_LIST"
            :key="index"
            @click="rankListFilterType = item.id"
            :class="{ active: rankListFilterType === item.id }"
          >
            {{ $t(item.label) }}
          </button>
        </div>
      </div>
    </div>
    <div
      class="game__top__bg"
      v-if="activeID !== 2 && rankDataList.length > 0"
      :class="tw(['md:-mx-4', isMobile ? 'mobile h-[90svw] min-h-[300px]' : 'web h-[30svw] max-h-[300px]'])"
    ></div>
    <div
      class="game__top__member"
      v-if="activeID !== 2 && rankDataList.length > 0"
      :class="tw(['px-2', 'max-w-[470px]', 'mx-auto', 'pb-[50px]', isMobile ? 'mt-[-70%]' : 'mt-[-16%]'])"
    >
      <div class="game__top__one" :class="tw(['flex', 'justify-center', 'relative', 'z-[13]', 'h-[20px]'])">
        <viewTopThreeItem :rank="1" :rankInfo="rankDataList[0]" />
      </div>
      <div class="game__top__other" :class="tw(['flex', 'justify-between'])">
        <viewTopThreeItem :rank="2" :rankInfo="rankDataList[1]" />
        <viewTopThreeItem :rank="3" :rankInfo="rankDataList[2]" />
      </div>
    </div>
    <viewMemberItem v-loading="loading" :rankDataList="rankDataList" :userId="userId" />
    <carouselSwiper
      v-if="Object.keys(lightData).length"
      :action="preView"
      :list="rankDataList[preImgKey].preview"
      :initialSlide="initialSlide"
    />
    <div
      class="game__no__data"
      v-if="rankDataList.length === 0 && !loading"
      :class="tw(['text(center [#aea1be])', 'flex', 'justify-center', 'my-7'])"
    >
      <img
        :class="tw(['inline-block', 'w-[18px]', 'h-auto', 'mr-2'])"
        :src="require('../../components/viewDrawer/images/i_note.svg')"
      />
      <span>{{ $t('目前尚無資料。') }}</span>
    </div>
    <div
      class="game__update__time"
      :class="tw([{ 'mt-[100px]': loading }, 'px-2', 'pt-[60px]', 'text(center 14px lakeGreen)'])"
    >
      ※ {{ $t('排行榜於每日{time}更新', { time: '6:00' }) }}
    </div>
  </div>
</template>

<script>
  import { ref, computed, watch } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import store from '@/store'
  import { GAME_SORT_TYPE, GAME_PREVIEW, GAME_SORT_LIST } from '@/configs/game'
  import 'swiper/swiper.scss'
  import carouselSwiper from '@/components/carousel'
  import viewGameItem from './gameItem'
  import viewMemberItem from './memberItem'
  import viewTopThreeItem from './topThreeItem'

  export default {
    name: 'rank-list',

    components: {
      carouselSwiper,
      viewGameItem,
      viewMemberItem,
      viewTopThreeItem
    },

    props: {
      activeID: {
        type: Number,
        default: () => 0
      },
      rankData: {
        type: Object,
        default: () => {}
      },
      subMenu: {
        type: Array,
        default: () => []
      },
      loading: {
        type: Boolean,
        default: () => false
      },
      menuListItem: {
        type: Object,
        default: () => {}
      }
    },

    setup(props) {
      const route = useRoute()
      const router = useRouter()
      const activeID = computed(() => props.activeID)
      const rankData = computed(() => props.rankData)
      const isMobile = computed(() => store.getters['platform/isMobile'])
      const userId = computed(() => store.state.member.info?.MemberID ?? 0)
      const rankListFilterType = ref('day')
      const RANK_FILTER_LIST = [
        { id: 'day', label: 'rank_日' },
        { id: 'month', label: 'rank_月' }
      ]

      const subID = ref(parseInt(route.query.subId ?? 0))

      watch(activeID, () => {
        router.replace({ query: { activeId: activeID.value, subId: subID.value } })
        switchSubMenu(0)
      })
      const switchSubMenu = id => {
        router.replace({ query: { activeId: activeID.value, subId: id } })
        subID.value = id
      }
      // set List
      const rankDataList = computed(() => {
        if (rankData.value.activeId === activeID.value) return rankData.value[rankListFilterType.value]
        return []
      })
      const setRankGame = subID => {
        const list = ref(rankData.value[props.subMenu[subID].listName] ?? [])
        return list.value.map(item => {
          const gameData = store.state.game.gameList.find(el => el.GameID === item.GameID)
          const gameImgData = GAME_PREVIEW[item.GameID]?.filter(el => el.type === 'image').slice(0, 3)
          if (gameImgData) getSize(gameImgData)
          return {
            id: item.GameID,
            name: item.GameName,
            gameClass:
              store.getters['game/gameTypeList'].find(item => item.id === gameData.GameType.toLowerCase())?.label || '',
            gameType: GAME_SORT_TYPE[item.GameID]
              ? GAME_SORT_TYPE[item.GameID].reduce((acc, cur) => {
                  const target = GAME_SORT_LIST.find(item => item.id === cur)
                  return acc.concat(target ? target.label : '')
                }, [])
              : '',
            preview: gameImgData ?? [],
            subTitle: gameData.SubTitle,
            gameProvider: gameData.Vendor.GameProvider.toLowerCase(),
            gameProviderGameID: gameData.Vendor.GameProviderGameID,
            isStatic: gameData.IsStatic,
            vendorID: gameData.Vendor.ID
          }
        })
      }

      const setRankBetCache = subID => {
        const list = ref(rankData.value[props.subMenu[subID].listName] ?? [])
        if (list.value) {
          return list.value.map(item => {
            return {
              id: item.MemberID,
              name: item.NickName,
              point: showPoint(item.TotalBet),
              rank: item.Ranking,
              picture: item.HeadPhotoName || '/img/member/preset_avatar00@2x.png',
              frame: item.HeadPhotoFramePath || '',
              trendStatus: item.TrendStatus ?? 0
            }
          })
        } else return []
      }

      const setRankWalletPoint = subID => {
        const list = ref(rankData.value[props.subMenu[subID].listName] ?? [])
        if (list.value) {
          return list.value.map(item => {
            return {
              id: item.MemberID,
              name: item.NickName,
              point: showPoint(item.TotalWalletPoint),
              rank: item.Ranking,
              picture: item.PhotoName || '/img/member/preset_avatar00@2x.png',
              frame: item.HeadPhotoFramePath || '',
              trendStatus: item.TrendStatus ?? 0
            }
          })
        } else return []
      }
      const showPoint = point => {
        const numLength = point.toString().length
        if (numLength <= 3) return point
        else if (numLength > 3 && numLength <= 6) return Math.floor(point / 10) / 100 + 'K'
        else if (numLength > 6 && numLength <= 9) return Math.floor(point / 10000) / 100 + 'M'
        return Math.floor(point / 10000000) / 100 + 'B'
      }

      // img
      const preImgKey = ref(0)
      const lightData = ref('')
      const initialSlide = ref(0)
      const preView = (item = '', key = '', index = null) => {
        preImgKey.value = Number.isInteger(index) ? index : ''
        initialSlide.value = key
        lightData.value = Number.isInteger(key) ? item[key] : ''
        store.dispatch('platform/setCover', !!lightData.value)
      }

      const imgSizeList = [65, 100]
      const imgSizeData = ref([])
      const getSize = arr => {
        for (const url of arr.map(item => item.url)) {
          const img = new Image()
          img.src = url
          img.onload = function() {
            const target = Math.ceil(this.width / this.height) > 1 ? 1 : 0
            imgSizeData.value.push(imgSizeList[target])
          }
        }
      }
      return {
        isMobile,
        subID,
        lightData,
        rankDataList,
        preImgKey,
        initialSlide,
        imgSizeData,
        preView,
        switchSubMenu,
        userId,
        rankListFilterType,
        RANK_FILTER_LIST
      }
    }
  }
</script>

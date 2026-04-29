<template>
  <div class="latest__wrap" :class="tw(['mt-26px', 'mb-42px', 'px-mobileSpace', 'md:px-0'])">
    <div class="latest__container">
      <div class="latest__tip" :class="tw(['md:px-8px', 'pb-10px'])">
        <div class="latest__title" :class="tw(['text([#707070] 24px)', 'font-bold'])">
          {{ $t('遊戲推薦') }}
        </div>
      </div>
      <viewGameList
        :list="formatList"
        :sub="sub"
        :isDisplayText="!isMobile"
        :isUseMaintenance="false"
        :isDisplayName="false"
      />
    </div>
  </div>
</template>

<script>
  import { computed, reactive, ref } from 'vue'

  // import viewGameList from './latest-list'
  import viewGameList from '@/components/view-game-list'
  import UISwitch from '@/components/ui/switch'

  import store from '@/store'
  import { recommendation } from './config.js'

  export default {
    name: 'home-latest',

    components: {
      viewGameList,
      UISwitch
    },

    setup() {
      const list = computed(() => {
        // 若今日後端傳入遊戲列表小於4筆，則顯示全部的靜態遊戲
        const originGameListLength = computed(() => store.state.game.originGameListLength)
        const gameList = computed(() => store.state.game.gameList)
        if (originGameListLength.value < 4) {
          const target = gameList.value.reduce((acc, cur) => {
            return acc.concat(cur.GameID)
          }, [])
          return target
        }

        return recommendation
      })

      const LIST_TYPE = [{ id: 1, class: 'news', label: '遊戲推薦' }]

      const choseID = ref(1)
      const choseItemIndexList = ref([])
      const action = obj => {
        choseItemIndexList.value = []
        if (choseID.value === obj.id) return false

        choseID.value = obj.id
      }

      // 與peace確認都為雙數。
      const formatList = computed(() => {
        const target = JSON.parse(JSON.stringify(list.value))
        return target.length % 2 ? target.splice(0, target.length - 1) : target
      })

      const sub = reactive({
        99998: '小編推薦：inPoker App版',
        99997: '小編超期待：烈焰戰紀',
        99996: '小編最愛玩：娜娜的奇幻冒險 RE',
        99995: '小編推薦：App Store上的爆款推薦',
        99994: '小編推薦：懷念惡靈勢力嗎？',
        99993: '遊戲新報：喜歡地下城卡牌遊戲不可錯過',
        99992: '小編精選：2022也要繼續擼貓',
        99991: '小編精選：三上真司全新力作',
        5999: '滿載著寶藏的幽浮起飛倒數！'
      })

      const isMobile = computed(() => store.getters['platform/isMobile'])

      return {
        formatList,
        sub,
        isMobile,
        choseID,
        LIST_TYPE,

        // fn
        action
      }
    }
  }
</script>

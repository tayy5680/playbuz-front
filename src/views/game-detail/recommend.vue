<template>
  <div class="game-detail__more" :class="tw(['mt-50px'])">
    <div
      class="game-detail__more__label"
      :class="tw(['text(24px [#5d6d8b])', 'font-bold', 'mb-12px', 'px-mobileSpace', 'md:px-0'])"
    >
      {{ $t('更多類似遊戲') }}
    </div>
    <div class="game-detail__list" :class="tw(['mx-mobileSpace', 'md:mx-auto'])">
      <viewGameShortList :isLoading="loading" :list="recommendGameList" :isSwiper="!isMobile" />
    </div>
  </div>
</template>

<script>
  import { ref, watch, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import store from '@/store'

  import { recommendGame } from '@/api/game'

  import viewGameShortList from '@/components/view-game-short-list'

  export default {
    name: 'game-detail-recommend',

    components: {
      viewGameShortList
    },

    setup() {
      const route = useRoute()
      const isMobile = computed(() => store.getters['platform/isMobile'])

      const loading = ref(false)

      const recommendGameList = ref([])
      const getRecommendGame = () => {
        return recommendGame()
          .then(res => {
            recommendGameList.value = res.GameID
          })
          .catch(err => {
            console.warn(err)
          })
      }

      const init = async () => {
        loading.value = true
        await getRecommendGame()
        loading.value = false
      }

      watch(
        () => route.params.gameID,
        () => init()
      )

      init()

      return {
        loading,
        recommendGameList,
        isMobile
      }
    }
  }
</script>

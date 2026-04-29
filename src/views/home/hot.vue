<template>
  <div class="hot__wrap" v-if="list.length">
    <div class="hot__container" :class="tw(['mx-mobileSpace', 'md:mx-0'])">
      <div class="hot__title" :class="tw(['text([#707070] 24px)', 'font-bold', 'md:px-8px', 'pb-10px'])">
        {{ $t('熱門遊戲') }}
      </div>
      <viewGameShortList :list="list" :loading="loading" />
    </div>
  </div>
</template>

<script>
  import { ref, computed } from 'vue'
  import store from '@/store'

  import viewGameShortList from '@/components/view-game-short-list'
  import { hotGameList } from '@/api/game'
  export default {
    name: 'home-hot-game-list',

    components: {
      viewGameShortList
    },

    setup() {
      const loading = ref(false)

      const list = ref([])
      const getHotGameList = async () => {
        loading.value = true
        await hotGameList({
          locale: store.state.member.languageCode
        })
          .then(res => {
            list.value = res.Data.map(item => item.GameID)
          })
          .catch(err => {
            console.warn(err)
          })
        loading.value = false
      }

      getHotGameList()

      return {
        list,
        loading
      }
    }
  }
</script>

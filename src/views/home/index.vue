<template>
  <div class="home__wrap">
    <div class="home__container">
      <viewBannerSwiperStreamChannel />
      <viewEvent202504 />
      <viewLatest />
      <viewHot />
    </div>
  </div>
</template>

<script>
  import { ref, onMounted } from 'vue'
  import store from '@/store'

  // import viewBanner from './banner'
  // import viewEvent from './event'
  import viewBannerSwiperStreamChannel from './banner/swiperStreamChannel'
  import viewEvent202504 from './event/index202504'
  import viewLatest from './latest'
  import viewHot from './hot'
  import { HOME_HEADER_MENU } from '@/configs'

  export default {
    name: 'home',

    components: {
      // viewBanner,
      viewLatest,
      //viewEvent,
      viewEvent202504,
      viewHot,
      viewBannerSwiperStreamChannel
    },

    setup() {
      const headerMenuList = ref(HOME_HEADER_MENU)
      onMounted(() => {
        store.dispatch('platform/setPageMenuList', headerMenuList.value)
      })
    }
  }
</script>

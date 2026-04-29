<template>
  <div class="view-guide">
    <component :is="activePage?.conponent" />
    <ViewHomeFooter />
  </div>
</template>
<script setup>
  import ViewHomeFooter from '@/views/playbuz-home/homeFooter.vue'
  import ViewHomeHeader from '@/components/header/index.vue'
  import ViewHowToWatchCofunLIVEStreams from './howToWatchCofunLIVEStreams.vue'
  import ViewHowToBecomeCofunLIVEStreamer from './howToBecomeCofunLIVEStreamer.vue'
  import ViewHowToWithdrawEarnings from './HowToWithdrawEarnings.vue'
  import ViewHowToTopupPackage from './howToTopupPackage.vue'
  import { ref, watch, computed, onMounted } from 'vue'
  import store from '@/store'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const isLogin = computed(() => store.getters['member/isLogin'])
  const isMobile = computed(() => store.getters['platform/isMobile'])

  const GUIDE_LIST = [
    { id: 'how-to-watch-cofun-live-streams', conponent: ViewHowToWatchCofunLIVEStreams },
    { id: 'how-to-become-cofun-live-streamer', conponent: ViewHowToBecomeCofunLIVEStreamer },
    { id: 'how-to-topup-package', conponent: ViewHowToTopupPackage },
    { id: 'how-to-withdraw-earnings', conponent: ViewHowToWithdrawEarnings }
  ]
  const activeID = ref('')
  const activePage = ref({})

  const switchGuidePage = items => {
    activeID.value = items.id
    activePage.value = items
  }
  watch(activeID, val => {
    router.push({ name: route.name, params: { pageId: val } })
  })

  onMounted(() => {
    activePage.value = GUIDE_LIST.find(({ id }) => id === route.params.pageId) ?? GUIDE_LIST[0]
    activeID.value = activePage.value.id
  })
</script>
<style lang="scss" scoped>
  .view-guide {
    background-color: rgb(255, 255, 255);

    .step-title {
      text-align: center;
      color: black;
      font-size: 25px;
      font-weight: bold;
      padding: 30px 0;
      span {
        background: linear-gradient(to right, #ff36a3, #ac29ff);
        color: white;
        display: inline-block;
        margin-right: 15px;
        line-height: 40px;
        padding: 0 10px;
      }
    }
    .step-content {
      display: block;
      text-align: center;
      padding: 20px;
      .step-img {
        display: inline-block;
        padding: 20px;
      }
    }
  }
</style>

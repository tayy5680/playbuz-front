<template>
  <div class="view-playbuz-home-page" id="playbuzHome">
    <div class="home-stream-channel">
      <ViewBannerSwiperStreamChannel />
    </div>
    <ViewAboutCofunLive />
    <ViewWhyChooseUs />
    <ViewJoinCofunLIVE />

    <div class="about-playbuz" id="aboutPlayBUZ">
      <div class="container-main basic-title" v-fade="'opacity'">
        <h2>{{ $t('關於我們') }}</h2>
      </div>
      <div class="container-main" v-fade="'up'"><ViewAboutPlayBUZ /></div>
    </div>
    <ViewHomeFooter />
  </div>
</template>
<script setup>
  import ViewBannerSwiperStreamChannel from '@/views/home/banner/swiperStreamChannel'
  import ViewAboutCofunLive from './aboutCofunLIVE.vue'
  import ViewWhyChooseUs from './whyChooseUs.vue'
  import ViewJoinCofunLIVE from './joinCofunLIVE.vue'
  import ViewAboutPlayBUZ from '@/views/aboutUs/index.vue'
  import ViewHomeFooter from './homeFooter.vue'
  import ViewHomeHeader from '@/components/header/index.vue'
  import { ref, computed, provide } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute, useRouter } from 'vue-router'
  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const SITE_NAME = computed(() => t(process.env.VUE_APP_SITE_NAME))

  const scrollToId = id => {
    const container = document.getElementById('playbuzHome')
    const target = document.getElementById(id)

    if (container && target) {
      const top = target.offsetTop - 80
      container.scrollTo({ top, behavior: 'smooth' })
    }
  }
  provide('scrollToId', scrollToId)
</script>
<style lang="scss" scoped>
  .view-playbuz-home-page {
    margin-top: -18px;
    overflow-y: scroll;
    overflow-x: hidden;

    .home-stream-channel {
      background-color: #f8f9ff;
    }
    .about-playbuz {
      background-color: #edeffb;
      padding: 60px 0;
    }
  }
</style>
<style lang="scss">
  .view-playbuz-home-page {
    .basic-card {
      transition: all 0.2s ease;
      border: 1px solid #f3f4f6;
      border-radius: 0.75rem;
      box-shadow: rgba(99, 102, 241, 0.01) 0px 0.329276px 0.823189px -0.164638px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
        rgba(0, 0, 0, 0.098) 0px 9.67072px 14.5061px -2.90122px, rgba(0, 0, 0, 0.098) 0px 3.86829px 5.80243px -3.86829px;
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
      }
    }
    .basic-title {
      padding-bottom: 60px;
      text-align: center;
      h2 {
        font-size: 2.25rem;
        line-height: 2.5rem;
        font-weight: bold;
        color: #314167;
        padding-bottom: 10px;
      }
      h4 {
        font-size: 1.25rem;
        line-height: 1.5rem;
        font-weight: bold;
        color: #314167;
        padding-bottom: 10px;
      }
      h5 {
        padding: 10px 0;
        color: #787687;
      }
    }
  }
</style>

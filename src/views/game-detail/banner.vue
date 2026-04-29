<template>
  <div class="game-banner__wrap">
    <div class="game-banner__container" v-if="Object.keys(info).length" :class="tw(['relative', 'z-10', 'mb-[-10px]'])">
      <div class="game-detail__picture">
        <el-image
          class="game-detail__img"
          :src="`${gameSiteURL}/game/${isMobile ? 'mobile' : 'pc'}/type_bg/${info.GameID}.jpg`"
          :class="tw(['relative', 'bg-bg', 'w-full', 'object-cover', 'z--1', 'min-h-[130svw]', 'md:min-h-[498px]'])"
          :alt="info.GameName"
        >
          <template #error>
            <div :class="tw(['absolute', 'top-0', 'left-0', 'w-full', 'h-full', 'bg-[#444]', 'text-white'])"></div>
          </template>
          <template #placeholder>
            <el-skeleton-item variant="image" style="height: 100%;"></el-skeleton-item>
          </template>
        </el-image>
      </div>
    </div>
    <el-skeleton v-else :loading="true" :count="1" animated>
      <template id="template">
        <div :class="tw(['h-624px', 'md:h-500px'])">
          <el-skeleton-item variant="image" style="height: 100%;" />
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script>
  import { computed } from 'vue'
  import store from '@/store'

  export default {
    name: 'game-banner-image',

    props: {
      info: {
        type: Object,
        default: () => {}
      },

      loading: {
        type: Boolean,
        default: () => false
      }
    },

    setup() {
      const isMobile = computed(() => store.getters['platform/isMobile'])
      const gameSiteURL = process.env.VUE_APP_IMG_URL + '/img'

      return {
        isMobile,
        gameSiteURL
      }
    }
  }
</script>

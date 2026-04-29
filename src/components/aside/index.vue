<template>
  <aside class="view-aside" v-if="!isMobile">
    <div class="aside-content">
      <div
        v-for="(item, index) in ASIDE_MENU_2025"
        :key="index"
        :class="['aside-items', { active: activePageId === item.id }]"
        @click="switchPage(item)"
      >
        <img v-if="item.iconFileName" :src="require(`@/assets/img/menu/${item.iconFileName}.svg`)" :alt="item.id" />
        <div>{{ $t(item.label) }}</div>
      </div>
    </div>
  </aside>
</template>

<script>
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import store from '@/store'
  import { ASIDE_MENU_2025 } from '@/configs/aside'

  export default {
    name: 'view-aside',
    setup() {
      const route = useRoute()
      const router = useRouter()
      const isMobile = computed(() => store.getters['platform/isMobile'])
      const activePageId = computed(() => ASIDE_MENU_2025.find(item => item.id === route.name)?.id ?? '')

      const switchPage = item => {
        if (item.router.name === route.name) return
        router.push(item.router)
      }
      return {
        isMobile,
        activePageId,
        ASIDE_MENU_2025,
        switchPage
      }
    }
  }
</script>

<style lang="scss" scoped>
  .view-aside {
    width: 200px;
    margin-right: 34px;
    flex-shrink: 0;
    .aside-content {
      .aside-items {
        color: #707070;
        transition: all 0.2s ease;
        padding: 8px 0 8px 24px;
        display: flex;
        align-items: center;
        cursor: pointer;
        user-select: none;
        border-radius: 50px;
        margin-top: 16px;
        font-size: 18px;
        font-weight: 500;

        img {
          width: 24px;
          height: 24px;
          margin-right: 8px;
          filter: invert(47%) sepia(0) saturate(25%) hue-rotate(148deg) brightness(91%) contrast(89%);
        }

        &:hover {
          color: #7c7ed7;
          img {
            filter: invert(52%) sepia(90%) saturate(517%) hue-rotate(202deg) brightness(86%) contrast(94%);
          }
        }
        &.active {
          background-color: white;
          color: #7c7ed7;
          img {
            filter: invert(52%) sepia(90%) saturate(517%) hue-rotate(202deg) brightness(86%) contrast(94%);
          }
        }
      }
    }
  }
</style>

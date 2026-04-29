<template>
  <div class="view-user-rules-wrap container-mo-main">
    <div class="user-rule-button-container">
      <button
        v-for="(item, index) of USER_RULE_BUTTON_LIST"
        :key="index"
        :class="{ active: item.id === activeID }"
        @click="switchUserRule(item)"
      >
        {{ $t(item.label) }}
      </button>
    </div>
    <div class="user-rule-main">
      <component v-if="currentComponent" :is="currentComponent" />
      <div v-else>{{ $t('目前尚無內容') }}</div>
    </div>
  </div>
</template>

<script setup>
  import { ref, watch, onMounted, defineAsyncComponent, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import UISwitch from '@/components/ui/switch'
  import store from '@/store'
  import { USER_RULE_BUTTON_LIST } from '@/configs/userRule.js'

  const router = useRouter()
  const route = useRoute()
  const activeID = ref('')
  const lang = computed(() => store.state.member.languageCode)
  const activePage = ref({})
  const langMap = {
    'zh-TW': 'tw',
    'en-US': 'en'
  }

  // 動態載入，失敗就用 en 版本
  const loadComponent = async (folderName, lang) => {
    if (!folderName) return null
    const fileName = langMap[lang] || langMap['tw']
    return import(`./${folderName}/${fileName}.vue`).catch(() => import(`./${folderName}/tw.vue`).catch(() => null))
  }
  const currentComponent = ref(null)

  const switchUserRule = items => {
    activeID.value = items.id
    activePage.value = items
  }
  watch(activeID, val => {
    if (val === route.params.pageId) return
    router.replace({ name: route.name, params: { pageId: val } })
  })
  watch(
    () => route.params.pageId,
    newVal => {
      if (newVal !== activeID.value) initActivePage()
    }
  )

  watch(
    [lang, activePage],
    async ([langCode, page]) => {
      currentComponent.value = page?.folderName
        ? defineAsyncComponent(() => loadComponent(page.folderName, langCode))
        : null
    },
    { immediate: true }
  )
  const initActivePage = () => {
    activePage.value = USER_RULE_BUTTON_LIST.find(({ id }) => id === route.params.pageId) ?? USER_RULE_BUTTON_LIST[0]
    activeID.value = activePage.value.id
  }
  onMounted(() => {
    initActivePage()
  })
</script>

<style lang="scss" scoped>
  .view-user-rules-wrap {
    .user-rule-button-container {
      display: grid;
      gap: 10px;
      grid-template-columns: repeat(3, 1fr);

      button {
        background-color: white;
        font-size: 14px;
        padding: 4px;
        border-radius: 50px;
        user-select: none;
        transition: all 0.2s ease;

        &:hover,
        &.active {
          background-color: #7c7ed7;
          color: white;
        }
      }
    }

    @media (max-width: 768px) {
      .user-rule-button-container {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    :deep(.user-rule-main) {
      line-height: 1.6;
      padding: 2rem;
      background-color: white;
      margin: 30px 0;
      border-radius: 10px;
      color: black;
      font-size: 14px;
      p {
        margin-bottom: 15px;
      }
      h3 {
        font-weight: bold;
        font-size: 24px;
      }
      h5 {
        padding: 30px 0 10px 0;
        font-weight: bold;
        font-size: 16px;
      }
      p {
        margin-bottom: 1rem;
      }

      hr {
        margin: 40px 0;
      }
      ol,
      ul {
        padding-left: 1.5rem;
        list-style: auto;
        padding: revert;
        li {
          padding-top: 10px;
        }
      }
    }
    @media (max-width: 768px) {
      .user-rule-main {
        margin: 30px 0px;
      }
    }
  }
</style>

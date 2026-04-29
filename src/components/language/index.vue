<template>
  <teleportItem>
    <popView
      v-if="enableLanguage"
      class="language__wrap"
      @close="close"
      :viewWidth="'380px'"
      :viewHeight="viewHeight"
      :viewMaxHeight="'400px'"
      v-loading="isWait"
    >
      <template #top>
        <div>{{ $t('選擇語言') }}</div>
      </template>
      <template #container>
        <div class="language__main" :class="{ waiting: isWait }">
          <div
            class="language-items"
            v-for="(item, index) in formatList"
            :key="index"
            @click="action(item.id)"
            v-audio="'asideMenu'"
            :class="[{ active: item.id === languageCode }]"
          >
            <div class="label">{{ item.label }}</div>

            <i v-if="item.id === languageCode" class="bi bi-check"></i>
          </div>
        </div>
      </template>
    </popView>
  </teleportItem>
</template>

<script>
  import { computed, ref } from 'vue'
  import store from '@/store'
  import popView from '@/components/ui/pop-view'
  import teleportItem from '@/components/ui/teleport-item'
  import { postMemberLocaleMod } from '@/api/member'
  import { useNotice } from '@/utils/use-notice'
  import { LANGUAGE_NAME } from '@/configs/locales'

  export default {
    name: 'view-language',

    components: {
      popView,
      teleportItem
    },

    setup() {
      const enableLanguage = computed(() => store.state.member.enableLanguage)
      const languageCode = computed(() => store.state.member.languageCode)

      const viewHeight = computed(() => {
        let h = formatList.value.length * 40 + 120
        return (h > 360 ? h : 360) + 'px'
      })
      const formatList = computed(() => {
        if (!store.state.member.languageList.length) return []

        return store.state.member.languageList.map(item => ({
          id: item.Locale,
          label: LANGUAGE_NAME?.[item.Locale] ?? item[`LocaleName_${item.Locale.replace('-', '')}`]
        }))
      })

      const close = () => {
        store.dispatch('member/setEnableLanguage', false)
      }

      const isWait = ref(false)
      const action = async id => {
        if (id === languageCode.value) return
        if (isWait.value) return useNotice({ type: 'info', message: '切換語系中，請稍等' })
        isWait.value = true
        useNotice({ type: 'info', message: '切換語系中，請稍等' })
        try {
          if (store.getters['member/isLogin']) {
            await postMemberLocaleMod({ locale: id })
          }
          await store.dispatch('member/setSiteLocale', id)
          setTimeout(() => {
            useNotice({ type: 'success', message: '語系切換成功' })
            isWait.value = false
          }, 2000)
        } catch {
          useNotice({ type: 'error', message: '發生錯誤，請稍後再試，或洽客服人員' })
        }
      }

      return {
        enableLanguage,
        languageCode,
        formatList,
        isWait,
        viewHeight,
        // fn
        action,
        close
      }
    }
  }
</script>

<style lang="scss" scoped>
  .language__wrap {
    .language__main {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-top: 30px;
      .language-items {
        color: #374151;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        height: 48px;
        transition: 0.2s all ease;
        border-radius: 10px;
        .label {
          flex-grow: 1;
          padding: 0 8px;
        }
        i {
          font-size: 30px;
        }
        &:hover {
          background-color: #d3d5e0;
        }
        &.active,
        &.active:hover {
          background-color: transparent;
          color: #3336eb;
          cursor: default;
        }
      }

      &.waiting {
        .language-items,
        .language-items:hover {
          color: #969696 !important;
          cursor: wait;
          background-color: #eff0f3;
        }
      }
    }
  }
</style>

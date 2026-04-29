<template>
  <div class="event_wrap" :class="tw(['mx-auto', 'md:mx-0'])">
    <el-skeleton v-if="isLoadingFinish" class="event-news-skeleton" :loading="isLoadingFinish" animated>
      <template #template>
        <el-skeleton-item variant="image" class="container-mo-main" :class="tw(['md:mx-0'])" />
        <el-skeleton-item variant="image" class="container-mo-main" :class="tw(['md:mx-0'])" />
        <el-skeleton-item variant="image" class="container-mo-main" :class="tw(['md:mx-0'])" />
      </template>
    </el-skeleton>

    <div v-else class="event_container container-mo-main" :class="tw(['md:mx-0'])">
      <UISwitch
        :list="formatListTags"
        :activeID="parseInt(activeTagID)"
        lineStyle="border-solid border-b-2 border-AccentColor"
        @action="action"
        :isTranslate="false"
        :class="tw(['mb-5', 'md:mb-3'])"
      />
      <template v-if="!formatList.length">
        <div class="event_none" :class="tw(['flex', 'justify-center'])">
          <div
            class="event_none"
            :class="
              tw([
                'w-[340px]',
                'h-[300px]',
                'bg-[#28252b]',
                'flex',
                'flex-col',
                'items-center',
                'rounded-[20px]',
                'mt-[81px]'
              ])
            "
          >
            <div class="event_none_img">
              <img :class="tw(['mt-[65px]', 'mb-[80px]'])" :src="noneImg" />
            </div>
            <div class="event_none_text" :class="tw(['text-white'])">
              {{ $t('目前沒有相關訊息') }}
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <Item v-for="item of formatList.slice().reverse()" :key="item.id" :data="item" />
      </template>
    </div>
    <!-- 彈窗 -->
    <viewPopup
      v-if="displayPopup"
      @close="
        () => {
          displayPopup = false
        }
      "
    >
      <template v-slot:context>
        <div class="info" :class="tw(['flex', 'flex-col', 'justify-center', 'items-center', 'h-[200px]'])">
          <img :class="tw(['mb-6', 'w-28'])" />
          <span :class="tw(['text(white center xl)'])">
            {{ $t('敬請期待') }}
          </span>
        </div>
      </template>
    </viewPopup>
  </div>
</template>

<script>
  import { ref, onBeforeUnmount, provide, computed, watch, onMounted } from 'vue'
  import store from '@/store'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import viewPopup from '@/components/popup'
  import UISwitch from '@/components/ui/switch'
  import { getActivityNews, getActivityNewsTags } from '@/api/event'
  import Item from './item'

  export default {
    name: 'event',

    components: {
      Item,
      viewPopup,
      UISwitch
    },

    setup() {
      const isLoadingFinish = ref(true)
      const displayPopup = ref(false)
      provide('displayPopup', displayPopup)

      const { t } = useI18n()
      const noneImg = require('./images/i_system_info_note.svg')
      const formatList = ref([])
      const formatListTags = ref([])
      const route = useRoute()
      const router = useRouter()
      const lang = computed(() => store.state.member.languageCode)
      const activeTagID = ref(-1)
      const activeTagName = computed(
        () => formatListTags.value.find(item => item.id === activeTagID.value)?.paramsTagsName ?? '-'
      )
      watch(activeTagID, () => {
        if (activeTagName.value === route.params?.TagsName) return
        router.replace({
          name: route.name,
          params: {
            ...route.params,
            TagsName: activeTagName.value
          }
        })
      })

      const init = async () => {
        isLoadingFinish.value = true
        store.commit('platform/SET_IS_LOADING', true)
        try {
          const targetTags = await getActivityNewsTags()
          formatListTags.value = targetTags.Data.map(item => {
            return { id: item.TagsId, label: item.TagsName, paramsTagsName: item.UrlRoute }
          })

          activeTagID.value = formatListTags.value.find(item => item.paramsTagsName === route.params?.TagsName)?.id ?? 1
          await getActivityNewsList(activeTagID.value)
          store.commit('platform/SET_IS_LOADING', false)
        } catch (e) {
          formatListTags.value = []
          console.warn(e)
        } finally {
          isLoadingFinish.value = false
          store.commit('platform/SET_IS_LOADING', false)
        }
      }

      const getActivityNewsList = async id => {
        store.commit('platform/SET_IS_LOADING', true)
        const payload = {
          tagsID: id,
          newsType: 0
        }
        try {
          const target = await getActivityNews(payload)
          if (!target.Data) {
            formatList.value = []
            activeTagID.value = activeTagID.value
            return
          }
          target.Data.forEach(e => {
            if (!e.Description) e.Description = t('詳情請見內頁')
          })
          formatList.value = target.Data
          activeTagID.value = id
        } catch (e) {
          formatList.value = []
          activeTagID.value = activeTagID.value
        } finally {
          store.commit('platform/SET_IS_LOADING', false)
        }
      }

      const action = obj => {
        activeTagID.value = obj.id
        getActivityNewsList(obj.id)
      }

      onBeforeUnmount(() => {
        store.dispatch('platform/resetPageMenu')
      })

      onMounted(() => {
        init()
      })

      watch(lang, () => {
        init()
      })

      return {
        isLoadingFinish,
        displayPopup,
        formatList,
        formatListTags,
        noneImg,
        action,
        activeTagID
      }
    }
  }
</script>

<style lang="scss" scoped>
  .event-news-skeleton {
    width: 100%;

    .el-skeleton__item {
      height: 280px;
      margin-bottom: 12px;
      border-radius: 20px;
    }
  }
</style>

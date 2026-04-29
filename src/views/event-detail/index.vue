<template>
  <div class="event_detail_container container-mo-main" :class="tw(['h-full', 'relative'])">
    <div class="event_detail_navbar" :class="tw('my-5', 'md:mt-2')">
      <el-skeleton v-if="isLoading" animated :rows="0" :class="tw('w-5')" />
      <el-breadcrumb v-else separator=">" style="line-height: 1.6em;">
        <el-breadcrumb-item v-audio="'asideMenu'" :to="{ name: 'home' }">
          {{ $t('首頁') }}
        </el-breadcrumb-item>
        <el-breadcrumb-item v-audio="'asideMenu'" :to="{ name: 'event', params: { TagsName: activeTagName } }">
          {{ $t('最新消息') }}
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          {{ formatListContent.Title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div
      class="event_detail_main"
      :class="tw(['bg-[#fff]', 'rounded-[10px]', 'flex', 'flex-col', isMobile ? 'p-[24px]' : 'py-[42px] px-[90px]'])"
    >
      <el-skeleton v-if="isLoading" animated />
      <div v-else>
        <h1 :class="tw(['text-[2em]', 'font-bold'])">{{ formatListContent.Title }}</h1>
        <div :class="tw(['text-[12px]', 'text-[#8B8B8B]', 'mb-[10px]'])">
          {{ dayjs(formatListContent.CreateTime).format(dateFormat) }}
        </div>
        <div class="event_detail_main_type" :class="tw(['mb-[10px]', 'mr-[92px]'])">
          <div
            class="event_detail_main_type_item"
            v-for="item in formatListContent.TagsInfo"
            :key="item.TagsId"
            :class="
              tw([
                'inline-block',
                'text-[12px]',
                'border-[1px]',
                'border-[#7C7ED7]',
                'rounded-[13px]',
                'px-[12px]',
                'py-[2px]',
                'mr-[10px]',
                'text-[#7C7ED7]',
                'font-bold'
              ])
            "
          >
            {{ item.TagsName }}
          </div>
        </div>
        <div class="event_detail_main_html" v-html="formatListContent.Content" @click="handleHtmlClick" />
      </div>
    </div>
    <div class="event_detail_button" :class="tw(['flex', 'justify-between', 'py-5', 'w-full'])">
      <div
        class="event-detail__before"
        :class="
          tw([
            'flex',
            'items-center',
            'hover:text-AccentColor',
            formatListContent.PrevId === null ? 'opacity-20' : 'opacity-100',
            formatListContent.PrevId === null ? 'cursor-not-allowed' : 'cursor-pointer'
          ])
        "
        @click="action(formatListContent.PrevId)"
      >
        <div class="event-detail_before_button" :class="tw(['text-[24px]'])">
          <i class="bi bi-caret-left-fill"></i>
        </div>
        <span v-audio="'asideMenu'" :class="tw(['text-[16px]', 'ml-[20px]', 'hover:text-AccentColor'])">
          {{ $t('前一篇') }}
        </span>
      </div>
      <div
        class="event_detail_next"
        :class="
          tw([
            'flex',
            'items-center',
            'hover:text-AccentColor',
            formatListContent.NextId === null ? 'opacity-20' : 'opacity-100',
            formatListContent.NextId === null ? 'cursor-not-allowed' : 'cursor-pointer'
          ])
        "
        @click="action(formatListContent.NextId)"
      >
        <span v-audio="'asideMenu'" :class="tw(['text-[16px]', 'mr-[20px]'])">
          {{ $t('後一篇') }}
        </span>
        <div class="event_detail_next_button" :class="tw(['text-[24px]'])">
          <i class="bi bi-caret-right-fill"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { computed, ref, watch, onMounted } from 'vue'
  import store from '@/store'
  import { getActivityNewsContent } from '@/api/event'
  import { getMemberInfo } from '@/api/member'
  import { useRoute, useRouter } from 'vue-router'
  import dayjs from 'dayjs'
  import { useNotice } from '@/utils/use-notice'
  import { TAGS_NAME } from '@/configs/event/index.js'
  export default {
    components: {},
    setup() {
      const isLoading = ref(true)
      const router = useRouter()
      const route = useRoute()
      const lang = computed(() => store.state.member.languageCode)
      const dateFormat = computed(() => (lang.value === 'zh-TW' ? 'YYYY年MM月DD日' : 'YYYY/MM/DD'))
      const isMobile = computed(() => store.getters['platform/isMobile'])
      const isLogin = computed(() => store.getters['member/isLogin'])
      const info = computed(() => store.state.member.info)
      const formatListContent = ref([])
      const activeTagName = ref(route.params.TagsName)
      const envImgUrl = process.env.VUE_APP_IMG_URL

      // innerHtml 參數判定
      // 1.平滑滾動參數：添加屬性 data-fn="scroll" data-id="element_id"
      // 2.圖片路徑替代規則：replaceAll('{env_image_url}', envImgUrl)
      // 3.顯示登入視窗判定：data-fn="login"
      const handleHtmlClick = e => {
        const el = e.target.closest('[data-fn]') // 找最近的有 data-fn 的元素
        if (!el) return
        const { fn, id } = el.dataset
        if (fn === 'scroll') scrollToId(id)
        if (fn === 'login' && !isLogin.value) store.commit('sign/UPDATE_DRAWER_STATE', true)
      }
      // 文字替換：
      const innerHtmlReplace = htmlContent => {
        if (!htmlContent) return ''
        let content = htmlContent

        //  {env_image_url} :替換env路徑
        content = content.replaceAll('{env_image_url}', envImgUrl)

        // 20251022-『玩霸PlayBUZ 盛大開幕！』專用，用來判斷顯示【立即領取】或【已領取】
        content = content.replaceAll(
          '{is_Login_20251022}',
          isLogin.value
            ? '<span style="color:#C3C3C3;cursor: default;">【已領取】</span>'
            : '【<a data-fn="login" role="button">立即領取</a>】'
        )
        content = content.replaceAll(
          '{is_phone_bound_20251022}',
          info.value?.PhoneNumber || ''
            ? '<span style="color:#C3C3C3;cursor: default;">【已領取】</span>'
            : `【<a role="button" onclick="${
                isLogin.value
                  ? "window.open('/center/edit', '_blank')"
                  : `window.open(\'/?returnUrl=${window.location.origin}/center/edit\', \'_blank\')`
              }">立即領取</a>】`
        )
        content = content.replaceAll(
          '{is_line_friends_20251022}',
          info.value?.IsLineFriend
            ? '<span style="color:#C3C3C3;cursor: default;">【已領取】</span>'
            : `【<a href="https://lin.ee/ZLAGBl0" target="_blank">立即領取</a>】`
        )
        return content
      }

      const init = async () => {
        isLoading.value = true
        store.commit('platform/SET_IS_LOADING', true)
        try {
          const target = await getActivityNewsContent({ newsID: route.params.eventID, locale: lang.value })
          formatListContent.value = {
            ...target.Data,
            Content: innerHtmlReplace(target.Data.Content)
          }
          document.title = `${document.title} - ${formatListContent.value.Title}`
        } catch (err) {
          if (err.Code === '9404') router.push({ name: 'event', params: { TagsName: route.params.TagsName } })
          else {
            useNotice({ type: 'error', message: '發生錯誤，請稍後再試，或洽客服人員' })
          }
        } finally {
          isLoading.value = false
          store.commit('platform/SET_IS_LOADING', false)
        }
      }
      const action = async id => {
        if (id === null) return
        router.push({ name: 'event/detail', params: { TagsName: route.params.TagsName, eventID: id } })
      }
      const scrollToId = name => {
        const container = document.getElementById('app')
        const target = document.getElementById(name)
        if (container && target) {
          const top = target.offsetTop
          container.scrollTo({ top, behavior: 'smooth' })
        }
      }

      watch(lang, () => {
        init()
      })

      watch(isLogin, () => {
        init()
      })

      watch(
        () => route.params.eventID,
        () => {
          init()
        }
      )
      onMounted(async () => {
        activeTagName.value = route.params.TagsName
        // 20251022-『玩霸PlayBUZ 盛大開幕！』專用，重新取得memberinfo 查看是否已經加入line好友
        if (isLogin.value) {
          await getMemberInfo()
          await store.dispatch('member/logIn')
        }

        init()
      })

      return {
        isLoading,
        isLogin,
        isMobile,
        dayjs,
        formatListContent,
        dateFormat,
        action,
        activeTagName,
        handleHtmlClick,
        envImgUrl,
        scrollToId
      }
    }
  }
</script>
<style lang="scss">
  .event_detail_container {
    .event_detail_navbar {
      .el-breadcrumb__item:last-child .el-breadcrumb__inner {
        color: $SubColor;
      }

      .el-breadcrumb__inner {
        color: $BaseColor;
        cursor: pointer;

        &:hover {
          color: $AccentColor;
        }
      }
    }
    .event_detail_main_html {
      font-size: 15.4px;
      word-break: break-word;
      line-break: anywhere;

      h1,
      h2,
      h3,
      h4,
      h5,
      h6,
      hr,
      p,
      ol,
      ul {
        margin: revert;
        font-size: revert;
        list-style: revert;
        padding: revert;
        margin: revert;
        line-height: 1.8em;
      }

      h3 {
        font-size: 1.2em;
        line-height: 1.2em;
      }
      h2 {
        font-size: 1.6em;
        margin: 15.4px 0;
        line-height: 1.6em;
      }

      table,
      td,
      th {
        border: 1px solid #b3b3b3;
        padding: 10px 10px;
      }
      th,
      td {
        position: relative;
      }
      a {
        font-weight: bold;
        padding: 0 2px;
        cursor: pointer;
        color: #7c7ed7;
        transition: all 0.2s ease;
        &:hover {
          text-decoration: underline;
        }
      }

      ul li {
        list-style-position: outside;
        vertical-align: top;
      }

      // === 基礎型css ===
      .fn_scroll_btn {
        cursor: pointer;
        transition: all 0.2s ease;
        &:hover {
          color: #7c7ed7;
        }
      }
      .highlighter {
        font-weight: bold;
        background: linear-gradient(transparent 60%, #feea94 60%, #feea94 100%, transparent 100%);
      }
      table .diagonal-cell {
        width: 120px;
        height: 80px;
        padding: 0;
        svg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none; /* 避免擋住文字 */
        }
        .top-left {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 12px;
        }
        .bottom-right {
          position: absolute;
          bottom: 10px;
          left: 10px;
          font-size: 12px;
        }
      }
    }
  }
</style>

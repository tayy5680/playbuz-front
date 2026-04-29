<template>
  <div class="item_container"
    :class="tw([
      'z-10',
      'flex',
      'items-center',
      'justify-center',
      'rounded-20px',
      'overflow-hidden',
      'relative',
      'mb-12px',
      'cursor-pointer',
      'h-full',
      'group',
      'bg-[#303133]'])"
    @click="action(data)" >
    <template v-if="data[isMobile ? 'ImgUrlMo' : 'ImgUrlPc']">
      <el-image
        :src="data[isMobile ? 'ImgUrlMo' : 'ImgUrlPc']"
        :alt="data.Title"
        :class="tw([
          'absolute',
          'h-full',
          'w-full',
          'bg-skeletonBgColor',
          'group-hover:scale-105',
          transitionBase,
          '!hidden',
          '!md:block'])"
        fit="contain"
        lazy >
        <template id="placeholder">
          <div class="el-skeleton-item" variant="image" style="height: 100%;" />
        </template>
      </el-image>
      <el-image
        :src="data[isMobile ? 'ImgUrlMo' : 'ImgUrlPc']"
        :alt="data.Title"
        fit="cover"
        :class="tw([
          'h-full',
          'w-full',
          'bg-skeletonBgColor',
          'group-hover:scale-105',
          transitionBase,
          '!md:hidden'])"
        lazy >
        <template id="placeholder">
          <div class="el-skeleton-item" variant="image" style="height: 100%;" />
        </template>
      </el-image>
    </template>
    <div class="item_content_wrap"
      :class="tw([
        'absolute',
        'bottom-[26px]',
        'left-0',
        'mt-auto',
        'w-full'])" >
      <div class="item_text_title"
        :class="tw([
          'flex',
          'md:items-center',
          'flex-col',
          'md:flex-row',
          'w-full',
          'bg-enentLabelBgColor',
          'bg-opacity-80',
          'text-enentLabelTextColor',
          'py-[4px]',
          'px-[22px]',
          'md:px-[40px]'])" >
        <div
        :class="tw([
          'text(white 18px)',
          'font-bold',
          'overflow-hidden',
          'overflow-ellipsis',
          'truncate',
          'flex-1'])" >
        {{ data.Title }}
        </div>
        <div :class="tw(['text-enentLabelTextColor', 'md:text-16px', 'text-12px'])" >
          <span>{{ data.StartTime? dayjs(data.StartTime).format('YYYY/MM/DD') : $t('即刻起') }}</span>
          <span>{{ data.EndTime? '-' + dayjs(data.EndTime).format('YYYY/MM/DD') : `-${$t('無期限')}` }}</span>
        </div>
      </div>
    </div>
  </div>
  </template>
  <script>
  import { computed, ref } from 'vue'
  import store from '@/store'
  import dayjs from 'dayjs'
  import { useRoute, useRouter } from 'vue-router'

  export default {
    props: {
      data: {
        type: Object,
        required: true,
      },
    },

    setup (props) {
      const isMobile = computed(() => store.getters['platform/isMobile'])
      const lottiePcElement = ref(null)
      const lottieMobileElement = ref(null)
      const route = useRoute()
      const router = useRouter()
      const weekList = ['日', '一', '二', '三', '四', '五', '六']
      const action = (obj) => {
        const url = obj[isMobile.value ? 'OpenUrlMo' : 'OpenUrlPc']
        const query = JSON.parse(JSON.stringify(route.query))
        if (url) window.open(url)
        else {
          if (route.name === 'event/detail') router.push({ query, params: { eventID: obj.NewsId } })
          else router.push({ name: 'event/detail', query, params: { eventID: obj.NewsId } })
        }
      }

      return {
        isMobile,
        lottiePcElement,
        lottieMobileElement,
        action,
        dayjs,
        weekList,
      }
    },
  }
  </script>

  <style lang="scss">
  .event-lottie__item.mobile {
    svg {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) !important;
      min-width: 100%;
      height: auto !important;
      min-height: 100%;
    }
  }
  </style>

<template>
  <div class="deposit__package__wrap" :class="tw(['pt-6px'])">
    <div class="deposit__package__container">
      <div class="deposit__package__menu" :class="tw(['md:mx-0'])">
        <UISwitch
          :list="classList"
          :activeID="nowPackageTypeName"
          lineStyle="border-solid border-b-2 border-AccentColor"
          @action="menuAction"
        />
      </div>
      <el-skeleton
        v-if="loading"
        :loading="loading"
        :class="tw(['grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-x-20px', 'gap-y-22px', 'mx-mobileSpace', 'md:mx-0'])"
        :count="1"
        :throttle="500"
        animated
      >
        <template id="template">
          <div
            :class="
              tw(['rounded-20px', 'overflow-hidden', route.params.depositPageClass !== 'cycle' ? 'h-330px' : 'h-220px'])
            "
          >
            <el-skeleton-item variant="image" style="height: 100%;" />
          </div>
        </template>
      </el-skeleton>
      <div
        class="deposit__package__list"
        v-else
        :class="
          tw([
            'mt-[20px]',
            'md:mt-4',
            'grid',
            'grid-cols-1',
            { 'md:grid-cols-2': nowTypeListData.length > 0 },
            'gap-x-20px',
            'gap-y-22px',
            'md:mx-0'
          ])
        "
      >
        <depositItem v-if="nowTypeListData.length" :nowTypeListData="nowTypeListData" />
        <div v-else class="event_none" :class="tw(['flex', 'justify-center'])">
          <div
            class="event_none"
            :class="
              tw([
                'w-[340px]',
                'h-[300px]',
                'bg-[#f8f8f8]',
                'flex',
                'flex-col',
                'items-center',
                'rounded-[20px]',
                'mt-[81px]',
                'shadow-depositNone'
              ])
            "
          >
            <div class="event_none_img">
              <img
                :class="tw(['mt-[65px]', 'mb-[80px]'])"
                :src="noneImg"
                style="filter: invert(47%) sepia(0%) saturate(25%) hue-rotate(148deg) brightness(91%) contrast(89%);"
              />
            </div>
            <div class="event_none_text" :class="tw(['text-[#7b7b7b]'])">
              {{ $t('售完') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { inject } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { event } from 'vue-gtag-next'

  import depositItem from './package-item'
  import UISwitch from '@/components/ui/switch'
  export default {
    name: 'deposit-package-list',

    components: {
      depositItem,
      UISwitch
    },

    props: {
      loading: {
        type: Boolean
      }
    },

    setup() {
      const route = useRoute()
      const router = useRouter()
      // 新資料
      const nowPackageTypeName = inject('nowPackageTypeName')
      const nowTypeListData = inject('nowTypeListData')
      const classList = inject('classList')
      const menuAction = obj => {
        nowPackageTypeName.value = obj.id
        router.replace({ name: route.name, params: { ...route.params, depositPageClass: obj.id } })
        event('shopping_click', { click: obj.id })
      }

      const noneImg = require('./images/i_system_info_note.svg')

      return {
        route,
        noneImg,
        classList,
        nowPackageTypeName,
        nowTypeListData,
        menuAction
      }
    }
  }
</script>

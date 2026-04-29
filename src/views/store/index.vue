<template>
  <div class="store__wrap">
    <div class="store__container" :class="tw(['mx-mobileSpace', 'md:mx-0'])">
      <div class="store__sort__wrap" :class="tw(['pt-6px'])">
        <UISwitch :list="formatStoreSortList" :activeID="sortID" @action="action" />
        <div class="store_none" :class="tw(['flex', 'justify-center'])">
          <div
            class="store_none"
            v-if="!formatStoreList.length"
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
            <div class="store_none_img">
              <img :src="noneImg" :class="tw(['mt-[65px]', 'mb-[80px]'])" />
            </div>
            <div class="store_none_text" :class="tw(['text-white'])">
              {{ $t('籌備中') }}
            </div>
          </div>
        </div>
        <div
          class="store_list"
          v-for="item of formatStoreList"
          :key="item.id"
          :class="
            tw([
              'mt-[20px]',
              'md:mt-4',
              'md:flex flex-nowrap',
              'md:pr-[33px]',
              'md:pl-[0px]',
              'md:pt-[42px]',
              'md:pb-[8px]',
              'text-white'
            ])
          "
        >
          <div
            class="store_img"
            :style="{ backgroundImage: `url(${item.img})` }"
            :class="
              tw([
                'h-[130px]',
                'w-[100%]',
                'md:h-[150px]',
                'md:w-[220px]',
                'rounded-[10px]',
                'bg-[#ABABAB]',
                'bg-cover',
                'bg-center'
              ])
            "
          ></div>
          <div class="store_main" :class="tw(['md:pl-[20px]', 'md:pt-[0px]', 'pt-[16px]', 'mb-[48px]', 'md:mb-[0px]'])">
            <div class="store_title" :class="tw(['pb-[4px]', 'font-bold', 'text-[18px]', 'leading-[26px]'])">
              <div class="store__title">{{ $t(item.name, { siteName: SITE_NAME }) }}</div>
              <div class="store__title" :class="tw(['h-[18px]', 'w-[20px]', 'ml-[4px]', 'mt-[4px]'])">
                <a :href="`${item.src}`" target="_blank">
                  <img :src="mapImg" />
                </a>
              </div>
            </div>
            <div class="store_main_main" :class="tw(['text-[12px]', 'leading-[17px]'])">
              <div class="store_main__main" v-if="item.add">{{ $t(item.add) }}</div>
              <div class="store_main__main" v-if="item.phone">
                <a :href="`tel:${item.phone}`">{{ item.phone }}</a>
              </div>
              <div class="store_main__main" v-if="item.time">{{ $t('營業時間') }}： {{ item.time }}</div>
              <div class="store_main__main">
                {{ $t('服務項目') }}：
                <span v-for="(items, index) in item.service＿items" :key="items">
                  {{ $t(SERVE_ITEM[items].items) }}
                  <span v-if="index !== item.service＿items.length - 1">、</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { computed, provide, ref, onMounted } from 'vue'
  import store from '@/store'
  import { useRoute, useRouter } from 'vue-router'

  import { STORE_SORT_LIST, STORE, SERVE_ITEM } from '@/configs/store'

  import UISwitch from '@/components/ui/switch'
  import { useI18n } from 'vue-i18n'

  export default {
    name: 'store',

    components: {
      UISwitch
    },

    setup() {
      const route = useRoute()
      const router = useRouter()
      const { t } = useI18n()
      const SITE_NAME = computed(() => t(process.env.VUE_APP_SITE_NAME))

      const headerMenuList = ref([
        //{ id: 0, label: '門市據點', route: { name: 'store', query: { type: 'store', class: 'all' } } }
      ])
      onMounted(() => {
        // store.dispatch('platform/setPageMenuList', headerMenuList.value)
      })

      const formatStoreSortList = STORE_SORT_LIST

      const sortID = computed(() => {
        const target = STORE_SORT_LIST.find(item => item.class === route.query.class)
        return target ? target.id : 0
      })
      provide('sortID', sortID)

      const formatStoreList = computed(() => {
        // 使用深拷貝確保參數不被後續修改變更文件現狀。
        const target = JSON.parse(JSON.stringify(STORE)).reduce((acc, cur) => {
          cur.img = cur.img || require('./images/img_storemap_default.jpg')
          cur.phone = cur.phone ? cur.phone : '04-2255-8568'
          return acc.concat(cur)
        }, [])
        if (!route.query.class || route.query.class === 'all') return target
        return target.filter(item => item.label.includes(route.query.class))
      })
      const mapImg = require('./images/i_googlemap.svg')
      const noneImg = require('./images/i_system_info_note.svg')
      const action = obj => {
        const query = JSON.parse(JSON.stringify(route.query))
        query.class = obj.class
        router.replace({ query })
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }

      return {
        formatStoreSortList,
        formatStoreList,
        SERVE_ITEM,
        headerMenuList,
        sortID,
        mapImg,
        noneImg,
        SITE_NAME,
        // fn
        action
      }
    }
  }
</script>

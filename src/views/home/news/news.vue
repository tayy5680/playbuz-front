<template>
  <div class="news_container" :class="tw(['md:flex', 'md:flex-col'])">
    <div class="news_title">
      <UISwitch
        :list="LIST_TYPE"
        :activeID="choseID"
        lineStyle="pb-1 border-solid border-b border-sky-500"
        @action="action"
        :class="tw(['border-solid', 'border-b', 'border-[#707070]', 'mb-2'])"
      />
    </div>
    <div class="news_items_container" :class="tw(['flex', 'flex-wrap', 'flex-1'])">
      <div
        class="news_item"
        v-for="(item, index) of formatList"
        :key="index"
        :class="
          tw([
            'min-h-[calc((100%-12px)/2)]',
            'rounded-20px',
            'bg-[#00000029]',
            'w-full',
            index !== 0 && formatList.length > 2 ? 'md:w-[calc((100%-8px)/2)] md:mb-0' : '',
            { 'mb-3 h-[250px]': formatList.length > 1 },
            { 'md:mr-2': index === 1 && formatList.length > 2 }
          ])
        "
      >
        <div :class="tw(['h-full'])" ref="item">
          <Item :data="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { ref } from 'vue'

  import UISwitch from '@/components/ui/switch'

  import { getActivityNews } from '@/api/event'
  import Item from './item'

  export default {
    name: 'view-news',

    components: {
      UISwitch,
      Item
    },

    setup() {
      const LIST_TYPE = [{ id: 1, class: 'news', label: '最新消息' }]

      const choseID = ref(1)
      const choseItemIndexList = ref([])
      const action = obj => {
        choseItemIndexList.value = []
        if (choseID.value === obj.id) return false

        choseID.value = obj.id
      }

      const formatList = ref([])
      const getActivityNewsList = async () => {
        const payload = {
          tagsID: 6,
          newsType: 0
        }
        try {
          const target = await getActivityNews(payload)
          formatList.value = target.Data?.slice(0, 3)
        } catch (e) {
          console.warn(e)
        }
      }
      getActivityNewsList()

      return {
        LIST_TYPE,
        choseID,
        formatList,

        // fn
        action
      }
    }
  }
</script>

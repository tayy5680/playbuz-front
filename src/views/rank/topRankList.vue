<template>
  <div
    class="game__top__bg"
    :class="tw([
      'md:-mx-4',
    ])"
  >
    <div
      :class="tw([
        'w-[60px]',
        'h-[60px]',
        'absolute',
        'md:right-0',
        'right-[20px]',
        'cursor-pointer',
        'z-20',
      ])"
      v-if="activeID === 3"
    >
      <a href="/event/2023-spring-pk" target="_blank">
        <el-tooltip
          effect="dark"
          content="前往活動頁"
          placement="bottom"
          :offset="-6"
        >
          <div
            :class="tw([
              'w-full',
              'h-full',
              'flex',
              'justify-center',
              'items-center',
            ])"
          >
            <img :src="require(`./images/i_system_info2.svg`)" />
          </div>
        </el-tooltip>
      </a>
    </div>
    <img :src="isMobile ? require(`./images/rank_bg_mo.jpg`) : require(`./images/rank_bg_pc.jpg`)" />
  </div>
  <div>
    <div
      class="game__top__member"
      :class="tw([
        'px-2',
        'max-w-[470px]',
        'mx-auto',
        'pb-[50px]',
        isMobile ? 'mt-[-70%]' : 'mt-[-16%]',
      ])"
    >
      <div
        class="game__top__one"
        :class="tw([
          'flex',
          'justify-center',
          'relative',
          'z-[13]',
          'h-[20px]',
        ])"
      >
        <viewTopThreeItem
          :rank="1"
          :rankInfo="rankDataList[0]"
        />
      </div>
      <div
        class="game__top__other"
        :class="tw([
          'flex',
          'justify-between',
        ])"
      >
        <viewTopThreeItem
          :rank="2"
          :rankInfo="rankDataList[1]"
        />
        <viewTopThreeItem
          :rank="3"
          :rankInfo="rankDataList[2]"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { computed } from 'vue'
import store from '@/store'
import viewTopThreeItem from './topThreeItem'

export default {
  name: 'top-rank-list',

  components: {
    viewTopThreeItem,
  },

  props: {
    rankDataList: {
      type: Object,
      default: () => {},
    },
    activeID: {
      type: Number,
      default: () => 0,
    },
  },
  setup () {
    const isMobile = computed(() => store.getters['platform/isMobile'])
    return {
      isMobile,
    }
  },
}
</script>

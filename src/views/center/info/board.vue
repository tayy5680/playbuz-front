<template>
  <div class="board_container" :class="tw(['w-full', 'flex', 'justify-evenly'])" >
    <div class="board_item"
      v-for="(item, index) in list"
      :key='item.key'
      :class="tw([
        'relative',
        'flex',
        'flex-row',
        'items-center',
        'justify-center',
        index ? 'pl-[10%]': ''])">
      <div class="board_line"
        v-if="index"
        :class="tw([
          'absolute',
          'left-0',
          'bg-[#5D5763]',
          'w-px',
          'h-[59px]' ])" />
      <div :class="tw(['flex', 'flex-col', 'items-center'])">
        <img class="board_img"
          :class="tw([
            'w-[44px]',
            'h-[44px]',
            'md:m-[24px]'])"
          :src="require(`@/assets/img/icons/${item.icon}`)" />
          <div class="board__label"
            :class="tw([
              'mt-[2px]',
              'text-[15px]',
              'text-BaseColor'])">
            {{ $t(item.title) }}
          </div>
        <div class="board_data"
          :class="tw([
            'flex',
            'flex-col',
            'items-center' ])">
        </div>
        <div class="board_count"
          :class="tw([
            'text-[22px]',
            'md:text-left'])">
          {{ item.count }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import store from '@/store'

export default {
  setup () {
    const info = computed(() => store.state.member.info)
    const list = computed(() => {
      return [
        { key: 'medal', value: 'MedalCount', icon: 'badge.svg', title: '勳章' },
        { key: 'friend', value: 'FriendCount', icon: 'friend.svg', title: '好友' },
        { key: 'rank', value: 'Ranking', icon: 'rank.svg', title: '排行榜' },
      ].reduce((acc, cur) => {
        cur.count = info.value?.[cur.value] ?? 0
        return acc.concat(cur)
      }, [])
    })

    return {
      info,
      list,
    }
  },
}
</script>

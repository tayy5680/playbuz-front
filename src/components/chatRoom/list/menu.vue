<template>
  <div
    class="chat-menu__wrap"
    :class="tw([
      'px-22px',
      'mb-12px',
      'sticky',
      'top-0',
      'left-0',
      'bg-navBgHover',
      'w-full',
      'z-10',
    ])"
  >
    <viewMenu
      #="slotProps"
      :list="list"
      :activeID="choseID"
      :isBadge="isBadge"
      :classNames="`!w-[33.3%] justify-center`"
      @action="action"
    >
      <span :class="tw(['text-center'])">
        {{ $t(slotProps.row.label) }}
      </span>
    </viewMenu>
  </div>
</template>

<script>
import { computed, inject } from 'vue'
import store from '@/store'

import viewMenu from '@/components/viewMenu'

export default {
  name: 'chat-list-menu',

  components: {
    viewMenu,
  },

  inject: [
    'menu',
    'choseMenuID',
    'chgMenuID',
  ],

  setup () {
    const list = inject('menu')
    const choseID = inject('choseMenuID')
    const chgMenuID = inject('chgMenuID')

    const isBadge = computed(() => {
      const friendObject = store.getters['platform/isformatFriend']
      if (Object.keys(friendObject).length <= 0) return
      return friendObject.find((e) => {
        return e.IsFriendSate === false
      })
    })

    const action = (id) => chgMenuID(id)

    return {
      list,
      choseID,
      isBadge,
      // fn
      action,
    }
  },
}
</script>

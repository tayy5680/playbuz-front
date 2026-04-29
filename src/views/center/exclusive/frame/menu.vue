<template>
  <div
    class="frame-menu__wrap"
    :class="tw([
      'w-full',
    ])"
  >
    <viewSwitch
      v-if="isMobile"
      :list="list"
      :activeID="choseID"
      @action="action"
    />
    <viewMenu
      v-else
      #="slotProps"
      :list="list"
      :activeID="choseID"
      :classNames="`!px-[30px]`"
      :isCenter="true"
      @action="action"
    >
      <span
        :class="tw([
          'text-center',
        ])"
      >
        {{ $t(slotProps.row.label) }}
      </span>
    </viewMenu>
  </div>
</template>

<script>
import viewMenu from '@/components/viewMenu'
import viewSwitch from '@/components/viewSwitch'
import { inject, computed } from 'vue'
import store from '@/store'

export default {
  name: 'frame-menu',

  components: {
    viewMenu,
    viewSwitch,
  },

  setup () {
    const isMobile = computed(() => store.getters['platform/isMobile'])
    const list = inject('menu')
    const choseID = inject('choseMenuID')
    const chgMenuID = inject('chgMenuID')
    const action = (id) => chgMenuID(id)

    return {
      list,
      choseID,
      action,
      isMobile,
    }
  },
}
</script>

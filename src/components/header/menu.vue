<template>
  <teleport v-if="list.length && !mobileNonMenu" to="#mobileMenu" :disabled="!isMobile">
    <viewMenu
      #="slotProps"
      :list="list"
      :activeID="activeID"
      :upadteView="updateViewElement"
      :class="tw(['container-mo-main', 'md:mx-0', 'mb-18px', 'md:mb-0', 'mt-5', 'md:mt-0'])"
      :xRayMargin="isMobile ? 16 : 66"
      @action="chgActiveID"
    >
      <span :class="tw(['text-center', 'flex', 'items-center'])">
        <img v-if="slotProps.row.img" :src="slotProps.row.img" :alt="slotProps.row.label" />
        {{ slotProps.row.label }}
      </span>
    </viewMenu>
  </teleport>
</template>

<script>
  import { ref, computed, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import store from '@/store'
  import viewMenu from '@/components/viewMenu'

  import { event } from 'vue-gtag-next'

  export default {
    components: {
      viewMenu
    },

    setup() {
      const route = useRoute()
      const router = useRouter()

      const mobileNonMenu = computed(() => route.meta.mobileNonMenu && isMobile.value)
      const isMobile = computed(() => store.getters['platform/isMobile'])

      const list = computed(() => store.state.platform.pageMenuList)
      const activeID = computed(() => store.state.platform.pageMenuID)
      const chgActiveID = id => {
        store.dispatch('platform/setPageMenuID', id)
        const obj = list.value.find(item => item.id === activeID.value)
        if (obj.route.name === 'game') {
          event('game_click', { click: obj.type })
          router.push({ name: 'game', params: { gameType: obj.type, gameClass: 'all' } })
          return
        }
        if (obj.route.name === 'deposit') {
          event('shopping_click', { click: obj.route?.params?.depositPageType })
          router.push({
            name: 'deposit',
            params: { ...obj.route.params, depositPageClass: route.params?.depositPageClass }
          })
          return
        }
        if (obj.route.name === route.name) {
          const query = JSON.parse(JSON.stringify(route.query))
          const originQuery = JSON.parse(JSON.stringify(obj.route.query))
          obj.route.query = { ...query, ...originQuery }
          router.push(obj.route)
        } else router.push(obj.route)
      }

      const updateViewElement = ref(null)
      watch(
        () => route.name,
        newVal => {
          store.dispatch('platform/setPageMenuList')
          store.dispatch('platform/setPageMenuID')
          updateViewElement.value = newVal
        }
      )

      return {
        mobileNonMenu,
        isMobile,
        list,
        activeID,
        updateViewElement,
        chgActiveID
      }
    }
  }
</script>

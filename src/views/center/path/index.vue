<template>
  <div class="path__wrap" :class="tw(['pb-1', 'border-b-1', 'border-[#9D9D9D]', 'mb-4'])">
    <div class="path__tips" :class="tw(['text(purpleLine 12px)', 'mb-6px'])">
      {{ SITE_NAME }}
    </div>
    <div class="path__list" :class="tw(['flex', 'items-center'])">
      <div class="path__item" v-for="(item, index) of pathArray" :key="index" :class="tw(['flex', 'items-center'])">
        <div
          class="path__label"
          :class="tw([index !== pathArray.length - 1 ? 'cursor-pointer' : ''])"
          @click="action(item)"
        >
          {{ $t(item.label) }}
        </div>
        <div class="path__arraw" v-if="index !== pathArray.length - 1" :class="tw(['mx-4px'])">
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  export default {
    name: 'view-path',

    setup() {
      const { t } = useI18n()
      const SITE_NAME = computed(() => t(process.env.VUE_APP_SITE_NAME))

      const route = useRoute()
      const router = useRouter()
      const pathList = {
        center: '會員中心',
        edit: '會員資料',
        record: '訂單'
      }

      const pathArray = computed(() => {
        const target = route.name.split('/')

        if (!target || !target.length) return []

        const routerString = []
        return target.reduce((acc, cur) => {
          routerString.push(cur)
          const label = pathList[cur] ?? cur
          const route = routerString.join('/')
          return acc.concat({ id: cur, label, route })
        }, [])
      })

      const action = obj => {
        if (route.name !== obj.route) router.push({ name: obj.route })
      }

      return {
        pathArray,
        SITE_NAME,
        action
      }
    }
  }
</script>

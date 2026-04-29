<template>
  <el-skeleton
    :loading="loading"
    :class="tw([
      'grid',
      `grid-cols-${slideDisplayCount}`,
      'gap-x-14px',
    ])"
    :count="slideDisplayCount"
    :throttle="500"
    animated
  >
    <template #template>
      <div
        :class="tw([
          'rounded-20px',
          'overflow-hidden',
          isMobile ? 'h-82px' : 'h-146px',
        ])"
      >
        <el-skeleton-item
          variant="image"
          style="height: 100%;"
        ></el-skeleton-item>
      </div>
    </template>
  </el-skeleton>
</template>

<script>
import { inject, computed } from 'vue'
import store from '@/store'

export default {
  setup () {
    const loading = inject('loading')
    const count = inject('count')

    const isMobile = computed(() => store.getters['platform/isMobile'])
    const slideDisplayCount = computed(() => {
      return count.value || isMobile.value ? 4 : 5
    })

    return {
      loading,
      slideDisplayCount,
      isMobile,
    }
  },
}
</script>

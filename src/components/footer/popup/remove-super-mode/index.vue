<template>
  <buttonView @click="action">關閉超級模式</buttonView>
</template>

<script>
import buttonView from '@/components/ui/button-view'

export default {
  components: {
    buttonView,
  },

  setup () {
    const action = () => {
      localStorage.removeItem('superMode')
      location.reload()
    }

    return {
      action,
    }
  },
}
</script>

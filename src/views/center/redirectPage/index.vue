<template>
  <div>loading</div>
</template>
<script>
import {
  onMounted,
} from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'redirectPage',
  components: {
  },

  setup () {
    const router = useRouter()
    onMounted(() => {
      router.push({ name: 'center/record', query: { type: 'order' } })
    })
    return {
    }
  },
}
</script>

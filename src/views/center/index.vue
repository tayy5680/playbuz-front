<template>
  <div
    :class="tw([
      'md:flex',
      'md:flex-col',
      'md:items-center'
    ])"
  >
    <info />
    <exclusive />
  </div>
</template>

<script>
import info from './info'
import exclusive from './exclusive'

export default {
  components: {
    info,
    exclusive,
  },
}
</script>

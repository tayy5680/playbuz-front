<template>
  <transition name="fade">
    <div
      class="miniPop_container"
      :class="tw([
        'w-full',
        'rounded-20px',
        'bg-white',
        'mt-5',
        'px-10',
        'py-5',
        'flex',
        'flex-col',
        'items-center'])">
    <slot name="context"></slot>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'miniPop',
  setup () {
  },
}
</script>
<style lang="scss" scoped>
  .miniPop_container {
    box-shadow: 0 0 5px #00000040;
  }
</style>

<template>
  <div class="event_wrap">
    <slot name="board"></slot>
  </div>
  <slot name="mask"></slot>
</template>

<script>
export default {
  name: 'event-content',
}
</script>

<template>
  <popView
    class="popup__wrap"
    @close="$emit('close')"
  >
    <template #container>
      <div
        class="popup__main"
        :class="tw([
          'flex',
          'flex-col',
          'items-center',
          'px-0',
          'md:px-40px',
          'h-full',
        ])"
      >
        <miningPetDebugModeView />
      </div>
    </template>
    <template #bottom>
      <div
        class="popup__main"
        :class="tw([
          'flex',
          'flex-col',
          'items-center',
          'px-0',
          'md:px-40px',
        ])"
      >
        <removeSuperModeView />
      </div>
    </template>
  </popView>
</template>

<script>
import popView from '@/components/ui/pop-view'
import removeSuperModeView from './remove-super-mode'
import miningPetDebugModeView from './miningpet-debug-mode'

export default {
  components: {
    popView,
    removeSuperModeView,
    miningPetDebugModeView,
  },

  setup () {
  },
}
</script>

<template>
  <popView class="gift__wrap" @close="onClose">
    <template #top>
      <wallet />
    </template>
    <template #container>
      <div class="gift__main" :class="tw(['px-0', 'md:px-40px', 'h-full'])">
        <component :is="setup" />
      </div>
    </template>
  </popView>
</template>

<script>
  import { computed, reactive, ref, provide } from 'vue'

  import popView from '@/components/ui/pop-view'
  import wallet from './wallet'
  import validate from './validate'
  import forgot from './forgot'
  import packing from './packing'
  import pickCoin from './pick-coin'
  import success from './success'

  export default {
    name: 'gift-view',

    components: {
      popView,
      wallet,
      forgot,
      validate,
      pickCoin,
      packing,
      success
    },

    setup(props, { emit }) {
      const setupIndex = ref(1)
      provide('setupIndex', setupIndex)
      const setupList = reactive(['forgot', 'validate', 'pickCoin', 'packing', 'success'])

      const setup = computed(() => setupList?.[setupIndex.value] || 1)

      const giftObject = reactive({
        id: 1,
        count: '',
        password: ''
      })
      provide('giftObject', giftObject)

      const onClose = () => {
        emit('close')
      }
      provide('onClose', onClose)

      const apiPackingList = ref(null)
      provide('apiPackingList', apiPackingList)

      return {
        setup,
        // fn
        onClose
      }
    }
  }
</script>

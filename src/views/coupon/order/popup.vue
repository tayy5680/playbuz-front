<template>
<viewPopup v-if="display">
  <template v-slot:context>
    <div class="info">
      <div
        class="img"
        :class="tw([
          'mt-14px',
          'mb-36px',
          'text-center',
        ])"
      >
        <div
          class="img"
          :class="tw([
            'mt-14px',
            'mb-36px',
            'mx-auto',
            'bg-white',
            'h-[80px]',
            'w-[80px]',
          ])"
          :style="{
            '-webkit-mask':  setStyleMaskImage(require('./images/i_system_info_note.svg')),
            'mask':  setStyleMaskImage(require('./images/i_system_info_note.svg')),
          }"
        >
        </div>
      </div>
      <div
        class="text"
        :class="tw([
          'flex-1',
          'flex',
          'flex-col',
          'items-center',
        ])"
      >
        {{ $t('是否確定取消兌換') }}
      </div>
    </div>
  </template>
  <template v-slot:bottom>
    <div
      class="btn_list"
      :class="tw([
        'text(white center)',
      ])"
    >
      <div
        class="btn"
        :class="tw([
          'cursor-pointer',
          'bg-depositBtn',
          'rounded-full',
          'mb-8px',
          'p-8px',
        ])"
        @click="action()"
      >
        {{ $t('確定') }}
      </div>
      <div
        class="btn"
        :class="tw([
          'cursor-pointer',
          'bg-giftBtnInactive',
          'rounded-full',
          'p-8px',
        ])"
        @click="$emit('close')"
      >
        {{ $t('取消') }}
      </div>
    </div>
  </template>
</viewPopup>
</template>

<script>
import viewPopup from '@/components/popup'
import {
  postCouponCancelOrder,
} from '@/api/member'
import { useNotice } from '@/utils/use-notice'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

export default {
  name: 'view-popup',

  components: {
    viewPopup,
  },

  props: {
    display: {
      type: Boolean,
      default: () => false,
    },

    id: {
      type: String,
      default: () => '',
    },
  },

  setup (props, { emit }) {
    const loading = ref(false)
    const router = useRouter()
    const setStyleMaskImage = (url) => {
      return `url(${url}) no-repeat center /contain`
    }

    const action = async () => {
      if (loading.value) return false

      try {
        loading.value = true
        await postCouponCancelOrder({
          orderID: props.id,
        })
        useNotice({ type: 'info', message: '訂單已成功取消' })
      } catch {
        useNotice({ type: 'error', message: '發生錯誤，請稍後再試，或洽客服人員' })
      } finally {
        loading.value = false
        router.push({ name: 'home' })
        emit('close')
      }
    }

    return {
      // fn
      setStyleMaskImage,
      action,
    }
  },
}
</script>

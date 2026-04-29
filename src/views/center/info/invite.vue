<template>
  <div class="invite__wrap" :class="tw(['mt-[28px]', 'mb-[44px]', 'md:my-0'])">
    <div class="invite__container">
      <div class="invite__text" :class="tw(['flex', 'flex-wrap', 'md:flex-nowrap', 'items-center', 'text-white'])">
        <div class="invite__label" :class="tw(['text-[12px]', 'w-full', 'md:w-auto'])">
          {{ $t('我的邀請碼') }}
        </div>
        <div class="invite__code" :class="tw(['text-[28px]', 'md:text-[18px]', 'md:mx-8px', 'tracking-[.18px]'])">
          {{ invite?.code ?? '' }}
        </div>
        <img
          src="./images/i_copy.svg"
          :class="tw(['cursor-pointer', 'w-[32px]', 'h-[32px]', 'md:w-[24px]', 'md:h-[24px]'])"
          @click="copyCode"
        />
      </div>
    </div>
    <div class="invite-share__container" :class="tw(['flex', 'items-center', 'mt-12px'])">
      <buttonView :outline="true" size="small" @click="clickCopy">
        {{ $t('複製邀請連結') }}
      </buttonView>
      <img
        v-for="item of SHARE_LIST"
        :key="item.id"
        :class="tw(['w-[45px]', 'h-[45px]', 'md:w-[24px]', 'md:h-[24px]', 'ml-14px', 'md:ml-8px', 'cursor-pointer'])"
        :src="item.img"
        @click="action(item.id)"
      />
    </div>
  </div>
</template>

<script>
  import { computed } from 'vue'

  import buttonView from '@/components/ui/button-view'

  import introduce from '@/utils/introduce'
  import { useNotice } from '@/utils/use-notice'
  import { event } from 'vue-gtag-next'
  import { useI18n } from 'vue-i18n'

  export default {
    name: 'center-invite-share',

    components: {
      buttonView
    },

    setup() {
      const { t } = useI18n()
      const SITE_NAME = computed(() => t(process.env.VUE_APP_SITE_NAME))
      const invite = introduce()
      const SHARE_LIST = [
        { id: 'line', img: require('./images/i_linelogo2.svg') },
        { id: 'telegram', img: require('./images/i_telegram2.svg') }
      ]

      const copyCode = () => {
        event('member_invite_click', { click: 'pomote_code' })

        navigator.clipboard
          .writeText(invite.code)
          .then(() => {
            useNotice({ type: 'success', message: '複製成功', allowDuplicate: true })
          })
          .catch(() => {
            useNotice({ type: 'error', message: '複製失敗', allowDuplicate: true })
          })
      }

      const clickCopy = () => {
        event('member_invite_click', { click: 'url' })

        const text = `${t(invite.message, { siteName: SITE_NAME.value })}\n${invite.link}\n`
        navigator.clipboard
          .writeText(text)
          .then(() => {
            useNotice({ type: 'success', message: '複製成功', allowDuplicate: true })
          })
          .catch(() => {
            useNotice({ type: 'error', message: '複製失敗', allowDuplicate: true })
          })
      }

      const action = id => {
        switch (id) {
          case 'line':
            event('member_invite_click', { click: 'line' })
            invite.shareLINE()
            break
          case 'telegram':
            event('member_invite_click', { click: 'telegram' })
            invite.shareTelegram()
            break
          case 'whatsapp':
            event('member_invite_click', { click: 'whatsapp' })
            invite.shareWhatsapp()
            break
        }
      }

      return {
        invite,
        SHARE_LIST,
        // fn
        copyCode,
        clickCopy,
        action
      }
    }
  }
</script>

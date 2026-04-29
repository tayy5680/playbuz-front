<template>
  <popView class="share__wrap" @close="$emit('close')">
    <template #container>
      <div class="share__main" :class="tw(['flex', 'flex-col', 'items-center', 'px-0', 'md:px-40px', 'h-full'])">
        <div
          class="share__img"
          :class="tw(['w-[60px]', 'h-[60px]', 'mt-auto', 'bg-white', 'flex-shrink-0'])"
          :style="{
            '-webkit-mask': setStyleMaskImage(require('./images/i_mm_invite.svg')),
            mask: setStyleMaskImage(require('./images/i_mm_invite.svg'))
          }"
        ></div>
        <div class="share__title" :class="tw(['mt-[18px]', 'mb-auto', 'text-[18px]', 'text-white'])">
          {{ $t('分享邀請連結') }}
        </div>
        <el-scrollbar
          class="share__overflow"
          :class="tw(['whitespace-pre-line', 'text-white', 'w-full', 'my-[20px]'])"
          :style="{ flex: '1 1 0' }"
        >
          {{ promoteText }}
        </el-scrollbar>
        <hr :class="tw(['border-purpleLine', 'w-full', 'my-[16px]'])" />
        <div class="share-button__list" :class="tw(['flex', 'items-center', 'w-full'])">
          <div
            class="share-button__item"
            v-for="item of list"
            :key="item.id"
            :class="tw(['flex-1', 'flex', 'flex-col', 'items-center', 'cursor-pointer'])"
            @click="action(item.id)"
          >
            <img
              class="share-button__icon"
              :src="require(`./images/${item.img}`)"
              :class="tw(['w-[40px]', 'mb-[12px]'])"
            />
            <span class="share-button__title" :class="tw(['text-[#AFA0BE]', 'text-14px'])">
              {{ item.label ?? $t(item.label) }}
            </span>
          </div>
        </div>
      </div>
    </template>
  </popView>
</template>

<script>
  import { ref, computed } from 'vue'

  import popView from '@/components/ui/pop-view'

  import introduce from '@/utils/introduce'
  import { useNotice } from '@/utils/use-notice'
  import { useI18n } from 'vue-i18n'

  export default {
    name: 'edit-share',

    components: {
      popView
    },

    setup() {
      const invite = introduce()
      const { t } = useI18n()
      const SITE_NAME = computed(() => t(process.env.VUE_APP_SITE_NAME))

      const promoteText = ref('')
      promoteText.value = `${t(invite.message, { siteName: SITE_NAME.value })}\n${invite.link}\n`

      const setStyleMaskImage = url => {
        return `url(${url}) no-repeat center /contain`
      }

      const action = id => {
        switch (id) {
          case 'copy':
            clickCopy()
            break
          case 'line':
            invite.shareLINE()
            break
          case 'telegram':
            invite.shareTelegram()
            break
        }
      }

      const clickCopy = () => {
        navigator.clipboard
          .writeText(promoteText.value)
          .then(() => {
            useNotice({ type: 'success', message: '複製成功', allowDuplicate: true })
          })
          .catch(() => {
            useNotice({ type: 'error', message: '複製失敗', allowDuplicate: true })
          })
      }

      const list = ref([
        { id: 'copy', img: 'i_copy.svg', label: t('複製文字') },
        { id: 'line', img: 'i_linelogo2.svg', label: 'Line' },
        { id: 'telegram', img: 'i_telegram2.svg', label: 'Telegram' }
      ])

      return {
        promoteText,
        list,
        // fn
        action,
        setStyleMaskImage
      }
    }
  }
</script>

<template>
  <div class="complete__wrap" :class="tw(['flex', 'flex-col', 'flex-1', 'w-full'])">
    <div
      class="complete__container"
      :class="tw(['flex-1', 'flex', 'flex-col', 'items-center', 'h-full', 'pb-20px', 'md:pb-0'])"
    >
      <div class="complete__icon" :class="tw(['rounded-full', 'overflow-hidden', 'w-80px', 'h-80px', 'mb-24px'])">
        <img :src="userPicture" class="complete__picture" />
      </div>
      <div class="complete__label" :class="tw(['text(white 22px)', 'mb-22px'])">
        {{ userNickName }}
      </div>
      <div class="complete__detail" :class="tw(['text(presentGold center)'])">
        <div class="complete__sub" :class="tw(['text-22px'])">
          {{ $t('恭喜您註冊成功') }}
        </div>
        <div class="complete__text">JKFx{{ SITE_NAME }} {{ $t('獎勵已發送!') }}</div>
      </div>
      <div class="complete__btn__list" :class="tw(['mt-auto', 'flex', 'items-center', 'mt-20px'])">
        <div
          class="complete__btn"
          v-for="(item, index) of btnList"
          :key="item.key"
          :class="
            tw([
              'cursor-pointer',
              'rounded-full',
              'text(20px center)',
              'p-12px',
              'min-w-[130px]',
              'leading-none',
              'mx-4px',
              index === 0 ? 'text-violet border border-violet' : 'text-white bg-ordernoBtn'
            ])
          "
          @click="action(item.id)"
        >
          {{ $t(item.label) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { computed, inject, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import store from '@/store'

  import { useNotice } from '@/utils/use-notice'
  import { useI18n } from 'vue-i18n'

  export default {
    setup() {
      const { t } = useI18n()
      const SITE_NAME = computed(() => t(process.env.VUE_APP_SITE_NAME))
      const router = useRouter()
      const close = inject('close')
      const thirdLoginObject = inject('thirdLoginObject')
      const info = computed(() => store.state.member.info)
      const userPicture = computed(() => info.value?.PhotoSrc || thirdLoginObject.PhotoPath || '')
      const userNickName = computed(() => info.value?.NickName || thirdLoginObject.NickName)

      const btnList = reactive([
        { id: 'close', label: '先逛逛' },
        { id: 'deposit', label: '前往商城' }
      ])
      const action = async id => {
        await store.dispatch('member/logIn')

        useNotice({ type: 'gpg', message: `Hi! ${info.value?.NickName || ''}  ${t('歡迎回來！')}`, isI18n: false })

        if (id === 'deposit') router.push({ name: id })
        close()
      }

      return {
        btnList,
        userPicture,
        userNickName,
        SITE_NAME,
        action
      }
    }
  }
</script>

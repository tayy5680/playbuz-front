<template>
  <div class="edit-name-and-photo__wrap">
    <p
      class="verified__text"
      :class="tw(['text(sm lineBg)', 'tablet:text-sm', 'absolute', 'top-[15px]', 'left-[23px]'])"
    >
      <img src="./images/i_tick.svg" :class="tw(['inline-block', 'w-4', 'tablet:w-5', 'mr-1.5', 'align-top'])" />
      <span :class="tw(['align-middle'])">{{ $t(verifiedText) }}</span>
    </p>
    <p :class="tw(['text-sm', 'text-BaseColor', 'text-center', 'pt-28', 'pb-8'])">
      {{ $t('給自己一個頭像！') }}
    </p>
    <div class="pic__list" :class="tw(['flex', 'justify-center', 'mb-40px'])">
      <div
        class="pic__item"
        v-for="(item, index) of avatars"
        :key="index"
        :class="[
          { selected: index + 1 === selectedIdx },
          tw([
            'cursor-pointer',
            'relative',
            'h-90px',
            'w-90px',
            'hover:opacity-100',
            'mx-10px',
            transitionBase,
            index + 1 === selectedIdx ? 'opacity-100' : 'opacity-30'
          ])
        ]"
        @click="changeAvatar(index + 1)"
      >
        <div
          class="pic__chose"
          v-if="index + 1 === selectedIdx"
          :class="
            tw([
              'absolute',
              'top-1/2',
              'left-1/2',
              '-translate-1/2',
              'w-full',
              'h-full',
              'p-6px',
              'border',
              'border(2 choseAvatarItem)',
              'rounded-full',
              'box-content'
            ])
          "
        ></div>
        <img class="pic__img" :src="item" :class="tw(['block', 'w-full', 'h-full', 'rounded-full'])" />
      </div>
    </div>
    <div :class="tw(['mx-auto', 'w-4/5'])">
      <input
        ref="nicknameInput"
        type="text"
        :placeholder="$t('告訴我你的名字吧！')"
        v-model="nickname"
        @keydown.enter="submit"
        :class="
          tw([
            'my-3',
            'block',
            'w-full',
            'h-10',
            'rounded-full',
            'text-center',
            'text-white',
            nickname ? 'text-base' : 'text-xs',
            'border-1',
            'bg-codeBox',
            'border-nicknameBorder'
          ])
        "
      />
      <button
        :class="
          tw([
            canSubmit ? 'bg-purpleBtn' : 'bg-codeBox',
            canSubmit && !loading ? 'cursor-pointer' : 'cursor-not-allowed',
            'block',
            'w-full',
            'h-11',
            'text-white',
            'rounded-full',
            'mt-3',
            'focus:outline-none'
          ])
        "
        @click="submit"
      >
        {{ $t('下一步') }}
      </button>
    </div>
    <div
      :class="
        tw([
          'mt-4',
          'mx-auto',
          'w-4/5',
          'pt-4',
          'pb-10',
          'px-2',
          'border-t-1',
          'border-purpleLine',
          'flex',
          'items-center'
        ])
      "
    >
      <div
        class="icon"
        :class="tw(['w-18px', 'h-18px', 'bg-violet', 'mr-[4px]'])"
        :style="{
          '-webkit-mask': setStyleMaskImage(require('./images/i_note.svg')),
          mask: setStyleMaskImage(require('./images/i_note.svg'))
        }"
      ></div>
      <p class="icon__hint" :class="tw(['text-sm'])">
        {{ $t('名字與頭像可於會員資料頁面更換!') }}
      </p>
    </div>
  </div>
</template>

<script>
  import { inject, ref, onMounted, computed } from 'vue'
  import { getAvatars, editAvatar, getMemberInfo, postNickname } from '@/api/member'
  import { NICKNAME_RULE } from '@/configs'
  import { useNotice } from '@/utils/use-notice'
  import { useI18n } from 'vue-i18n'
  import store from '@/store'

  export default {
    name: 'editNameAndPhoto',

    setup() {
      const { t } = useI18n()
      const selectedIdx = ref(2)
      const avatars = ref([])
      const nickname = ref('')
      const nicknameInput = ref(null)
      const min = NICKNAME_RULE.min
      const max = NICKNAME_RULE.max
      const loading = inject('loading')
      const popularizeCode = inject('popularizeCode')
      const changeView = inject('changeView')
      const loginType = inject('loginType')
      const verifiedText = computed(() => {
        const txt = [
          { id: 'phoneNumber', label: '手機已認證' },
          { id: 'email', label: '信箱已認證' }
        ]
        return txt.find(item => item.id === loginType.value)?.label ?? ''
      })

      const canSubmit = computed(() => {
        const len = nickname.value.length
        return len > NICKNAME_RULE.min && len < NICKNAME_RULE.max
      })

      const changeAvatar = index => {
        selectedIdx.value = index
      }

      const submit = async () => {
        const len = nickname.value.length

        if (!nickname.value || loading.value) return
        if (len < min || len > max) {
          useNotice({
            type: 'info',
            message: t('請輸入{min}~{max}個字元，禁止空白及異常字元', { min: min, max: max }),
            isI18n: false
          })
          return
        }

        loading.value = true

        try {
          await postNickname(nickname.value)
          await editAvatar(avatars.value[selectedIdx.value - 1])
          useNotice({ type: 'success', message: '設定成功' })

          await getMemberInfo()
          await store.dispatch('member/logIn', '')
          // 禮物介面跳轉
          const ispopularizeCode =
            popularizeCode.value &&
            (popularizeCode.value.promote || popularizeCode.value.introduce || popularizeCode.value.introduction)
          if (ispopularizeCode) {
            changeView('introduceGift')
          } else {
            changeView('signupGift')
          }
        } catch (err) {
          const errorCodeList = {
            1009: '暱稱重複',
            400: t('請輸入{min}~{max}個字元，禁止空白及異常字元', { min: min, max: max })
          }
          const errorMessage = errorCodeList[err.Code] ?? '發生錯誤，請稍後再試，或洽客服人員'
          useNotice({ type: 'error', message: errorMessage })
          nickname.value = ''
          nicknameInput.value.focus()
        } finally {
          loading.value = false
        }
      }

      const init = async () => {
        loading.value = true
        await getAvatars()
          .then(response => {
            avatars.value = response.Avatar
          })
          .catch(() => {
            useNotice({ type: 'error', message: '發生錯誤，請稍後再試，或洽客服人員' })
          })
          .finally(() => {
            loading.value = false
          })
      }

      init()

      onMounted(() => {
        nicknameInput.value.focus()
      })

      const setStyleMaskImage = url => {
        return `url(${url}) no-repeat center center /contain`
      }

      return {
        avatars,
        loading,
        selectedIdx,
        nickname,
        nicknameInput,
        verifiedText,
        canSubmit,
        // fn
        changeAvatar,
        submit,
        setStyleMaskImage
      }
    }
  }
</script>

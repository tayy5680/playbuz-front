<template>
  <div class="set-profile__warp" :class="tw(['w-full', 'flex-1', 'flex', 'flex-col', 'px-[14%]'])">
    <div class="set-profile__container" :class="tw(['flex-1', 'flex', 'flex-col'])">
      <template v-if="!thirdLoginObject.PhotoPath">
        <div class="set-profile__tips" :class="tw(['text(white center)', 'my-auto'])">
          {{ $t('給自己一個頭像！') }}
        </div>
        <div class="set-profile__pic__list" :class="tw(['pb-20px', 'md:pb-0', 'mb-auto', 'flex', 'items-center'])">
          <div
            class="set-profile__pic__item"
            v-for="(item, index) of avatarList"
            :key="index"
            :class="
              tw([
                'mx-8px',
                'rounded-full',
                'overflow-hidden',
                'cursor-pointer',
                choseAvatarIndex === index ? 'border border(white 2)' : ''
              ])
            "
            @click="
              () => {
                choseAvatarIndex = index
              }
            "
          >
            <img class="set-profile__pic__img" :src="item" />
          </div>
        </div>
      </template>
      <template v-if="!thirdLoginObject.NickName">
        <div class="set-profile__input" :class="tw(['my-auto', 'pb-20px', 'md:pb-0'])">
          <input
            type="text"
            :placeholder="$t('告訴我你的名字吧！')"
            v-model="nickname"
            :class="
              tw([
                'p-4px',
                'block',
                'bg-codeBox',
                'w-full',
                'rounded-full',
                'text(center white)',
                'border-1',
                'border-nicknameBorder'
              ])
            "
          />
        </div>
      </template>
      <div
        class="set-profile__button"
        :class="
          tw([
            nicknameLength ? 'bg-purpleBtn' : 'bg-codeBox',
            nicknameLength && !loading ? 'cursor-pointer' : 'cursor-not-allowed',
            'mt-auto',
            'w-full',
            'text(white 18px center)',
            'rounded-full',
            'p-8px'
          ])
        "
        @click="submit"
      >
        {{ $t('下一步') }}
      </div>
      <div
        class="set-profile__tip"
        :class="
          tw([
            'my-4',
            'py-3',
            'border-t-1',
            'border-purpleLine',
            'text(center 14px)',
            'flex',
            'items-center',
            'justify-center'
          ])
        "
      >
        <div
          class="icon"
          :class="tw(['w-[18px]', 'h-[18px]', 'mr-4px'])"
          :style="{
            background: `url(${require('./images/i_note.svg')}) no-repeat center center /cover`
          }"
        ></div>
        <div class="text">{{ $t('名字與頭像可於會員資料頁面更換!') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { ref, computed, inject } from 'vue'
  import store from '@/store'

  import { NICKNAME_RULE } from '@/configs'
  import { getAvatars, postNickname, editAvatar } from '@/api/member'
  import { useNotice } from '@/utils/use-notice'
  import { useI18n } from 'vue-i18n'

  export default {
    name: 'set-profile',

    setup() {
      const { t } = useI18n()
      const thirdChangeStep = inject('thirdChangeStep')

      const loading = ref(false)
      const choseAvatarIndex = ref(2)
      const nickname = ref('')
      const thirdLoginObject = inject('thirdLoginObject')

      const nicknameLength = computed(() => nickname.value.length)
      const nicknameLimitLength = {
        min: NICKNAME_RULE.min,
        max: NICKNAME_RULE.max
      }

      const postUpdateNickname = () => {
        return postNickname(nickname.value)
          .then(() => {
            useNotice({ type: 'success', message: '暱稱設定成功' })
          })
          .catch(err => {
            const errorCodeList = {
              1009: '暱稱重複',
              400: t('請輸入{min}~{max}個字元，禁止空白及異常字元', {
                min: nicknameLimitLength.min,
                max: nicknameLimitLength.max
              })
            }
            const errorMessage = errorCodeList[err.Code] ?? '發生錯誤，請稍後再試，或洽客服人員'
            useNotice({ type: 'error', message: errorMessage })
          })
      }

      const postEditAvatar = () => {
        const target = avatarList.value[choseAvatarIndex.value - 1]
        return editAvatar(target)
          .then(() => {
            useNotice({ type: 'success', message: '頭像設定成功' })
          })
          .catch(err => {
            const errorCodeList = {
              400: '頭像設定失敗'
            }
            const errorMessage = errorCodeList[err.Code] ?? '發生錯誤，請稍後再試，或洽客服人員'
            useNotice({ type: 'error', message: errorMessage })
          })
      }

      const submit = async () => {
        if (loading.value) return false

        if (!thirdLoginObject.value.NickName) {
          if (!nickname.value) return false
          if (nicknameLength.value < nicknameLimitLength.min || nicknameLength.value > nicknameLimitLength.max) {
            return useNotice({
              type: 'info',
              message: t('請輸入{min}~{max}個字元，禁止空白及異常字元', {
                min: nicknameLimitLength.min,
                max: nicknameLimitLength.max
              }),
              isI18n: false
            })
          }
        }

        loading.value = true
        const target = []
        if (!thirdLoginObject.value.NickName) target.push(postUpdateNickname())
        if (!thirdLoginObject.value.PhotoPath) target.push(postEditAvatar())
        await Promise.all(target)
          .then(() => {
            store.dispatch('member/logIn')
            thirdChangeStep('viewReward')
          })
          .catch(err => {
            const errorCodeList = {}
            const errorMessage = errorCodeList[err.Code] ?? '發生錯誤，請稍後再試，或洽客服人員'
            useNotice({ type: 'error', message: errorMessage })
          })
        loading.value = false
      }

      const avatarList = ref([])
      const init = async () => {
        loading.value = true
        await getAvatars().then(res => {
          avatarList.value = res.Avatar
        })
        loading.value = false
      }

      init()

      return {
        thirdLoginObject,
        loading,
        avatarList,
        choseAvatarIndex,
        nickname,
        nicknameLength,
        submit
      }
    }
  }
</script>

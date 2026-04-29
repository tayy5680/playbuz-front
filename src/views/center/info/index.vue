<template>
  <div class="info_wrap" :class="tw(['mb-5', 'w-full'])">
    <div class="info_container" :class="tw(['flex', 'flex-col', 'items-center'])">
      <h2 :class="tw(['text([#374151] [26px])', 'mb-[28px]', 'mt-[18px]'])">{{ $t('會員中心') }}</h2>
      <ViewUser :class="tw(['md:col-span-1'])" v-loading="loading" />
      <div @click="handlePhoto()">
        <img src="@/assets/img/icons/camera.svg" :class="tw(['w-10', 'm-5', 'cursor-pointer'])" />
      </div>
      <div :class="tw('md:flex md:justify-center md:-ml-5')">
        <ViewPersonal :class="tw(['col-span-2'])" />
      </div>
      <!-- <invite
        :class="tw([
          'col-span-2',
          'flex',
          'flex-col',
          'items-start',
          'md:items-end',
        ])"
      /> -->
      <ViewBoard :class="tw(['col-span-5'])" />
    </div>
  </div>
</template>

<script>
  import { computed, ref } from 'vue'
  import store from '@/store'
  import { useI18n } from 'vue-i18n'

  import ViewUser from './user'
  import ViewPersonal from './personal'
  // import invite from './invite'
  import ViewBoard from './board'

  import { pointFormatter } from '@/utils/formatters'
  import { useNotice } from '@/utils/use-notice'
  import { uploadAvatar } from '@/api/member'

  export default {
    name: 'center-info',

    components: {
      ViewUser,
      ViewPersonal,
      // invite,
      ViewBoard
    },

    setup() {
      const { t } = useI18n()
      const info = computed(() => {
        const target = store.state.member.info

        return {
          picture: target?.PhotoSrc || require('./images/i_m_user.svg'),
          frame: target?.FrameSrc || '',
          name: target?.NickName || '',
          level: target?.VIP?.Level || 0,
          exp: target?.VIP?.Experience || 0,
          expNext: target?.VIP?.NextExperience || 0,
          progress: (target?.VIP?.Experience / target?.VIP?.NextExperience) * 100 || 0
        }
      })

      const wallet = computed(() => store.getters['wallet/walletTotal'])
      const enableBalance = computed(() => store.state.wallet.enableBalance)

      const actionBalance = id => {
        store.dispatch('wallet/setDisplayBalanceType', id)
        store.dispatch('wallet/setEnableBalance', !enableBalance.value)
      }

      const setStyleMaskImage = url => {
        return `url(${url}) no-repeat center /contain`
      }
      const input = ref(null)
      const loading = ref(false)
      const handlePhoto = () => {
        if (loading.value) {
          useNotice({ type: 'info', message: '請稍等' })
          return
        }

        input.value = document.createElement('input')
        input.value.type = 'file'
        input.value.accept = 'image/*'
        input.value.onchange = async file => {
          try {
            loading.value = true
            const fileData = file.target.files[0]
            const fileDataSize = Math.ceil(fileData.size / 1000000)
            const fileDataType = fileData.type.substring(fileData.type.lastIndexOf('/') + 1)
            const acceptExt = ['jpg', 'jpeg', 'png', 'gif']
            const acceptSize = 5
            if (!acceptExt.includes(fileDataType))
              throw new Error(t('只接受{files}檔案格式', { files: acceptExt.join(', ') }))
            if (fileDataSize > acceptSize) throw new Error(t('超過{size}MB', { size: acceptSize }))
            await uploadAvatar(fileData)
            await store.dispatch('member/logIn')
            useNotice({ type: 'success', message: '上傳成功' })
          } catch (err) {
            useNotice({ type: 'error', message: `${t('上傳失敗')}: ${err.message}`, isI18n: false })
          } finally {
            loading.value = false
          }
        }
        input.value.click()
      }

      return {
        info,
        wallet,
        pointFormatter,
        loading,
        // fn
        handlePhoto,
        actionBalance,
        setStyleMaskImage
      }
    }
  }
</script>

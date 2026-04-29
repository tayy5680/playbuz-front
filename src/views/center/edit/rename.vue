
<template>
  <popView
    class="rename__wrap"
    @close="$emit('close')"
    >
    <template #container>
      <div
        class="rename__main"
        :class="tw([
          'flex',
          'flex-col',
          'items-center',
          'px-0',
          'md:px-40px',
          'justify-around',
          'h-full',
          'px-40px',
        ])"
      >
        <div
          class="rename__head"
          :class="tw([
             'flex-[0.5]',
          ])" >
          <maskPicture size="60" :class="tw(['m-auto'])" :img="require('@/assets/img/icons/i_m_user.svg')" />
          <div
            :class="tw([
              'mt-[18px]',
              'text-[18px]',
            ])">
            {{ $t('修改暱稱') }}
          </div>
        </div>
        <div
          class="rename__context"
          :class="tw([
            'w-full',
            ])">
          <input
            :placeholder="placeholder"
            v-model="from.name"
            v-on:keypress.enter="onSubmit"
            :class="tw([
              'w-full',
              'h-10',
              'rounded-full',
              'text-center',
              'text-white',
              'border-1',
              'bg-codeBox',
              'focus:outline-none',
              v$.name.$error ? 'border-[#FF6767]' : 'border-giftBtnInactive',
            ])" />
          <span
            v-if="v$.name.$error"
            :class="tw([
              'block',
              'text-center',
              'text-[#FF6767]',
            ])">
            {{ v$.name.$errors?.[0]?.$message }}
          </span>
          <button
            @click="onSubmit" :disabled="!from.name.length || loading"
            :class="tw([
              'w-full',
              'h-11',
              'rounded-full',
              'mt-3',
              'text-white',
              'focus:outline-none',
              (from.name.length && !loading) ?? 'text-confirmBtnText',
              from.name.length ? 'bg-blurPurpleBtn' : 'bg-codeBox',
              !loading ? 'cursor-pointer' : 'cursor-not-allowed',
              transitionBase,
            ])">
            {{ renameInfo.editable ? $t('送出修改') : `${$t('金幣')} ${renameInfo.cost}` }}
          </button>
        </div>
        <div
          class="rename__footer"
          :class="tw([
             'w-full',
              'flex-[0.3]',
              'border-t-1',
              'border-purpleLine',
              'pt-2',
              'text-violet'
            ])">
          <span>
            {{ direction }}
          </span>
        </div>
      </div>
    </template>
  </popView>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import store from '@/store'
import { useI18n } from 'vue-i18n'

import popView from '@/components/ui/pop-view'

import { NICKNAME_RULE } from '@/configs'
import { postNickname } from '@/api/member'
import { useNotice } from '@/utils/use-notice'
import { useValidator, required, betweenLength } from '@/utils/use-validator'
import maskPicture from '@/components/maskPicture/maskPicture.vue'

export default {
  name: 'rename',

  components: {
    popView,
    maskPicture,
  },

  setup (props, { emit }) {
    const { t } = useI18n()
    const loading = ref(false)

    const renameInfo = reactive({
      editable: store.state.member.info.NickNameEditable ?? false,
      totleTimes: store.state.member.info.NickNameEditQuota ?? 0,
      cost: store.state.member.info.NickNameEditCost ?? 0,
    })
    const direction = computed(() => t('暱稱每個月可以免費修改 {totleTimes} 次，超過需要每次花費金幣 {cost}。', { totleTimes: renameInfo.totleTimes, cost: renameInfo.cost }))
    const walletMainPointList = computed(() => store.getters['wallet/walletMainPointList'])

    const placeholder = ref(t('請輸入{min}~{max}個字元', { min: NICKNAME_RULE.min, max: NICKNAME_RULE.max }))

    const infoName = computed(() => store.state.member.info?.NickName)

    const from = reactive({
      name: '',
    })

    const rules = {
      name: {
        betweenLength: betweenLength(NICKNAME_RULE.min, NICKNAME_RULE.max),
        required: required(),
      },
    }

    const v$ = useValidator(rules, from)

    const onSubmit = async () => {
      if (loading.value) return false
      if (!renameInfo.editable && walletMainPointList.value.gold < renameInfo.cost) return useNotice({ type: 'info', message: '金幣不足，請進行儲值' })

      if (from.name === infoName.value) return useNotice({ type: 'info', message: '修改暱稱與原本相同' })

      v$.value.$touch()
      if (v$.value.$error) return useNotice({ type: 'info', message: '內容輸入錯誤' })

      try {
        loading.value = true
        await postNickname(from.name)
        store.dispatch('member/logIn')
        useNotice({ type: 'success', message: '修改成功' })
        if (!renameInfo.time) store.dispatch('wallet/updateAllWallet')
        from.name = ''
        emit('close')
        v$.value.$reset()
      } catch (err) {
        const errorCodeList = {
          400: t('請填入設定暱稱{min}~{max}個字，禁止空白及異常字元', { min: NICKNAME_RULE.min, max: NICKNAME_RULE.max }),
          1009: t('暱稱{name}重覆', { name: from.name }),
        }
        const errorMessage = errorCodeList[err.Code] ?? '發生錯誤，請稍後再試，或洽客服人員'
        useNotice({ type: 'error', message: errorMessage })
      } finally {
        loading.value = false
      }
    }

    const onClose = () => {

    }

    const init = () => {
      from.name = infoName.value
    }

    init()

    return {
      loading,
      from,
      placeholder,
      v$,
      direction,
      renameInfo,
      // fn
      onSubmit,
      onClose,
    }
  },
}
</script>

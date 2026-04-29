<template>
  <div
    class="serial__wrap"
    :class="tw(['flex', 'justify-center', 'bg-center', 'min-h-[600px]', 'rounded-2xl', 'pt-[30%]', 'bg-no-repeat'])"
  >
    <div class="serial__container" :class="tw(['flex', 'flex-col', 'items-center', 'justify-center'])">
      <div class="serial__title" :class="tw(['text-[22px]'])">
        {{ $t('禮包兌換碼') }}
      </div>
      <div
        class="serial__tips"
        :class="tw(['mt-18px', 'font-bold', 'text(center SubColor 15px)'])"
        v-html="`${$t('您有優惠序號嗎？')}<br>${$t('請於下方輸入方可使用！')}`"
      ></div>
      <input
        class="serial__input"
        :class="
          tw([
            'rounded-20px',
            'px-16px',
            'py-8px',
            'leading-none',
            'placeholder-SubColor',
            'text-center',
            'w-300px',
            'mt-28px',
            'mb-16px',
            'bg-InputBackground',
            v$.serialInput.$error ? 'border border-red-600' : ''
          ])
        "
        :placeholder="$t('輸入序號')"
        v-model="from.serialInput"
      />
      <button
        class="serial_confirm"
        :class="
          tw([
            'cursor-pointer',
            'bg-ordernoBtn',
            'text(18px white center)',
            'rounded-full',
            'p-8px',
            'max-w-300px',
            'w-full',
            'mx-auto'
          ])
        "
        @click="submit"
      >
        {{ $t('確定') }}
      </button>
    </div>
  </div>
  <!-- 兌換成功提示 -->
  <teleportItem>
    <div
      class="serial__tips"
      v-if="presetObject.enable"
      :class="
        tw([
          'fixed',
          isMobile ? 'bottom-0' : 'top-1/2',
          'left-1/2',
          '-translate-x-1/2',
          isMobile ? '-translate-y-0' : '-translate-y-1/2',
          'z-30',
          'bg-navBgHover',
          'max-w-428px',
          'w-full',
          isMobile ? 'p-12px' : 'p-48px',
          isMobile ? 'rounded-t-20px' : 'rounded-20px',
          isMobile ? 'min-h-50svh' : ''
        ])
      "
    >
      <div class="animate__wrap" :class="tw(['relative'])">
        <div class="animate" ref="animateElement" :class="tw(['max-w-366px', 'w-full', 'mx-auto', 'mt-[-80px]'])"></div>
      </div>
      <div class="serial__title" :class="tw(['text(white center)', 'mb-8px'])">
        {{ $t('恭喜您收到') }}
      </div>
      <div class="serial__container">
        <div
          class="serial__item"
          v-for="item of presetObject.content"
          :key="item.id"
          :class="
            tw(['flex', 'items-center', 'justify-center', 'text(white 26px)', 'font-normal', 'mt-14px', 'mb-4px'])
          "
        >
          <div class="label" :class="tw(['mr-4px'])">
            {{ $t(item.label) }}
          </div>
          <span v-if="item.count">{{ pointFormatter(item.count) }}</span>
        </div>
      </div>
      <router-link
        class="serial__link"
        :class="tw(['block', 'text(violet center)', 'mt-28px', 'mb-4px'])"
        :to="{ name: 'center/record', query: { type: 'receive' } }"
      >
        {{ $t('查看紀錄請前往訂單') }}
      </router-link>
      <div
        class="serial__btn"
        :class="
          tw([
            'cursor-pointer',
            'bg-ordernoBtn',
            'text(18px white center)',
            'rounded-full',
            'p-8px',
            'max-w-300px',
            'w-full',
            'mx-auto'
          ])
        "
        @click="close"
      >
        {{ $t('確定') }}
      </div>
    </div>
  </teleportItem>
</template>

<script>
  import { reactive, ref, nextTick, watch, computed, onBeforeUnmount } from 'vue'
  import store from '@/store'

  import teleportItem from '@/components/ui/teleport-item'

  import { useValidator, required } from '@/utils/use-validator'
  import { pointFormatter } from '@/utils/formatters'
  import { useNotice } from '@/utils/use-notice'
  import { postExchange } from '@/api/deposit'
  import { useReCaptcha } from 'vue-recaptcha-v3'
  import { RECAPTCHA } from '@/configs'
  import lottie from 'lottie-web'
  import { event } from 'vue-gtag-next'

  export default {
    name: 'deposit-serial',

    components: {
      teleportItem
    },

    setup() {
      const { executeRecaptcha, recaptchaLoaded } = useReCaptcha()
      const loading = ref(false)
      const isMobile = computed(() => store.getters['platform/isMobile'])

      const from = reactive({
        serialInput: ''
      })

      const rules = {
        serialInput: {
          required: required()
        }
      }

      const v$ = useValidator(rules, from)

      const presetObject = ref({
        enable: false,
        content: []
      })

      watch(
        () => presetObject.value.enable,
        bol => {
          store.dispatch('platform/setCover', bol)
        }
      )

      const animateElement = ref(null)
      const animate = ref(null)

      const submit = async () => {
        if (!store.getters['member/isLogin']) return store.commit('sign/UPDATE_DRAWER_STATE', true)
        else if (store.state.member.info && store.state.member.info.IsGuest) {
          // 當為訪客身份時
          const popularize = JSON.stringify({ promote: from.serialInput.trim() })
          localStorage.setItem('popularizeCode', popularize)
          store.commit('sign/UPDATE_DRAWER_STATE', true)
          return false
        }

        if (loading.value) return false

        v$.value.$touch()
        if (v$.value.$error) return false
        if (!from.serialInput.trim()) return false

        loading.value = true

        const code = from.serialInput.trim()

        // 當長度為推廣連結時(長度3, 6, 7, 10或13)則使用綁定
        if ([3, 6, 7, 10, 13].includes(code.length)) {
          try {
            store.commit('login/SET_AGM_CODE', code)
            store.commit('sign/UPDATE_DRAWER_STATE', true)
            store.commit('sign/UPDATE_DRAWER_STEP', 'ThreadAward')
          } catch (err) {
            useNotice({ type: 'error', message: '發生錯誤，請稍後再試，或洽客服人員' })
          }
          // 長度12或大於13，則使用兌換
        } else if (code.length > 11) {
          await recaptchaLoaded()
          const recaptcha = await executeRecaptcha(RECAPTCHA.actionList.exchangeSerialno)
          postExchange({
            body: {
              ExchangeCode: code,
              recaptcha: recaptcha,
              locale: store.state.member.languageCode
            }
          })
            .then(res => {
              event('orderno_success', { success: true })
              const walletPointList = store.getters['wallet/walletPointList']
              const contentData = []

              walletPointList.forEach(item => {
                if (res.Data?.[item.point]) {
                  contentData.push({
                    label: item.label,
                    type: item.type,
                    count: res.Data[item.point]
                  })
                }
              })
              presetObject.value.enable = true
              presetObject.value.content = contentData.length ? contentData : [{ label: res.Data?.PackageName ?? '' }]

              nextTick(() => {
                const animDataType = ref('other')
                // animDataType:只有金幣/銀幣動畫 => gold/silver，皆有、皆無、其他都屬於other
                if (contentData.length === 1 && ['gold', 'silver'].includes(contentData[0]?.type)) {
                  animDataType.value = contentData[0].type
                }

                animate.value = lottie.loadAnimation({
                  container: animateElement.value,
                  renderer: 'svg',
                  loop: true,
                  autoplay: true,
                  animationData: require(`./images/ani_getall_${animDataType.value}.json`)
                })
              })
            })
            .catch(err => {
              event('orderno_success', { success: false })

              const errorCodeList = {
                'http-403': '無交易權限，請先綁定手機或信箱',
                401: '無交易權限，請先綁定手機或信箱',
                3008: '此序號已被兌換',
                7002: '已經擁有此款造型'
              }

              const errorMessage =
                errorCodeList[err.Code] ?? (Number(err.Code) >= 3008 && Number(err.Code) <= 3012)
                  ? '兌換碼錯誤'
                  : '發生錯誤，請稍後再試，或洽客服人員'
              useNotice({ type: ['3008', '7002'].includes(err.Code) ? 'info' : 'error', message: errorMessage })
            })
        } else useNotice({ type: 'info', message: '序號無效，請確認輸入正確的字元' })
        v$.value.$reset()
        from.serialInput = ''
        loading.value = false
      }

      const close = () => {
        presetObject.value.enable = false
      }

      onBeforeUnmount(() => {
        store.dispatch('platform/setCover', false)
      })

      return {
        loading,
        from,
        v$,
        submit,
        presetObject,
        animateElement,
        isMobile,
        close,
        pointFormatter
      }
    }
  }
</script>
<style lang="scss" scoped>
  .serial_confirm {
    text-decoration: underline;
  }
</style>

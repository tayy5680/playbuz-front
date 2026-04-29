<template>
  <div class="complete__wrap" :class="tw(['flex', 'flex-col', 'items-center', 'justify-center', 'flex-1'])">
    <div
      v-if="[1, 2, 3].includes(result.status)"
      class="complete__container"
      :class="tw(['w-full', 'rounded-20px', 'flex', 'flex-col', 'items-stretch', 'justify-center', 'min-h-screen'])"
    >
      <div
        class="complete__lottie"
        :class="
          tw([
            'w-auto',
            'h-auto',
            'mx-auto',
            'flex',
            'justify-center',
            'items-center',
            result.status === 3 ? 'mt-[40px]' : 'mt-0'
          ])
        "
      >
        <div
          class="complete__lottie__status"
          ref="completeStatus"
          :class="tw(['w-[120px]', 'h-[120px]', 'mx-auto '])"
        ></div>
        <div
          class="complete__lottie__success"
          ref="completeSuccess"
          :class="tw(['w-full ', 'max-w-[510px]', 'h-auto', 'mx-auto', 'absolute', 'mt-[-12%] md:mt-[-9%]'])"
        ></div>
      </div>
      <div class="complete__text" :class="tw(['text(20px center [#707070])', 'my-36px md:my-[20px]'])">
        <div class="complete__text__waiting" v-if="result.status === 1">
          <p>{{ $t('交易處理中') }}</p>
          <p>{{ $t('請稍後') }}...</p>
          <div
            class="complete__btn__content"
            :class="tw(['w-full', 'max-w-[320px]', 'flex', 'flex-col', 'mt-5', 'mx-auto', 'px-[20px]'])"
          >
            <buttonView
              :type="'opacity'"
              :class="
                tw([
                  'p-8px',
                  'mt-16px',
                  'text(center 18px)',
                  'text-[#AFA0BE]',
                  'leading-6',
                  'w-full',
                  'border-[#AFA0BE]',
                  'border hover:bg-sort hover:text-white hover:border-sort'
                ])
              "
              @click="cancelOrder()"
            >
              {{ $t('取消訂單並回到首頁') }}
            </buttonView>
          </div>
        </div>
        <div class="complete__text__waiting" v-else>
          <p>{{ $t('訂單完成') }}！</p>
          <br />
          <p>{{ $t('感謝您購買') }}</p>
          <p>{{ result.itemName }}</p>
          <p>{{ $t('希望您會喜歡！') }}</p>
          <p>{{ $t('期待為您帶來更美好的遊戲體驗！') }}</p>
        </div>
      </div>
      <div
        class="complete__btn__content"
        :class="tw(['w-full', 'max-w-[320px]', 'flex', 'flex-col', 'mt-5', 'mx-auto', 'px-[20px]'])"
      >
        <howToUseView v-if="result.status === 3" :serial="result.serial" :gameData="result.gameData" />
        <div
          class="complete__btn"
          v-for="item of btnList"
          :key="item.id"
          :class="tw(['relative', 'text-violet', 'w-full', 'mx-auto'])"
        >
          <buttonView
            v-if="item.status === result.status"
            :type="item.status === 3 ? 'primary' : 'opacity'"
            :class="
              tw([
                'p-8px',
                'mt-16px',
                'text(center 18px)',
                'leading-6',
                'w-full',
                item.status === 3
                  ? 'text-white'
                  : 'border border-violet hover:bg-sort hover:text-white hover:border-sort',
                item.id === 'game' && !result.url ? 'hidden' : ''
              ])
            "
            @click="action(item)"
            v-audio="item.id === 'play' ? 'clickMinePet' : 'none'"
          >
            {{ $t(item.label) }}
          </buttonView>
        </div>
        <div class="complete__forget" v-if="result.status === 3" :class="tw(['text-left', 'text-[#707070]', 'mt-5'])">
          <p>{{ $t('忘記序號？') }}</p>
          <p
            :class="tw(['cursor-pointer', 'underline', 'font-bold'])"
            @click="action(btnList.find(el => el.id === 'record'))"
          >
            {{ $t('可至訂單中心查詢購買紀錄。') }}
          </p>
        </div>
      </div>
    </div>
    <viewPopup v-else>
      <template v-slot:context>
        <div class="info" :class="tw(['flex', 'flex-col', 'justify-center', 'items-center', 'h-[200px]'])">
          <img :class="tw(['font-extralight'])" :src="require('./images/complete/i_system_info_note.svg')" />
          <div :class="tw(['font-extralight', 'pt-5'])">
            <span v-if="result.status === 4">
              {{ $t('您的訂單已取消,請至"會員中心>訂單"查看,歡迎再次選購。') }}
            </span>
            <span v-else>
              {{ $t('訂單狀態異常, 請至"會員中心>訂單"查看,如需進一步查詢,請聯繫客服。') }}
            </span>
          </div>
        </div>
      </template>
      <template v-slot:bottom>
        <div class="btn" :class="tw(['text(white center)'])">
          <div
            class="btn"
            :class="tw(['cursor-pointer', 'bg-blurPurpleBtn', 'rounded-full', 'mb-8px', 'p-8px'])"
            @click="errorAction(result.status === 4 ? 'home' : 'record')"
          >
            {{ result.status === 4 ? $t('確定') : $t('查看訂單紀錄') }}
          </div>
          <div
            class="btn"
            :class="tw(['cursor-pointer', 'bg-giftBtnInactive', 'rounded-full', 'p-8px'])"
            @click="errorAction(result.status === 4 ? 'record' : 'home')"
          >
            {{ result.status === 4 ? $t('查看訂單紀錄') : $t('回首頁') }}
          </div>
        </div>
      </template>
    </viewPopup>
  </div>
</template>

<script>
  import { ref, nextTick, onMounted, onUnmounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import store from '@/store'
  import lottie from 'lottie-web'
  import buttonView from '@/components/ui/button-view'
  import howToUseView from './howToUse.vue'
  import { getOrder } from '@/api/records'
  import { useNotice } from '@/utils/use-notice'
  import uaParser from 'ua-parser-js'
  import { postMemberOrderDel } from '@/api/deposit'
  import viewPopup from '@/components/popup'
  import { useI18n } from 'vue-i18n'

  export default {
    name: 'deposit-complete',

    components: {
      buttonView,
      howToUseView,
      viewPopup
    },

    setup() {
      const { t } = useI18n()
      const ua = uaParser()
      const route = useRoute()
      const router = useRouter()
      /**
       * @param {Number} status 訂單狀態
       * 1 = 等待中請稍候
       * 2 = 訂單完成（站內商品）
       * 3 = 訂單完成（外站序號類型商品）
       * 4 = 訂單已取消
       * 5、其他 = 其他訂單異常
       */
      const result = ref({
        status: 1,
        serial: '',
        itemName: '',
        url: '',
        gameData: {}
      })
      const completeStatus = ref(null)
      const completeSuccess = ref(null)
      const btnList = ref([
        { id: 'record', status: 2, label: '查看訂單紀錄', route: { name: 'center/record' } },
        {
          id: 'pay',
          status: 2,
          label: '返回商城',
          route: { name: 'deposit', params: { depositPageType: 'giftpack' } }
        },
        // { id: 'play', status: 2, label: '開啟神遊礦寵' },
        { id: 'game', status: 3, label: '開啟遊戲' },
        { id: 'checkRecord', status: 3, label: '訂單紀錄', route: { name: 'center/record' } }
      ])

      const action = obj => {
        if (obj.route) router.replace(obj.route)
        else if (obj.id === 'play') store.dispatch('sign/loginProxy', { binding: true, action: 'goMine' })
        else if (obj.id === 'game') {
          if (typeof result.value.url === 'string') window.open(result.value.url)
          else router.replace(result.value.url)
        }
      }
      const lottieAnimation = ref(null)
      const anim = () => {
        if (![1, 2, 3].includes(result.value.status)) return false
        if (result.value.status !== 1) {
          lottie.loadAnimation({
            container: completeSuccess.value,
            path: '/lottie/deposit/i_ani_eff_success01.json',
            renderer: 'svg',
            loop: true,
            autoplay: true
          })
        }
        lottie.destroy('completeStatus')
        lottieAnimation.value = lottie.loadAnimation({
          name: 'completeStatus',
          container: completeStatus.value,
          path: `/lottie/deposit/${result.value.status === 1 ? 'i_system_ani_exclamationmark' : 'i_ani_ok'}.json`,
          renderer: 'svg',
          loop: true,
          autoplay: true
        })
      }
      const errorAction = type => {
        if (type === 'home') router.replace('/')
        if (type === 'record') router.replace({ name: 'center/record' })
      }

      onMounted(() => {
        nextTick(() => {
          anim()
        })
      })
      const cancelOrder = async () => {
        if (!route.query.transId) return router.replace({ name: 'home' })
        try {
          await postMemberOrderDel({ transId: route.query.transId })
        } catch {
          useNotice({ type: 'error', message: '發生錯誤，請稍後再試，或洽客服人員' })
        } finally {
          router.replace({ name: 'home' })
        }
      }
      // 五秒取一次訂單資料
      const secondInterval = setInterval(async () => {
        try {
          const inputData = {
            transId: route.query.transId,
            lang: store.state.member.languageCode
          }
          const res = await getOrder(inputData)
          /** StoredStatusID: 儲值狀態編號 0(訂單成立)、1(確定交付)、2(取消交付)、3(異常)、4(系統自動取消的訂單) */
          if (res.Data[0].StoredStatusID !== 0) clearInterval(secondInterval)
          const data = res.Data[0]
          switch (res.Data[0].StoredStatusID) {
            case 1:
              document.title = t('交易成功')
              result.value = {
                serial: data.PackageSeries,
                itemName: data.PackageName,
                gameData: {
                  gameId: data.GameId,
                  gameName: data.GameName
                }
              }
              // 無序號：status = 2 交易成功頁面
              // 有序號：status = 3 序號教學頁面
              result.value.status = data.PackageSeries ? 3 : 2
              switch (ua.os.name.toLowerCase()) {
                case 'android':
                  result.value.url = data.UrlAndroid ?? ''
                  break
                case 'ios':
                  result.value.url = data.UrlIOS ?? ''
                  break
                default:
                  result.value.url = data.UrlWeb ?? ''
              }
              if (!result.value.url) {
                const target = store.state.game.gameList.some(item => item.GameID === data.GameId)
                result.value.url = target ? { name: 'game/detail', params: { gameID: data.GameId } } : ''
              }
              anim()
              break
            case 2:
              // 訂單已取消：status = 4
              result.value.status = 4
              document.title = t('交易失敗')
              break
            case 3:
              // 訂單異常：status = 5
              result.value.status = 5
              document.title = t('交易失敗')
              break
            case 4:
              // 系統自動取消的訂單：同訂單已取消畫面
              result.value.status = 4
              document.title = t('交易失敗')
              break
          }
        } catch {
          useNotice({ type: 'error', message: '發生錯誤，請稍後再試，或洽客服人員' })
          router.replace({ name: 'center/record' })
        }
      }, 5000)
      onUnmounted(() => {
        clearInterval(secondInterval)
      })
      return {
        btnList,
        completeStatus,
        completeSuccess,
        result,
        // fn
        action,
        cancelOrder,
        errorAction
      }
    }
  }
</script>

<template>
  <div class="deposit__wrap" :class="tw(['relative'])">
    <div class="deposit_container container-mo-main">
      <viewPackageList v-if="pageMenuID !== 1" :loading="loading" />
      <viewSeroal v-else />
    </div>
    <!-- 購買禮包彈窗 -->
    <teleportItem>
      <depositPop v-if="isDisplayPackagePop" />
    </teleportItem>

    <!-- 首購禮包購買引導彈窗 -->
    <viewPopup
      v-if="isPopUpFirstPackageTips"
      @close="
        () => {
          isPopUpFirstPackageTips = false
        }
      "
    >
      <template v-slot:context>
        <div class="info" :class="tw(['flex', 'flex-col', 'justify-center', 'items-center', 'h-[200px]'])">
          <i
            class="bi bi-exclamation-circle"
            :class="tw(['mb-6', 'h-auto', 'w-[50px]', 'text(black center)', 'text-[50px]'])"
          ></i>
          <span :class="tw(['text(black center )', 'whitespace-pre-line'])" v-text="$t('領取首購禮包優惠了嗎?')" />
        </div>
      </template>
      <template v-slot:bottom>
        <div class="btn" :class="tw(['text(white center)'])">
          <div
            class="btn"
            :class="tw(['cursor-pointer', 'bg-depositBtn', 'rounded-full', 'mb-8px', 'p-8px'])"
            @click="redirectClassFirst()"
          >
            {{ $t('立即領取') }}
          </div>
        </div>
      </template>
    </viewPopup>
  </div>
</template>

<script>
  import { reactive, ref, computed, provide, watch, onMounted, onBeforeMount, onUnmounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import store from '@/store'

  import teleportItem from '@/components/ui/teleport-item'
  import viewPackageList from './package-list'
  import depositPop from './pop'
  // import depositMulPayPop from './mul-pay-pop' // GMO金流
  import viewSeroal from './serial'
  import viewPopup from '@/components/popup'

  import { TYPE_LIST, CLASS_LIST } from '@/configs/deposit'
  import { getPackageList } from '@/api/deposit'
  import { useNotice } from '@/utils/use-notice'
  import { nextTick } from 'process'
  import { event } from 'vue-gtag-next'

  // mptoken
  import { loadMulpay } from '@mul-pay/mptoken-js'

  export default {
    name: 'deposit',

    components: {
      teleportItem,
      viewPackageList,
      depositPop,
      viewSeroal,
      viewPopup
    },

    setup() {
      const route = useRoute()
      const router = useRouter()

      const loading = ref(false)
      provide('loading', loading)

      const version = process.env.VUE_APP_VERSION_TITLE
      const headerMenuList = computed(() =>
        // 日文版不出現序號頁面
        version === 'japan' ? TYPE_LIST.filter(item => item.label !== '序號') : TYPE_LIST
      )
      const pageMenuID = computed(() => store.state.platform.pageMenuID ?? 0)
      const lang = computed(() => store.state.member.languageCode)
      watch(lang, () => getAllPackageList())

      /**
       * @param {Array} allPackageList 所有禮包所有內容
       * @param {string} nowPackageTypeName 當前Type(time/limit/cycle)
       * @param {Array} nowTypeListData 當前Type(time/limit/cycle)內含的所有禮包內容
       */
      const allPackageList = ref([])
      const nowPackageTypeName = ref('time')
      const nowTypeListData = computed(
        () => allPackageList.value.find(item => item.Type === nowPackageTypeName.value)?.PackageGroupList ?? []
      )
      provide('nowPackageTypeName', nowPackageTypeName)
      provide('nowTypeListData', nowTypeListData)
      const getAllPackageList = async () => {
        try {
          allPackageList.value = await getPackageList({ locale: lang.value }).then(res => res.Data)
          // 預設顯示類型
          // 沒內容的不顯示
          // 若網址參數有就先按照網址參數，沒有的話：有首購禮包顯示'first'，若無顯示'cycle'
          const typeList = allPackageList.value.filter(x => x.PackageGroupList.length)
          const isfirstList = allPackageList.value.some(item => item.Type === 'first' && item.PackageGroupList?.length)
          nowPackageTypeName.value = route.params?.depositPageClass
            ? route.params.depositPageClass
            : isfirstList
            ? 'first'
            : typeList?.[0]?.Type ?? 'cycle'
          router.replace({ params: { ...route.params, depositPageClass: nowPackageTypeName.value } })
        } catch {
          useNotice({ type: 'error', message: '發生錯誤，請稍後再試，或洽客服人員' })
        }
      }
      // 最終顯示於畫面上的class列表
      const classList = computed(() => {
        return CLASS_LIST.filter(classItem => {
          return allPackageList.value.some(item => item.Type === classItem.id && item.PackageGroupList?.length)
        })
      })
      provide('classList', classList)

      const isDisplayPackagePop = ref(false)
      const setPackagePop = bool => {
        isDisplayPackagePop.value = bool
      }

      // 首購禮包引導轉址彈窗
      const isPopUpFirstPackageTips = ref(false)
      provide('isPopUpFirstPackageTips', isPopUpFirstPackageTips)
      const redirectClassFirst = () => {
        isPopUpFirstPackageTips.value = false
        nowPackageTypeName.value = 'first'
        router.replace({ params: { ...route.params, depositPageClass: 'first' } })
        event('shopping_click', { click: 'package_class' })
      }
      provide('setPackagePop', setPackagePop)

      const init = async () => {
        loading.value = true

        // 網參數錯誤強制轉址
        const target = headerMenuList.value.find(
          item => item.route.params.depositPageType === route.params.depositPageType
        )
        if (target) store.dispatch('platform/setPageMenuID', target.id)
        else router.replace({ params: headerMenuList.value[0].route.params })

        await getAllPackageList()
        loading.value = false

        nextTick(() => {
          // 網址判斷是否直接顯示禮包內容
          const urlPackageGroupID = route.params?.depositPackageGroupID
          if (urlPackageGroupID) {
            const isIdInPackageData = nowTypeListData.value.some(
              item => item.PackageGroupID.toString() === route.params?.depositPackageGroupID
            )
            // 開啟購買視窗：有這個禮包 && (不存在首購禮包 || 正處於首購禮包購買頁面 )
            if (
              isIdInPackageData &&
              (!classList.value.some(item => item.id === 'first') || nowPackageTypeName.value === 'first')
            ) {
              return setPackagePop(true)
            }
            const { depositPackageGroupID, ...restParams } = route.params
            router.push({
              name: route.name,
              params: restParams
            })
          }

          // 網址判斷是否顯示交易狀態Modal (彈窗禮包視窗)
          const orderId = route?.query?.orderId
          if (orderId) setPackagePop(true)
        })
      }

      // mptoken， 掛載mptoken sdk (不能在組件中掛載，因重新開啟modal取得getTokenThroughIframe會有問題)
      const mulpay = ref(null)
      const initMulpay = async () => {
        const productionMode = Boolean(process.env.VUE_APP_GMO_PAY_CREDIT_CARD_PRODUCTION_MODE)
        const model = {
          // API 金鑰
          publicKey: productionMode
            ? process.env.VUE_APP_GMO_PAY_CREDIT_CARD_PUBLIC_KEY
            : process.env.VUE_APP_GMO_PAY_CREDIT_CARD_DEV_PUBLIC_KEY,

          // 公開金鑰
          apiKey: productionMode
            ? process.env.VUE_APP_GMO_PAY_CREDIT_CARD_API_KEY
            : process.env.VUE_APP_GMO_PAY_CREDIT_CARD_DEV_API_KEY,

          // Google Pay 的商家資訊
          merchantIds: null,

          // 是否允許發送指紋資訊，預設值：true（允許）
          permitToSendFingerprint: true,

          // 否使用正式環境或測試環境，預設值：false（測試環境）
          productionMode: productionMode
        }

        // 初始化 Multipayment 對象
        mulpay.value = await loadMulpay(
          model.apiKey,
          model.publicKey,
          model.merchantIds,
          model.permitToSendFingerprint,
          model.productionMode
        )
        if (!mulpay.value || typeof mulpay.value.createElements !== 'function') {
          throw new Error('Mulpay 初始化失敗或不包含 createElements 方法')
        }
      }
      provide('mulpay', mulpay)

      watch(
        () => route.params.depositPageType,
        val => {
          const paramsList = headerMenuList.value.map(item => item.route.params.depositPageType)
          if (paramsList.includes(val)) store.dispatch('platform/setPageMenuID', paramsList.indexOf(val))
        }
      )

      onMounted(() => {
        store.dispatch('platform/setPageMenuList', headerMenuList.value)
        init()
      })
      onUnmounted(() => {
        store.dispatch('platform/setPageMenuList', [])
      })

      onBeforeMount(() => {
        initMulpay()
      })

      return {
        pageMenuID,
        loading,
        isDisplayPackagePop,
        allPackageList,
        isPopUpFirstPackageTips,
        redirectClassFirst,
        headerMenuList
      }
    }
  }
</script>

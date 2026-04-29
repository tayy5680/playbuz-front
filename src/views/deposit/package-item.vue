<template>
  <div
    class="package_item"
    v-for="(item, index) of typeListData"
    :key="index"
    :class="tw(['relative', 'cursor-pointer', 'group', 'z-0', { 'filter grayscale': !item.IsConditionAvailable }])"
    @click="action(item)"
  >
    <el-image
      class="package__sale"
      v-if="item.SalePhoto"
      :src="item.SalePhoto"
      :class="tw(['absolute', 'top-[-10px]', 'right-[-15px]', 'z-20', 'w-[160px]'])"
      style="position:absolute"
    >
      <template #error><i></i></template>
    </el-image>
    <div
      class="package__item-tips"
      v-if="item.DrawlotsActivityId"
      :class="tw(['absolute', 'top-0', 'left-0', 'p-[14px]', 'z-10', 'flex', 'flex-col', 'items-center'])"
      @click.stop="displayOddsTanble = item.DrawlotsActivityId"
    >
      <img
        class="package__item-tips__icon"
        :src="require('./images/i_system_info2.svg')"
        :class="tw(['w-[26px]', 'h-[26px]', 'mb-4px'])"
      />
      <div class="package__item-tips__label" :class="tw(['text-white', 'text-12px'])">
        {{ $t('獎項列表') }}
      </div>
    </div>
    <div
      class="package_item_container"
      :class="tw(['relative', 'rounded-12px', 'overflow-hidden', 'bg-white', 'flex', 'flex-col', 'h-250px'])"
      :style="{
        willChange: 'transform'
      }"
    >
      <div
        class="package_img_area"
        :class="tw(['flex', 'flex-grow', 'overflow-hidden', 'flex-col', 'justify-center', 'bg-cover'])"
        :style="`background-image:url(${envImgUrl}/img/deposit/background/deposit_deposit_bg01.jpg)`"
      >
        <el-image
          :fit="'cover'"
          :class="tw([transitionBase, 'w-full'])"
          :src="item.PhotoPath"
          :alt="item.PackageName"
          style="position:absolute;height: calc(100% - 50px);"
        >
          <template #error>
            <div :class="tw(['w-[40%]', 'mx-auto'])">
              <img :src="require(`@/assets/img/logo/logo_PlayBUZ.svg`)" />
            </div>
          </template>
        </el-image>
        <div
          class="package__content"
          v-if="item.Text"
          :class="
            tw([
              'flex',
              'flex-1',
              'items-end',
              'relative',
              'z-10',
              'mb-[10px]',
              'mx-[15px]',
              'text-[#00DFB9]',
              'text-[14px]'
            ])
          "
          style="text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;"
        >
          {{ $t(item.Text) }}
        </div>
        <div
          class="package__content"
          v-else
          :class="tw(['flex', 'flex-1', 'items-end', 'relative', 'z-10', 'px-[15px]'])"
        >
          <template v-for="(coin, index) of filterCoinList(item)">
            <div
              class="package__type__item"
              v-if="item[coin.label]"
              :key="coin.id"
              :class="
                tw(['relative', 'flex', 'flex-[33.33%]', 'flex-grow-0', 'items-center', 'justify-start', 'mb-14px'])
              "
            >
              <el-divider v-if="index" direction="vertical" :class="tw(['opacity-30'])" style="margin: 0 5px;" />
              <div
                class="package__type__coin"
                :class="tw(['w-22px', 'h-22px', 'mr-2px'])"
                :style="{
                  background: `url('${coin.img}') no-repeat center center /contain`
                }"
              ></div>
              <div
                class="package__type__count"
                :class="
                  tw(['text(14px center)', 'leading-none', coin.label === 'Exp' ? 'py-2px px-8px rounded-full' : ''])
                "
                :style="{
                  color: coin.text,
                  background: coin.label === 'Exp' ? coin.background : ''
                }"
              >
                {{ coin.point }}{{ pointFormatter(item[coin.label]) }}
              </div>
            </div>
          </template>
        </div>
      </div>

      <div
        class="package__title"
        :class="
          tw(['relative', 'flex', 'justify-between', 'items-center', 'bg-white', 'px-20px', 'py-6px', 'min-h-[50px]'])
        "
        style="box-shadow:0 -10px 20px 20px #00000052"
      >
        <div class="package__label" :class="tw(['text-[14px]', 'text-BaseColor'])">
          {{ item.PackageName }}
        </div>
        <!--即將開放-->
        <div
          class="package__open__soon"
          v-if="item.ConditionID === 4"
          :class="tw(['bg-purpleLine', 'text(white 16px)', 'rounded-full', 'py-4px', 'px-24px', 'leading-none'])"
        >
          {{ $t('即將開放') }}
        </div>
        <!--付款按鈕＋顯示金額-->
        <div class="package__price" v-else :class="tw(['text-[20px]', 'leading-none', 'flex', 'items-right'])">
          <!--付款單位，金幣/銀幣/新台幣-->
          <div class="pay__currency" :class="tw(['text-12px', 'mr-[4px]'])">
            <img
              v-if="item.btnCurrencyData?.payTypeID === 6 || item.btnCurrencyData?.payTypeID === 7"
              :src="`/img/coin/i_money_${item.btnCurrencyData?.payTypeID === 6 ? 'gold' : 'silver'}_line.svg`"
              :class="tw(['w-[18px]', 'mr-[4px]'])"
            />
            <span :class="tw(['text-16px'])" v-else>{{ currency }}</span>
          </div>
          <span>{{ item.btnCurrencyData?.payAmount }}</span>
        </div>
      </div>
    </div>
    <div class="package__tips" :class="tw(['flex', 'justify-end', 'text-14px'])">
      <div v-if="item.ConditionQuantityRemains" class="package__count" :class="tw(['text-bannerBg'])">
        {{ $t('可購數量') }} {{ item.ConditionQuantityRemains }}
      </div>
      <span v-if="item.ConditionQuantityRemains && item.EndTime" class="package__dot" :class="tw(['text-bannerBg'])">
        ,&nbsp;
      </span>
      <div class="package__time" :class="tw(['text([#7c7ed7] right)'])">
        {{ countdownTimer(item.EndTime) }}
      </div>
    </div>
    <teleportItem>
      <packageItemTips v-if="displayOddsTanble" :id="displayOddsTanble" @close="displayOddsTanble = null" />
    </teleportItem>
  </div>
</template>

<script>
  import { computed, onMounted, onUnmounted, ref, inject } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import store from '@/store'

  import { REWARD_COIN } from '@/configs/deposit'
  import dayjs from 'dayjs'
  import duration from 'dayjs/plugin/duration'
  import { pointFormatter } from '@/utils/formatters'
  import teleportItem from '@/components/ui/teleport-item'
  import packageItemTips from './package-item-tips'
  import { useI18n } from 'vue-i18n'

  dayjs.extend(duration)

  export default {
    name: 'deposit-package-item',

    components: {
      teleportItem,
      packageItemTips
    },

    props: {
      nowTypeListData: {
        type: Array,
        default: () => []
      }
    },

    setup(props) {
      const route = useRoute()
      const router = useRouter()
      const currency = computed(() => store.getters['member/currency'])
      const envImgUrl = process.env.VUE_APP_IMG_URL

      const { t } = useI18n()
      const setPackagePop = inject('setPackagePop')
      const isPopUpFirstPackageTips = inject('isPopUpFirstPackageTips')
      const classList = inject('classList')
      const nowPackageTypeName = inject('nowPackageTypeName')

      // 外層按鈕顯示的付款類型與金額，優先順序金幣＞銀幣＞錢
      const typeListData = computed(() => {
        return props.nowTypeListData.map(item => {
          const goldPay = item.PackageListResultDetail.find(el => el.PayTypeID === 6)
          const silverPay = item.PackageListResultDetail.find(el => el.PayTypeID === 7)
          const otherPay = item.PackageListResultDetail[0]
          const result = goldPay ?? silverPay ?? otherPay
          return {
            ...item,
            btnCurrencyData: result
              ? {
                  payTypeID: result.PayTypeID,
                  payAmount: pointFormatter(result.ActuallyPayAmount, goldPay || silverPay)
                }
              : {}
          }
        })
      })
      const action = obj => {
        // IsConditionAvailable為不可用。
        if (obj.ConditionID === 4 || !obj.IsConditionAvailable) return false
        // 當有結束時間且超過當前時間時 不做動作
        if (obj.EndTime && !dayjs().isBefore(dayjs(obj.EndTime))) return false
        // 未登入者顯示登入畫面
        if (!store.getters['member/isLogin'] || store.state.member.info.IsGuest) {
          store.commit('sign/UPDATE_DRAWER_STATE', true)
          store.commit('sign/UPDATE_IS_DREWER_SHOW_GUEST', false)
          return
        }
        // 如果存在首購，而且並非首購頁：強制跳出首購畫面提示視窗
        if (classList.value.some(item => item.id === 'first') && nowPackageTypeName.value !== 'first') {
          isPopUpFirstPackageTips.value = true
          return
        }

        // 清除訂單已結帳資料
        localStorage.gmoData = ''

        router.push({ name: route.name, params: { ...route.params, depositPackageGroupID: obj.PackageGroupID } })
        setPackagePop(true)
      }

      const nowTime = ref(dayjs())
      let timer = null
      onMounted(() => {
        timer = setInterval(() => {
          nowTime.value = dayjs()
        }, 1000)
      })
      onUnmounted(() => {
        clearInterval(timer)
      })

      const countdownTimer = timeString => {
        if (!timeString) return ''

        const endTime = dayjs(timeString)
        if (endTime.isBefore(nowTime.value)) return '已結束販售'

        const dd = endTime.diff(nowTime.value, 'day')
        const target = dayjs.duration(endTime.diff(nowTime.value))

        // TODO: 當跨月份取得天數時會失效，故先用dd去判斷日，其餘時分用duration。
        const hh = target.format('H')
        const mm = target.format('mm')
        return dd
          ? t('倒數 {day} 天 {hour} 小時 {min} 分', { day: dd, hour: hh, min: mm })
          : t('倒數 {hour} 小時 {min} 分', { hour: hh, min: mm })
      }

      const filterCoinList = items => {
        return REWARD_COIN.filter(item => Object.keys(items).includes(item.label))
      }

      const displayOddsTanble = ref(null)
      return {
        typeListData,
        currency,
        displayOddsTanble,
        envImgUrl,
        // fn
        pointFormatter,
        countdownTimer,
        filterCoinList,
        action
      }
    }
  }
</script>
<style lang="scss" scoped>
  .package_item_container {
    box-shadow: 0 0 5px #00000040;
  }
  .package_img_area {
    transition: all 0.2s ease;
    &:hover {
      :deep(.el-image) {
        scale: 1.2;
      }
    }
  }
</style>

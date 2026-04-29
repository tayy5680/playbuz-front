<template>
  <!-- to do: delete 沒有作用 -->
  <!-- <el-skeleton v-if="loading" :loading="loading" :count="count"
    :throttle="500" animated :class="tw([
    'grid',
    'grid-cols-1',
    'md:grid-cols-2',
    'gap-x-16px',
    'gap-y-10px'
  ])">
    <template #template>
      <div :class="tw([
        'rounded-20px',
        'overflow-hidden',
        'h-[110px]',
        'md:h-[120px]',
        're'
      ])">
        <el-skeleton-item variant="image" style="height: 100%;" />
      </div>
    </template>
  </el-skeleton> -->
  <div class="game_list" :class="tw(['flex', 'flex-wrap'])">
    <div
      class="game_item"
      v-for="item of formatList"
      :key="item.id"
      style="will-change: transform;"
      @click="action(item)"
      :class="
        tw([
          'p-3',
          'm-1',
          'w-full',
          'rounded-20px',
          'overflow-hidden',
          'min-h-[110px]',
          'md:min-h-[120px]',
          'max-w-[calc((100svw-24px-(8px*2))/2)]',
          'tablet:max-w-[calc((100svw-120px-160px-(8px*3))/3)]',
          'pc:w-[calc((100svw-300px-160px-(8px*5))/5)]',
          item.maintenance ? 'cursor-not-allowed' : 'cursor-pointer'
        ])
      "
    >
      <div
        class="game_maintenance_mask"
        v-if="item.maintenance"
        :class="
          tw([
            'absolute',
            'z-30',
            'text(white 20px)',
            'font-bold',
            'top-0',
            'left-0',
            'w-full',
            'h-full',
            'bg-black',
            'bg-opacity-60',
            'flex',
            'items-center',
            'justify-center'
          ])
        "
      >
        {{ $t('遊戲維護中') }}
      </div>
      <div class="game_audio" v-audio="item.maintenance ? 'none' : 'enterGamePage'" :key="item.maintenance">
        <div class="game_pricute" :class="tw(['h-full', 'w-full', 'overflow-hidden'])">
          <el-image
            class="game_img"
            :lazy="!isSwiper"
            :src="
              `${gameSiteURL}/game/${item.IsStatic ? 'static/' : ''}${isMobile ? 'mobile/' : 'pc/'}type_short/${
                item.IsStatic ? item.Vendor.ID : item.GameID
              }.jpg`
            "
            :class="tw(['max-w-none', 'w-full', 'rounded-20px', 'group-hover:scale-125', transitionBase])"
            :alt="item.GameName"
          >
            <template #error>
              <div :class="tw(['flex', 'justify-center', 'items-center', 'h-full', 'bg-[#333]'])">
                <img :alt="item.GameName" :src="require(`@/assets/img/logo/logo_PlayBUZ_only.png`)" />
              </div>
            </template>
            <template #placeholder>
              <el-skeleton-item variant="image" style="height: 100%;" />
            </template>
          </el-image>
        </div>
        <div class="game_content_container" :class="tw(['relative', 'bottom-0', 'left-0', 'z-20'])">
          <div class="game_content_icon_container" :class="tw(['absolute', 'right-[2px]'])">
            <div
              v-for="(imgItem, imgiIndex) in item.SupportedPointTypeID"
              :class="tw(['inline-block'])"
              :key="imgiIndex"
            >
              <img :src="getImageUrl(imgItem)" :class="tw(['w-24px', 'h-24px', 'inline-block'])" />
            </div>
          </div>
          <div class="game_label" :class="tw(['text-[20px]', 'font-bold'])">
            {{ item.IsStatic ? $t(item.GameName) : item.GameName }}
          </div>
          <div class="game_sub" :class="tw(['text-[14px]', 'text-BaseColor', 'leading-[18px]'])">
            {{ item.IsStatic || sub?.[item.GameID] ? $t(item.SubTitle) : item.SubTitle }}
          </div>
        </div>
      </div>
    </div>
    <!-- 彈窗 -->
    <viewPopup
      v-if="displayPopup"
      @close="
        () => {
          displayPopup = false
        }
      "
    >
      <template v-slot:context>
        <div class="info" :class="tw(['flex', 'flex-col', 'justify-center', 'items-center', 'h-[200px]'])">
          <img
            :src="require(`@/assets/img/logo/logo_PlayBUZ_only.png`)"
            :alt="SITE_NAME"
            :class="tw(['mb-6', 'w-28'])"
          />
          <span :class="tw(['text(center xl)'])">
            {{ $t('敬請期待') }}
          </span>
        </div>
      </template>
    </viewPopup>
  </div>
</template>

<script>
  import { computed, ref } from 'vue'
  import store from '@/store'
  import { useRoute, useRouter } from 'vue-router'
  import viewPopup from '@/components/popup'

  import { GAME_BG, GAME_DEFAULT_BG } from '@/configs/game'
  import { COIN_TYPE } from '@/configs'
  import { useI18n } from 'vue-i18n'

  export default {
    name: 'view-latest-list',
    components: {
      viewPopup
    },

    props: {
      list: {
        type: Array,
        default: () => []
      },

      count: {
        type: Number,
        default: () => 10
      },

      loading: {
        type: Boolean,
        default: () => false
      },

      sub: {
        type: Object,
        default: () => {}
      },

      isUseMaintenance: {
        type: Boolean,
        default: () => true
      }
    },

    setup(props) {
      const route = useRoute()
      const router = useRouter()
      const gameSiteURL = process.env.VUE_APP_IMG_URL + '/img'
      const { t } = useI18n()
      const SITE_NAME = computed(() => t(process.env.VUE_APP_SITE_NAME))
      const displayPopup = ref(false)
      const isMobile = computed(() => store.getters['platform/isMobile'])
      const formatList = computed(() => {
        if (!store.state.game.gameList || !store.state.game.gameList.length) return []

        return props.list.reduce((acc, cur) => {
          const target =
            cur instanceof Object
              ? store.state.game.gameList.find(item => item.GameID === cur.id)
              : store.state.game.gameList.find(item => item.GameID === cur)

          if (target) {
            const imgTarget = acc.concat({
              ...target,
              bg: GAME_BG[target.GameID] ?? GAME_DEFAULT_BG,
              maintenance: !!target.MaintenanceStatus || !!target.Vendor?.MaintenanceStatus,
              super: cur.super,
              SubTitle: props.sub?.[target.GameID] || target.SubTitle,
              imgSrc:
                '/img/game/' +
                (target.IsStatic ? 'static/' : '') +
                (isMobile.value ? 'mobile/' : 'pc/') +
                (target.super ? 'type_bg/' : 'type_long/') +
                (target.IsStatic ? target.Vendor.ID : target.GameID) +
                '.jpg'
            })

            return imgTarget
          } else return acc
        }, [])
      })

      const getImageUrl = item => {
        const img = COIN_TYPE.find(res => res.id === item)
        return img.imgLine
      }

      const action = obj => {
        if (obj.maintenance && props.isUseMaintenance) return false

        // 靜態資料不進入詳細頁
        if (obj.IsStatic) {
          if (obj.Vendor.GameUrl) window.open(obj.Vendor.GameUrl)
          else if (obj.Vendor.IOSUrl || obj.Vendor.AndroidUrl) {
            if (store.state.platform.deviceInfo.toLowerCase().includes('android') && obj.Vendor.AndroidUrl) {
              window.open(obj.Vendor.AndroidUrl)
            } else if (store.state.platform.deviceInfo.toLowerCase().includes('ios') && obj.Vendor.IOSUrl) {
              window.open(obj.Vendor.IOSUrl)
            } else {
              const target = obj.Vendor.IOSUrl ?? obj.Vendor.AndroidUrl
              window.open(target)
            }
          } else displayPopup.value = true
          return false
        }

        if (route.name === 'game/detail') {
          router.push({ params: { gameID: obj.GameID } })
        } else {
          router.push({ name: 'game/detail', params: { gameID: obj.GameID } })
        }
      }

      const imgUrl = ref(process.env.VUE_APP_IMG_URL)

      return {
        isMobile,
        formatList,
        displayPopup,
        SITE_NAME,
        gameSiteURL,
        imgUrl,
        // fn
        action,
        getImageUrl
      }
    }
  }
</script>
<style lang="scss" scoped>
  .game_item {
    box-shadow: 0 0 5px #00000040;
  }
</style>

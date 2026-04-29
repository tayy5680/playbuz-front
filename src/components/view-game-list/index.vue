<template>
  <el-skeleton
    v-if="!isWebSiteInitReady"
    :loading="!isWebSiteInitReady"
    :count="count"
    :throttle="500"
    animated
    :class="tw(['grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-x-16px', 'gap-y-10px'])"
  >
    <template #template>
      <div :class="tw(['rounded-20px', 'overflow-hidden', 'h-[110px]', 'md:h-[120px]', 're'])">
        <el-skeleton-item variant="image" style="height: 100%;" />
      </div>
    </template>
  </el-skeleton>
  <div class="game_list" v-else :class="tw(['grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-x-16px', 'gap-y-10px'])">
    <div
      class="game_item"
      v-for="item of formatList"
      :key="item.id"
      style="will-change: transform;"
      @click="action(item)"
      :class="
        tw([
          { 'row-span-2': item.super },
          'relative',
          'rounded-20px',
          'overflow-hidden',
          item.maintenance ? 'cursor-not-allowed' : 'cursor-pointer',
          'min-h-[110px]',
          'md:min-h-[120px]',
          'group',
          'bg-[#191919]',
          'h-full',
          'block'
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
      <div
        class="game_audio"
        :key="item.maintenance"
        v-audio="item.maintenance ? 'none' : 'enterGamePage'"
        :class="tw(['h-full'])"
      >
        <div class="game_pricute" :class="tw(['h-full'])">
          <i
            v-if="!item.super"
            :class="
              tw([
                'absolute',
                '-top-[80px]',
                'md:-top-3/4',
                '-left-[250px]',
                'tablet:-left-1/2',
                'h-300px',
                'w-300px',
                'block',
                `bg-[${item.bg}]`,
                'transform',
                'rotate-[30deg]',
                'origin-bottom-right',
                'z-20',
                'bg-opacity-80',
                { 'group-hover:w-270px': !item.maintenance },
                transitionBase
              ])
            "
          />
          <el-image
            class="game_bg"
            lazy
            :fit="'cover'"
            :alt="item.GameName"
            :src="
              `${gameSiteURL}/game/${item.IsStatic ? 'static/' : ''}${isMobile ? 'mobile/' : 'pc/'}${
                item.super ? 'type_bg/' : 'type_long/'
              }${item.IsStatic ? item.Vendor.ID : item.GameID}.jpg`
            "
            :class="
              tw([
                'block',
                'h-full',
                'w-full',
                'object-cover',
                { 'group-hover:scale-125': !item.maintenance },
                transitionBase
              ])
            "
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
        <div class="game_content" :class="tw(['absolute', 'bottom-0', 'right-0', 'w-full', 'h-full', 'z-20'])">
          <div class="game_content_icon_container" :class="tw(['absolute', 'left-3', 'top-[8px]'])">
            <div
              :class="tw(['inline-block'])"
              v-for="(imgItem, imgiIndex) in item.SupportedPointTypeID"
              :key="imgiIndex"
            >
              <img :src="getImageUrl(imgItem)" :class="tw(['w-20px', 'h-20px', 'inline-block'])" />
            </div>
          </div>
          <div class="game_content_introduce_container" :class="tw(['absolute', 'left-3', 'top-[30px]', 'w-[70%]'])">
            <div class="game_label" :class="tw(['text(white 18px)', 'md:text(white 20px)', 'font-bold'])">
              {{ item.IsStatic ? $t(item.GameName) : item.GameName }}
            </div>
            <div
              class="game_sub"
              :class="
                tw([
                  'text(white 12px)',
                  'md:text(white 14px)',
                  'w-full',
                  'leading-[18px]',
                  'break-words',
                  'overflow-hidden',
                  'overflow-ellipsis'
                ])
              "
              style="display: -webkit-box;-webkit-line-clamp: 3; -webkit-box-orient: vertical;"
            >
              {{ item.IsStatic || sub?.[item.GameID] ? $t(item.SubTitle) : item.SubTitle }}
            </div>
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
          <!-- todo update -->
          <maskPicture
            :img="`${require(`@/assets/img/logo/logo_PlayBUZ_only.png`)}`"
            :size="100"
            :class="tw(['mb-6'])"
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
  import maskPicture from '@/components/maskPicture/maskPicture.vue'

  import { GAME_BG, GAME_DEFAULT_BG } from '@/configs/game'
  import { COIN_TYPE } from '@/configs'

  export default {
    name: 'view-game-list',
    components: {
      viewPopup,
      maskPicture
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

      const displayPopup = ref(false)
      const isMobile = computed(() => store.getters['platform/isMobile'])
      const isWebSiteInitReady = computed(() => store.state.platform.isWebSiteInitReady)
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

        router.push({
          name: 'game/detail',
          params: { gameType: obj.GameType, gameID: obj.GameID }
        })
      }

      const imgUrl = ref(process.env.VUE_APP_IMG_URL)

      return {
        isMobile,
        isWebSiteInitReady,
        formatList,
        displayPopup,

        gameSiteURL,
        imgUrl,
        COIN_TYPE,
        // fn
        action,
        getImageUrl
      }
    }
  }
</script>

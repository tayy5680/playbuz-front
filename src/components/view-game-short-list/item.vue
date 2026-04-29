<template>
  <div
    class="game__short__item"
    v-if="item && Object.keys(item).length"
    :class="tw(['relative', 'cursor-pointer', 'group'])"
    @click="action(item)"
    v-audio="item.maintenance ? 'none' : 'enterGamePage'"
  >
    <div
      class="game__short__picture"
      :class="tw(['relative', 'rounded-20px', 'overflow-hidden', { 'min-h-[120px]': isMobile }, 'bg-bg', 'flex'])"
      style="will-change: transform;"
    >
      <el-image
        class="game__short__img"
        :lazy="!isSwiper"
        :src="
          `${gameSiteURL}/game/${item.IsStatic ? 'static/' : ''}${isMobile ? 'mobile/' : 'pc/'}type_short/${
            item.IsStatic ? item.Vendor.ID : item.GameID
          }.jpg`
        "
        :class="tw(['max-w-none', 'w-full', 'group-hover:scale-125', 'group-hover:origin-top', transitionBase])"
        :alt="item.GameName"
      >
        <template #error>
          <div :class="tw(['flex', 'justify-center', 'items-center', 'h-full', 'bg-[#333]'])">
            <img :alt="item.GameName" :src="require(`@/assets/img/logo/logo_PlayBUZ_only.png`)" />
          </div>
        </template>
        <template #placeholder>
          <el-skeleton-item variant="image" style="height: 100%;"></el-skeleton-item>
        </template>
      </el-image>
      <div
        class="game__short__mask"
        v-if="!isMobile"
        :class="
          tw([
            'absolute',
            'bottom-0',
            'left-0',
            'h-1/2',
            'w-full',
            'bg-gradient-to-b',
            'from-opacityBlack',
            'to-black',
            'opacity-40'
          ])
        "
      ></div>
      <div :class="tw(['absolute', 'bg-black', 'bg-opacity-50', 'w-full', 'bottom-0'])">
        <div :class="tw(['flex', 'justify-center'])">
          <div :class="tw(['inline-block'])" v-for="(imgItem, imgiIndex) in item.SupportedPointTypeID" :key="imgiIndex">
            <img class="icon__img" :src="getImageUrl(imgItem)" :class="tw(['w-18px', 'h-18px', 'inline-block'])" />
            <div
              v-if="item.SupportedPointTypeID.length > 1 && imgiIndex == 0"
              :class="tw(['inline-block', 'text-white', 'mx-0.5'])"
            >
              |
            </div>
          </div>
        </div>
      </div>
      <div
        class="game__maintenance__mask"
        v-if="isUseMaintenance && item.maintenance"
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
    </div>
    <div
      class="game__short__text"
      :class="
        tw([
          'text(12px [#707070])',
          'md:text(13px [#707070])',
          'overflow-hidden',
          'overflow-ellipsis',
          'text-[#8D8D8D]',
          'mt-4px'
        ])
      "
      :style="{
        display: '-webkit-box',
        '-webkit-line-clamp': '2',
        '-webkit-box-orient': 'vertical'
      }"
    >
      <template v-if="isDisplayName"> {{ item.IsStatic ? $t(item.GameName) : item.GameName }}： </template>
      {{ item.IsStatic ? $t(item.sub || item.SubTitle) : item.sub || item.SubTitle }}
    </div>
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
          <img :class="tw(['mb-6', 'w-28'])" :src="require(`@/assets/img/logo/logo_PlayBUZ_only.png`)" />
          <span :class="tw(['text(white center xl)'])">
            {{ $t('敬請期待') }}
          </span>
        </div>
      </template>
    </viewPopup>
  </div>
</template>

<script>
  import { inject, computed, ref } from 'vue'
  import store from '@/store'
  import { useRoute, useRouter } from 'vue-router'

  import { COIN_TYPE } from '@/configs'
  import viewPopup from '@/components/popup'

  export default {
    name: 'game-item',

    components: {
      viewPopup
    },

    props: {
      item: {
        type: Object,
        default: () => {}
      },

      isSwiper: {
        type: Boolean,
        default: () => false
      }
    },

    setup() {
      const router = useRouter()
      const route = useRoute()
      const gameSiteURL = process.env.VUE_APP_IMG_URL + '/img'

      const displayPopup = ref(false)
      const isMobile = computed(() => store.getters['platform/isMobile'])
      const isDisplayText = inject('isDisplayText')
      const isUseMaintenance = inject('isUseMaintenance')
      const isDisplayName = inject('isDisplayName')

      const getImageUrl = val => {
        const img = COIN_TYPE.find(res => res.id === val)
        return img.imgLine
      }

      const action = obj => {
        if (obj.maintenance && isUseMaintenance) return false

        // 靜態資料不進入詳細頁
        if (obj.IsStatic) {
          if (obj.Vendor.GameUrl) window.open(obj.Vendor.GameUrl)
          else if (obj.Vendor.IOSUrl || obj.Vendor.AndroidUrl) {
            if (store.state.platform.deviceInfo.toLowerCase().includes('android') && obj.Vendor.AndroidUrl)
              window.open(obj.Vendor.AndroidUrl)
            else if (store.state.platform.deviceInfo.toLowerCase().includes('ios') && obj.Vendor.IOSUrl)
              window.open(obj.Vendor.IOSUrl)
            else {
              const target = obj.Vendor.IOSUrl ?? obj.Vendor.AndroidUrl
              window.open(target)
            }
          } else displayPopup.value = true
          return false
        }

        if (route.name === 'game/detail') router.push({ params: { gameID: obj.GameID } })
        else router.push({ name: 'game/detail', params: { gameID: obj.GameID } })
      }

      return {
        isMobile,
        isDisplayText,
        isUseMaintenance,
        isDisplayName,
        displayPopup,
        gameSiteURL,
        COIN_TYPE,
        // fn
        action,
        getImageUrl
      }
    }
  }
</script>

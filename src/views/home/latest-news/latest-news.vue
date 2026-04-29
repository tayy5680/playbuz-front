<template>
  <div class="latest_news_container" :class="tw(['w-[full]', 'flex', 'flex-col'])">
    <div class="news_title">
      <UISwitch
        :list="LIST_TYPE"
        :activeID="choseID"
        lineStyle="pb-1 border-solid border-b border-sky-500"
        :class="tw(['border-solid', 'border-b', 'border-[#707070]', 'mb-10'])"
      />
    </div>
    <div
      class="latest_news_item_container"
      v-for="(item, index) of recommendList"
      :key="item.GameID"
      :class="
        tw([
          'md:flex',
          { 'border-t-2 border-BaseColor': index !== 0 },
          { 'mt-10 pt-10': index !== 0 && recommendList.length > 1 }
        ])
      "
    >
      <div
        class="latest_news_introduce"
        :class="tw(['md:w-[70%]', 'flex', 'flex-col', 'justify-center', 'mr-2', 'leading-10'])"
      >
        <div :class="tw(['flex', 'md:block'])">
          <div :class="tw(['text-[30px]', 'font-bold', 'mr-5', 'md:mr-0'])">
            {{ $t(item.GameName) }}
          </div>
          <div v-if="item.openUrl.value">
            <div :class="tw(['inline', 'text-[20px]', 'font-bold', 'cursor-pointer'])" @click="btnAction(item.openUrl)">
              <img
                :src="require('@/assets/img/icons/more.svg')"
                :class="tw(['inline', 'w-[30px]', 'h-[30px]'])"
                alt="more"
              />
              <span :class="tw(['ml-4', 'text-[24px]'])">more</span>
            </div>
          </div>
        </div>
        <div :class="tw(['text-[20px]', 'font-bold'])">
          {{ $t(item.SubTitle) }}
        </div>
        <div v-if="item.Detailed" :class="tw(['text-BaseColor'])">
          {{ $t(item.Detailed) }}
        </div>
      </div>
      <div class="latest_news_picture" :class="tw(['md:w-[30%]', 'flex', 'flex-col'])">
        <div
          v-for="(mediaItem, index) of item.mediaUrl"
          :key="index"
          :class="
            tw([
              'relative',
              'w-full',
              'h-full',
              { 'cursor-pointer': mediaItem.type === 'youtube' },
              'min-h-[225px]',
              'rounded-20px',
              { 'mb-2': index === 0 }
            ])
          "
          @click="action(mediaItem)"
        >
          <el-image
            :class="tw(['w-full', 'h-full', 'rounded-20px', 'group-hover:scale-105', 'bg-[#00000029]', transitionBase])"
            fit="cover"
            :src="
              mediaItem.type === 'image'
                ? `${imgUrl}/img/game/static/mobile/type_short/${item.Vendor.ID}.jpg`
                : `https://img.youtube.com/vi/${mediaItem.id}/maxresdefault.jpg`
            "
            :alt="item.GameName"
          >
            <template #error>
              <div
                :class="
                  tw(['flex', 'justify-center', 'items-center', 'h-full', 'min-h-[225px]', 'object-cover', 'bg-[#333]'])
                "
              >
                <img :alt="item.GameName" :src="require(`@/assets/img/logo/logo_PlayBUZ_only.png`)" />
              </div>
            </template>
            <template #placeholder>
              <el-skeleton-item variant="image" style="height: 100%;" />
            </template>
          </el-image>
          <img
            class="preview__player"
            v-if="mediaItem.type === 'youtube'"
            :src="require('@/assets/img/icons/i_video_play.svg')"
            :class="
              tw([
                'pointer-events-none',
                'absolute',
                'top-1/2',
                'left-1/2',
                '-translate-1/2',
                'z-10',
                'w-60px',
                'h-60px',
                'opacity-80',
                'group-hover:opacity-100',
                'group-hover:scale-110',
                transitionBase
              ])
            "
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { computed, ref } from 'vue'
  import UISwitch from '@/components/ui/switch'
  import store from '@/store'

  import { GAME_STATIC_LIST } from '@/configs/static_game.js'

  export default {
    name: 'view-latest-news',

    components: {
      UISwitch
    },

    setup() {
      const imgUrl = ref(process.env.VUE_APP_IMG_URL)
      const LIST_TYPE = [{ id: 1, class: 'latestNews', label: '遊戲介紹' }]

      const choseID = ref(1)
      const isMobile = computed(() => store.getters['platform/isMobile'])
      const recommendList = GAME_STATIC_LIST.filter(e => e.isRecommend === true)
      recommendList.map(e => {
        const url = ref('')
        if (isMobile.value) {
          if (store.state.platform.deviceInfo.toLowerCase().includes('android') && e.Vendor.AndroidUrl) {
            url.value = e.Vendor.AndroidUrl
          }
          if (store.state.platform.deviceInfo.toLowerCase().includes('ios') && e.Vendor.IOSUrl) {
            url.value = e.Vendor.ios
          }
        } else {
          url.value = e.Vendor.GameUrl
        }
        e.openUrl = url
      })

      const action = obj => {
        if (obj.type !== 'youtube') return
        window.open(obj.src)
      }

      const btnAction = url => {
        window.open(url)
      }

      return {
        LIST_TYPE,
        recommendList,
        choseID,
        imgUrl,

        // fn
        action,
        btnAction
      }
    }
  }
</script>

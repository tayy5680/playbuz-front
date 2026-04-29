<template>
  <div class="news-items" @click="action(data)">
    <div class="item-image">
      <el-image
        :src="data[isImageMobile ? 'ImgUrlMo' : 'ImgUrlPc']"
        :alt="data.Title"
        :style="`background-image:url(${envImgUrl}/img/deposit/background/deposit_deposit_bg01.jpg);`"
      >
        <template id="placeholder">
          <div class="el-skeleton-item" variant="image" style="height: 160px;"></div>
        </template>
        <template #error>
          <img class="err" :src="require(`@/assets/img/logo/logo_PlayBUZ.svg`)" />
        </template>
      </el-image>
    </div>
    <div class="item-tag">
      <div
        v-for="dataTag of data.TagsInfo"
        :key="dataTag.TagsId"
        :class="[{ mo: isMobile }, { hidden: dataTag.TagsId === 1 }]"
      >
        {{ dataTag?.TagsName }}
      </div>
    </div>
    <div class="item-title">
      <div class="title">{{ data.Title }}</div>
      <div class="time" v-if="data?.StartTime || data?.EndTime">
        <span>{{ data.StartTime ? dayjs(data.StartTime).format('YYYY/MM/DD') : $t('即刻起') }}</span>
        <span>{{ data.EndTime ? '-' + dayjs(data.EndTime).format('YYYY/MM/DD') : `-${$t('無期限')}` }}</span>
      </div>
    </div>
  </div>
</template>
<script>
  import { computed, ref } from 'vue'
  import store from '@/store'
  import dayjs from 'dayjs'
  import { useRoute, useRouter } from 'vue-router'

  export default {
    props: {
      data: {
        type: Object,
        required: true
      }
    },

    setup(props) {
      const isImageMobile = computed(() => store.state.platform.screenWidth <= 420)
      const isMobile = computed(() => store.getters['platform/isMobile'])
      const lottiePcElement = ref(null)
      const lottieMobileElement = ref(null)
      const route = useRoute()
      const router = useRouter()
      const envImgUrl = process.env.VUE_APP_IMG_URL
      const weekList = ['日', '一', '二', '三', '四', '五', '六']

      const action = obj => {
        const url = obj[isMobile.value ? 'OpenUrlMo' : 'OpenUrlPc']
        if (url) window.open(url)
        else {
          router.push({
            name: 'event/detail',
            params: {
              TagsName: route.params?.TagsName ?? 1,
              eventID: obj.NewsId
            }
          })
        }
      }

      return {
        isMobile,
        lottiePcElement,
        lottieMobileElement,
        action,
        dayjs,
        envImgUrl,
        weekList,
        isImageMobile
      }
    }
  }
</script>

<style lang="scss" scoped>
  .news-items {
    background-color: pink;
    overflow: hidden;
    margin-bottom: 20px;
    border-radius: 20px;
    cursor: pointer;
    .item-tag {
      position: absolute;
      margin-top: -35px;
      display: flex;
      opacity: 0.6;
      gap: 8px;
      padding: 0 22px;
      > div {
        background-color: rgba(0, 0, 0, 0.6);
        border-radius: 100px;
        border: 1px solid white;
        padding: 4px 20px;
        color: white;
        font-size: 12px;
        display: inline-block;

        &.hidden {
          display: none;
        }
        &.mo {
          font-weight: bold;
        }
      }
    }
    .item-image {
      overflow: hidden;
      aspect-ratio: 628 / 214;
      width: 100%;
      :deep(.el-image) {
        display: block;
        width: 100%;
        height: 100%;
        transition: all 0.5s ease;
        .err {
          object-fit: contain;
          max-width: 100%;
          max-height: 100%;
          margin: 0 auto;
        }
        &:hover {
          scale: 1.1;
        }
      }

      @media (max-width: 420px) {
        aspect-ratio: 372 / 238;
      }
    }
    .item-title {
      padding: 4px 22px;
      background-color: #480a8f;
      color: white;
      font-weight: bold;
      font-size: 18px;
      display: flex;
      align-items: center;
      .title {
        flex-grow: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .time {
        color: #cd9cff;
        font-size: 14px;
        flex-shrink: 0;
      }
    }
  }
</style>
<style lang="scss">
  .event-lottie__item.mobile {
    svg {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) !important;
      min-width: 100%;
      height: auto !important;
      min-height: 100%;
    }
  }
</style>

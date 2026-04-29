<template>
  <div class="view-join-cofun-live" id="joinCofunLIVE" :style="`background-image:url(${imgUrl}/bg-join.svg)`">
    <div class="basic-title" v-fade="'opacity'">
      <h2>{{ $t('立即加入 Cofun LIVE') }}</h2>
      <h5>
        {{ $t('在 Cofun LIVE，人人都能開播當主角，觀眾也能變直播主。') }}<br />
        {{ $t('不只秀出自我，還能賺分潤，現在加入，一起Cofun起來！') }}
      </h5>
    </div>

    <div class="container-main" :class="tw(['grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-10'])">
      <div v-fade="'right'">
        <div class="role-card basic-card live">
          <div class="bg-text">LIVE</div>
          <div :class="tw(['relative', 'flex-grow'])">
            <div class="title">
              <img :src="`${imgUrl}/icon-become-streamer.svg`" alt="" />
              <h5>{{ $t('成為直播主') }}</h5>
            </div>
            <p>{{ $t('在 Cofun LIVE，不只是表演才藝，還能與粉絲即時互動、共玩遊戲，創造雙向娛樂體驗！') }}</p>
            <br />
            <p>{{ $t('讓你邊玩邊建立人氣，同時賺取實質收益，打造你的專屬直播舞台。') }}</p>

            <ol>
              <li>{{ $t('業界首創直播互動遊戲') }}</li>
              <li>{{ $t('50%起跳的分潤機制') }}</li>
              <li>{{ $t('多種利潤收益模式') }}</li>
            </ol>
          </div>
          <div class="btn-area py-4">
            <el-button class="basic-btn basic" @click="routeGuidePage('how-to-become-cofun-live-streamer')">
              {{ $t('如何成為直播主？') }}
            </el-button>
            <el-button class="basic-btn basic white" @click="routeGuidePage('how-to-withdraw-earnings')">
              {{ $t('如何提領直播收益') }}
            </el-button>
          </div>
        </div>
      </div>
      <div v-fade="'left'">
        <div class="role-card basic-card member">
          <div class="bg-text">MEMBER</div>
          <div :class="tw(['relative', 'flex-grow'])">
            <div class="title">
              <img :src="`${imgUrl}/icon-become-member.svg`" alt="" />
              <h5>{{ $t('成為會員') }}</h5>
            </div>
            <p>
              {{
                $t(
                  '加入直播不只是聊天打賞那麼簡單！在 Cofun LIVE，你能與喜愛的直播主同步遊玩，共同完成充滿挑戰的登月旅程。這不只是互動，更是一場沉浸式體驗，讓你享受與主播攜手破關、一起衝上月球的驕傲與快感！'
                )
              }}
            </p>
            <ol>
              <li>{{ $t('與直播主共同互動') }}</li>
              <li>{{ $t('支援多人即時同場互動') }}</li>
              <li>{{ $t('多款超值禮包限時放送中') }}</li>
            </ol>
          </div>
          <div class="btn-area py-4">
            <el-button class="basic-btn basic" @click="handleLogin">
              {{ isLogin ? $t('您已經是會員') : $t('立即註冊') }}
            </el-button>
            <el-button class="basic-btn white" @click="routeGuidePage('how-to-watch-cofun-live-streams')">
              {{ $t('註冊操作教學') }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <div id="app-download" class="container-main">
      <img v-fade="'right'" class="cofun-icon" :src="`${imgUrl}/cofun-icon.svg`" alt="" @click="cofunPage" />
      <div v-fade="'left'" class="app-download">
        <a :href="COFUN_APP_URL.android" target="_blank">
          <img :src="`${imgUrl}/google-play.svg`" :alt="$t('下載{type}版App', { type: 'Android' })" />
        </a>
        <a :href="COFUN_APP_URL.ios" target="_blank">
          <img :src="`${imgUrl}/apple-store.svg`" :alt="$t('下載{type}版App', { type: 'IOS' })"
        /></a>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { inject, computed } from 'vue'
  import store from '@/store'
  import { COFUN_APP_URL } from '@/configs/game.js'
  import { useRoute, useRouter } from 'vue-router'
  import { useNotice } from '@/utils/use-notice'
  const scrollToId = inject('scrollToId')
  const route = useRoute()
  const router = useRouter()
  const isLogin = computed(() => store.getters['member/isLogin'])

  const handleLogin = () => {
    if (!isLogin.value) store.commit('sign/UPDATE_DRAWER_STATE', true)
  }
  const routeGuidePage = pageId => {
    router.push({ name: 'guide', params: { pageId: pageId } })
  }

  const cofunPage = () => {
    router.push('/game/detail/100001')
  }
  const imgUrl = computed(() => {
    return `${process.env.VUE_APP_IMG_URL}/img/home/2025NewHome`
  })
</script>
<style lang="scss" scoped>
  .view-join-cofun-live {
    background: white;
    text-align: center;
    padding: 90px 0 30px 0;
    background-position: bottom;
    background-size: contain;
    background-repeat: repeat-x;

    .role-card {
      background: white;
      text-align: left;
      padding: 2rem;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      .bg-text {
        color: #f0f4fb;
        font-size: 70px;
        font-weight: bold;
        position: relative;
        width: 100%;
        height: 0;
        z-index: 0;
        right: -0.5em;
        top: -0.5em;
        text-align: right;
      }

      .title {
        display: flex;
        align-items: center;
        padding-bottom: 25px;
        color: #c479ff;

        img {
          margin-right: 15px;
          width: 70px;
          height: 70px;
        }

        h5 {
          font-weight: bold;
          font-size: 32px;
          line-height: 2rem;
        }
      }

      p {
        color: #314167;
      }

      ol {
        padding: 25px 0;
        color: #c479ff;
        li {
          margin-left: 2em;
          margin-bottom: 10px;
          &::before {
            content: '\f26a';
            display: inline-block;
            font-family: bootstrap-icons !important;
            margin-left: -2em;
            padding-right: 15px;
          }
        }
      }
      .btn-area {
        display: flex;
        flex-shrink: 0;
        align-items: flex-end;
        button {
          height: 100%;
        }
      }
      .basic-btn {
        cursor: pointer;
        transition: all 0.2s ease;
        background-color: #7c7ed7;
        color: white;
        font-weight: bold;
        text-align: center;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        border: 2px solid #7c7ed7;
        word-wrap: break-word;
        white-space: break-spaces;
        height: fit-content;
        &:hover {
          background-color: #b2b3ff;
        }

        &.white {
          background-color: white;
          color: #7c7ed7;
          border: 2px solid #7c7ed7;

          &:hover {
            background-color: #1f2530;
            border: 2px solid #1f2530;
            color: #b2b3ff;
          }
        }
        &.basic {
          flex-grow: 1;
        }
      }

      &.member {
        .title,
        ol {
          color: #7c7ed7;
        }
      }
    }

    #app-download {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top: 100px;
      padding-bottom: 100px;

      .cofun-icon {
        width: 30svw;
        max-width: 200px;
        padding: 15px;
        cursor: pointer;
      }
      .app-download {
        padding-left: 15px;
        width: 40svw;
        max-width: 262px;

        img {
          cursor: pointer;
          margin-top: 15px;
          margin-bottom: 15px;
        }
      }
      @media screen and (max-width: 540px) {
        .app {
          padding-left: 0px;
        }
      }
    }
  }
</style>

<template>
  <div class="view-playbuz-home-header" v-fade="'down'">
    <div class="container-main">
      <div class="logo" :class="{ 'logo-214px': !route.meta.nonAside && !isMobile }">
        <img
          :src="require(`@/assets/img/logo/logo_PlayBUZ.svg`)"
          :title="siteTitle"
          :class="tw(['h-[42px]', 'cursor-pointer'])"
          @click="clickHomeNav('')"
        />
      </div>
      <!-- 主選單 -->
      <div v-if="!isMobile && ['home', 'guide'].includes(route.name)" class="home-nav-list">
        <div
          v-for="(item, index) in ASIDE_MENU_2025_WITHOUT_HOME"
          :key="index"
          @click="clickHomeNav(item)"
          v-audio="'serviceList'"
        >
          {{ $t(item.label) }}
        </div>
      </div>
      <!-- game-detail選單 -->
      <div class="game-detail-nav" v-if="route.name === 'game/detail'">
        <a
          class="inner-nav-list-back"
          :class="tw(['text(##374151 14px)', 'flex', 'items-center'])"
          @click="$router.back()"
          v-audio="'close'"
        >
          <i class="bi bi-chevron-left "></i>
          {{ gameTypeLabel }}
        </a>
      </div>
      <!-- 內頁選單 -->
      <div
        class="inner-nav-list"
        :class="tw(['relative', 'flex-1', 'col-span-2', 'flex-grow'])"
        v-if="pageMenuList.length"
      >
        <viewHeaderMenu />
      </div>
      <div class="home-nav-user-btn">
        <!-- 音樂 -->
        <div class="audio-btn" v-audio="'serviceList'">
          <ViewAudioButton />
        </div>
        <!-- 聊天室 
        <div class="chat-btn" v-if="isLogin && !isMobile" @click="toggleEnableTalk" v-audio="'serviceList'">
          <i class="bi bi-chat-dots"></i>
        </div> -->
        <!-- 頭像 -->
        <div class="member-btn" v-if="!isMobile">
          <el-dropdown
            trigger="click"
            popper-class="header-wallet-dropdown"
            :show-arrow="false"
            ref="pcMemberDropdownRef"
          >
            <div class="el-dropdown-link">
              <el-avatar
                :class="{ guest: !isLogin }"
                :size="40"
                :src="isLogin ? info?.PhotoSrc : require('./images/i_user_guest.svg')"
                :fit="'cover'"
                v-audio="'serviceList'"
              >
                <img src="/img/member/preset_avatar00@2x.png" />
              </el-avatar>
            </div>
            <template #dropdown>
              <el-dropdown-menu> <ViewSubMemberMenu :closeWindow="closeSubMemberMenu" /> </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <!-- 金幣區域 -->
        <div class="wallet-btn" v-if="isLogin && !isMobile">
          <el-dropdown
            trigger="click"
            @visible-change="bool => (isPCWalletDropdown = bool)"
            popper-class="header-wallet-dropdown"
            :show-arrow="false"
            ref="pcWalletDropdownRef"
          >
            <div class="el-dropdown-link" v-audio="'serviceList'">
              <img :src="require(`@/assets/img/wallet/i_money_gold.svg`)" />
              <div class="gold">{{ pointFormatter(wallet?.gold ?? 0) }}</div>
              <i class="bi bi-chevron-down" :class="{ open: isPCWalletDropdown }"></i>
            </div>
            <!-- <span class="el-dropdown-link"> Dropdown List<i class="bi bi-chevron-down"></i> </span> -->
            <template #dropdown>
              <el-dropdown-menu> <ViewBalance @closePCBalance="closePCWalletUI" /> </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <!-- 手機版選單-->
        <div class="mobile_menu_bar" @click="mobileDrawerMenuVisible = true" v-audio="'serviceList'" v-if="isMobile">
          <img class="img" :src="require('./images/i_mobile_menu_bar.svg')" :class="tw(['w-40px'])" alt="menu" />
        </div>
      </div>
    </div>

    <!-- 彈出式介面 -->
    <ViewLanguage />
    <!-- 手機版側邊選單 -->
    <el-drawer
      v-model="mobileDrawerMenuVisible"
      modal-class="mobile-menu"
      size="100%"
      :append-to-body="true"
      :show-close="false"
      :with-header="false"
    >
      <ViewSubMemberMenu :closeWindow="closeMobileDrawerMenu" />
      <div class="menu-close">
        <div @click="closeMobileDrawerMenu">
          <img class="close" :src="require('./images/i_menu_close.svg')" :class="tw(['w-40px'])" alt="close" />
        </div>
        <div class="audio-btn" @click="closeMobileDrawerMenu">
          <ViewAudioButton />
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script setup>
  import ViewBalance from '@/components/view-balance'
  import viewHeaderMenu from './menu'
  import ViewSubMemberMenu from './subMemberMenu.vue'
  import ViewAudioButton from '@/components/audio/audioButton'
  import ViewLanguage from '@/components/language'
  import { ref, computed, watch, inject, provide } from 'vue'
  import store from '@/store'
  import { COIN_TYPE } from '@/configs'
  import { pointFormatter } from '@/utils/formatters'
  import { SOCIAL_LIST, COPYRIGHT } from '@/configs'
  import { ASIDE_MENU_2025_WITHOUT_HOME } from '@/configs/aside'
  import { useRoute, useRouter } from 'vue-router'
  import { useNotice } from '@/utils/use-notice'
  import { event } from 'vue-gtag-next'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const isLogin = computed(() => store.getters['member/isLogin'])
  const isMobile = computed(() => store.getters['platform/isMobile'])
  const info = computed(() => store.state.member.info)
  const pcMemberDropdownRef = ref(null)
  const mobileDrawerMenuVisible = ref(false)
  const pcWalletDropdownRef = ref(null)
  const isPCWalletDropdown = ref(false)
  const pageMenuList = computed(() => store.state.platform.pageMenuList)
  const wallet = computed(() => store.getters['wallet/walletTotal'])

  const gameTypeLabel = computed(() => {
    const type = store.state.game.gameDetail.gameDetailType
    if (route.name === 'game/detail' && type)
      return store.getters['game/gameTypeList'].find(item => item.type === type)?.label ?? type
    else return ''
  })

  const scrollToId = id => {
    const container = document.getElementById('playbuzHome')
    const target = document.getElementById(id)

    if (container && target) {
      const top = target.offsetTop - 80
      container.scrollTo({ top, behavior: 'smooth' })
    }
  }

  const closeSubMemberMenu = () => {
    if (!pcMemberDropdownRef.value) return
    pcMemberDropdownRef.value.visible = false
  }
  const closeMobileDrawerMenu = () => {
    mobileDrawerMenuVisible.value = false
  }
  const closePCWalletUI = () => {
    console.log('closePCWalletUI')
    if (!pcWalletDropdownRef.value) return
    pcWalletDropdownRef.value.visible = false
  }

  // 聊天室
  const enableTalk = computed(() => store.state.platform.enableTalk)
  const toggleEnableTalk = () => {
    if (!store.state.member.info) return false
    store.dispatch('platform/setEnableTalk', !enableTalk.value)
  }

  watch(isMobile, val => {
    closeMobileDrawerMenu()
    closeSubMemberMenu()
  })
  // ====   顯示新版首頁
  const clickHomeNav = item => {
    if (!item) {
      event('header_logo_click', { click: '' })
      return router.push('/')
    }
    const id = item.id
    if (id === 'aboutPlayBUZ') {
      if (route.path === '/') {
        const container = document.getElementById('app')
        const target = document.getElementById('aboutPlayBUZ')
        if (container && target) {
          const top = target.offsetTop - 90
          container.scrollTo({ top, behavior: 'smooth' })
        }
      } else router.push({ name: 'about' })
    } else {
      router.push(item.router)
    }
  }
</script>
<style lang="scss" scoped>
  .view-playbuz-home-header {
    background-color: white;
    box-shadow: 0 3px 6px #45454557;
    background-image: none;
    position: fixed;
    top: 0;
    z-index: 11;
    left: 0;
    right: 0;
    width: 100%;
    user-select: none;

    .container-main {
      display: flex;
      height: 75px;
      align-items: center;
      justify-content: space-between;
      max-width: 1200px;

      .logo {
        padding-right: 30px;
        flex-shrink: 0;

        &.logo-214px {
          width: 214px;
        }
      }

      .home-nav-list {
        display: flex;
        font-size: 14px;
        justify-content: flex-start;
        flex-grow: 1;
        color: #374151;
        align-items: center;

        > div {
          transition: all 0.2s ease;
          cursor: pointer;
          padding: 0 10px;
          &:hover {
            color: #6566f1;
          }
        }
      }

      .inner-nav-list {
        font-size: 14px;
        flex-grow: 1;
        padding: 0 10px;
      }
      .game-detail-nav {
        font-size: 14px;
        flex-grow: 1;
        i {
          margin-right: 20px;
        }
      }

      .home-nav-user-btn {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        > div {
          transition: all 0.2s ease;
          margin-left: 20px;
          height: 40px;
        }
        .member-btn {
          cursor: pointer;
          :deep(.el-avatar) {
            background-color: transparent;
            img {
              width: 100%;
            }
            &.guest {
              border-radius: 0;
            }
          }
        }
        .audio-btn {
          width: 40px;
          filter: invert(80%) sepia(0%) saturate(25%) hue-rotate(129deg) brightness(91%) contrast(89%);
          opacity: 1;
          &:hover {
            opacity: 0.7;
          }
        }
        .chat-btn {
          cursor: pointer;
          transition: 0.2s all ease;
          color: #374151;
          i {
            font-size: 38px;
            line-height: 34px;
          }
          &:hover {
            color: #3336eb;
          }
        }
        .wallet-btn {
          background: linear-gradient(147.53deg, #525a68 -57.93%, #242931 68.47%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          cursor: pointer;

          :deep(.el-dropdown) {
            .el-dropdown-link {
              color: white;
              display: flex;
              align-items: center;
              font-weight: 600;
              line-height: 100%;
              letter-spacing: 2%;
              padding: 0 12px;
              height: 40px;
              min-width: 155px;
              > img {
                width: 21px;
                height: 21px;
              }
              .gold {
                flex-grow: 1;
                padding: 0 10px;
              }
              i {
                color: #ffc800;
                transition: 0.2s all ease;
                &.open {
                  transform: rotate(180deg);
                }
                &::before {
                  font-weight: bold !important;
                }
              }
            }
          }
        }

        .mobile_menu_bar {
          width: 40px;
          height: 40px;
          cursor: pointer;
        }
      }
    }
  }
</style>
<style lang="scss">
  .el-popper.header-wallet-dropdown {
    border-radius: 20px !important;
    max-width: 364px;
    width: 100%;
    box-shadow: 0px 0px 6.8px 0px #00000099;

    .el-dropdown-menu {
      padding: 0;
    }
    .el-scrollbar {
      border-radius: 20px !important;
    }
    .el-popper__arrow {
      &::before {
        border-color: #dcdcdc !important;
        border-bottom-color: transparent;
        border-right-color: transparent;
      }
    }
  }

  .el-overlay.mobile-menu {
    user-select: none;
    // transition: 0.1s all ease !important;
    .el-drawer {
      margin-top: 0;
      max-width: 428px;
      button:focus,
      button:hover {
        outline: none;
      }
      .el-drawer__body {
        display: flex;
        height: 100svh;
        .menu-close {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px;
          gap: 24px;
          box-shadow: 0px 4px 4px 0px #00000066;
          > div {
            cursor: pointer;
            transition: 0.2s all ease;
            &:hover {
              opacity: 0.7;
            }
          }
        }
        .audio-btn {
          width: 40px;
          height: 40px;
          filter: invert(80%) sepia(0%) saturate(25%) hue-rotate(129deg) brightness(91%) contrast(89%);
          opacity: 1;
        }
      }
    }
  }
</style>

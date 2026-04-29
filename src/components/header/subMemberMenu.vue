<template>
  <div class="sub-member-menu" :class="{ mobile: isMobile }">
    <!-- user -->
    <div class="sub-user" v-if="isLogin">
      <div class="user" @click="switchPage({ router: '/center' })">
        <el-avatar :size="48" :src="memberInfo?.PhotoSrc" :fit="'cover'">
          <img src="/img/member/preset_avatar00@2x.png" />
        </el-avatar>
        <div class="level">Lv.{{ memberInfo?.VIP?.Level || 0 }}</div>
        <div class="name">
          {{ memberInfo.NickName }}
        </div>
        <div class="btn"><i class="bi bi-chevron-right"></i></div>
      </div>
      <div class="wallet-btn" v-if="isLogin && isMobile" @click="openBalance">
        <img :src="require(`@/assets/img/wallet/i_money_gold.svg`)" />
        <div class="gold">{{ pointFormatter(wallet?.gold ?? 0) }}</div>
        <i class="bi bi-chevron-right"></i>
      </div>
    </div>
    <!-- menu -->
    <div class="sub-menu" v-if="isMobile">
      <div
        v-for="(item, index) in ASIDE_MENU_2025"
        :key="index"
        :class="['menu-items', { active: route.name === item.id }]"
        @click="switchPage(item)"
      >
        <img
          :alt="item.id"
          :src="
            require(`@/assets/img/menu/${
              route.name === item.id ? item.iconFileName + '_active' : item.iconFileName
            }.svg`)
          "
        />
        <div class="label">{{ $t(item.label) }}</div>
      </div>
    </div>
    <!-- member -->
    <div class="sub-member" v-if="isLogin">
      <div class="sub-title">{{ $t('會員') }}</div>
      <div
        v-for="(item, index) in MEMBER_MENU"
        :key="index"
        :class="['menu-items', { active: route.name === item.id }]"
        @click="switchPage(item)"
      >
        <img
          :alt="item.id"
          :src="
            require(`@/assets/img/menu/${
              route.name === item.id ? item.iconFileName + '_active' : item.iconFileName
            }.svg`)
          "
        />
        <div class="label">{{ $t(item.label) }}</div>
      </div>
    </div>
    <!-- setting -->
    <div class="sub-setting" :class="tw([{ 'mt-[24px]': !isLogin && !isMobile }])">
      <div class="sub-title">{{ $t('其他') }}</div>
      <div class="menu-items" @click="openMinePet" v-if="isLogin">
        <img :src="require(`@/assets/img/menu/i_mine_pet.svg`)" />
        <div class="label">{{ $t('來去挖礦') }}</div>
      </div>
      <div class="menu-items" @click="openLanguage">
        <img :src="require(`@/assets/img/menu/i_language.svg`)" />
        <div class="label">{{ $t('切換語言') }}</div>
        <div class="lang">{{ LANGUAGE_NAME?.[languageCode] ?? languageCode }} <i class="bi bi-chevron-right"></i></div>
      </div>
      <div class="menu-items" @click="logout" v-if="isLogin">
        <img :src="require(`@/assets/img/menu/i_logout.svg`)" />
        <div class="label">{{ $t('登出') }}</div>
      </div>
      <div class="login-btn" @click="login" v-if="!isLogin">
        <img :src="require(`@/assets/img/menu/i_login.svg`)" />
        <div>{{ $t('登入') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { ref, computed, watch, inject } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import store from '@/store'
  import { pointFormatter } from '@/utils/formatters'
  import { ASIDE_MENU_2025, MEMBER_MENU } from '@/configs/aside'
  import { useNotice } from '@/utils/use-notice'
  import { event } from 'vue-gtag-next'
  import { LANGUAGE_NAME } from '@/configs/locales'

  export default {
    name: 'sub-member-menu',

    props: {
      closeWindow: {
        type: Function
      }
    },
    setup(props) {
      const route = useRoute()
      const router = useRouter()
      const languageCode = computed(() => store.state.member.languageCode)
      const isLogin = computed(() => store.getters['member/isLogin'])
      const isMobile = computed(() => store.getters['platform/isMobile'])
      const memberInfo = computed(() => store.state.member.info)
      const wallet = computed(() => store.getters['wallet/walletTotal'])
      const walletDialogVisible = ref(false)

      const switchPage = item => {
        props.closeWindow()
        if (item.router.name === route.name) return
        router.push(item.router)
      }

      const openMinePet = () => {
        store.dispatch('sign/loginProxy', { binding: true, action: 'goMine' })
        event('mine_click', { click: 'header' })
        props.closeWindow()
      }
      const openLanguage = () => {
        store.dispatch('member/setEnableLanguage', true)
        props.closeWindow()
      }
      const logout = () => {
        store
          .dispatch('member/signOut')
          .then(() => {
            store.dispatch('platform/setDefault')
            useNotice({ type: 'info', message: '您已成功登出' })
            event('logout', { success: location.pathname })
          })
          .catch(() => {
            useNotice({ type: 'error', message: '發生錯誤，請稍後再試，或洽客服人員' })
          })
          .finally(() => {
            if (route.name !== 'home') router.push({ name: 'home' })
            props.closeWindow()
          })
      }
      const login = () => {
        if (isLogin.value) return
        store.commit('sign/UPDATE_DRAWER_STATE', true)
        props.closeWindow()
      }

      const openBalance = () => {
        store.dispatch('wallet/setEnableBalance', true)
        props.closeWindow()
      }
      return {
        route,
        router,
        languageCode,
        isLogin,
        isMobile,
        memberInfo,
        wallet,
        walletDialogVisible,
        pointFormatter,
        ASIDE_MENU_2025,
        MEMBER_MENU,
        LANGUAGE_NAME,
        openBalance,
        login,
        logout,
        openLanguage,
        openMinePet,
        switchPage
      }
    }
  }
</script>
<style lang="scss" scoped>
  .sub-member-menu {
    padding: 0 24px;
    max-height: calc(95svh - 100px);
    .sub-user,
    .sub-menu,
    .sub-member {
      border-bottom: 1px solid #e3e3e3;
      // margin-bottom: 24px;
    }
    .sub-user {
      padding-top: 24px;
      display: flex;
      gap: 16px;
      align-items: center;
      font-size: 18px;
      padding-bottom: 24px;
      cursor: default;
      flex-direction: column;

      .user {
        cursor: pointer;
        display: flex;
        width: 100%;
        align-items: center;
        .el-avatar,
        .level,
        .btn {
          flex-shrink: 0;
        }
        :deep(.el-avatar) {
          width: 48px;
          height: 48px;
          line-height: 48px;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .level {
          padding-right: 10px;
          padding-left: 15px;
          color: #3336eb;
        }
        .name {
          flex-grow: 1;
          word-break: break-all;
        }
        .btn {
          cursor: pointer;
          transition: 0.2s all ease;
          padding-left: 15px;

          &:hover {
            color: #3336eb;
          }
        }
      }

      .wallet-btn {
        width: 100%;
        padding: 0 16px;
        background: linear-gradient(147.53deg, #525a68 -57.93%, #242931 68.47%);
        border-radius: 20px;
        display: flex;
        align-items: center;
        cursor: pointer;
        height: 64px;
        color: white;

        > img {
          width: 32px;
          height: 32px;
        }
        .gold {
          flex-grow: 1;
          padding: 0 8px;
          font-size: 20px;
          word-break: break-all;
          line-height: 20px;
        }
        i {
          text-shadow: 0 0 0px #ffc800, 0 0 0px #ffc800;
          display: block;
          color: #ffc800;
          &::before {
            font-weight: bold !important;
          }
        }
      }
    }
    .sub-member {
      gap: 16px;
      display: flex;
      flex-direction: column;
      padding: 16px 0;
    }
    .sub-menu {
      gap: 16px;
      display: flex;
      flex-direction: column;
      padding: 16px 0;
    }
    .sub-setting {
      gap: 16px;
      display: flex;
      flex-direction: column;
      padding: 16px 0;
      padding-bottom: 24px;
    }
    .sub-title {
      font-size: 20px;
      color: #bfbfbf;
      cursor: default;
    }
    .menu-items {
      font-size: 16px;
      cursor: pointer;
      display: flex;
      color: #374151;
      transition: 0.2s all ease;
      align-items: center;
      img {
        font-size: 18px;
        flex-shrink: 0;
        width: 24px;
        height: 24px;
        margin-right: 8px;
        background-size: cover;
      }
      &.active {
        color: #3336eb;
      }
      &:hover {
        opacity: 0.7;
      }
      .label {
        flex-grow: 1;
      }
      .lang {
        font-size: 14px;
        color: #bfbfbf;

        i {
          text-shadow: 0 0 0px #bfbfbf, 0 0 0px #bfbfbf;
          &::before {
            font-weight: bold !important;
          }
        }
      }
    }
    .login-btn {
      background-color: #374151;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px 16px;
      border-radius: 17px;
      font-size: 16px;
      color: white;
      margin-top: 40px;
      margin-bottom: 0 !important;
      cursor: pointer;
      transition: 0.2s all ease;
      img {
        width: 24px;
        height: 24px;
        margin-right: 8px;
      }
      &:hover {
        background-color: #ffc800;
      }
    }

    &.mobile {
      max-height: 100svh;
      flex-grow: 1;
      overflow-y: scroll;
      padding: 0px 24px;

      .menu-items {
      }
      .sub-menu,
      .sub-member,
      .sub-setting {
        gap: 32px;
        padding: 32px 0;
      }
    }
  }
</style>

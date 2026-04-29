<template>
  <div class="view-playbuz-home-footer">
    <div class="container-main main">
      <!-- :class="tw(['', 'grid-cols-1', 'md:grid-cols-3'])" -->
      <div class="about">
        <img class="logo" :src="require(`@/assets/img/logo/logo_PlayBUZ.svg`)" :alt="$t('玩霸PlayBUZ')" />
        <div class="about-items" @click="handleContractButton('about-PlayBUZ')">{{ $t('關於我們') }}</div>

        <div class="social-link">
          <a v-for="(item, index) in SOCIAL_LIST" :key="index" target="_blank" :href="item.url" :title="item.id">
            <i :class="`bi ${item.icon}`"></i>
          </a>
        </div>
      </div>
      <div class="link-area">
        <div class="link">
          <div class="footer-title">{{ $t('相關規範') }}</div>
          <div
            class="link-items"
            v-for="(item, index) in CONTRACT_LIST"
            :key="index"
            @click="handleContractButton(item.id)"
          >
            {{ $t(item.label) }}
          </div>
        </div>
        <div class="link">
          <div class="footer-title">{{ $t('客服中心') }}</div>
          <div
            class="link-items"
            v-for="(item, index) in MENU_LIST"
            :key="index"
            @click="handleContractButton(item.id)"
          >
            {{ $t(item.label) }}
          </div>
        </div>
      </div>
      <div class="download-area">
        <div class="footer-title">{{ $t('下載') }}</div>
        <div class="download-link">
          <img class="cofun-icon" :src="`${imageURL}/img/home/2025NewHome/cofun-icon.svg`" @click="cofunPage" />
          <a :href="COFUN_APP_URL.android" target="_blank"><i class="bi bi-google-play"></i></a>
          <a :href="COFUN_APP_URL.ios" target="_blank"><i class="bi bi-apple"></i></a>
        </div>
        <div class="label">
          <img :src="`${imageURL}/img/footer/rating-18plus.svg`" :alt="$t('18 歲以上限制級標誌')" />
          <div>
            ※
            {{
              $t(
                '本遊戲不涉及任何形式的現金交易賭博，並且不鼓勵、不支持也不容許用於賭博或其他違法用途，違者請自行負責其行為，請使用者遵守所當地法律法規。'
              )
            }}
          </div>
        </div>
      </div>
    </div>

    <div class="container-main copyright">
      {{ COPYRIGHT }}<br />
      {{ versionTitle }} v{{ VERSION }}
    </div>
  </div>
</template>
<script setup>
  import { ref, computed, watch, inject } from 'vue'
  import store from '@/store'
  import { SOCIAL_LIST, COPYRIGHT } from '@/configs'
  import { useRoute, useRouter } from 'vue-router'
  import { useNotice } from '@/utils/use-notice'
  import { VERSION } from '@/configs/version'
  import { useI18n } from 'vue-i18n'
  import { LIST_FAQ } from '@/views/FAQ/i18n/index.js'
  import { COFUN_APP_URL } from '@/configs/game.js'
  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const isLogin = computed(() => store.getters['member/isLogin'])
  const isMobile = computed(() => store.getters['platform/isMobile'])
  const versionTitle = process.env.VUE_APP_VERSION_TITLE ?? 'qa'
  const imageURL = process.env.VUE_APP_IMG_URL

  const CONTRACT_LIST = [
    { id: 'user-guidelines', label: '使用者條款' },
    { id: 'game-management-policy', label: '遊戲管理規章' },
    { id: 'intellectual-property', label: '智慧財產權保護政策' },
    { id: 'privacy-policy', label: '隱私權政策' },
    { id: 'limitation-of-liability', label: '遊戲責任事項' },
    { id: 'anti-fraud-and-security', label: '反詐騙與帳號安全宣導' }
  ]

  const MENU_LIST = [
    // { id: 'about-PlayBUZ', label: '關於玩霸' },
    { id: 'faq', label: '常見問題' },
    { id: 'contact-us', label: '聯絡我們' },
    // { id: 'service', label: '客服中心' },
    { id: 'user-center', label: '會員中心' }
  ]

  const handleLogin = () => {
    if (!isLogin.value) store.commit('sign/UPDATE_DRAWER_STATE', true)
  }
  const cofunPage = () => {
    router.push('/game/detail/100001')
  }
  const handleContractButton = id => {
    switch (id) {
      case 'user-guidelines':
        router.push({ name: 'userRules', params: { pageId: 'user-guidelines' } })
        break
      case 'about-PlayBUZ':
        router.push({ name: 'about' })
        break
      case 'faq':
        router.push({ name: 'FAQ', params: { faqTypeName: LIST_FAQ[0].name } })
        break
      case 'user-center':
        if (!isLogin.value) return handleLogin()
        router.push('/center')
        break
      case 'contact-us':
        const email = 'service.tw@playbuz.app'
        const mailtoLink = `mailto:${email}`
        window.location.href = mailtoLink
        break
      case 'game-management-policy':
        router.push({ name: 'userRules', params: { pageId: 'game-management-policy' } })
        break
      case 'privacy-policy':
        router.push({ name: 'userRules', params: { pageId: 'privacy-policy' } })
        break
      case 'intellectual-property':
        router.push({ name: 'userRules', params: { pageId: 'intellectual-property' } })
        break
      case 'limitation-of-liability':
        router.push({ name: 'userRules', params: { pageId: 'limitation-of-liability' } })
        break
      case 'anti-fraud-and-security':
        router.push({ name: 'userRules', params: { pageId: 'anti-fraud-and-security' } })
        break
    }
  }
  const scrollToId = id => {
    const container = document.getElementById('playbuzHome')
    const target = document.getElementById(id)

    if (container && target) {
      const top = target.offsetTop - 80
      container.scrollTo({ top, behavior: 'smooth' })
    }
  }
</script>
<style lang="scss" scoped>
  .view-playbuz-home-footer {
    background-color: #101827;
    color: white;
    font-size: 14px;
    padding: 60px 0 40px 0;

    .container-main.main {
      display: flex;
      .about {
        flex-shrink: 0;
        width: 25%;
        min-width: 170px;
        color: #878e9b;
        font-size: 14px;

        .logo {
          height: auto;
          width: 58px;
          margin-bottom: 16px;
        }

        .about-items {
          cursor: pointer;
          transition: color 0.2s ease;
          margin-bottom: 20px;
          font-size: 12px;
          line-height: 24px;

          &:hover {
            color: white;
          }
        }
      }
      .link-area {
        flex-grow: 1;
        display: flex;
        justify-content: space-between;
        width: 50%;
        .link {
          width: 50%;
          .link-items {
            font-size: 16px;
            padding-bottom: 8px;
            color: #9ca3af;
            cursor: pointer;
            transition: color 0.2s ease;
            &:hover {
              color: #7e5ff4;
            }
          }
        }
      }
      .download-area {
        flex-shrink: 0;
        width: 25%;
        min-width: 362px;
        word-break: break-word;
        line-break: anywhere;
        .label {
          color: #878e9b;
          font-size: 12px;
          padding: 10px 0 20px 0;
          display: flex;
          align-items: flex-start;
          img {
            width: 48px;
            height: 48px;
            margin-right: 16px;
          }
        }
        .download-link {
          display: flex;
          align-items: center;
          gap: 48px;

          .cofun-icon {
            width: 48px;
            height: 48px;
            cursor: pointer;
          }
          a {
            color: #878e9b;
            cursor: pointer;
            font-size: 48px;
            transition: all 0.2s ease;

            &:hover {
              color: white;
            }
          }
          .bi-google-play {
            position: relative;
            left: 3px;
          }
        }
        @media (min-width: 767px) and (max-width: 1000px) {
          min-width: 25%;
          .download-link {
            gap: 24px;
          }
        }
        @media (max-width: 767px) {
          min-width: 100%;
          width: 100%;
        }
      }
      .social-link {
        a {
          color: #878e9b;
          padding-right: 16px;
          font-size: 24px;
          line-height: 24px;
          transition: all 0.2s ease;

          &:hover {
            color: white;
          }
        }
      }
    }
    @media (max-width: 767px) {
      .container-main.main {
        display: block;
        .about {
          padding: 0;
          max-width: 100%;
          width: 100%;
        }
        .link-area {
          display: block;
          .link {
            width: 100%;
          }
        }

        .download-area {
          text-align: left;
          width: 100%;
          max-width: 100%;

          .app-btn {
            justify-content: flex-start;
            button {
              margin: 0 10px 0 0;
              padding: 5px 15px;
            }
          }
        }
      }
      .footer-title {
        margin-top: 49px;
      }
    }

    .copyright {
      color: #9ca3af;
      text-align: center;
      margin-top: 60px;
    }

    .footer-title {
      color: white;
      font-size: 18px;
      font-weight: bold;
      padding-bottom: 21px;
    }
  }
</style>

<template>
  <ul class="main__menu">
    <li
      class="main__menu__item"
      v-for="item of ASIDE_MENU_2025"
      :key="item.id"
      @click="action(item)"
      v-audio="'asideMenu'"
    >
      <div class="main__menu__icon" :class="tw(['w-[50%]', '-ml-[20px]', 'text-right'])">
        <div
          class="img"
          :class="
            tw([
              'w-[27px]',
              'h-[27px]',
              'ml-auto',
              'bg-white',
              { 'bg-lakeGreen': item.id === choseMainMenuId },
              { 'bg-bannerBg': item.id === 'event' }
            ])
          "
          :style="{
            '-webkit-mask': `url(${require(`@/assets/img/menu/${item.iconFileName}.svg`)}) no-repeat center /contain`,
            mask: `url(${require(`@/assets/img/menu/${item.iconFileName}.svg`)}) no-repeat center /contain`
          }"
        ></div>
      </div>
      <div
        class="main__menu__label"
        :class="
          tw([
            'text-18px',
            'ml-[16px]',
            { 'text-bannerBg': item.id === 'event' },
            { 'text-lakeGreen': item.id === choseMainMenuId }
          ])
        "
      >
        {{ $t(item.label, { siteName: SITE_NAME }) }}
      </div>
    </li>
  </ul>
</template>

<script>
  import { useRoute, useRouter } from 'vue-router'
  import { computed } from 'vue'
  import { ASIDE_MENU_2025 } from '@/configs/aside'
  import { useI18n } from 'vue-i18n'
  export default {
    name: 'header-mainmenu',

    props: {
      closeWindow: {
        type: Function
      }
    },
    setup(props) {
      const { t } = useI18n()
      const SITE_NAME = computed(() => t(process.env.VUE_APP_SITE_NAME))
      const route = useRoute()
      const router = useRouter()
      const choseMainMenuId = computed(() => ASIDE_MENU_2025.find(item => item.id === route.name)?.id ?? '')
      const action = item => {
        props.closeWindow()
        if (item.router.name === route.name) return
        router.push(item.router)
      }
      return {
        SITE_NAME,
        ASIDE_MENU_2025,
        choseMainMenuId,
        action
      }
    }
  }
</script>

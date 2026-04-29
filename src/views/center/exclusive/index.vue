<template>
<div class="exclusive__wrap">
  <div class="exclusive__container">
    <div class="exclusive__title"
      :class="tw([
        'pb-[16px]',
        'pl-[20px]',
        'text-[26px]',
        'md:text-[22px]',
      ])"
    >
      {{$t('會員專屬') }}
    </div>
    <div
      class="exclusive__main"
      :class="tw([
        'flex',
        'flex-col',
        'md:flex-row',
        'min-h-[100px]',
      ])"
    >
      <!-- <div
        class="exclusive-mine__container"
        :class="tw([
          'flex-1',
          'bg-popupBg',
          'p-[12px]',
          'md:p-0',
          'text-white',
          'rounded-[20px]',
          'relative',
          'flex',
          'flex-row-reverse',
          'md:flex-row',
          'items-center',
          'justify-around',
          'md:justify-center',
          'mb-[16px]',
          'md:mb-0',
          'md:mr-[16px]',
        ])"
      >
        <div class="exclusive-mine__img">
          <img
            :class="tw([
              'relative',
              'w-[157px]',
              'md:w-[176px]',
              'mt-[-20px]',
            ])"
            :src="isMobile ? require('./images/img_m.png') : require('./images/img_m@2x.png')"
          />
        </div>
        <div
          class="exclusive-mine__label"
          :class="tw([
            'md:ml-[46px]',
          ])"
        >
          <div
            class="exclusive-mine__title"
            :class="tw([
              'text-18px',
              'md:text-16px',
              'mb-[8px]',
              'md:mb-0',
            ])"
          >
            Hi, {{ name }}
          </div>
          <div
            class="exclusive-mine__text"
            :class="tw([
              'text-18px',
              'md:text-13px',
              'mb-[16px]',
            ])"
          >
            {{ $t('今天的礦機領了嗎~') }}
          </div>
          <buttonView
            size="small"
            type="secondary"
            v-audio="'clickMinePet'"
            @click="goMine"
          >
            {{ $t('點我領取') }}
          </buttonView>
        </div>
      </div> -->
      <div
        class="exclusive-nav__container"
        :class="tw([
          'grid',
          'grid-cols-2',
          'md:grid-cols-4',
          'gap-[10px]',
        ])"
      >
        <div
          class="exclusive-nav__item"
          v-for="item of list"
          :key="item.id"
          :class="tw([
            'relative',
            'rounded-[20px]',
            'bg-popupBg',
            'flex',
            'md:flex-col',
            'items-center',
            'p-[20px]',
            'w-full',
            'md:w-[96px]',
            'py-[14px]',
            'ease-in-out',
            item.disabled
              ? 'cursor-not-allowed'
              : 'cursor-pointer group hover:scale-110 transition-all duration-200',
          ])"
          v-audio="'clickMinePet'"
          @click="action(item.id)"
        >
          <div
            class="exclusive-nav__img"
            :class="tw([
              'relative',
              'h-[36px]',
              'w-[36px]',
              'bg-cover',
              'mr-12px',
              'md:mr-0',
            ])"
            :style="{
              '-webkit-mask': setStyleMaskImage(require(`./images/${item.icon}`)),
              'mask': setStyleMaskImage(require(`./images/${item.icon}`)),
            }"
          >
            <div
              class="exclusive-nav__color"
              :class="tw([
                item.disabled ? 'bg-[#51455E]' : `bg-[${item.color}]`,
                'absolute',
                'top-0',
                'left-0',
                'w-full',
                'h-full',
              ])"
              >
            </div>
          </div>
          <div class="exclusive-nav__label"
            :class="tw([
              'text-[20px]',
              'md:text-[15px]',
              item.disabled ? 'text-[#51455E]' : 'text-white md:text-[#9B75CC] md:group-hover:text-[#fff]',
              'md:mt-[2px]',
              'transition-colors',
              'duration-200',
              'ease-in-out',
            ])"
          >
            {{ $t(item.title) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<teleportItem>
  <viewFrame
    v-if="enableFrame"
    @close="enableFrame = false"
  />
</teleportItem>
<teleportItem>
  <viewGift
    v-if="enableGift"
    @close="enableGift = false"
  />
</teleportItem>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import store from '@/store'

// import buttonView from '@/components/ui/button-view'
import teleportItem from '@/components/ui/teleport-item'
import viewFrame from './frame'
import viewGift from './gift'
import { event } from 'vue-gtag-next'
import { useNotice } from '@/utils/use-notice'

export default {
  components: {
    // buttonView,
    teleportItem,
    viewFrame,
    viewGift,
  },

  setup () {
    const enableFrame = ref(false)
    const enableGift = ref(false)

    const name = computed(() => store.state.member.info?.NickName || '')
    const info = computed(() => store.state.member.info?.Email || store.state.member.info?.PhoneNumber)
    const isMobile = computed(() => store.getters['platform/isMobile'])

    const list = reactive([
      { id: 'mission', color: '#5FE2E8', title: '任務', icon: 'i_member_task.svg', disabled: true },
      { id: 'frame', color: '#B164FF', title: '頭像框', icon: 'i_member_face.svg' },
      { id: 'gift', color: '#FF4181', title: '送禮', icon: 'i_member_gift2.svg' },
      { id: 'month', color: '#FFD500', title: '月卡', icon: 'i_member_month_card.svg', disabled: true },
    ])

    const action = (id) => {
      switch (id) {
        case 'frame':
          event('member_frame_click', { click: '' })
          enableFrame.value = true
          break
        case 'gift':
          event('member_present_open', { show: '' })
          if (!info.value) {
            useNotice({ type: 'info', message: '請先綁定手機或是信箱' })
            return
          }
          enableGift.value = true
          break
        default:
          event('member_click', { click: id })
      }
    }

    const goMine = () => {
      event('mine_click', { click: 'member' })
      store.dispatch('sign/loginProxy', { binding: true, action: 'goMine' })
    }

    const setStyleMaskImage = (url) => {
      return `url(${url}) no-repeat center /contain`
    }

    return {
      enableFrame,
      enableGift,
      list,
      isMobile,
      name,
      // fn
      action,
      goMine,
      setStyleMaskImage,
    }
  },
}
</script>

<style lang="scss" scoped>
.exclusive-mine__img {
  animation: move 2.8s ease-in-out infinite;

  @keyframes move {
    50% {
      transform: translateY(22px);
    }
  }
}
</style>

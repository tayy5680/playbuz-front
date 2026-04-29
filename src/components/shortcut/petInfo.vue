<template>
  <div class="shortcut__petInfo" :class="tw(['contents', 'select-none'])">
    <i
      v-show="!isShowTip"
      :class="tw(['absolute', 'w-[60px]', 'h-[60px]', 'left-[-10px]', 'bg-contain'])"
      :style="{ backgroundImage: `url(${require('./images/img_tip01.png')})` }"
    ></i>
    <div
      class="shortcut__petInfo__tips"
      v-show="isShowTip"
      ref="petInfoTipElement"
      :class="
        tw([
          'absolute',
          'bg-white',
          'max-w-[100px]',
          'text-[12px]',
          'p-[14px]',
          'mr-[40px]',
          'ml-[-10px]',
          'shadow-mobileSubMenu',
          'top-0',
          'rounded-lg',
          showInfo.tipCss
        ])
      "
    >
      {{ showInfo.tip ? $t(showInfo.tip) : '' }}
    </div>
    <div
      class="shortcut__triangle"
      v-show="isShowTip"
      :class="tw(['absolute', 'border-chat', 'border-chatTriangle', 'top-0', 'mt-[-1px]'])"
    ></div>
    <div class="shortcut__petinfo" :class="tw(['absolute', 'text-[14px]', 'text-center'])">
      <div
        class="shortcut__petinfo__title"
        v-if="showInfo.title"
        :class="tw(['text-[#FFC527]'])"
        style="text-shadow: rgb(0 0 0 / 80%) 0 2px 2px;"
      >
        {{ $t(showInfo.title) }}
      </div>
      <div
        class="shortcut__petinfo__time"
        v-if="showInfo.status === 1"
        :class="tw(['text-white', 'bg-[#be0000cf]', 'rounded-lg', 'px-3'])"
      >
        {{ time }}
      </div>
    </div>
  </div>
</template>

<script>
  import { ref, inject, watch, nextTick, computed } from 'vue'
  import dayjs from 'dayjs'
  import { MINING_PET_INFO } from './config'

  export default {
    name: 'pet-info',

    setup() {
      const isShowTip = ref(false)
      const petInfoTipElement = ref(null)
      const secDuration = ref(0)
      const petInfo = inject('petInfo')
      const showInfo = ref({})
      const time = computed(() => dayjs.duration(secDuration.value, 'seconds').format('HH:mm:ss'))
      watch(petInfo, () => {
        showPetInfo()
      })

      const showPetInfo = async () => {
        clearInterval(secondInterval.value)
        isShowTip.value = Math.random() < 0.5
        const statusInfo = MINING_PET_INFO.find(item => item.id === petInfo.value.status) ?? {}
        const tipsArray = statusInfo?.tips ?? []
        showInfo.value = {
          ...petInfo.value,
          title: statusInfo.title ?? '',
          tip: tipsArray.length > 0 ? tipsArray[Math.floor(Math.random() * tipsArray.length)] : '',
          tipCss: ''
        }
        if (tipsArray.length <= 0) isShowTip.value = false
        if (petInfo.value.status === 1) {
          getEndTimeSecond(petInfo.value.endTime)
        }

        nextTick(() => {
          showInfo.value.tipCss = 'mt-[-' + (petInfoTipElement.value?.clientHeight ?? 0) + 'px]'
        })
      }
      const secondInterval = ref(null)
      const getEndTimeSecond = endTime => {
        const sec = dayjs(endTime).diff(dayjs(), 'second')
        secDuration.value = sec < 0 ? 0 : sec
        // 每秒遞減
        secondInterval.value = setInterval(() => {
          secDuration.value--
          if (secDuration.value < 0) {
            petInfo.value.status = 2
            showPetInfo()
          }
        }, 1000)
      }

      return {
        petInfo,
        petInfoTipElement,
        isShowTip,
        showInfo,
        time
      }
    }
  }
</script>

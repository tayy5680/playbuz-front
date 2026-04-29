<template>
  <div class="complete__serial" :class="tw(['relative', 'w-full', 'mx-auto', 'text-[#707070]', 'text-center'])">
    <h3 :class="tw(['text-[20px]', 'mb-5'])">《{{ $t('如何於遊戲中啟用') }}》</h3>
    <div class="complete__serial__step" v-for="(item, index) of serialStep" :key="index" :class="tw(['text-left'])">
      <p :class="tw(['text-[14px]'])">Step{{ item.id }}.</p>
      <p>{{ item.id === 2 && gameData.gameName ? `${$t('開啟')} ${gameData.gameName}` : $t(item.label) }}</p>
      <div
        class="serial"
        v-if="item.id === 1"
        :class="tw(['flex', 'border', 'p-8px', 'border-violet', 'leading-6', 'rounded-full', 'mt-2'])"
      >
        <div class="serial__text" :class="tw(['px-2', 'mr-[70px]', 'w-full', 'text-white'])">
          {{ serialNumber }}
        </div>
        <div
          class="serial__text"
          :class="
            tw([
              'bg-depositBtnBg',
              'rounded-full',
              'cursor-pointer',
              'w-[70px]',
              'text-center',
              'text-[14px]',
              'absolute',
              'right-[10px]'
            ])
          "
          @click="clickCopy"
        >
          {{ $t('複製') }}
        </div>
      </div>
      <br />
    </div>
  </div>
</template>
<script>
  import { ref, computed } from 'vue'
  import { useNotice } from '@/utils/use-notice'

  export default {
    name: 'deposit-serial',

    props: {
      serial: {
        type: String,
        default: () => ''
      },
      gameData: {
        type: Object,
        default: () => {}
      }
    },

    setup(props) {
      const serialNumber = computed(() => props.serial)
      const serialStep = ref([
        { id: 1, label: '請複製以下序號' },
        { id: 2, label: '開啟遊戲' },
        { id: 3, label: '於遊戲內的序號區貼上序號，兌換完成！' }
      ])

      const clickCopy = () => {
        navigator.clipboard
          .writeText(serialNumber.value)
          .then(() => {
            useNotice({ type: 'success', message: '複製成功', allowDuplicate: true })
          })
          .catch(() => {
            useNotice({ type: 'error', message: '複製失敗', allowDuplicate: true })
          })
      }

      return {
        serialNumber,
        serialStep,
        clickCopy
      }
    }
  }
</script>

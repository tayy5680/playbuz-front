<template>
  <div class="event-switch__wrap" :class="tw(['mx-10px', 'relative', 'w-[580px]', 'max-w-[90svw]'])">
    <div class="event-switch__container" :class="tw(['bg-[#000]', 'py-10px', 'rounded-10px'])">
      <div class="event-switch__list" ref="menuEle" :class="tw(['flex', 'justify-around', 'text-16px'])">
        <div
          class="menu__item"
          v-for="item of list"
          v-audio="'headerMenu'"
          :key="item.id"
          :class="
            tw([
              'relative',
              'cursor-pointer',
              'transition-colors',
              activeID === item.id ? 'font-bold text-20px md:text-18px' : 'text-18px md:text-16px',
              activeID === item.id ? 'text-white' : 'text-footerTipsText',
              'flex',
              'items-center'
            ])
          "
          @click="action(item.id)"
        >
          <span>{{ $t(item.label) }}</span>
          <div class="dot" v-if="item.dot" :class="tw(['absolute', 'top-0', 'right-[-25px]'])">
            <viewDot />
          </div>
        </div>
      </div>
      <div
        class="menu__line"
        ref="lineEle"
        :class="
          tw(['absolute', 'left-0', 'bottom-0', 'h-4px', 'w-24px', 'bg-menuLine', 'transition-all', 'rounded-full'])
        "
      />
    </div>
  </div>
</template>

<script>
  import { computed, inject, ref, watch, nextTick, onMounted } from 'vue'
  import store from '@/store'

  import viewDot from '@/components/ui/dot'

  export default {
    name: 'view-switch',

    components: {
      viewDot
    },

    setup() {
      const activeID = ref(null)
      const menuEle = ref(null)
      const lineEle = ref(null)

      const eventList = inject('eventList')

      const list = computed(() => {
        if (!eventList.value) return []

        // TODO: 礦寵空投關係API修正整個架構，後續有扭蛋等相關活動時修改紅點提示判斷。
        return eventList.value.map((item, index) => {
          return {
            id: item.id,
            label: item.switch?.label,
            dot: !store.getters['event/isSignReceive']
          }
        })
      })

      watch(activeID, () => {
        setActiveLine()
      })

      watch(list, () => {
        setActiveLine()
      })

      onMounted(() => {
        setActiveLine()
      })

      const setActiveLine = () => {
        nextTick(() => {
          const index = list.value.findIndex(item => item.id === activeID.value)
          const ele = menuEle.value?.children[index] ?? menuEle.value?.children[0]
          if (!ele) return false

          lineEle.value.style.left = `${ele.offsetLeft + (ele.offsetWidth - lineEle.value.offsetWidth) / 2}px`
        })
      }

      const action = id => {
        activeID.value = id
        store.dispatch('event/setSpecify', id)
      }

      const init = async () => {
        // todo: 因渲染流程在前面已完成nextTick有可能被直接跳過，先暫時使用setTimeout
        await new Promise(resolve => setTimeout(resolve, 200))
        const target = list.value?.[0]?.id ?? 0
        action(target)
      }

      init()

      return {
        menuEle,
        lineEle,
        list,
        activeID,
        // fn
        action
      }
    }
  }
</script>

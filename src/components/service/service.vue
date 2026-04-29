<template>
  <div
    class="shortcut__wrap"
    ref="element"
    @touchstart.passive="touchStart"
    @touchmove.passive="touchMove"
    @touchend="touchEnd"
    @click="
      () => {
        service.length === 1 ? goLink(service[0]) : (displayPopup = true)
      }
    "
    :class="
      tw([
        !animationStatus ? 'transition-all duration-300 ease-in-out' : '',
        'cursor-pointer',
        'fixed',
        'w-[50px]',
        'h-[50px]',
        'md:w-[50px]',
        'md:h-[50px]',
        'bottom-[35svh]',
        'md:bottom-250px',
        'right-0',
        'z-10',
        'flex',
        'items-end',
        'justify-center'
      ])
    "
  >
    <div ref="animation">
      <div v-if="service.length === 1">
        <img :src="service[0].alt === 'LiveChat' ? '/img/icons/i_livechat1.svg' : service[0].img" />
      </div>
      <div v-else>
        <img src="/img/icons/i_service.svg" />
      </div>
    </div>
    <viewPopup
      v-if="displayPopup"
      @close="
        () => {
          displayPopup = false
        }
      "
    >
      <template v-slot:context>
        <div class="info" :class="tw(['flex', 'flex-col', 'justify-evenly', 'h-[200px]'])">
          <div
            v-for="item in service"
            :key="item"
            @click="goLink(item)"
            :class="tw(['flex', 'items-center', 'cursor-pointer'])"
          >
            <el-image
              v-if="item.isShow"
              lazy
              :src="item.img"
              :alt="item.alt"
              :class="tw(['min-w-[50px]', 'w-[50px]', 'mr-15px'])"
            >
            </el-image>
            {{ item.alt }}
          </div>
        </div>
      </template>
    </viewPopup>
  </div>
</template>

<script>
  import { onMounted, ref, computed, watch, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import store from '@/store'
  import { debounce } from 'lodash'
  import { deviceInfo } from '@/utils/ua'
  import viewPopup from '@/components/popup'
  import { SITE } from '@/configs'

  export default {
    name: 'chat',
    components: {
      viewPopup
    },

    setup() {
      const petInfo = ref({})

      /**
       * @param { number } eleSize 圖示尺寸
       * @param { number } eleHalfSize 圖示尺寸(一半)
       * @param { number } heightDivide 下方邊界位置
       * @param { boolean } actionStatus 判定拖動或點擊狀態
       * @param { boolean } animationStatus 動畫狀態
       * @param { array } originPosition 紀錄點擊初始位置
       * @param { number } touchKey 綁定touch事件中的第一個觸控
       */

      const router = useRouter()
      const service = computed(() => {
        return linkData.filter(item => item.isShow === true)
      })
      const linkData = reactive([
        {
          img: `/img/icons/i_${SITE.contact.icon}.svg`,
          src: SITE.contact.url,
          alt: SITE.contact.name,
          isShow: true
        },
        {
          img: '/img/icons/i_fblogo.svg',
          src: 'https://www.facebook.com/GodPlayGameFun',
          alt: 'Facebook',
          isShow: false
        }
      ])
      const displayPopup = ref(false)

      const goLink = obj => {
        if (obj?.router) router.push(obj.router)
        else if (obj?.src) window.open(obj.src, '_blank')
      }

      const element = ref(null)
      const animation = ref(null)
      let outStatus = false
      let eleSize = 0
      let eleHalfSize = 0
      const heightDivide = window.innerHeight * 0.86
      onMounted(() => {
        eleSize = element.value.clientWidth
        eleHalfSize = element.value.clientWidth / 2
        // 處理ios瀏覽器滑動換頁時跑版，在滑動換頁時滑到圖示前會先經過外層元素，因此監聽外層元素touch事件可阻止圖示作用
        if (deviceInfo().includes('iOS')) {
          element.value.previousElementSibling.addEventListener('touchstart', () => {
            outStatus = true
          })
          element.value.previousElementSibling.addEventListener('touchend', () => {
            outStatus = false
          })
        }
      })

      const isMobile = computed(() => store.getters['platform/isMobile'])
      watch(isMobile, () => {
        element.value.style.left = ''
        element.value.style.top = ''
      })

      const animationStatus = ref(false)
      let actionStatus = false
      let originPosition = []
      let touchKey = null
      const touchStart = e => {
        if (outStatus) return false
        if (!touchKey && touchKey !== 0) touchKey = e.changedTouches[0].identifier
        if (multiStatus(e)) return false
        originPosition = [element.value.style.top, element.value.style.left]
        changeStatus()
        actionStatus = false
        animationStatus.value = true
      }
      const touchMove = e => {
        // 減去eleHalfSize 令滑動時圖片置中
        if (multiStatus(e)) return false
        element.value.style.top = e.changedTouches[0].clientY - eleHalfSize + 'px'
        element.value.style.left = e.changedTouches[0].clientX - eleHalfSize + 'px'
      }
      // 設定手機滑動結束時需令圖示移動到邊界
      const touchEnd = e => {
        if (multiStatus(e)) return false
        if (!actionStatus) {
          element.value.style.top = originPosition[0]
          element.value.style.left = originPosition[1]
        } else {
          changePostion(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
          actionStatus = false
          animationStatus.value = false
        }
        touchKey = null
      }

      const multiStatus = e => {
        let target = true
        e.changedTouches.forEach(item => {
          if (item.identifier === touchKey) target = false
        })
        return target
      }

      // 判斷圖示隨垂直或水平方向固定
      const changePostion = (x, y) => {
        let endXPosition = 0
        let endYPosition = 0
        if (y < 120 || y > heightDivide - eleHalfSize) {
          // x 判斷放開時是左右方 x - eleHalfSize 圖片的位置才會置中
          // y 判斷放開時是上下方 上方為top:50px 下方為top:heightDivide - eleSize 須減去eleSize 才不會被footer覆蓋
          endXPosition =
            x < eleHalfSize ? 0 : x > window.innerWidth - eleHalfSize ? window.innerWidth - eleSize : x - eleHalfSize
          endYPosition = window.innerHeight / 2 > y ? 100 : heightDivide - eleSize
        } else {
          // x軸 判斷放開時是左右方 左方為left:-10px 右方為left:window.innerWidth - eleSize * 0.75同right:[-(圖片1/4)px]
          // y軸 須減去eleHalfSize圖片的位置才會致中
          endXPosition = window.innerWidth / 2 > x ? 0 : window.innerWidth - eleSize
          endYPosition = y - eleHalfSize
        }
        element.value.style.left = endXPosition + 'px'
        element.value.style.top = endYPosition + 'px'
      }

      const changeStatus = debounce(() => {
        actionStatus = true
      }, 200)

      return {
        element,
        animation,
        animationStatus,
        petInfo,
        service,
        displayPopup,
        // fn
        touchStart,
        touchMove,
        touchEnd,
        goLink
      }
    }
  }
</script>

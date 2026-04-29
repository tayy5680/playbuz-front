<template>
  <popView
    class="frame__wrap"
    @close="close"
    :viewWidth="'850px'"
    :viewHeight="'640px'"
  >
    <template #container>
      <div class="frame__containet">
        <viewMenu />
        <div
          class="frame__context"
          :class="tw([
            'flex-1',
            'py-36px',
            'md:pt-0',
          ])"
        >
          <div
            class="frame__list"
            v-if="formatAvatarFrameRepositoryList.length"
            :class="tw([
              'grid',
              isMobile ? 'grid-cols-3' : 'grid-cols-4',
              isMobile ? 'gap-x-10px gap-y-50px' : 'gap-40px',
              'pb-20px',
            ])"
          >
            <div
              class="frame__item"
              v-for="item of formatAvatarFrameRepositoryList"
              :key="item.id"
              :class="tw([
                [0, 1].includes(item.status) ? 'cursor-pointer' : 'cursor-not-allowed',
                'relative',
                'flex',
                'flex-col',
                'items-center',
                'group',
              ])"
              @click="action(item)"
            >
              <div
                class="frame__picture"
                :class="tw([
                  [0, 1].includes(item.status) ? 'translate-0 group-hover:-translate-y-10px' : 'opacity-20',
                  transitionBase,
                  'max-w-full',
                ])"
              >
                <transition name="fade">
                  <img
                    class="frame__profile"
                    v-if="[0].includes(item.status)"
                    :class="tw([
                      'w-56px',
                      'h-56px',
                      'md:w-90px',
                      'md:h-90px',
                      'absolute',
                      'top-1/2',
                      'left-1/2',
                      '-translate-1/2',
                      'rounded-full',
                      'z--1',
                      'object-cover',
                    ])"
                    :src="infoImageUrl"/>
                </transition>
                <el-image
                  class="frame__img"
                  :src="item.img"
                  :class="tw([
                    'w-100px',
                    'md:w-150px',
                    'h-100px',
                    'md:h-150px',
                    'max-w-full',
                  ])"
                  fit="contain"
                  lazy
                >
                  <template #placeholder>
                    <el-skeleton-item
                      variant="image"
                      style="height: 100%;"
                    >
                    </el-skeleton-item>
                  </template>
                </el-image>
              </div>
              <div
                class="frame__label"
                :class="tw([
                  'absolute',
                  '-bottom-px',
                  'left-1/2',
                  '-translate-x-1/2',
                  'translate-y-0',
                  'rounded-full',
                  'text-[16px]',
                  'md:text-18px',
                  'py-4px',
                  'px-12px',
                  'leading-none',
                  'whitespace-nowrap',
                  setLabelStyle(item.status),
                ])"
              >
                {{ choseMenuID === 3 ? item.count >= item.limit ? $t(item.label) : `${item.count} / ${item.limit}` : $t(item.label) }}
              </div>
            </div>
          </div>
          <div
            class="frame__non"
            v-else-if="!loading"
            :class="tw([
              'text-[center]',
              'py-18px',
            ])"
          >
            {{ $t('您目前沒有任何頭像框') }}
          </div>
        </div>
      </div>
    </template>
  </popView>
</template>

<script>
import { ref, provide, computed, reactive } from 'vue'
import store from '@/store'

import viewMenu from './menu'
import popView from '@/components/ui/pop-view'

import { getAvatarFrameRepository, getUpdateAvatarFrame, getMemberInfo } from '@/api/member'
import { apply } from 'twind'

export default {
  name: 'frame',

  components: {
    viewMenu,
    popView,
  },

  emits: ['close'],

  setup (props, { emit }) {
    const isMobile = computed(() => store.getters['platform/isMobile'])
    const loading = ref(false)

    const menu = reactive([
      { id: 0, type: 1, label: 'VIP頭像框' },
      { id: 1, type: 0, label: '排行榜頭像框' },
      { id: 2, type: 0, label: '成就頭像框' },
      { id: 3, type: 2, label: '活動頭像框' },
    ])
    const formatMenu = computed(() => {
      if (!avatarFrameRepositoryList.value.length) return menu

      const target = avatarFrameRepositoryList.value
        .map(item => item.HeadPhotoFrameTypeID)
        .filter((cur, index, arr) => arr.indexOf(cur) !== index)
      return menu.reduce((acc, cur) => {
        if (!target.includes(cur.type)) return acc
        return acc.concat({
          ...cur,
        })
      }, [])
    })
    provide('menu', formatMenu)
    const choseMenuID = ref(0)
    provide('choseMenuID', choseMenuID)
    const chgMenuID = (id = 0) => {
      choseMenuID.value = id
    }
    provide('chgMenuID', chgMenuID)

    const avatarFrameRepositoryList = ref([])
    const formatAvatarFrameRepositoryList = computed(() => {
      if (!avatarFrameRepositoryList.value) return []

      const target = menu.find(item => item.id === choseMenuID.value)
      const statusList = {
        0: '使用中',
        1: '可使用',
        2: '不可使用',
        3: '已過期',
        4: '未獲得',
      }

      return avatarFrameRepositoryList.value
        .reduce((acc, cur) => {
          if (cur.HeadPhotoFrameTypeID !== target.type) return acc

          const item = {}
          item.id = cur.HeadPhotoFrameID
          item.img = cur.HeadPhotoFramePath
          item.status = cur.StatusID
          item.label = statusList[cur.StatusID]
          item.count = cur.FragmentsCount
          item.limit = cur.FragmentsMixCount

          return acc.concat(item)
        }, [])
    })

    const setLabelStyle = (status) => {
      switch (status) {
        case 0:
          return apply`bg-frameUse`
        case 1:
          return apply`bg-deepBlackPurple text-frameHasText opacity-90`
        case 2:
          return apply`border border-giftBtnInactive bg-navBgHover text-frameHasText opacity-90`
        case 3:
          return apply`border border-giftBtnInactive bg-navBgHover text-frameHasText opacity-90`
        case 4:
          return apply`border border-giftBtnInactive bg-navBgHover text-frameHasText opacity-90`
        default:
          return ''
      }
    }

    const action = async (obj) => {
      if (obj.status !== 1 || loading.value) return false

      loading.value = true

      await getUpdateAvatarFrame({ body: { headPhotoFrameID: obj.id } })
        .catch(err => { console.warn(err) })
      store.dispatch('member/logIn')
      getAvatarFrameRepository()
        .then(res => {
          avatarFrameRepositoryList.value = res.Data
        })
      loading.value = false
    }

    const infoImageUrl = ref('')
    const init = async () => {
      loading.value = true
      await Promise.all([getAvatarFrameRepository(), getMemberInfo()])
        .then(res => {
          avatarFrameRepositoryList.value = res[0].Data
          infoImageUrl.value = res[1].Data?.Photo?.Url ?? ''
        })
        .catch(err => { console.warn(err) })
      loading.value = false
    }

    const setStyleMaskImage = (url) => {
      return `url(${url}) no-repeat center /contain`
    }

    const close = () => {
      emit('close')
    }

    init()

    return {
      action,
      setLabelStyle,
      formatAvatarFrameRepositoryList,
      loading,
      infoImageUrl,
      isMobile,
      setStyleMaskImage,
      close,
      choseMenuID,
    }
  },
}
</script>

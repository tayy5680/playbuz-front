<template>
  <div class="edit__wrap container-mo-main" :class="tw(['md:px-0'])">
    <viewPath />
    <div class="edit__container">
      <div class="edit_list" :class="tw(['mb-10', 'grid', 'grid-cols-1', 'gap-3', 'tablet:grid-cols-2', 'text-white'])">
        <div
          class="edit__item"
          v-for="item in formatList"
          :key="item.id"
          :class="
            tw([
              'flex',
              'items-center',
              'flex-wrap',
              'py-12px',
              'md:py-16px',
              'px-16px',
              'md:px-26px',
              'bg-popupBg',
              'rounded-10px',
              'md:rounded-20px'
            ])
          "
        >
          <img class="edit__icon" :src="item.img" :class="tw(['mr-[20px]', 'md:mr-16px', 'w-[36px]', 'md:w-[40px]'])" />
          <div class="edit__label" :class="tw(['flex-1'])">
            <div class="edit__title" :class="tw(['text-violet', 'text-[12px]', 'tracking-wide'])">
              {{ item.sub ? $t(item.sub) : '' }}
            </div>
            <div
              class="edit__sub"
              :class="tw(['break-all', 'text-white', 'text-[18px]', 'leading-none', 'tracking-wide'])"
            >
              {{ item.id === 'photo' || item.title === UNKNOWN_USER_NAME ? $t(item.title) : item.title }}
            </div>
          </div>
          <div class="edit__action" v-if="item.buttonLabel">
            <div
              class="edit__button"
              v-if="item.buttonLabel !== '已驗證'"
              v-loading="item.loading"
              @click="action(item.id)"
              :class="
                tw([
                  'relative',
                  item.loading ? 'border-0' : 'border-1',
                  'px-[20px]',
                  'py-[4px]',
                  'rounded-full',
                  'text-[14px]',
                  'md:text-[12px]',
                  'tracking-wide',
                  'overflow-hidden',
                  transitionBase,
                  isSameArrayValue(item.disabled, infoRoles) || item.loading
                    ? 'border-[#66349a] bg-[#66349a] text-[#afa0be] cursor-not-allowed'
                    : [
                        'cursor-pointer',
                        item.id === 'phone' || item.id === 'email'
                          ? 'border-[#00DFB9] text-[#00DFB9] hover:text-[#67ffe5] hover:border-[#67ffe5]'
                          : 'border-violet text-violet hover:bg-sort hover:text-white hover:border-sort'
                      ]
                ])
              "
            >
              {{ $t(item.buttonLabel) }}
            </div>
            <!-- 手機號碼特例樣式 -->
            <div class="edit__message" v-else :class="tw(['flex', 'items-center'])">
              <img class="icon" :src="require('./images/i_tick_act.svg')" :class="tw(['w-[20px]', 'h-[20px]'])" />
              <span :class="tw(['text-[14px]', 'md:text-[12px]', 'text-[#00DFB9]', 'ml-8px'])">
                {{ $t('已驗證') }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <teleportItem>
        <renameView v-if="renameDisplay" @close="renameDisplay = false" />
      </teleportItem>
      <teleportItem>
        <shareView v-if="shareDisplay" @close="shareDisplay = false" />
      </teleportItem>
    </div>
  </div>
</template>

<script>
  import { computed, reactive, ref } from 'vue'
  import store from '@/store'

  import renameView from './rename'
  import shareView from './share'
  import teleportItem from '@/components/ui/teleport-item'
  import { useRoute } from 'vue-router'

  import { uploadAvatar } from '@/api/member'
  import { useNotice } from '@/utils/use-notice'
  import viewPath from '../path'
  import { event } from 'vue-gtag-next'
  import introduce from '@/utils/introduce'

  import { useI18n } from 'vue-i18n'
  import { UNKNOWN_USER_NAME, lineUrl, yahooUrl, appleUrl } from '@/configs'

  export default {
    name: 'center-edit',

    components: {
      viewPath,
      renameView,
      shareView,
      teleportItem
    },

    setup() {
      const { t } = useI18n()
      const invite = introduce()
      const route = useRoute()

      const info = computed(() => store.state.member.info)
      const infoRoles = computed(() => info.value?.Roles || [])
      const infoPhone = computed(() => info.value?.PhoneNumber || '')
      const infoEmail = computed(() => info.value?.Email || '')
      const infoLine = computed(() => info.value?.LineId || '')
      const infoYahoo = computed(() => info.value?.YahooId || '')
      const infoApple = computed(() => info.value?.AppleId || '')

      const renameDisplay = ref(false)
      const shareDisplay = ref(false)

      const input = ref(null)
      const action = async id => {
        const index = list.findIndex(item => item.id === id)

        if (list[index].loading) return false
        // 過濾掉身份不可用的功能。
        if (isSameArrayValue(list[index].disabled, infoRoles.value)) return false

        switch (list[index].id) {
          case 'rename':
            event('member_edit_click', { click: 'nickname' })
            renameDisplay.value = true
            break
          case 'photo':
            try {
              input.value = document.createElement('input')
              input.value.type = 'file'
              input.value.accept = 'image/*'
              input.value.onchange = async file => {
                list[index].loading = true
                event('member_edit_click', { click: 'avatar' })
                const fileData = file.target.files[0]
                const fileDataSize = Math.ceil(fileData.size / 1000000)
                const fileDataType = fileData.type.substring(fileData.type.lastIndexOf('/') + 1)
                const acceptExt = ['jpg', 'jpeg', 'png', 'gif']
                const acceptSize = 5
                if (!acceptExt.includes(fileDataType)) {
                  list[index].loading = false
                  return useNotice({
                    type: 'error',
                    message: t('只接受{files}檔案格式', { files: acceptExt.join(', ') }),
                    isI18n: false
                  })
                }
                if (fileDataSize > acceptSize) {
                  list[index].loading = false
                  return useNotice({ type: 'error', message: t('超過{size}MB', { size: acceptSize }), isI18n: false })
                }
                await uploadAvatar(fileData)
                await store.dispatch('member/logIn')
                useNotice({ type: 'success', message: '上傳成功' })
                list[index].loading = false
              }
              input.value.click()
            } catch (err) {
              useNotice({ type: 'error', message: `${t('上傳失敗')}: ${err}`, isI18n: false })
              list[index].loading = false
            }
            break
          case 'invite':
            event('member_edit_click', { click: 'invite_code' })
            shareDisplay.value = true
            break
          case 'phone':
            event('member_edit_click', { click: 'phone' })
            store.commit('sign/UPDATE_DRAWER_STEP', 'bindAccount')
            store.commit('sign/UPDATE_DRAWER_STATE', true)
            store.commit('sign/UPDATE_DRAWER_BIND_TYPE', 'phoneNumber')
            break
          case 'email':
            event('member_edit_click', { click: 'email' })
            store.commit('sign/UPDATE_DRAWER_STEP', 'bindAccount')
            store.commit('sign/UPDATE_DRAWER_STATE', true)
            store.commit('sign/UPDATE_DRAWER_BIND_TYPE', 'email')
            break
          case 'line':
            event('member_edit_click', { click: 'line' })
            sessionStorage.setItem(
              'lineLoginBackPage',
              JSON.stringify({
                returnRoute: route.name,
                routeParams: route.params,
                query: route.query
              })
            )
            sessionStorage.setItem('lineLoginType', 'edit')
            window.location.assign(lineUrl())
            break
          case 'yahoo':
            event('member_edit_click', { click: 'yahoo' })
            sessionStorage.setItem(
              'yahooLoginBackPage',
              JSON.stringify({
                returnRoute: route.name,
                routeParams: route.params,
                query: route.query
              })
            )
            sessionStorage.setItem('yahooLoginType', 'edit')
            window.location.assign(yahooUrl())
            break
          case 'apple':
            event('member_edit_click', { click: 'apple' })
            sessionStorage.setItem(
              'appleLoginBackPage',
              JSON.stringify({
                returnRoute: route.name,
                routeParams: route.params,
                query: route.query
              })
            )
            sessionStorage.setItem('appleLoginType', 'edit')
            window.location.assign(appleUrl())
            break
        }
      }

      const list = reactive([
        {
          id: 'rename',
          img: require('./images/i_mm_name.svg'),
          sub: '名字',
          title: '',
          buttonLabel: '修改暱稱',
          display: ['Agent', 'Normal', 'Guest'],
          disabled: ['Guest'],
          show: false
        },
        {
          id: 'photo',
          img: require('./images/i_mm_photo.svg'),
          sub: '',
          title: '修改頭像',
          buttonLabel: '選擇',
          display: ['Agent', 'Normal'],
          disabled: [],
          loading: false
          // }, {
          //   id: 'invite',
          //   img: 'i_mm_invite.svg',
          //   sub: '我的邀請碼',
          //   title: '',
          //   buttonLabel: '分享邀請碼',
          //   display: ['Agent', 'Normal'],
          //   disabled: [],
          //   show: false,
        },
        {
          id: 'phone',
          img: require('./images/i_mm_phone.svg'),
          sub: '手機號碼',
          title: '-',
          buttonLabel: '已驗證',
          display: ['Agent', 'Normal', 'Guest'],
          disabled: []
        },
        {
          id: 'email',
          img: require('./images/i_email.svg'),
          sub: 'E-mail信箱',
          title: '-',
          buttonLabel: '已驗證',
          display: ['Agent', 'Normal', 'Guest'],
          disabled: []
        },
        {
          id: 'line',
          img: require('./images/i_line.svg'),
          sub: 'Line',
          title: '-',
          buttonLabel: '已驗證',
          display: ['Agent', 'Normal', 'Guest'],
          disabled: []
        },
        {
          id: 'apple',
          img: require('./images/i_apple.svg'),
          sub: 'Apple',
          title: '-',
          buttonLabel: '已驗證',
          display: ['Agent', 'Normal', 'Guest'],
          disabled: []
        }
      ])

      const formatList = computed(() => {
        return list
          .map(item => {
            switch (item.id) {
              case 'rename':
                item.title = info.value?.NickName || ''
                break
              case 'invite':
                item.title = invite.code || ''
                break
              case 'phone':
                item.title = info.value?.PhoneNumber || '-'
                item.buttonLabel = infoPhone.value ? '已驗證' : '手機驗證'
                break
              case 'email':
                item.title = info.value?.Email || '-'
                item.buttonLabel = infoEmail.value ? '已驗證' : '信箱驗證'
                break
              case 'line':
                item.title = info.value?.LineId || '-'
                item.buttonLabel = infoLine.value ? '已驗證' : 'Line驗證'
                break
              case 'yahoo':
                item.title = info.value?.YahooId || '-'
                item.buttonLabel = infoYahoo.value ? '已驗證' : 'Yahoo驗證'
                break
              case 'apple':
                item.title = info.value?.AppleId || '-'
                item.buttonLabel = infoApple.value ? '已驗證' : 'Apple驗證'
                break
            }
            return item
          })
          .filter(items => isSameArrayValue(items.display, infoRoles.value))
      })

      const isSameArrayValue = (arr1, arr2) => {
        if (!arr1.length || !arr2.length) return false

        const target = [...arr1, ...arr2]

        return new Set(target).size !== target.length
      }

      return {
        formatList,
        infoRoles,
        renameDisplay,
        shareDisplay,
        UNKNOWN_USER_NAME,
        // fn
        action,
        isSameArrayValue
      }
    }
  }
</script>

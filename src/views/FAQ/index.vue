<template>
  <div class="faq-wrap">
    <div class="search-container container-mo-main">
      <div class="label">
        {{ $t(SITE_NAME) }} / <b>{{ $t('常見問題') }}</b>
      </div>
      <ViewMobileSearchResult v-if="!isMobile" class="pc-search" :faqContent="FAQ_CONTENT" />
    </div>
    <div class="faq-container container-mo-main">
      <ViewMobileSearchResult v-if="isMobile" :faqContent="FAQ_CONTENT" />
      <el-tabs
        v-model="activeName"
        class="fa-tabs"
        @tab-click="action"
        id="faqTabsId"
        :class="[{ scrollMaxLeft: scrollStatus.scrollMaxLeft }, { scrollMaxRight: scrollStatus.scrollMaxRight }]"
      >
        <el-tab-pane v-for="(item, index) in LIST_FAQ" :key="index" :name="item.name" :label="$t(item.label)">
          <!-- 電腦版本FAQ -->
          <div v-if="!isMobile" class="pc-tabs">
            <div class="faq-left">
              <div
                v-for="(option, optionIndex) in FAQ_CONTENT?.[item.name] ?? []"
                :key="optionIndex"
                :class="{ 'active-option': activeNameItemIndex === optionIndex }"
                @click="activeNameItemIndex = optionIndex"
              >
                <div class="number">
                  <span>{{ optionIndex + 1 }}</span>
                </div>
                <div>{{ option.title }}</div>
              </div>
            </div>
            <div class="faq-right">
              <Transition @before-enter="beforeEnter" @enter="enter" :css="false">
                <div v-if="FAQ_CONTENT?.[item.name]?.[activeNameItemIndex]" :key="activeNameItemIndex">
                  <div class="inner-title">
                    {{ FAQ_CONTENT[item.name][activeNameItemIndex].subTitle }}
                  </div>
                  <div class="inner" v-html="FAQ_CONTENT[item.name][activeNameItemIndex].innerHTML"></div>
                </div>
              </Transition>
            </div>
          </div>
          <!-- 手機版本FAQ -->
          <div v-else class="mo-collapse">
            <Transition @before-enter="beforeEnter" @enter="enter" :css="false">
              <el-collapse v-model="collapseOptionIndex" accordion :key="activeName">
                <el-collapse-item
                  v-for="(option, optionIndex) in FAQ_CONTENT?.[item.name] ?? []"
                  :key="optionIndex"
                  :name="optionIndex"
                  @click="activeNameItemIndex = optionIndex"
                  :id="`${activeName}-${optionIndex}`"
                >
                  <template #title>
                    <div class="number">
                      <span>{{ optionIndex + 1 }}</span>
                    </div>
                    <div>{{ option.title }}</div>
                  </template>
                  <div class="inner-title">{{ option.subTitle }}</div>
                  <div class="inner" v-html="option.innerHTML"></div>
                </el-collapse-item>
              </el-collapse>
            </Transition>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
  import ViewMobileSearchResult from './mobileSearchResult.vue'
  import { ref, computed, onMounted, nextTick, provide, watch } from 'vue'
  import { LIST_FAQ, I18N_FAQ } from './i18n/index.js'
  import { useRoute, useRouter } from 'vue-router'
  import { SITE } from '@/configs'
  import store from '@/store'
  import { useI18n } from 'vue-i18n'

  export default {
    name: 'view-faq',
    components: {
      ViewMobileSearchResult
    },

    setup() {
      const { t } = useI18n()
      const route = useRoute()
      const router = useRouter()
      const SITE_NAME = computed(() => t(process.env.VUE_APP_SITE_NAME))
      const isMobile = computed(() => store.getters['platform/isMobile'])
      const lang = computed(() => store.state.member.languageCode)
      const FAQ_CONTENT = computed(() => {
        let jsonString = JSON.stringify(I18N_FAQ?.[lang.value] ?? I18N_FAQ['zh-TW'])
        jsonString = jsonString.replaceAll('SITE_NAME', SITE_NAME.value)
        jsonString = jsonString.replaceAll('SITE_MAIL', SITE.contact.mail)
        jsonString = jsonString.replaceAll('SITE_CONTACT_NAME', SITE.contact.name)
        return JSON.parse(jsonString)
      })
      const activeName = ref('')
      provide('activeName', activeName)
      watch(activeName, val => {
        if (val === route.params.faqTypeName) return
        router.replace({
          name: route.name,
          params: {
            ...route.params,
            faqTypeName: val
          }
        })
      })
      const activeNameItemIndex = ref(0)
      provide('activeNameItemIndex', activeNameItemIndex)
      const keyword = ref('')
      const collapseOptionIndex = ref(-1)
      provide('collapseOptionIndex', collapseOptionIndex)
      const isMobileSearchVisible = ref(false)
      const action = () => {
        activeNameItemIndex.value = 0
        collapseOptionIndex.value = -1
      }

      const scrollStatus = ref({
        scrollMaxLeft: true,
        scrollMaxRight: false
      })

      // 顯示tab左右滑動的ｃｓｓ效果
      onMounted(() => {
        activeName.value = route.params.faqTypeName || LIST_FAQ[0].name
        nextTick(() => {
          const faqTabsId = document.getElementById('faqTabsId')
          const scrollable = faqTabsId.querySelector('.el-tabs__nav-scroll')
          scrollable.addEventListener('scroll', () => {
            const scrollLeft = scrollable.scrollLeft
            const scrollWidth = scrollable.scrollWidth
            const clientWidth = scrollable.clientWidth

            if (scrollLeft === 0) {
              console.log('已滾動到最左邊')
              scrollStatus.value.scrollMaxLeft = true
            } else if (scrollLeft + clientWidth >= scrollWidth) {
              console.log('已滾動到最右邊')
              scrollStatus.value.scrollMaxRight = true
            } else {
              console.log('正在中間滾動中')
              scrollStatus.value.scrollMaxLeft = false
              scrollStatus.value.scrollMaxRight = false
            }
          })
        })
      })

      // Transition 效果
      const beforeEnter = el => {
        el.style.opacity = '1'
      }
      const enter = (el, done) => {
        el.style.transition = 'opacity 0.3s'
        el.style.opacity = '0'
        setTimeout(() => {
          el.style.opacity = '1'
          done()
        }, 200)
      }
      watch(
        () => route.params.faqTypeName,
        newVal => {
          if (newVal !== activeName.value) activeName.value = newVal ?? LIST_FAQ[0].name
        }
      )

      return {
        SITE_NAME,
        lang,
        isMobile,
        keyword,
        LIST_FAQ,
        activeName,
        action,
        FAQ_CONTENT,
        activeNameItemIndex,
        beforeEnter,
        enter,
        scrollStatus,
        collapseOptionIndex,
        isMobileSearchVisible
      }
    }
  }
</script>
<style lang="scss" scoped>
  .faq-wrap {
    .faq-container {
      background-color: #edf0f4;
      box-shadow: -2px 2px 6px #00000030;
      border-radius: 10px;
      margin: 20px 0;
      transition: all 0.2s ease;

      :deep(.el-tabs) {
        .el-tabs__header {
          margin: 0;
          user-select: none;
          .el-tabs__item {
            padding: 0 0 0 20px;
          }
          .el-tabs__item:last-child {
            padding: 0 20px;
          }
          @media (min-width: 768px) {
            .el-tabs__item:last-child {
              padding-right: 50px;
            }
          }
          .el-tabs__nav-scroll {
            overflow-x: scroll;
            padding: 0 20px;
          }
          .el-tabs__active-bar {
            height: 3px;
            border-radius: 5px;
          }
          .el-tabs__nav-wrap::after {
            height: 1px;
            background-color: #b8c4d9;
            margin-bottom: 1px;
          }

          .el-tabs__nav-prev,
          .el-tabs__nav-next {
            height: 100%;
            z-index: 10;
            i {
              padding: 0 10px;
            }
          }
          .el-tabs__nav-prev {
            background: linear-gradient(to right, #f6f6f6, #f6f6f600);
          }
          .el-tabs__nav-next {
            background: linear-gradient(to left, #f6f6f6, #f6f6f600);
            text-align: right;
          }
        }
        &.scrollMaxLeft .el-tabs__nav-prev,
        &.scrollMaxRight .el-tabs__nav-next {
          background: none;
        }
        .el-tabs__content {
          .el-tab-pane {
            width: 100%;
            font-size: 14px;
            .pc-tabs {
              display: flex;

              .faq-left {
                padding: 15px 10px;
                max-width: 200px;
                width: 100%;
                border-right: 1px solid #b8c4d9;
                min-height: 60svh;

                > div {
                  padding: 5px 10px;
                  border-radius: 5px;
                  color: #5d6d8b;
                  transition: all 0.2s ease;
                  cursor: pointer;
                  display: flex;
                  align-items: flex-start;

                  .number {
                    display: flex;
                    height: 20px;
                    align-items: center;
                    margin-right: 10px;

                    span {
                      background-color: #8492aa;
                      color: #cad6ea;
                      width: 18px;
                      height: 18px;
                      line-height: 18px;
                      font-size: 10px;
                      font-weight: bold;
                      text-align: center;
                      border-radius: 5px;
                    }
                  }

                  &:hover {
                    color: white;
                    background-color: var(--el-color-primary-light-3);
                  }
                  &.active-option {
                    color: white;
                    background-color: var(--el-color-primary);

                    .number span {
                      background-color: #b4c9ee;
                      color: white;
                    }
                  }

                  img {
                    padding-right: 10px;
                  }
                }
              }
              .faq-right {
                flex-grow: 1;
                padding: 15px 20px;

                &::after {
                  content: '';
                  position: absolute;
                  background-image: url('./images/bg.png');
                  background-repeat: no-repeat;
                  bottom: 0;
                  right: 0;
                  width: 200px;
                  height: 320px;
                  background-size: contain;
                  background-position: left bottom;
                }
              }
            }
            .mo-collapse {
              width: 100%;
              .el-collapse {
                background-color: #edeff4;
                border-radius: 10px;
                overflow: hidden;
                min-height: 50svh;

                .el-collapse-item {
                  border-bottom: 1px solid #b8c4d9;
                  .el-collapse-item__header {
                    background: none;
                    padding: 0 15px;
                    color: #5d6d8b;

                    .number {
                      span {
                        background-color: #8492aa;
                        color: #cad6ea;
                        width: 18px;
                        height: 18px;
                        line-height: 18px;
                        font-size: 10px;
                        font-weight: bold;
                        text-align: center;
                        border-radius: 5px;
                        display: inline-block;
                        margin-right: 10px;
                        top: -1px;
                        position: relative;
                      }
                    }

                    img {
                      padding-right: 10px;
                    }
                    > div {
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                    }

                    .el-collapse-item__arrow {
                      display: none;
                    }
                  }
                  .el-collapse-item__wrap {
                    background: none;
                    padding: 0 15px;
                  }

                  &.is-active {
                    .el-collapse-item__header {
                      > div {
                        color: #7c7ed7;
                      }

                      .number span {
                        background-color: #b4c9ee;
                        color: white;
                      }
                    }
                  }
                }
              }
            }

            .pc-tabs,
            .mo-collapse {
              .inner-title {
                color: #5d6d8b;
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 10px;
              }
              .inner {
                color: #5d6d8b;

                ol {
                  list-style: auto;
                  padding-left: 20px;
                  margin: revert;
                }
                p {
                  margin-bottom: 15px;
                }
              }
            }
          }
        }
      }
    }
    .search-container {
      display: flex;
      align-items: center;
      .label {
        font-size: 16px;
        padding-right: 20px;
        flex-shrink: 0;
      }
      :deep(.el-input) {
        width: 100%;
        flex-grow: 1;
        .el-input__inner {
          font-size: 16px;
          border-radius: 50px;
          background-color: #dcdee2;
          padding-left: 40px;
          &::placeholder {
            color: #a7adba;
          }
        }
        .el-input__prefix {
          display: flex;
          width: 35px;
          align-items: center;
          padding-left: 10px;
          img {
            filter: invert(55%) sepia(29%) saturate(869%) hue-rotate(200deg) brightness(89%) contrast(88%);
          }
        }
      }
    }

    @media (max-width: 768px) {
      .search-container {
        padding: 0 30px;
        .el-input {
          display: none;
        }
      }
      .faq-container {
        background: none;
        box-shadow: none;
        :deep(.el-tabs) {
          .el-tabs__header {
            padding-left: 40px;

            .el-tabs__nav-scroll {
              padding: 0;
            }
          }
        }
      }
    }
  }
</style>

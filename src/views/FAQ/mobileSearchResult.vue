<template>
  <div class="faq-search-result-wrap" :class="isMobile ? 'mo-search' : 'pc-search'">
    <el-input :class="{ 'width-0': !isWidthFull }" v-model="keyword" :placeholder="$t('請輸入問題關鍵字')">
      <template #prefix>
        <img :src="require('./images/search.svg')" @click="isWidthFull = true" />
      </template>
      <template #suffix>
        <img :src="require('./images/close.svg')" @click="isWidthFull = false" />
      </template>
      <template #append v-if="keyword">
        <div v-if="filteredFAQList.length">
          <div
            v-for="(item, index) in filteredFAQList"
            :key="index"
            class="search-res-item"
            @click="actionSearch(item)"
          >
            <!-- <strong>分類：</strong>{{ item.category }}，index:{{ item.optionIndex }}<br /> -->
            <span v-html="highlightText(item.title)" />
          </div>
        </div>
        <div class="res-empty" v-else>{{ $t('沒有相關查詢結果') }}</div>
      </template>
    </el-input>
  </div>
</template>
<script>
  import { ref, computed, onMounted, inject, watch } from 'vue'
  import { LIST_FAQ, FAQ_TW } from './i18n/index.js'
  import store from '@/store'
  export default {
    name: 'faq-search-result-wrap',
    props: {
      faqContent: {
        type: Object,
        default: () => {}
      }
    },
    setup(props) {
      const isMobile = computed(() => store.getters['platform/isMobile'])
      const keyword = ref('')
      const activeName = inject('activeName')
      const activeNameItemIndex = inject('activeNameItemIndex')
      const collapseOptionIndex = inject('collapseOptionIndex')
      const isWidthFull = ref(false)

      // 將 FAQ_TW 展平成陣列，並加上類別名稱
      const flatFAQList = computed(() => {
        return Object.entries(props.faqContent).flatMap(([category, items]) =>
          items.map((item, index) => ({
            ...item,
            category,
            optionIndex: index
          }))
        )
      })

      // 過濾符合條件的項目
      const filteredFAQList = computed(() => {
        if (!keyword.value.replace(/\s/g, '')) return []
        return flatFAQList.value
          .filter(
            item =>
              item.title.toLowerCase().includes(keyword.value) || item.innerHTML.toLowerCase().includes(keyword.value)
          )
          .sort((a, b) => {
            const aTitleHasKeyword = a.title.toLowerCase().includes(keyword.value) ? 1 : 0
            const bTitleHasKeyword = b.title.toLowerCase().includes(keyword.value) ? 1 : 0
            return bTitleHasKeyword - aTitleHasKeyword
          })
      })

      // 高亮文字
      const highlightText = text => {
        if (!keyword.value) return text

        // 建立正規表達式（不區分大小寫）
        const regex = new RegExp(`(${keyword.value})`, 'gi')
        return text.replace(regex, '<span style="color:#FF6969">$1</span>')
      }

      const actionSearch = item => {
        keyword.value = ''
        isWidthFull.value = false
        activeName.value = item.category
        activeNameItemIndex.value = item.optionIndex
        collapseOptionIndex.value = item.optionIndex
      }

      watch(isMobile, val => {
        if (val) {
          keyword.value = ''
          isWidthFull.value = false
        }
      })

      return {
        isMobile,
        filteredFAQList,
        highlightText,
        keyword,
        actionSearch,
        isWidthFull
      }
    }
  }
</script>
<style lang="scss" scoped>
  .faq-search-result-wrap {
    width: 100%;
    :deep(.el-input) {
      transition: all 0.2s ease;
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
      .el-input__suffix {
        display: none;
      }
      .el-input-group__append {
        background-color: #f8f8f8;
        position: absolute;
        width: 100%;
        z-index: 3;
        margin-top: 10px;
        padding: 15px 0;
        box-shadow: 0 0 5px #00000033;
        border-radius: 10px;

        > div {
          max-height: 60svh;
          overflow-y: scroll;
        }

        .search-res-item {
          cursor: pointer;
          padding: 10px 25px;
          color: #5d6d8b;
          &:hover {
            background-color: #e6e9f0;
          }
        }
        .res-empty {
          cursor: default;
          color: #8c8c8c;
          padding: 10px 25px;
          font-size: 16px;
          font-weight: bold;
        }
      }
    }

    &.mo-search {
      background-color: yellowgreen;
      :deep(.el-input) {
        position: absolute;
        z-index: 20;
        background-color: #f7f7f7;
        left: 0;
        padding: 0 20px;
        .el-input__prefix {
          cursor: default;
          left: 20px;
        }
        .el-input__suffix {
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0 10px;
          right: 20px;
          transform: translateX(0) !important;
        }
        &.width-0 {
          background-color: #f7f7f700;
          width: 0px;
          padding: 0;

          .el-input__inner {
            padding: 0;
            background: 0;
            border: 0;
          }
          .el-input__prefix {
            cursor: pointer;
            // left: 0;
          }
        }
      }
    }
  }
</style>

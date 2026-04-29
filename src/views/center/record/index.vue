<template>
  <div class="record__wrap container-mo-main" :class="tw(['w-full'])">
    <viewPath />
    <div class="menu__container">
      <viewMenu
        #="slotProps"
        :list="RECORD_TYPE_LIST"
        :activeID="selectTypeID"
        :xRayMargin="66"
        @action="selectTypeIDChange"
      >
        <span :class="tw(['text-center'])">
          {{ $t(slotProps.row.label) }}
        </span>
      </viewMenu>
    </div>
    <div class="switch__container" :class="tw(['mt-24px', 'mb-14px'])">
      <UISwitch :list="RECODRD_RANGE_LIST" :activeID="selectRangeItem.id" @action="selectRangeChange" />
    </div>
    <div class="record__container" :class="tw(['text-white'])">
      <component :is="activeComponent" />
    </div>
  </div>
</template>

<script>
  import { computed, provide } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import viewPath from '../path'
  import viewPopup from '@/components/popup'
  import viewMenu from '@/components/viewMenu'
  import UISwitch from '@/components/ui/switch'
  import viewCoupon from './coupon'
  import viewOrder from './order'
  import viewPresent from './present'

  import { RECODRD_RANGE_LIST, RECORD_TYPE_LIST } from './configs'

  export default {
    name: 'record',

    components: {
      viewPath,
      viewMenu,
      UISwitch,
      viewPopup,
      viewCoupon,
      viewOrder,
      viewPresent
    },

    setup() {
      const route = useRoute()
      const router = useRouter()
      const selectTypeID = computed(() => route.query?.type)
      provide('selectTypeID', selectTypeID)

      const selectTypeIDChange = val => {
        queryChange({ type: val, range: route.query.range })
      }

      const selectRangeItem = computed(() => {
        if (!route.query?.range) return {}
        const target = RECODRD_RANGE_LIST.find(item => item.start === route.query.range)
        return target
      })
      provide('selectRangeItem', selectRangeItem)

      const selectRangeChange = obj => {
        const target = RECODRD_RANGE_LIST.find(item => item.id === obj.id)
        queryChange({ type: route.query.type, range: target.start })
      }

      const queryChange = async ({ type, range }) => {
        const parms = {
          query: {
            type,
            range
          }
        }
        // 首次進入頁面 沒有資料 用replace
        if (!route.query.type || !route.query.range) await router.replace(parms)
        else await router.push(parms)
      }

      const initSearchData = () => {
        // 若無選擇啟用第0個
        const type = route.query?.type ?? RECORD_TYPE_LIST[0].id
        const range = route.query?.range ?? RECODRD_RANGE_LIST[0].start
        queryChange({ type, range })
      }
      initSearchData()

      const activeComponent = computed(() => {
        const target = RECORD_TYPE_LIST.find(item => item.id === route.query.type)
        return target?.component ?? null
      })

      return {
        RECORD_TYPE_LIST,
        RECODRD_RANGE_LIST,
        route,
        selectTypeID,
        selectRangeItem,
        activeComponent,
        // fn
        selectTypeIDChange,
        selectRangeChange,
        queryChange
      }
    }
  }
</script>

<style lang="scss">
  .record__wrap .el-table {
    color: #fff;
    background: transparent;

    &::before {
      background: transparent;
    }

    th {
      padding: 0 3px;
      font-size: 12px;
      color: #fff;
      background: transparent;
      border: 0;

      .cell {
        background: #28252b;
        border-radius: 3px;
      }
    }

    tr {
      background: transparent;

      &:hover > td {
        background: transparent;
      }

      td {
        border-bottom: 0.75px dashed #b4b4b4;
      }
    }

    .el-table__empty-text {
      width: 100%;
    }
  }
</style>

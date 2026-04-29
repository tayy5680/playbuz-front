<template>
  <div class="deposit-menu__wrap">
    <UISwitch :list="filterTypeList" :activeID="choseType" @action="action" />
  </div>
</template>

<script>
  import { computed, inject, watch } from 'vue'
  import { useRoute } from 'vue-router'

  import UISwitch from '@/components/ui/switch'

  export default {
    name: 'deposit-package-menu',

    components: {
      UISwitch
    },

    setup(props, { emit }) {
      const route = useRoute()
      const choseType = inject('chosePackageType')
      const classList = inject('classList')
      const packageList = inject('packageList')

      const filterTypeList = computed(() => {
        if (!packageList) return []

        const formatPackageList = packageList.map(item => item.data).flat()

        return classList.value.filter(item => {
          if (item.id === 3) {
            const limit = formatPackageList.map(item => !!item?.EndTime).filter(item => item)
            const vip = formatPackageList.map(item => !!item?.ConditionID).includes(2)
            return limit || vip
          } else if (item.id === 4 || item.id === 2) {
            return true
          } else return false
        })
      })

      watch(filterTypeList, () => {
        init()
      })

      const init = () => {
        if (filterTypeList.value[0]?.id === undefined) return false

        const pageClass = route.params.depositPageClass

        if (!pageClass) emit('chgPackageType', filterTypeList.value[1]?.id)
        else {
          const target = filterTypeList.value.find(item => item.type === route.params.depositPageClass)
          emit('chgPackageType', target.id)
        }
      }

      const action = obj => {
        emit('chgPackageType', obj.id)
      }

      init()

      return {
        choseType,
        filterTypeList,
        // fn
        action
      }
    }
  }
</script>

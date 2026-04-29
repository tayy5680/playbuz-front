<template>
  <div class="rank__member__container" :class="tw(['flex', 'flex-col', 'items-center', 'break-all'])">
    <div
      class="rank__member__group"
      v-for="(item, index) of rankDataList"
      :key="index"
      :class="
        tw([
          `top-${item.Rank}`,
          'relative',
          'w-full',
          'flex',
          { 'bg-rankItemBgPurple rounded-xl w-[108%] px-[4%] user-order ': item.UserId === userId && item.Rank <= 10 },
          { 'bg-[#312F39] rounded-xl w-[108%] px-[4%] user-other': item.UserId === userId && item.Rank > 10 }
        ])
      "
    >
      <div
        class="rank__member__index"
        :class="tw(['h-full', 'w-[10%]', 'md:w-[7%]', 'flex', 'items-center', 'justify-center', 'self-center'])"
        :style="`filter:${RANK_ICON_COLOR_FILTER?.[item.Rank]}`"
      >
        <img v-if="item.Rank <= 3" :src="require(`./images/i_rank${item.Rank}.svg`)" />
        <div v-else>{{ setRank(item.Rank) }}</div>
      </div>
      <div
        class="user__pic__container"
        :class="tw(['relative', 'w-[90px]', 'h-[90px]', 'z-10', 'flex-shrink', 'mx-auto', 'md:mx-0'])"
      >
        <div
          class="info__user-pic"
          :class="
            tw([
              'absolute',
              'bg-center',
              'bg-no-repeat',
              'bg-cover',
              'top-1/2',
              'left-1/2',
              '-translate-x-1/2',
              '-translate-y-1/2',
              'object-cover',
              'rounded-full',
              'w-[50px]',
              'h-[50px]',
              'z--1'
            ])
          "
          :style="`background-image:url(${item.PhotoPath})`"
        ></div>
      </div>
      <div
        class="rank__member__item"
        :class="tw(['flex', 'flex-col', 'flex-shrink', 'border-[#424242]', 'justify-center'])"
      >
        <div class="rank__member__name" :class="tw(['h-1/3', 'text-[15px]', 'flex', 'items-center'])">
          <div class="rank__member__name" :class="tw(['h-1/3', 'w-full', 'text-[15px]', 'flex', 'items-center'])">
            {{ item.Name }}
          </div>
        </div>
      </div>
      <div
        class="rank__member__point"
        :class="tw(['w-auto', 'flex', 'flex-grow', 'items-center', 'justify-start', 'pl-4'])"
      >
        <img
          :class="tw(['h-[15px] w-[14px] mr-2'])"
          :src="require('./images/i_vector.svg')"
          style="filter: invert(1);"
        />
        {{ item.Amount }}
      </div>
      <div
        class="rank__member__follow"
        v-if="item.UserId !== userId"
        :class="
          tw(['w-auto', 'flex', 'mr-3', 'md:mr-0', 'flex-shrink', 'items-center', 'justify-center', 'border-[#424242]'])
        "
      >
        <el-button round type="danger" :class="tw(['bg-[#424242]'])"> {{ $t('追蹤') }}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'rank-list-member-item',
    props: {
      rankDataList: {
        type: Object,
        default: () => {}
      },
      userId: {
        type: Number,
        default: () => 0
      }
    },

    setup() {
      const setRank = rank => {
        if (typeof rank !== 'number') return ''
        const rankInterval = [0, 500, 1000, 5000, 10000]
        const index = rankInterval.findIndex(element => element > rank)
        return index < 0
          ? rankInterval[rankInterval.length - 1] + '+'
          : index <= 1
          ? rank
          : rankInterval[index - 1] + '+'
      }

      const RANK_ICON_COLOR_FILTER = {
        1: 'invert(88%) sepia(95%) saturate(1444%) hue-rotate(327deg) brightness(101%) contrast(101%)',
        2: 'invert(63%) sepia(0%) saturate(0%) hue-rotate(233deg) brightness(85%) contrast(89%)',
        3: 'invert(41%) sepia(11%) saturate(2650%) hue-rotate(343deg) brightness(98%) contrast(86%)'
      }
      return {
        setRank,
        RANK_ICON_COLOR_FILTER
      }
    }
  }
</script>
<style lang="scss" scoped>
  .rank__member__container {
    .rank__member__group {
      &.user-other {
        margin-top: 40px;
      }
    }
    @media (max-width: 767px) {
      .rank__member__group {
        padding: 0 10px;
        .rank__member__item {
          flex-grow: 1;
        }

        .rank__member__point {
          display: none;
        }
      }
    }
  }
</style>

<template>
  <div
    class="top__three__member"
    :class="
      tw([
        `top-${rank}`,
        { 'bg-[#988747] p-5 w-[40%] max-w-[200px] border border-[#ECD98F] shadow-switchList': rank === 1 },
        { 'bg-[#68616D] p-7 w-[36%] max-w-[160px]': rank === 2 },
        { 'bg-[#584130] p-7 w-[36%] max-w-[160px]': rank === 3 },
        'rounded',
        'text-center',
        'flex',
        'flex-col',
        'items-center',
        'h-[220px]',
        'bg-center',
        'bg-no-repeat'
      ])
    "
    :style="rank === 1 ? `background-image:url(${require('./images/top1-bg.svg')})` : ''"
  >
    <div
      class="user__pic__container"
      v-if="rankInfo?.PhotoPath"
      :class="
        tw([
          'relative',
          'flex',
          'justify-center',
          { 'min-w-[140px] min-h-[140px] mt-[-95px]': rank === 1 },
          { 'min-w-[120px] min-h-[120px] mt-[-90px]': rank > 1 },
          'z-10'
        ])
      "
    >
      <img
        class="i_crown"
        v-if="rank === 1"
        :src="require('./images/i_crown.svg')"
        :class="
          tw([
            'mx-auto',
            'absolute',
            'mt-[-10px]',
            'filter-[invert(88%) sepia(65%) saturate(1305%) hue-rotate(327deg) brightness(101%) contrast(101%)]'
          ])
        "
        style="filter: invert(88%) sepia(65%) saturate(1305%) hue-rotate(327deg) brightness(101%) contrast(101%);"
      />
      <div
        class="info__user-pic"
        :class="
          tw(['absolute', 'bg-center', 'bg-no-repeat', 'bg-cover', 'rounded-full', 'w-[60%]', 'h-[60%]', 'mt-[20%]'])
        "
        :style="`background-image:url(${rankInfo?.PhotoPath})`"
      ></div>
    </div>
    <div class="user__name" :class="tw(['overflow-hidden', 'overflow-ellipsis', 'whitespace-nowrap', 'w-full'])">
      {{ rankInfo?.Name ?? '-' }}
    </div>
    <div
      class="user__point"
      :class="
        tw([
          'text-[18px]',
          'font-bold',
          'flex-grow',
          'break-all',
          'leading-5',
          'flex',
          'pt-2',
          'items-center',
          'justify-center',
          'whitespace-nowrap'
        ])
      "
    >
      <img :class="tw(['h-[15px] w-[14px] mr-2'])" :src="require('./images/gift.svg')" />
      {{ rankInfo?.Amount }}
    </div>
    <div
      class="user__ranking"
      :class="tw(['font-bold', 'bg-bottom', 'bg-no-repeat', 'w-full'])"
      :style="rank === 1 ? `background-image:url(${require('./images/1st.svg')}` : ''"
    >
      <span
        :class="
          tw([
            { 'text-[36px] text-white relative top-[-12px]': rank === 1 },
            { 'text-[30px] text-[#A9A9A9]': rank === 2 },
            { 'text-[30px] text-[#A46333]': rank === 3 }
          ])
        "
        :style="
          rank === 1
            ? 'text-shadow: -2px -2px 0 #B59137, 2px -2px 0 #B59137, -2px 2px 0 #B59137, 2px 2px 0 #B59137;'
            : ''
        "
      >
        {{ rank }}
      </span>
      <span
        :class="
          tw([
            { 'text-[24px] text-white relative top-[-12px]': rank === 1 },
            { 'text-[18px] text-[#A9A9A9]': rank === 2 },
            { 'text-[18px] text-[#A46333]': rank === 3 }
          ])
        "
        :style="
          rank === 1
            ? 'text-shadow: -2px -2px 0 #B59137, 2px -2px 0 #B59137, -2px 2px 0 #B59137, 2px 2px 0 #B59137;'
            : ''
        "
      >
        {{ getRankName(rank) }}
      </span>
    </div>
  </div>
</template>
<script>
  import { UNKNOWN_USER_NAME } from '@/configs'
  export default {
    name: 'rank-list-member-top',
    props: {
      rank: {
        type: Number,
        default: () => 1
      },
      rankInfo: {
        type: Object,
        default: () => {}
      }
    },

    setup() {
      const getRankName = rank => {
        if (rank === 1) return 'ST'
        else if (rank === 2) return 'ND'
        else return 'RD'
      }

      return {
        UNKNOWN_USER_NAME,
        getRankName
      }
    }
  }
</script>

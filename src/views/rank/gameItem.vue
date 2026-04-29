<template>
  <div>
    <div
      class="rank__game__container"
      v-for="(item, index) of rankDataList"
      :key="index"
      :class="tw([
        'relative',
        'w-full',
        'my-2.5',
        'flex',
      ])"
    >
      <div
        class="rank__game__index"
        :class="tw([
          'h-full',
          'min-w-[40px]',
          'w-[10%]',
          'md:w-[7%]',
          'flex',
          'items-center',
          'justify-center',
          'self-center',
          'p-2',
        ])"
      >
        <img
          v-if="index < 3"
          :src="require(`./images/i_rank${index + 1}.svg`)"
        />
        <div v-else>{{index + 1}}</div>
      </div>
      <div
        class="rank__game__icon"
        :class="tw([
          'h-auto',
          'w-auto',
          'cursor-pointer',
          'items-center',
          'flex',
          'flex-shrink',
          'mx-3',
        ])"
      >
        <img
          class="rank__game__img"
          :src="`${gameSiteURL}/game/${item.isStatic ? 'static/' : ''}mobile/type_short/${item.isStatic ? item.vendorID : item.id}.jpg`"
          :class="tw([
            'max-w-none',
            'w-[90px]',
            'md:w-[80px]',
            'h-[90px]',
            'md:h-[80px]',
            'rounded-2xl',
            transitionBase,
          ])"
          @click="action(item.id)"
          :alt="item.name"
        />
      </div>
      <div
        class="rank__game__item"
        :class="tw([
          'p-2',
          'mr-3',
          'md:mr-0',
          'md:min-w-[230px]',
          'w-full',
          'flex',
          'flex-col',
          'flex-grow',
          index + 1 !== rankDataList.length ? 'border-b-1' : '',
          'border-[#424242]',
          'cursor-pointer',
        ])"
        @click="action(item.id)"
      >
        <div
          class="rank__game__name"
          :class="tw([
            'h-1/3',
            'w-full',
            'text-[15px]',
            'md:text-xl',
            'flex',
            'items-center',
          ])"
        >
          {{ item.name }}
        </div>
        <div
          class="rank__game__sort"
          :class="tw([
            'md:h-1/5',
            'min-h-5',
            'mt-0',
            'md:mt-1',
            'w-full',
            'flex',
            'flex-wrap',
          ])"
        >
          <div
            class="rank__game__class"
            v-if="item.gameClass"
            :class="tw([
              'text-[#878787]',
              'text-[10px]',
              'border',
              'rounded',
              'h-full',
              'py-px',
              'md:py-0',
              'px-2',
              'border-[#878787]',
              'inline-block',
            ])"
          >
            {{ item.gameClass }}
          </div>
          <div
            class="rank__game__type"
            v-if="item.gameType"
            :class="tw([
              'text-[#878787]',
              'text-[10px]',
              'border',
              'rounded',
              'h-full',
              'ml-1',
              'py-px',
              'md:py-0',
              'px-1',
              'md:px-2',
              'border-[#878787]',
              'inline-block',
            ])"
          >
          <span
            v-for="(name,keys) of item.gameType"
            :key="name"
          >
            {{keys === 0 ? $t(name) : `/${ $t(name) }`}}
          </span>
          </div>
        </div>
        <div
          class="rank__game__describe"
          v-if="item.subTitle"
          :class="tw([
            'mt-3',
            'text-xs',
            'text-[#919191]',
            'inline-block',
            'align-middle',
          ])"
        >
          {{item.subTitle}}
        </div>
      </div>
      <div
        class="rank__game__preview"
        v-if="!isMobile && item.preview.length >0"
        :class="tw([
          'pb-2',
          index + 1 !== rankDataList.length ? 'border-b-1' : '',
          'border-[#424242]',
          'w-full',
          'flex',
          'flex-shrink',
        ])"
      >
        <div
          v-if="!imgSizeData.length && item.preview.length >0"
          :class="tw([
            'flex',
            'flex-shrink',
            'items-center',
            'justify-center',
          ])"
        >
          <div
            v-for="img of item.preview"
            :key="img.url"
            :class="tw([
              'h-[65px]',
              'w-[100px]',
            ])"
          >
            <el-skeleton-item
              variant="image"
              style="height: 100%;"
            />
          </div>
        </div>
        <div
          v-if="imgSizeData.length"
          :class="tw([
            'flex',
            'flex-shrink',
            'items-center',
            'justify-center',
          ])"
        >
          <img
            class="rank__game__preview"
            v-for="(img, key) of item.preview"
            :key="img.url"
            :src="img.url"
            :id="key"
            :class="tw([
              'flex-shrink',
              'overflow-hidden',
              'justify-start',
              'px-1.5',
              'cursor-pointer',
              'h-auto',
              'w-[100px]',
              'rounded-lg',
              transitionBase,
            ])"
            @click="preView(item.preview, key, index)"
            :alt="item.name"
          />
        </div>
      </div>
    </div>
  </div>

</template>
<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import store from '@/store'
import 'swiper/swiper.scss'
export default {
  name: 'rank-list-game-item',
  props: {
    rankDataList: {
      type: Object,
      default: () => {},
    },
    preView: {
      type: Function,
    },
    imgSizeData: {
      type: Array,
      default: () => [],
    },

  },

  setup () {
    const router = useRouter()
    const gameSiteURL = process.env.VUE_APP_IMG_URL + '/img'

    const isMobile = computed(() => store.getters['platform/isMobile'])
    const action = (id) => {
      router.push({ name: 'game/detail', params: { gameID: id } })
    }
    return {
      action,
      isMobile,
      gameSiteURL,
    }
  },
}
</script>

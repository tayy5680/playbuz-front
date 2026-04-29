<template>
  <div class="event__wrap" :class="tw(['relative', 'z-10'])">
    <div class="event__container" :class="tw(['mt-26px', 'mb-30px', 'mx-mobileSpace', 'md:mx-0'])">
      <div
        class="event__button__area"
        :class="
          tw([
            'grid',
            'grid-cols-1',
            'md:grid-cols-2',
            'gap-x-20px',
            'md:gap-x-16px',
            'md:gap-y-16px',
            'gap-y-30px',
            'items-end'
          ])
        "
      >
        <div class="JoinUs" @click="actionJoinUs">
          <el-image class="bg" :src="`${imageURL}/button_JoinUs_bg_${lang}.png`">
            <template #error>
              <img class="bg" :src="`${imageURL}/button_JoinUs_bg_en-US.png`" />
            </template>
          </el-image>
          <img class="arrow" :src="`${imageURL}/button_JoinUs_arrow.png`" />
          <img class="ufo" :src="`${imageURL}/button_JoinUs_ufo.png`" />
        </div>
        <div class="FAQ" @click="actionFAQ">
          <img class="bg" :src="`${imageURL}/button_FAQ_bg_${lang}.png`" />
          <img class="et" :src="`${imageURL}/button_FAQ_et.png`" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { ref, computed, nextTick, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import store from '@/store'
  import { LIST_FAQ } from '@/views/FAQ/i18n/index.js'

  export default {
    name: 'event',
    setup() {
      const router = useRouter()
      const lang = computed(() => store.state.member.languageCode)
      const imageURL = process.env.VUE_APP_IMG_URL + '/img/home'

      const actionJoinUs = () => {
        router.push('/game/detail/100001')
      }

      const actionFAQ = () => {
        router.push({ name: 'FAQ', params: { faqTypeName: LIST_FAQ[0].name } })
      }

      return {
        actionJoinUs,
        actionFAQ,
        lang,
        imageURL
      }
    }
  }
</script>
<style lang="scss" scoped>
  .event__wrap {
    .JoinUs,
    .FAQ {
      cursor: pointer;
      transition: all 0.2s ease;
      .bg {
        width: 100%;
      }
      .ufo,
      .arrow,
      .et {
        position: absolute;
        bottom: 0;
        transition: all 0.2s ease;
      }
      .ufo {
        left: 27%;
        height: 100%;
      }
      .arrow {
        left: 20%;
        bottom: 21%;
      }
      .et {
        height: 90%;
        right: 0;
      }

      &:hover {
        .ufo {
          height: 113%;
        }
        .arrow {
          left: 21%;
        }
        .et {
          height: 103%;
        }
      }

      @media (max-width: 767px) {
        .ufo {
          height: 45%;
          bottom: calc(50% + 15px);
          right: 25px;
          left: auto;
        }
        .arrow {
          left: 40%;
          bottom: calc(59.5% + 15px);
          width: 5svw;
          margin-top: -11%;
        }
        .et {
          height: 40%;
          right: 25px;
        }
        &:hover {
          .ufo {
            height: 50%;
          }
          .arrow {
            left: 42%;
          }
          .et {
            height: 45%;
          }
        }
      }
    }
    .JoinUs {
      display: flex;
    }
  }
</style>

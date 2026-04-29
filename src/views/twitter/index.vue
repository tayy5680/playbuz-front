<template>
<div
  class="twitter__wrap"
  :class="tw([
    'md:px-120px',
    'min-h-screen',
    'md:min-h-0'
  ])"
>
  <gpgLoading v-if="loading" />
  <div
    class="twitter__container"
    ref="twitterContainerElement"
    :class="tw([
      { 'opacity-0': loading },
    ])"
  >
    <a
      class="twitter-timeline"
      href="https://twitter.com/GodGpg?ref_src=twsrc%5Etfw"
      data-theme="dark"
      data-chrome="noheader nofooter noscrollbar noborders transparent"
      :class="tw([
        'text-white',
      ])"
    >
      Tweets by GodGpg
    </a>
  </div>
</div>
</template>

<script>
import { nextTick, onMounted, ref } from 'vue'
import store from '@/store'
import gpgLoading from '@/components/gpg-loading'
import { HOME_HEADER_MENU } from '@/configs'

export default {
  components: {
    gpgLoading,
  },

  setup () {
    const headerMenuList = ref(HOME_HEADER_MENU)
    const loading = ref(false)
    const twitterScriptUrl = ref('https://platform.twitter.com/widgets.js')
    const twitterContainerElement = ref(null)
    const addTwitterScript = () => {
      return new Promise(resolve => {
        const twitterScript = document.createElement('script')
        twitterScript.setAttribute('src', twitterScriptUrl.value)
        twitterScript.setAttribute('async', true)
        twitterScript.setAttribute('charset', 'utf-8')
        document.head.appendChild(twitterScript)
        twitterScript.onload = () => resolve()
      })
    }

    const hasTwitterScript = () => {
      return Array.from(document.querySelectorAll('script'))
        .map(item => item.src)
        .includes(twitterScriptUrl.value)
    }

    const init = async () => {
      loading.value = true

      // 已引用過twitter的widgets則不重複引用。
      if (hasTwitterScript()) window.twttr.widgets.load(twitterContainerElement.value)
      else await addTwitterScript()

      window.twttr.events.bind('loaded', () => {
        loading.value = false
      })
    }

    onMounted(() => {
      store.dispatch('platform/setPageMenuList', headerMenuList.value)
      store.dispatch('platform/setPageMenuID', headerMenuList.value[2].id)

      nextTick(() => {
        init()
      })
    })

    return {
      loading,
      twitterContainerElement,
    }
  },
}
</script>

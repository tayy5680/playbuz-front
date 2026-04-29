<template>
  <div class="contact_container" :class="tw(['flex', 'justify-center', 'md:justify-around'])">
    <div class="contact_img"
      v-for="(item, index) of contactList"
      :key="index">
      <img
      :class="tw(['h-[40px]', 'w-[40px]', 'md:h-[80px]', 'md:w-[80px]', 'p-1', 'cursor-pointer'])"
      :src="require(`@/assets/img/icons/${item.img}.svg`)"
      @click="action(item.url)" />
    </div>
  </div>
</template>

<script>

export default {
  name: 'view-contact',

  setup () {
    const contactList = [
      { name: 'facebook', img: 'facebook', url: 'https://www.facebook.com/?locale=zh_TW' },
      { name: 'twitter', img: 'twitter', url: 'https://twitter.com/i/flow/login' },
      { name: 'instagram', img: 'instagram', url: 'https://www.instagram.com/' },
      { name: 'youtube', img: 'youtube', url: 'https://www.youtube.com/' },
    ]

    const action = (url) => {
      window.open(url)
    }

    return {
      contactList,

      // fn
      action,
    }
  },
}
</script>

<template>
  <div
    :class="tw([`w-[${size}px]`, `h-[${size}px]`, 'group'])"
    :style="{
      '-webkit-mask': setStyleMaskImage(img),
      'mask': setStyleMaskImage(img)}">
    <div
      :class="tw([
        'w-full',
        'h-full',
        transitionBase,
        bgColor ? `bg-[${bgColor}]` : 'bg-BaseColor',
        bgHover ? `bg-[${bgHover}]`  : 'group-hover:bg-gradient-to-br from-pink-500'])" />
    </div>
</template>

<script>
  export default {
    name: 'maskPicture',

    props: {
      img: {
        type: Image,
      },
      bgColor: {
        type: String,
      },
      bgHover: {
        type: String,
      },
      size: {
        type: Number,
        default: 30,
      },
    },

    setup (props) {
      const setStyleMaskImage = (url) => {
      return `url(${url}) no-repeat center /contain`
    }
      return {
        setStyleMaskImage,
      }
    },
  }
</script>

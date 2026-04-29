<template>
  <div>
    <div
      class="game__no__data"
      :class="tw([
        'text(center [#aea1be])',
        'flex',
        'justify-center',
        'my-7',
      ])"
    >
      <img
        :class="tw([
          'inline-block',
          'w-[18px]',
          'h-auto',
          'mr-2',
        ])"
        :src="require('../../components/viewDrawer/images/i_note.svg')"
      />
      <span>{{ $t('目前尚無資料。') }}</span>
    </div>
  </div>
  </template>

<script>
export default {
  setup () {

  },
}
</script>

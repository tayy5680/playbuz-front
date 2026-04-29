<template>
  <div class="gpg-loading" v-show="true" :class="tw(['p-28', 'flex', 'flex-col', 'items-center'])">
    <div class="gpg-loading__icon" :class="tw(['relative', 'animate-bounce'])">
      <img
        :src="require(`@/assets/img/logo/logo_PlayBUZ_only.png`)"
        :class="tw(['animate-ping', 'w-28'])"
        :alt="$t('玩霸PlayBUZ')"
      />
      <img
        :src="require(`@/assets/img/logo/logo_PlayBUZ_only.png`)"
        :class="tw(['absolute', 'top-1/2', 'left-1/2', '-translate-1/2', 'w-28'])"
        :alt="$t('玩霸PlayBUZ')"
      />
    </div>
    <span :class="tw(['text(white xl)', 'font-bold'])">
      Loading...
    </span>
  </div>
</template>

<script>
  export default {
    setup() {}
  }
</script>

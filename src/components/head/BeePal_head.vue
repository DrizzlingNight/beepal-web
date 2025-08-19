<template>
  <div :class="{bdb: border}" class="page-top-safe-area__has-page-title">
    <!-- 頭部左側插槽 -->
    <div class="page-left">
      <slot name="left">
        <svg-icon icon-class="Notification" class-name="Notification" @click="$router.push('/Announcement')">
        </svg-icon>
      </slot>
    </div>

    <!-- 頭部中間插槽 -->
    <div class="page-title">
      <slot name="title"></slot>
    </div>

    <!-- 頭部右側插槽 -->
    <div class="page-title-cs">
      <slot name="right">
        <svg-icon icon-class="black_scan" class-name="scan" @click="$router.push('/b_scan')">
        </svg-icon>
      </slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Head',
    props: {
      border: {
        type: Boolean,
        default: false,
      },
    },
  }
</script>

<style lang="scss" scoped>
  .bdb {
    border-bottom: 0.5px solid rgba($color: #000, $alpha: 0.1);
  }
</style>

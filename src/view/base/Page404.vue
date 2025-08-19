<template>
  <div class="page-404">
    <!-- 2021.10.07 暫時先把404頁面改成缺省頁 -->
    <default-page :status="1" />
  </div>
</template>

<script>
import DefaultPage from '@/components/defaultPage'

export default {
  name: 'Page404',
  components: {
    DefaultPage
  }
}
</script>

<style lang="scss" scoped>
.page-404{
  // font-size: 30px;
  // color: #ccc;
  // line-height: 400px;
  // text-align: center;
}
</style>

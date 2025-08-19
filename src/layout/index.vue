<template>
  <div id="layout" :class="{'full-screen': $route.name === 'horizontalFrame'}">
    <router-view />
    <the-footer v-if="$route.name !== 'horizontalFrame'"></the-footer>
  </div>
</template>

<script>
import TheFooter from './footer/Footer.vue'

export default {
  name: 'Layout',
  components: {
    TheFooter,
  },
}
</script>

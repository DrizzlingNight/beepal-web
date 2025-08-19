<template>
  <div v-if="isExternal" :style="styleExternalIcon" class="svg-external-icon svg-icon" v-on="$listeners" />
  <div v-else :class="svgClass" style="position: relative; overflow: visible">
    <svg aria-hidden="true" v-on="$listeners">
<!--      v-else-->
      <use :xlink:href="iconName" />
    </svg>
    <div v-if="badge" class="badge"></div>
  </div>
</template>

<script>
function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export default {
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      default: '',
    },
    badge: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isExternal() {
      return isExternal(this.iconClass)
    },
    iconName() {
      return `#icon-${this.iconClass}`
    },
    svgClass() {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    },
    styleExternalIcon() {
      return {
        mask: `url(${this.iconClass}) no-repeat 50% 50%`,
        '-webkit-mask': `url(${this.iconClass}) no-repeat 50% 50%`,
      }
    },
  },
}
</script>

<style scoped lang="scss">
.svg-icon {
  position: relative;
  width: 1em;
  height: 1em;
  overflow: hidden;
  svg {
    width: inherit;
    height: 100%;
    fill: currentColor;
    vertical-align: -0.15em;
    display: block;
  }
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}

.badge {
  position: absolute;
  right: 1px;
  top: 1px;
  transform: translate(50%, -50%) scale(0.5, 0.5);
  width: 16px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  border-radius: 50%;
  background-color: red;
  color: white;
  font-size: 12px;
}
</style>

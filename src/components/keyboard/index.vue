<template>
  <div class="keyboard flex row-v-c ft16">
    <div class="left">
      <div class="flex row-v-c keys">
        <div
          v-for="item in 9"
          :key="item"
          class="simpleKey w30 h50"
          @click="input(item)"
        >
          {{ item }}
        </div>
      </div>
      <div class="flex row-v-c mb10">
        <div class="simpleKey w60 h50" @click="input(0)">
          0
        </div>
        <div class="simpleKey w30 h50" @click="input('.')">
          .
        </div>
      </div>
    </div>
    <div class="right mb10">
      <div class="simpleKey h108 flex row-v-c row-h-c" @click="del">
        <svgIcon icon-class="del" class-name="del"></svgIcon>
      </div>
      <div
        :class="{ disbtn: disbtn }"
        class="simpleKey h108 blue"
        @click="gonext"
      >
        {{ confirm }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Keyboard',
  props: {
    confirm: {
      type: String,
      default: '',
    },
    disbtn: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {}
  },
  computed: {},
  methods: {
    input(item) {
      this.$emit('input', item)
    },
    del() {
      this.$emit('del')
    },
    gonext() {
      if (!this.disbtn) {
        this.$emit('gonext')
      }
    },
  },
}
</script>

<style scoped lang="scss">
@import '@/styles/variable.scss';
.keyboard {
  //   position: fixed;
  //   bottom: 0;
  //   width: 100%;
  //   background: $bodyBgColor;
}

.left {
  width: 75%;
  .keys {
    flex-wrap: wrap;
  }

  .simpleKey {
    margin-left: 8px;
    margin-top: 8px;
    border-radius: 5px;
    text-align: center;
    background: $pageBgColor;
    -moz-user-select:none;
    -webkit-user-select:none;
    &:active {
      background-color: $listActiveBgColor;
    }
  }
}

.right {
  width: 22%;

  .simpleKey {
    margin-left: 5px;
    margin-top: 8px;
    border-radius: 5px;
    text-align: center;
    background: $pageBgColor;
    -moz-user-select:none;
    -webkit-user-select:none;
    &:active {
      background-color: $listActiveBgColor;
    }
  }
}

.w30 {
  width: 30%;
}

.h50 {
  height: 50px;
  line-height: 50px;
}

.h108 {
  height: 108px;
  line-height: 108px;
}

.w60 {
  width: 63%;
}

.del {
  height: 1.5em;
  width: 1.5em;
}

.blue {
  background-color: $cardBgColor !important;
  color: $cardColor;
}

.disbtn {
  background-color: $diableBtnColor !important;
}
</style>

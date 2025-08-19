<template>
  <div :class="{'pos_absolute': abs }" class="page-top-safe-area__has-page-title">
    <div class="page-left">
      <slot name="left">
        <svg-icon :badge="haveBadge" icon-class="Notification" class-name="Notification"
                  @click="$router.push('/Announcement')">
        </svg-icon>
      </slot>
    </div>

    <div class="page-title">
      <slot name="title"></slot>
    </div>

    <div :class="['page-title-cs',type == 'home'?'mr20':'mr10']">
      <slot :inner="selectorClicker" name="right">
        <div class="pos_relative" @click="selectorClicker">
          <svg-icon
            icon-class="Plus" class-name="Plus"
          >
          </svg-icon>
          <div class="pos_absolute page-right-font">{{ $t('buy.text_5') }}</div>
        </div>
      </slot>
      <div ref="selector" :class="['selector',{'disAvailable':!show}]">
        <ul>
          <li v-for="(item,index) in list" v-show="item.show" :key="index" @click="$router.push(item.go)">
            <svg-icon
              :icon-class="item.icon" :class-name="item.icon"
            >
            </svg-icon>
            <span class="ft15">{{ item.name }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div :class="['Allpage',{'disAvailable':!show}]" @click="selectorClicker"></div>
  </div>
</template>

<script>
  import notices from '@/mixins/notices'

  export default {
    name: 'Index',
    mixins: [notices],
    props: {
      type: {
        type: String,
        default: '',
      },
      abs: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        show: false,
        isClicked: false,
        list: [
          {
            name: this.$t('head.nav_1'),
            icon: 'addFriend',
            show: this.type !== 'home',
            go: '/addfriend',
          },
          {
            name: this.$t('head.nav_2'),
            icon: 'scan',
            show: true,
            go: '/scan',
          },
          {
            name: this.$t('head.nav_3'),
            icon: 'transfer',
            show: this.type === 'home',
            go: '/senddeal',
          },
          {
            name: this.$t('head.nav_4'),
            icon: 'qrcode',
            show: this.type === 'home',
            go: '/getmoneycode',
          },
        ],
      }
    },
    methods: {
      async selectorClicker() {
        if (this.isClicked === true) return
        this.isClicked = true
        if (this.show) {
          await new Promise((resolve, reject) => {
            this.$refs.selector.animate([
              { opacity: 1, transform: 'scale(1,1)' },
              { opacity: 0.2, transform: 'scale(0.5,0.5)' },
            ], {
              duration: 100,
              fill: 'forwards',
            })
            setTimeout(resolve, 100)
          })
          this.show = !this.show
          this.isClicked = false
        } else {
          await new Promise((resolve, reject) => {
            this.show = !this.show
            this.$refs.selector.animate([
              { opacity: 0.2, transform: 'scale(0.7,0.7)' },
              { opacity: 1, transform: 'scale(1,1)' },
            ], {
              duration: 100,
              fill: 'forwards',
            })
            setTimeout(resolve, 100)
          })
          this.isClicked = false
        }
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '@/styles/variable.scss';

  ::v-deep .page-title-cs {
    margin-right: 0;
  }

  ::v-deep .page-left {
    margin-left: 0;
  }

  .disAvailable {
    display: none;
  }

  .Allpage {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    z-index: -5;
  }

  .selector {
    position: absolute;
    font-size: 20px;
    font-weight: bold;
    background-color: $selectorBgColor;
    border-radius: 5px;
    width: fit-content;
    padding: 5px 10px;
    text-align: left;
    color: $cardColor;
    min-width: 110px;
    top: 50px;
    transform-origin: 92% 0%;
    right: 1px;
  }

  .selector:after {
    content: '';
    position: absolute;
    border-bottom: 8px solid $selectorBgColor;
    border-right: 8px solid transparent;
    border-top: 8px solid transparent;
    border-left: 8px solid transparent;
    top: -15px;
    right: 7px;
  }

  .selector ul li {
    padding: 10px 5px 10px 3px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .selector ul li span {
    margin-left: 10px;
    white-space: nowrap;
  }

  .selector ul li:not(:last-of-type) {
    border-bottom: 1px solid #474747;
  }
</style>

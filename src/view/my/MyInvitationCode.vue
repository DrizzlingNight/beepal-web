<!--
 * @Author: your name
 * @Date: 2019-12-06 10:06:28
 * @LastEditTime: 2019-12-10 15:45:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /beex/src/view/my/Kyc.vue
 -->
<template>
  <div class="my-invitation-code">
    <!-- <div class="page-top-safe-area__has-page-title">
      <div class="back-arrow" @click="$router.go(-1)"></div>
      <div class="page-title">{{ $t('my.myInvitationCode.title_1') }}</div>
      <div v-if="livechat" class="page-title-cs">
        <svg-icon
          icon-class="livechat"
          class-name="livechat"
          @click.stop="handleRouter('livechat')"
        >
        </svg-icon>
      </div>
    </div> -->
    <my-head :title="$t('my.myInvitationCode.title_1')"></my-head>
    <!-- 我的邀请码 -->
    <div class="invitation-code-card fg-card">
      <!-- <h4 class="title">{{ $t('my.myInvitationCode.title_2') }}</h4>
      <div class="qrcode-wrap">
        <fg-qrcode :text="referralUrl"></fg-qrcode>
      </div>
      <div v-if="!settings.showID" class="referral-url">
        {{ referralUrl }}
        <fg-copy :text="referralUrl">
          <div class="copy-btn ml10"></div>
        </fg-copy>
      </div>
      <h4 class="mt15 ft15">
        {{
          settings.showID
            ? $t('my.myInvitationCode.title_3')
            : $t('my.myInvitationCode.title_1')
        }}
      </h4>
      <div class="invitation-code mt7 mb16">{{ invitationCode }}</div>
      <fg-copy :text="invitationCode" class="copy-invitation-code">{{
        settings.showID
          ? $t('my.myInvitationCode.text_3')
          : $t('my.myInvitationCode.text_1')
      }}</fg-copy> -->
      <div class="flex row-v-c w100">
        <!--            <svg-icon class-name="notice-svg" icon-class="notice"></svg-icon>-->
        <div class="left avatar shrink">
          <img :src="VG__userInfo.avatar | avatar" />
        </div>
        <div class="flex grow row-between row-v-c ml10">
          <div>
            <div class="title ft16">{{ VG__userInfo.nickname }}</div>
            <div class="chat-content ft12 mt3">ID: {{ VG__userInfo.id }}</div>
          </div>
        </div>
      </div>
      <div class="qrcode-wrap">
        <fg-qrcode :text="referralUrl"></fg-qrcode>
      </div>
      <div class="ft13 chat-content mb30 mt10 tip">
        {{ $t('my.myInvitationCode.text_4') }}
      </div>
    </div>
    <!-- 我的下线 -->
    <!-- <div v-if="false" class="my-referrals-card fg-card">
      <div class="dropdown-display" @click="isOpen = !isOpen">
        <div class="left">{{ $t('my.myInvitationCode.text_2') }}</div>
        <div :class="{ 'arrow--toggle': isOpen }" class="right">
          {{ referrals.length }}人
        </div>
      </div>
      <ul
        v-if="referrals.length"
        :class="{ 'dropdown-body--open': isOpen }"
        class="dropdown-body"
      >
        <li
          v-for="(item, index) in referrals"
          :key="index"
          class="dropdown-item"
        >
          {{ item.username }}
        </li>
      </ul>
    </div> -->
  </div>
</template>

<script>
import FgCopy from '@/components/copy/Copy'
import FgQrcode from '@/components/qrcode/Qrcode'
import { mapGetters } from 'vuex'
import { settings } from '@/config'
import myHead from '@/components/head/Normal_head'

export default {
  name: 'Kyc',
  components: {
    FgCopy,
    FgQrcode,
    myHead
  },
  filters: {
    avatar(item) {
      return item || require('../my/avatar.png')
    }
  },
  data() {
    return {
      isOpen: false,
      livechat: settings.customerService,
      settings,
      referrals: [
        {
          id: '111',
          username: 'AAsldjflk',
        },
        {
          id: '222',
          username: 'BBosajflajgl',
        },
        {
          id: '333',
          username: 'CCqoweuajlsdgjasgx',
        },
      ],
    }
  },
  computed: {
    ...mapGetters(['VG__userInfo']),
    invitationCode() {
      if (settings.showID) { return (this.VG__userInfo && this.VG__userInfo.id.toString()) || '--' } else {
        return (
          (this.VG__userInfo && this.VG__userInfo.invitation_code) ||
          '--'
        )
      }
    },
    referralUrl() {
      if (settings.showID) {
      return JSON.stringify({
                type: 'scanresult',
                userid: this.invitationCode,
                username: this.VG__userInfo.username,
              })
      } else {
        return (
          window.location.origin + '/#/register?referral=' + this.invitationCode
        )
      }
    },
  },
  methods: {
    handleRouter(router) {
      if (this.$route.path.includes(router)) {
        return
      } else {
        this.$router.push(`/${router}`)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/variable.scss';
.svg-icon {
  margin-bottom: 0px;
  color: #d1d1d1;
  width: 22px;
  height: 24px;
  font-size: 24px;
}
.main-content {
  //margin: 16px 12px;
}

.my-invitation-code {
  position: relative;
  height: 100%;
}

.fg-card {
  background: $pageBgColor;
  padding: 22px 22px 18px;
  color: $Color;
  & + & {
    margin-top: 15px;
  }
}
.invitation-code-card {
  // position: absolute;
  // top: 50%;
  // transform: translateY(-50%);
  width: 100%;
  margin-top: 70px;
  box-sizing: border-box;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  .invitation-code {
    font-weight: bold;
    flex: 1;
    font-size: 20px;
    word-break: break-all;
  }

  h4.title {
    font-size: 14px;
    font-weight: bold;
    color: $labelColor6;
  }
  .qrcode-wrap {
    margin-top: 8px;
    //margin-bottom: 11px;
    height: 250px;
    width: 250px;

    .qrcode {
      position: relative;
    }

    // 2021.12.14 為了配合下載下來的QR Code也要有Logo，改成用套件(@cheprasov/qrcode)把Logo壓上去
    // .qrcode::after {
    //   display: block;
    //   content: '';
    //   justify-content: center;
    //   align-items: center;
    //   width: 65px;
    //   height: 65px;
    //   background: center center no-repeat url('~@/assets/img/logo_BeePal.png');
    //   background-size: 60px 60px;
    //   background-color: #fff;
    //   color: #ffc100;
    //   position: absolute;
    //   top: 50%;
    //   left: 51%;
    //   // border-radius: 50%;
    //   transform: translate(-50%, -50%);
    // }
  }
  .referral-url {
    font-weight: bold;
    color: rgb(136, 136, 136);

    display: flex;

    word-break: break-all;
    text-align: center;
  }

  .copy-invitation-code {
    padding: 6px 36px;
    height: 30px;
    line-height: 30px;
    background: $cardBgColor;
    font-size: 14px;
    font-weight: bold;
    color: $cardColor;
  }
}

// .my-referrals-card {
// }
.dropdown-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .right {
    &::after {
      display: inline-block;
      content: '';
      width: 18px;
      height: 18px;
      background-size: 100%;
      background-repeat: no-repeat;
      background-image: url(~@/assets/icons/arrow-up@2x.png);

      position: relative;
      left: 2px;
      top: 3px;

      transform: rotate(180deg);
      transition: transform 0.3s;
    }

    &.arrow--toggle::after {
      transform: rotate(0deg);
      transition: transform 0.3s;
    }
  }
}

.dropdown-body {
  height: 0;
  overflow: auto;

  &--open {
    height: auto;
  }

  .dropdown-item {
    font-size: 14px;
    font-weight: bold;
    color: rgba(157, 157, 157, 1);
    line-height: 50px;
    & + .dropdown-item {
      position: relative;
      &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        height: 1px;
        transform: scaleY(0.5);
        background-color: #979797;
      }
    }
  }
}

.left {
  height: 45px;
  width: 45px;
  border-radius: 5px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
  }
}

.title {
  font-weight: bold;
  color: $labelColor4;
}

.chat-content {
  color: $my-goLogin;
}

.w100 {
  width: 100%;
}

.tip {
  width: 80%;
  text-align: center;
}

.copy-btn {
  width: 12px;
  height: 14px;
  background-size: 100%;
  background-repeat: no-repeat;
  background-image: url(~@/assets/icons/copy.png);
}
</style>

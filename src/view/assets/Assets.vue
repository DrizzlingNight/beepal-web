<template>
  <div class="assets">
    <div class="page-top-safe-area__has-page-title">
      <div class="page-title">{{ $t('assets.title') }}</div>
      <div v-if="livechat" class="page-title-cs">
        <svg-icon
          icon-class="livechat"
          class-name="livechat" @click.stop="
           handleRouter('livechat')
        ">
        </svg-icon>
      </div>
    </div>

    <div class="main-content">
      <template v-if="isLogined">
        <div v-if="tokenList.length" class="assets-card mt20 ml12 mr12">
          <fg-dropdown
            v-if="tokenList.length"
            :data-list="tokenList"
            class="token-dropdown"
            @selectItem="selectToken"
          ></fg-dropdown>

          <div class="wrap wrap-1">
            <div class="line-wrap title-wrap">
              <div class="title">{{ $t('assets.text_1') }}：</div>
              <div class="line-wrap refesh-btn" @click="__getUserInfoById(true)">
                <svg-icon icon-class="refesh" style="color: black"></svg-icon>
                <span>{{ $t('assets.text_2') }}</span>
              </div>
            </div>
            <ul class="balance-list">
              <li
                v-for="(balance, idx) in balances"
                v-show="balance.coin === selectTokenInfo.coin"
                :key="idx"
                class="balance-item"
              >
                <div class="left">
                  <div :class="[balance.name]" class="balance-img"></div>
                  <!-- <div class="balance-name">
                    {{ balance.name }}
                  </div> -->
                </div>
                <div class="right">
                  <div class="amount">
                    {{
                    (parseInt(Decimal(balance.amount)
                    .toDP(VG__getCoinDecimalPlacesByLabel('USDT') || 6)
                    .toString() * 10000) / 10000).toFixed(4)
                    }}
                  </div>
                  <div class="cny-amount">
                    <!-- ≈
                  {{
                    Decimal(balance.amount)
                      .times(usdtToCnyRatio)
                      .toDP(4)
                      .toString()
                  }}
                  CNY -->
                    <!-- {{ balance.name }} -->
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="wrap do-btns-wrap">
            <ul class="do-btns">
              <li class="do-btn">
                <a href="#/depositWithdraw?type=0">{{ $t('assets.text_3') }}</a>
              </li>
              <li class="do-btn">
                <a href="#/depositWithdraw?type=1">{{ withdrawIsAssign ? '划分' : $t('assets.text_4') }}</a>
              </li>
              <li class="do-btn history" @click="$router.push('/depositWithdrawHistory')">
                <!-- <svg-icon icon-class="refesh" style="color: black"></svg-icon> -->
                {{ $t('assets.history') }}
              </li>
              <!-- <li class="do-btn">
                <a href="#/depositWithdraw?type=2">{{ $t('assets.text_5') }}</a>
              </li> -->
            </ul>
          </div>
        </div>

        <template v-if="thirdPartySelectedTOkenBalances.length">
          <div
            v-for="(o, i) in thirdPartySelectedTOkenBalances"
            :key="i"
            class="account-wrapper"
          >
            <h3>{{ o.name }}</h3>

            <div
              v-for="(balance, i) in o.balances"
              v-show="balance.code === selectTokenInfo.code"
              :key="i"
              class="line line--between line--v-c"
            >
              <div class="thirdParty-left line line--v-c">
                <div class="action-btns">
                  <!-- 0-deposit， 1-withdraw -->
                  <!-- 当没有withdraw时，要显示tips -->
                  <div
                    v-show="o.deposit"
                    class="action-btn"
                    @click="clickTransfer(0, o)"
                  >
                    {{ $t('assets.text_9') }}
                  </div>
                  <div
                    v-show="o.withdraw"
                    class="action-btn"
                    @click="clickTransfer(1, o)"
                  >
                    {{ $t('assets.text_10') }}
                  </div>
                </div>
              </div>
              <div class="thirdParty-right">
                <div class="thirdParty-right-top">{{ $t('assets.text_6') }}：</div>
                <div class="thirdParty-right-bottom">
                  <div class="amount">{{ balance.amount ? Number(balance.amount).toFixed(4) : 0 }}</div>
                  <div class="token">
                    {{ balance.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
      <div v-else class="not-login__wrapper mt20">
        <div class="left avatar"></div>
        <div class="right">
          <div class="login-tip">{{ $t('assets.text_7') }}</div>
          <div class="go-login" @click="goLogin()">{{ $t('assets.text_8') }}</div>
        </div>
      </div>
    </div>
    <div v-if="isLogined && !tokenList.length" class="main-content">
      <van-loading size="48px" color="#1989fa" class="loading-data" vertical
      >{{ $t('base.loading') }}
      </van-loading
      >
    </div>
    <div v-if="refeshLoading" class="main-content" style="padding: 0; position: absolute; top: 40%; left: 50%;">
      <van-loading size="48px" color="#1989fa" class="loading-data" style="margin: 0;" vertical/>
    </div>

    <!-- 下面是InputDialog弹窗 -->
    <input-dialog
      v-model="isShow"
      :title="transferTitle"
      :tips="transferTip"
      :transfer-type="transferType"
      :available-withdraw-amount="availableWithdrawAmout"
      :available-deposit-amount="availableDepositAmout"
      @confirm="confirmTransfer"
    ></input-dialog>
  </div>
</template>

<script>
  import { Cell, CellGroup, Dialog, Loading } from 'vant'
  import { APK_URL, settings } from '@/config'
  import { getThirdPartyList, getUserInfoById, thirdPartyLogin, transferThirdParty } from '@/api'
  import { mapActions, mapGetters } from 'vuex'
  import { Decimal } from 'decimal.js'
  import Dropdown from '@/components/dropdown/Dropdown'
  import Storage from '@/utils/storage.js'
  import InputDialog from '@/components/dialog/InputDialog'

  const statusList = [
    {
      id: 0,
      name: '新建',
    },
    {
      id: 1,
      name: '进行中',
    },
    {
      id: 2,
      name: '完成',
    },
    {
      id: 3,
      name: '失败',
    },
  ]

  export default {
    name: 'Assets',
    components: {
      [CellGroup.name]: CellGroup,
      [Cell.name]: Cell,
      [Loading.name]: Loading,
      FgDropdown: Dropdown,
      InputDialog,
    },
    data() {
      return {
        APK_URL,
        Decimal,
        usdtToCnyRatio: '7.00',
        thirdPartyBalances: [],
        selectTokenInfo: {
          coin: 2,
        },
        transferToItem: {},
        isShow: false,
        transferTitle: '输入金额',
        transferTip: '',
        transferAmount: 0,
        transferType: 0, //
        availableWithdrawAmout: 0,
        livechat: settings.customerService,
        withdrawIsAssign: settings.withdrawIsAssign,
        refeshLoading: false,
      }
    },
    computed: {
      ...mapGetters([
        'VG__coinList',
        'VG__userInfo',
        'VG__getCoinLabelById',
        'VG__getCoinIdByLabel',
        'VG__getCoinDecimalPlacesByLabel',
        'VG__getUSDTId',
      ]),
      isLogined() {
        return !!this.VG__userInfo
      },
      balances() {
        if (!this.VG__userInfo) {
          return []
        }
        return this.VG__userInfo.balances
          .map(o => ({
            ...o,
            ...this.VG__coinList.find(p => o.coin === p.id),
          }))
          .filter(o => o.isCrypto)
      },
      availableDepositAmout() {
        if (this.balances && this.balances.length) {
          const balance = this.balances.find(
            o => o.coin === this.selectTokenInfo.coin,
          )
          return balance.amount || 0
        } else {
          return 0
        }
      },
      tokenList() {
        return this.balances || []
      },
      // 具有选中币种的应用，如果该应用没有选中的币种则不显示
      thirdPartySelectedTOkenBalances() {
        return this.thirdPartyBalances.filter(o => {
          if (
            o.balances.find(token => token.code === this.selectTokenInfo.code)
          ) {
            return true
          } else {
            return false
          }
        })
      },
    },
    created() {
      if (this.isLogined) {
        this.__getThirdPartyInfo()
        this.__getUserInfoById()
      }
    },
    methods: {
      handleRouter(router) {
        if (this.$route.path.includes(router)) {
          return
        } else {
          this.$router.push(`/${router}`)
        }
      },
      ...mapActions('user', ['VA__setUserInfo', 'VA__setUserWallet']),
      selectToken(o) {
        console.log(o.name)
        this.selectTokenInfo = o
        Storage.setLocal('selectToken', o)
      },
      // 1、拉取第三方应用列表，拿到对应的应用id， get /third_party/
      // 2、登录所有的第三方应用，可以得到对应应用的账户信息+login_token post /third_party/login/ third_party 为上面拿到的id
      // 3、点击划转的时候，只展示账户余额与该第三方应用所公共有的币种【交集】
      __getThirdPartyInfo() {
        getThirdPartyList()
          .then(res => {
            const thirdPartyBalances = []
            res.data.results.forEach(async o => { // 2021.08.16 配合新API，資料放res.data裡
              await thirdPartyLogin({ third_party: o.id }) // 异步转同步
                .then(r => {
                  console.log(r)
                  thirdPartyBalances.push({
                    ...o,
                    ...r,
                    balances: r.balances.map(o => ({
                      code: o.id, // 第三方的字段转换成beex的字段，"EOS_BAP"
                      ...o,
                    })),
                  })
                })
                .catch(err => {
                  console.log(err)
                })
              // 这里拿到了所有的第三方账户信息，可以统一保存在vuex和localStorage
              console.log(thirdPartyBalances)

              const _thirdPartyBalances = thirdPartyBalances.sort(
                (a, b) => a.index - b.index,
              )
              this.thirdPartyBalances = _thirdPartyBalances
              Storage.setLocal('thirdPartyBalances', _thirdPartyBalances)
            })
          })
          .catch(err => {
            console.log(err)
          })
      },
      goLogin() {
        this.$router.push(`/login?redirect=/assets`)
      },
      // 0-deposit， 1-withdraw
      clickTransfer(type, third_party_info) {
        console.log('third_party_info:', third_party_info)
        this.transferToItem = third_party_info
        const balance = third_party_info.balances.find(
          o => o.code === this.selectTokenInfo.code,
        )
        console.log('balance:', balance)
        this.availableWithdrawAmout = balance.amount

        switch (type) {
          case 0:
            if (+this.availableDepositAmout === 0) {
              this.$toast(
                this.$t('assets.toast_1'),
              )
              return
            }
            this.transferTitle = this.$t('assets.transfer_1')
            this.isShow = true
            this.transferType = 0
            break
          case 1:
            if (+this.availableWithdrawAmout === 0) {
              this.$toast(this.$t('assets.toast_2'))
              return
            }
            this.transferTitle = this.$t('assets.transfer_2')
            this.isShow = true
            this.transferType = 1
            break
          default:
            console.error('type can be only 0 or 1')
            break
        }
        if (!third_party_info.withdraw) {
          this.transferTip = this.$t('assets.transfer_3')
        } else {
          this.transferTip = ''
        }
      },
      confirmTransfer(amount) {
        this.transferAmount = amount
        let message = ''
        const money = `${this.transferAmount} ${this.selectTokenInfo.name} `
        switch (this.transferType) {
          case 0:
            message = this.$t('assets.message_1', { money, name: this.transferToItem.name })
            break
          case 1:
            message = this.$t('assets.message_2', { money, name: this.transferToItem.name })
            break
        }
        Dialog.confirm({
          title: this.$t('assets.confirm'),
          message,
        })
          .then(() => {
            // on confirm
            this.transferSubmit()
          })
          .catch(() => {
            // on cancel
          })
      },
      transferSubmit() {
        const data = {
          amount: this.transferAmount,
          type: this.transferType,
          third_party: this.transferToItem.id,
          coin: this.selectTokenInfo.id,
          login_token: this.transferToItem.login_token,
        }
        transferThirdParty(data)
          .then(res => {
            console.log(res)
            this.amount = ''
            this.__getUserInfoById()
            this.__getThirdPartyInfoById(this.transferToItem.id)
            this.$toast(this.$t('assets.toast_3'))
            setTimeout(() => {
              this.$toast(`${this.$t('assets.toast_4')}${this.statusFormat(res.status)}`)
              this.__getThirdPartyInfo()
            }, 1000)
          })
          .catch(err => {
            this.amount = ''
            this.$toast(this.$t('assets.toast_5'))
            console.log(err)
          })
      },
      __getUserInfoById(activeLoading = false) {
        console.log('this.VG__userInfo.id:', this.VG__userInfo.id)
        if (activeLoading) {
          this.refeshLoading = true
        }
        getUserInfoById(this.VG__userInfo.id)
          .then(res => {
            console.log('getUserInfoById-res:', res)
            this.refeshLoading = false
            if (!res) {
              return
            }
            Storage.setLocal('userInfo', res)
            this.VA__setUserInfo(res)
          })
          .catch(err => {
            console.log('getUserInfoById-errr:', err)
          })
      },
      __getThirdPartyInfoById(id) {
        thirdPartyLogin({ third_party: id })
          .then(r => {
            if (!r) {
              return
            }
            console.log('__getThirdPartyInfoById-res:', r)
            this.transferToItem = {
              loginToken: r.login_token,
              id: id,
              balances: r.balances.map(o => ({
                code: o.id, // 第三方的字段转换成beex的字段，"EOS_BAP"
                ...o,
              })),
            }
          })
          .catch(err => console.log(err))
      },
      statusFormat(id) {
        const obj = statusList.find(o => o.id === id)
        return (obj && obj.name) || '-'
      },
    },
  }
</script>

<style lang="scss" scoped>
  .svg-icon {
    margin-bottom: 0px;
    color: #d1d1d1;
    width: 22px;
    height: 24px;
    font-size: 24px;
  }

  .username {
    margin-bottom: 8px;
    font-size: 24px;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
  }

  .assets-card {
    background: linear-gradient(
        153deg,
        rgba(255, 240, 124, 1) 0%,
        rgba(255, 193, 0, 1) 100%
    );
    border-radius: 8px;
    padding: 12px 15px;
    color: #222222;
    margin-bottom: 12px;
    position: relative;

    .action-btn {
      padding: 3px 12px;
      border-radius: 12px;
      border: 1px solid rgba(34, 34, 34, 1);

      position: absolute;
      top: 9px;
      right: 10px;
      font-size: 12px;
      font-weight: bold;

      a {
        color: rgba(34, 34, 34, 1);
      }
    }

    .title {
      font-size: 12px;
      font-weight: bold;
      line-height: 30px;
    }

    .amount {
      font-size: 20px;
    }

    .cny-amount {
      font-size: 12px;
    }

    .flex {
      .item {
        flex: 1;

        &.flex4 {
          flex: 4;
        }

        &.flex5 {
          flex: 5;
        }
      }
    }

    .item + .item {
      border-left: 1px solid #222222;
    }
  }

  .bt {
    position: relative;

    &::before {
      position: absolute;
      left: 0;
      right: 0;
      content: '';
      transform: scaleY(0.5);
      top: 0;
      border-top: 1px solid #222222;
    }
  }

  .bb {
    position: relative;

    &::after {
      position: absolute;
      left: 0;
      right: 0;
      content: '';
      transform: scaleY(0.5);
      bottom: 0;
      border-bottom: 1px solid #222222;
    }
  }

  ::v-deep .van-cell {
    color: #ffffff;
    background-color: #222222;

    &:active {
      background-color: rgba(34, 34, 34, 0.95);
    }
  }

  ::v-deep .van-cell:not(:last-child)::after {
    left: 0;
    border-bottom: 1px solid #111;
  }

  ::v-deep [class*='van-hairline']::after {
    border: none;
  }

  .fg-divider {
    height: 15px;
    background-color: #111;
  }

  // loading
  .loading-data {
    // margin-top: 0%;
    height: auto;
    text-align: center;
    color: #444;
    position: absolute;
    top: 48px;
    left: 50%;
    transform: translateX(-50%);
  }

  .apk {
    line-height: 40px;
  }

  .btn-apk {
    width: 140px;
    height: 40px;
    line-height: 40px;
    background: rgba(255, 198, 41, 1);
    border-radius: 6px;

    font-weight: 500;
    color: rgba(0, 0, 0, 1);

    display: flex;
    align-items: center;
    justify-content: center;

    float: right;

    &::before {
      margin-right: 8px;
      content: '';
      height: 20px;
      width: 18px;
      background-repeat: no-repeat;
      background-size: 100%;
      background-image: url(~@/assets/icons/android.png);
    }
  }

  .not-login__wrapper {
    height: 95px;
    box-sizing: border-box;
    background: rgba(34, 34, 34, 1);
    display: flex;
    padding: 25px 20px;

    .left {
      margin-right: 14px;
      height: 45px;
      width: 45px;
      border-radius: 50%;
      background-repeat: no-repeat;
      background-size: 100%;
      background-image: url(~./avatar.png);
    }

    .right {
      margin-top: 4px;

      .login-tip {
        font-size: 19px;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
      }

      .go-login {
        font-size: 12px;
        font-weight: bold;
        color: rgba(255, 193, 0, 1);
      }
    }
  }

  .balance-item {
    display: flex;
    justify-content: space-between;
    align-items: center;

    height: 50px;

    position: relative;

    &::after {
      content: '';
      background-color: #684e00;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 1px;
      transform: scaleY(0.5);
    }

    .left {
      display: flex;
      align-items: center;

      .balance-name {
        margin-top: 4px; // 垂直居中
        font-size: 18px;
        font-weight: 600;
        color: #000;
      }
    }

    .right {
      text-align: right;
      margin-top: 6px;
      display: flex;

      .cny-amount {
        margin-left: 4px;
        line-height: 2.4; // different
      }
    }
  }

  .do-btns-wrap {
    margin-top: 12px;
    display: flex;
    justify-content: space-between;
  }

  .do-btns {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .do-btn {
      border-radius: 12px;
      border: 1px solid rgba(34, 34, 34, 0.5);

      width: 82px;
      height: 30px;
      line-height: 30px;
      border-radius: 4px;
      border: 1px solid rgba(34, 34, 34, 1);
      box-sizing: border-box;
      font-size: 12px;

      a {
        color: rgba(10, 10, 10, 1);
      }

      & + .do-btn {
        margin-left: 12px;
      }

      &.history {
        width: 80px;
        text-align: center;
      }
    }
  }
</style>

<style lang="scss" scoped>
  .action-btns {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .action-btn + .action-btn {
      background: rgba(52, 127, 255, 1);
      color: rgba(255, 255, 255, 1);
    }
  }

  .action-btn {
    min-width: 50px;
    padding: 4px 6px;
    margin-right: 10px;
    // line-height: 30px;
    background: linear-gradient(
        153deg,
        rgba(255, 240, 124, 1) 0%,
        rgba(255, 193, 0, 1) 100%
    );
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    color: rgba(10, 10, 10, 1);
    border-radius: 4px;

    &.poa {
      position: absolute;
      top: 9px;
      right: 10px;
    }

    a {
      color: rgba(255, 255, 255, 1);
    }
  }

  .account-wrapper {
    margin-top: 20px;
    background: rgba(34, 34, 34, 1);
    padding: 12px 17px;
    position: relative;

    > h3 {
      margin-top: 12px;
    }
  }

  .line {
    height: 70px;
    display: flex;
    align-items: center;

    &.line--between {
      justify-content: space-between;
    }

    &.line--v-c {
      align-items: center;
    }

    // & + .line {
    //   border-top: 1px solid #6c6c6c;
    // }
    .left {
      display: flex;
      align-items: center;
    }

    .right {
      display: flex;

      .cny-amount {
        margin-left: 4px;
        line-height: 1.3; // different
        color: rgba(130, 130, 130, 1);
      }
    }
  }

  h3 {
    font-size: 12px;
    font-weight: bold;
    color: rgba(173, 173, 173, 1);
  }

  .token {
    font-size: 14px;
    font-weight: normal;
    color: rgba(255, 255, 255, 1);
  }

  .symbol {
    margin-right: 9px;
  }

  .amount {
    font-size: 17px;
    font-weight: normal;
    color: #fff;
  }

  .balance-item {
    .amount {
      color: #000;
    }
  }

  .cnyAmount {
    font-size: 12px;
    font-weight: 400;
    color: rgba(130, 130, 130, 1);
  }

  // loding的位置
  // .loading-data {
  //   margin-top: 40px;
  // }

  .balance-wrapper {
    padding: 12px 17px;
    background: rgba(34, 34, 34, 1);

    .title {
      color: rgba(173, 173, 173, 1);
    }

    .balance-item {
      display: flex;
      justify-content: space-between;
      align-items: center;

      height: 57px;

      position: relative;

      &::after {
        content: '';
        background-color: #6c6c6c;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 1px;
        transform: scaleY(0.5);
      }

      .left {
        display: flex;
        align-items: center;

        .balance-name {
          margin-top: 4px; // 垂直居中
          font-size: 14px;
          color: rgba(255, 255, 255, 1);
        }
      }

      .right {
        display: flex;
        margin-top: 3px;

        .cny-amount {
          margin-left: 4px;
          line-height: 1.3; // different
          color: rgba(130, 130, 130, 1);
        }
      }
    }
  }

  .do-btns-wrap {
    margin-top: 12px;
    display: flex;
    justify-content: flex-end;
  }

  .do-btns {
    display: flex;
    align-items: center;
  }

  .do-btn {
    border-radius: 12px;
    border: 1px solid rgba(249, 249, 249, 0.5);

    width: 52px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    font-size: 12px;
    font-weight: bold;
    box-sizing: border-box;

    a {
      color: rgba(255, 255, 255, 1);
    }

    & + .do-btn {
      margin-left: 12px;
    }
  }

  .title-wrap {
    font-size: 12px;
    font-weight: 600;
  }
</style>

<style lang="scss" scoped>
  .token-dropdown {
    position: absolute !important;
    top: 50px;
    left: 40px;
    width: 76px;
    border-radius: 7px;
    z-index: 1;

    ::v-deep .fg-dropdown__display {
      background-color: unset;
      border-radius: unset;
      height: 23px;
      line-height: 23px;
      color: #222222;

      .arrow-down::after {
        margin-left: 1vw;
        width: 3vw;
        height: 2vw;
      }
    }

    &.hidden {
      ::v-deep .fg-dropdown__display {
        .arrow-down::after {
          display: none;
        }
      }
    }

    ::v-deep .fg-dropdown-item__selected::after {
      height: 2.8vw;
      width: 2.8vw;
    }

    @media (max-width: 767px) and (min-width: 320px) {
      ::v-deep .fg-dropdown__body {
        top: 38px;
        border-radius: 10px;
      }
    }

    ::v-deep .fg-dropdown-item {
      padding: 4px 10px;
    }
  }

  .thirdParty-right-top {
    font-size: 12px;
    font-weight: 500;
    color: rgba(158, 158, 158, 1);
    line-height: 28px;
  }

  .thirdParty-right-bottom {
    display: flex;
    font-size: 16px;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 32px;

    .token {
      margin-left: 4px;
    }
  }
</style>

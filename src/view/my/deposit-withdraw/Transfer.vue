<template>
  <div class="transfer has-bottom-action-btn">
    <div class="title">划转</div>

    <div :class="{ toggle: !isDepositToThirdParty }" class="transfer-wrapper">
      <div class="item">
        <div class="transfer-item transfer-from">
          从
          <fg-dropdown
            :data-list="SelfAccountList"
            class="transfer-dropdown"
          ></fg-dropdown>
        </div>
        <div class="amount-tip">
          余额：{{
            SelfAccountSelectedItemBalances
              | findCoinAndGetAmount(selectedToken)
          }}
        </div>
      </div>
      <div class="toggle-icon__wrap">
        <div class="toggle-icon" @click="toggle"></div>
      </div>
      <div class="item">
        <div class="transfer-item transfer-to">
          到
          <fg-dropdown
            :data-list="ThirdPartyList"
            class="transfer-dropdown"
            @selectItem="selectTransferToItem"
          >
          </fg-dropdown>
        </div>
        <div class="amount-tip">
          余额：{{
            transferToItemBalances | findCoinAndGetAmount(selectedToken)
          }}
        </div>
      </div>
    </div>

    <div class="chain-title">币种</div>
    <fg-dropdown
      :data-list="SupportedCoinList"
      @selectItem="selectToken"
    ></fg-dropdown>

    <div class="label">划转数量</div>
    <van-cell-group>
      <van-field v-model="amount" placeholder="请输入划转数量" />
      <div class="field-right">
        <div class="usdt">{{ selectedToken.name }}</div>
        <!--<div class="usdt">USDT |</div>-->
        <!--<div class="all">全部</div>-->
      </div>
    </van-cell-group>

    <div v-if="!loading" class="transfer-btn" @click="transferSubmit">划转</div>
    <van-loading v-show="loading" size="48px" vertical>
      加载中..
    </van-loading>
  </div>
</template>

<script>
import DepositWithdraw from './mixin/deposit-withdraw'
import { mapActions, mapGetters } from 'vuex'
import { CellGroup, Field, Loading } from 'vant'
import Storage from '@/utils/storage'
import { getThirdPartyList, getUserInfoById, thirdPartyLogin, transferThirdParty } from '@/api'

export default {
  name: 'Transfer',
  components: {
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [Loading.name]: Loading,
  },
  filters: {
    findCoinAndGetAmount(list, selectedToken) {
      if (!list) return '-'
      const obj = list.find(o => o.name === selectedToken.name)
      if (obj && obj.hasOwnProperty('amount')) {
        return obj['amount']
      }
      return '-'
    },
  },
  mixins: [DepositWithdraw],
  data() {
    return {
      loading: false,
      isDepositToThirdParty: true, // 默认是从平台划转到第三方，所以对第三方来说默认是充值

      transferToItem: {},
      ThirdPartyList: [],

      amount: '',
      getThirdPartyInfoFinished: false,
    }
  },
  computed: {
    ...mapGetters([
      'VG__coinList',
      'VG__userInfo',
      'VG__getCoinLabelById',
      'VG__getCoinInfoById',
      'VG__getCoinIdByLabel',
      'VG__getCoinDecimalPlacesByLabel',
      'VG__getUSDTId',
    ]),
    SelfAccountList() {
      return [
        {
          name: '余额账户',
          balances: this.VG__userInfo.balances
            .map(o => ({
              ...o,
              ...this.VG__coinList.find(p => o.coin === p.id),
            }))
            .filter(o => o.isCrypto),
        },
      ]
    },
    SelfAccountSelectedItem() {
      return this.SelfAccountList[0]
    },
    SelfAccountSelectedItemBalances() {
      return this.SelfAccountSelectedItem.balances || []
    },
    transferToItemBalances() {
      return (this.transferToItem && this.transferToItem.balances) || []
    },
  },
  watch: {
    getThirdPartyInfoFinished() {
      if (this.transferToItem.id) {
        this.transferToItem = this.ThirdPartyList.find(
          o => o.id === this.transferToItem.id
        )
      } else {
        this.transferToItem = this.ThirdPartyList[0]
      }
    },
  },
  created() {
    this.loading = true

    this.__getUserInfoById()
    this.__getThirdPartyInfo()
  },
  methods: {
    ...mapActions('user', ['VA__setUserInfo']),

    toggle() {
      this.isDepositToThirdParty = !this.isDepositToThirdParty
    },
    selectTransferToItem(o) {
      this.transferToItem = o
    },

    transferSubmit() {
      if (this.amount === '' || +this.amount === 0) {
        this.$toast('请输入金额！')
        return
      }
      const data = {
        amount: this.amount,
        type: this.isDepositToThirdParty ? 0 : 1,
        third_party: this.transferToItem.id,
        coin: this.selectedToken.id,
        login_token: this.transferToItem.loginToken,
      }
      transferThirdParty(data)
        .then(res => {
          console.log(res)
          this.amount = ''
          this.__getUserInfoById()
          this.__getThirdPartyInfo()
          this.$toast('划转成功！')
        })
        .catch(err => {
          this.amount = ''
          this.$toast('划转失败！')
          console.log(err)
        })
    },
    __getUserInfoById() {
      console.log('this.VG__userInfo.id:', this.VG__userInfo.id)
      getUserInfoById(this.VG__userInfo.id)
        .then(res => {
          console.log('getUserInfoById-res:', res)
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
    __getThirdPartyInfo() {
      this.getThirdPartyInfoFinished = false
      getThirdPartyList()
        .then(res => {
          console.log('getThirdPartyList-res:', res)
          if (!res) {
            return
          }
          const ThirdPartyList = []
          // 2021.08.16 配合新API，資料放res.data裡
          res.data.results.length &&
            res.data.results.forEach(async o => {
              await thirdPartyLogin({ third_party: o.id }) // 异步转同步
                .then(r => {
                  if (!r) {
                    return
                  }
                  console.log(
                    `thirdPartyLogin,id=${o.id},r=${JSON.stringify(r, null, 2)}`
                  )
                  // balances有length的应用才可以划转
                  r.balances.length &&
                    ThirdPartyList.push({
                      loginToken: r.login_token,
                      id: o.id,
                      name: o.name, // 第三方应用的名字
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
              console.log(
                `ThirdPartyList: ${JSON.stringify(ThirdPartyList, null, 2)}`
              )
              this.ThirdPartyList = ThirdPartyList
              this.getThirdPartyInfoFinished = true
              this.loading = false
              Storage.setLocal('ThirdPartyList', ThirdPartyList)
            })
        })
        .catch(err => {
          console.log(err)
        })
    },
  },
}
</script>

<style lang="scss" scoped>
@import './common.scss';
.transfer-wrapper {
  display: flex;
  flex-direction: column;
  &.toggle {
    flex-direction: column-reverse;
  }
}
.transfer-item {
  display: flex;
  align-items: center;

  font-size: 14px;
  font-weight: bold;
  color: rgba(179, 179, 179, 1);
  line-height: 2.5;
  position: relative;

  border: 1px solid #747474;
  padding-left: 10px;
  > span {
    color: rgba(66, 66, 66, 1);
  }
  .transfer-dropdown {
    flex: 1;
    ::v-deep.fg-dropdown__display {
      background-color: transparent;
    }
  }
  &::before {
    margin-right: 10px;
    content: '';
    display: inline-block;
    width: 12px;
    height: 12px;
    background: rgba(44, 89, 255, 1);
    border-radius: 50%;
  }
  &.transfer-to::before {
    background: rgba(241, 60, 77, 1);
  }
}
.amount-tip {
  margin-top: 4px;
  color: #fff;
  font-size: 12px;
}

.toggle-icon__wrap {
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.toggle-icon {
  width: 30px;
  height: 30px;
  background-image: url(~./exchange@2x.png);
  background-size: 100%;
  background-repeat: no-repeat;
}
.transfer-btn {
  position: absolute;
  left: 5vw;
  bottom: 80px;
  width: 90vw;
  height: 46px;
  line-height: 46px;
  text-align: center;
  background: rgba(255, 193, 0, 1);
  border-radius: 2px;
  font-size: 18px;
  font-weight: bold;
  color: rgba(34, 34, 34, 1);
  &:active {
    background: #ce9c00;
  }
}

.label {
  margin-top: 30px;
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: bold;
  color: #ffffff;
}
.input {
  font-size: 18px;
}
::v-deep .van-cell {
  padding-left: 0;
  background-color: #111111;
}
.field-right {
  position: absolute;
  right: 10px;
  top: 1em;
  display: flex;
}
.usdt {
  font-size: 14px;
  font-weight: bold;
  color: #888888;
}
.all {
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  margin-left: 6px;
}
::v-deep .van-field__control {
  color: #fff;
}
::v-deep [class*='van-hairline']::after {
  border: none;
  border-bottom: 1px solid #595959;
}
::v-deep .van-cell:not(:last-child)::after {
  border: none;
}
// 保证内容不会被底部的操作按钮遮挡住
.components.has-bottom-action-btn {
  padding-bottom: 90px;
}
</style>

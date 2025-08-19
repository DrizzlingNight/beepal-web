<template>
  <div>
    <div class="page-top-safe-area__has-page-title ">
      <div class="back-arrow" @click="$router.go(-1)"></div>
      <div v-if="components.length" class="btns">
        <div
          v-for="(o, i) in components"
          :key="i"
          :class="{ 'btn-item__active': curIdx === i }"
          :style="{ width: 100 / components.length + '%' }"
          class="btn-item"
          @click="curIdx = i"
        >
          {{ o.name }}
        </div>
      </div>
      <div class="list-icon" @click="$router.push('/depositWithdrawHistory')"></div>
    </div>
    <div class="main-content">
      <component :is="curComp" class="components"></component>
    </div>
  </div>
</template>

<script>
import { settings } from '@/config'
import { Cell, CellGroup } from 'vant'
import { Decimal } from 'decimal.js'
import Deposit from './Deposit'
import Withdraw from './Withdraw'
import Assign from './Assign'
// import Transfer from './Transfer'

export default {
  name: 'DepositWithdraw',
  components: {
    [CellGroup.name]: CellGroup,
    [Cell.name]: Cell,
  },
  data() {
    return {
      Decimal,
      curIdx: 0,
      components: [
        {
          id: 0,
          name: this.$t('my.depositWithdraw.tab_1'),
          comp: Deposit,
        },
        {
          id: 1,
          name: settings.withdrawIsAssign ? "划分" : this.$t('my.depositWithdraw.tab_2'),
          comp: settings.withdrawIsAssign ? Assign : Withdraw,
        },
        // {
        //   id: 2,
        //   name: '划转',
        //   comp: Transfer,
        // },
      ],
    }
  },
  computed: {
    curComp() {
      return this.components[this.curIdx].comp
    },
  },

  created() {
    // console.log(this.$route.query)
    // 如果未登录则提示登录，如果已经登录则展示信息
    const type = this.$route.query.type
    type && (this.curIdx = Number(type))
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.page-top-safe-area__has-page-title {
  display: flex;
  align-items: center;
}
.back-arrow {
  top: 30px;
}
.btns {
  text-align: center;
  height: 26px;
  line-height: 26px;
  border-radius: 3px;
  border: 1px solid rgba(72, 72, 72, 1);
  display: flex;
  // 调整位置
  width: 60vw;
  margin-left: 20vw;
  box-sizing: border-box;
  .btn-item {
    text-align: center;
    border-radius: 3px;
    color: #ffffff;
    &__active {
      color: #222222;
      background: rgba(255, 193, 0, 1);
    }
  }
}
.components {
  padding: 14px;
}
.list-icon {
  width: 18px;
  height: 20px;
  background-repeat: no-repeat;
  background-size: 100%;
  background-image: url(~@/assets/icons/list.png);

  position: absolute;
  right: 20px;
  top: 26px;
}
</style>

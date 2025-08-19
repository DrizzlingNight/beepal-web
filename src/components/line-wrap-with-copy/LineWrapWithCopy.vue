<template>
  <div class="line-wrap__with-copy">
    <div class="label">{{ label }}：</div>
    <div class="value">{{ value }}</div>
    <div class="copy">{{ copy }}</div>
  </div>
</template>

<script>
export default {
  name: 'LineWrapWithCopy',
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    copy: {
      type: String,
      default: '複製',
    },
  },
}
</script>

<style lang="scss" scoped>
.line-wrap__with-copy {
  display: flex;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  border-bottom: 1px solid #979797;
  margin-top: 1em;

  .label {
    font-weight: 400;
    color: rgba(85, 85, 85, 1);
  }
  .value {
    font-weight: 500;
    color: rgba(46, 46, 46, 1);
  }
  .copy {
    margin-left: auto;
    width: 72px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background: rgba(17, 142, 234, 1);
    border-radius: 2px;
    border: 1px solid rgba(19, 130, 212, 1);
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
  }
}
</style>

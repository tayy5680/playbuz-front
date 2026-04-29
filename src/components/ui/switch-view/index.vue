<template>
  <el-switch
    class="switchView__wrap"
    inline-prompt
    :active-text="active"
    :inactive-text="inactive"
    :value="switchBol"
  />
</template>

<script>
export default {
  name: 'switch-ui-view',

  props: {
    switchBol: {
      type: Boolean,
      default: () => false,
    },

    active: {
      type: String,
      default: () => 'ON',
    },

    inactive: {
      type: String,
      default: () => 'OFF',
    },
  },
}
</script>

<style lang="scss">
.switchView__wrap.el-switch {
  display: block;
  width: 68px !important;
  height: 28px;

  .el-switch__core {
    width: 68px !important;
    height: 28px;
    background: transparent;
    border: 2px #706a75 solid;
    border-radius: 9999px;

    .el-switch__action {
      top: 50%;
      left: 2px;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      background: #706a75;
      box-shadow: 0 0 8px 0 #282729;
    }
  }

  .el-switch__label {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
    margin: 0;
    color: #706a75;

    &.el-switch__label--left {
      right: 10px;
    }

    &.el-switch__label--right {
      left: 10px;
      opacity: 0;
    }
  }

  &.is-checked {
    .el-switch__core {
      background: #7c41ab;
      border: 2px #7c41ab solid;

      .el-switch__action {
        left: calc(100% - 2px);
        margin-left: 0;
        transform: translate(-100%, -50%);
        background: #fff;
        box-shadow: 0 0 8px 0 #522e52;
      }
    }

    .el-switch__label {
      color: #fff;

      &.el-switch__label--left {
        opacity: 0;
      }

      &.el-switch__label--right {
        opacity: 100%;
      }
    }
  }
}
</style>

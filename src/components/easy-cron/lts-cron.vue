<template>
  <div class="input-cron">
    <v-text-field
      label="Cron表达式"
      slot="reference"
      :readonly="true"
      @click="showConfigDlg"
      v-model="editCronValue"
    ></v-text-field>

    <Modal
      v-model="show"
      title="配置Cron表达式"
      :closable="true"
      :width="`${width + 50}`"
      :footer-hide="true"
    >
      <div>
        <easy-cron
          v-model="editCronValue"
          :style="`width: ${width}px`"
          :exeStartTime="exeStartTime"
          :hideYear="hideYear"
          :remote="remote"
          :hideSecond="hideSecond"
        ></easy-cron>
      </div>
    </Modal>
  </div>
</template>

<script>
import EasyCron from "./index";

export default {
  name: "input-cron",
  model: {
    prop: "cronValue",
    event: "change"
  },
  props: {
    cronValue: {
      type: String,
      default: ""
    },
    width: {
      type: Number,
      default: 700
    },
    placeholder: {
      type: String,
      default: "请输入cron表达式"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    exeStartTime: {
      type: [Number, String, Object],
      default: 0
    },
    hideSecond: {
      type: Boolean,
      default: false
    },
    hideYear: {
      type: Boolean,
      default: false
    },
    remote: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      editCronValue: this.cronValue,
      show: false
    };
  },
  watch: {
    cronValue(newVal) {
      if (newVal === this.editCronValue) {
        return;
      }
      this.editCronValue = newVal;
    },
    editCronValue(newVal) {
      this.$emit("change", newVal);
    }
  },
  methods: {
    showConfigDlg() {
      if (!this.disabled) {
        this.show = true;
      }
    }
  },
  components: {
    EasyCron
  }
};
</script>

<style scoped>
.input-cron .ivu-input-wrapper {
  width: 100% !important;
}

.config-btn {
  cursor: pointer;
}

.config-btn:hover {
  color: #2d8cf0;
}
</style>

<template>
  <div id="editor">
    <toolbar @save="saveData" @exit="exit" @change-eage="changeEage" />
    <div :style="{ height: '42px' }"></div>
    <div class="bottom-container">
      <context-menu />

      <div id="itempannel">
        <ul>
          <el-input
            placeholder="请输入过滤组名"
            v-model="filter"
            class="input-with-select"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              v-on:click="submit"
            ></el-button>
          </el-input>
          <li
            v-for="job in jobsList"
            :data-shape="job.id"
            class="getItem"
            data-type="node"
            data-size="170*34"
          >
            <span class="pannel-type-icon"></span>{{ job.id + ":" + job.name }}
          </li>
        </ul>
      </div>
      <div id="detailpannel">
        <div id="node_detailpannel" data-status="node-selected" class="pannel">
          <div class="pannel-title">模型详情</div>
          <div class="block-container">
            <div v-if="selectedModel && selectedModel.type === 'node'">
              <div v-if="selectedModel.shape === 'factory-card'">
                <el-form label-width="80px" label-position="left">
                  <el-form-item label="名称：" prop="label">
                    <el-input v-model="inputingLabel" />
                  </el-form-item>
                  <el-form-item label="字体颜色：" prop="color">
                    <el-color-picker v-model="color" size="mini" />
                  </el-form-item>
                </el-form>
              </div>
              <div
                v-if="
                  selectedModel.shape === 'k-means' ||
                    selectedModel.shape === 'random-forest'
                "
              >
                <el-form label-width="60px">
                  <el-form-item label="名称：">
                    <el-input v-model="inputingLabel" />
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </div>
        </div>
        <div
          id="node_detailpannel2"
          data-status="group-selected"
          class="pannel"
        >
          <div class="pannel-title">群组详情</div>
          <div class="block-container">
            <el-input v-model="inputingLabel" />
          </div>
        </div>
        <div
          id="canvas_detailpannel"
          data-status="canvas-selected"
          class="pannel"
        >
          <div class="pannel-title">画布</div>
          <div class="block-container">
            <el-checkbox @change="toggleGrid">网格对齐</el-checkbox>
          </div>
        </div>
      </div>
      <navigator
        :cur-zoom="curZoom"
        :min-zoom="minZoom"
        :max-zoom="maxZoom"
        @change-zoom="changeZoom"
      />
      <page />
    </div>
  </div>
</template>

<script>
import Navigator from "./navigator";
import Toolbar from "./toolbar";
import ContextMenu from "./context-menu";
import Page from "./page";
import Editor from "./editor";
import "./register-items.js";
import JobRegister from "./register-items.js";
import { getAllJobsByUser } from "@/api/workFlow";

export default {
  props: {
    flowEditorInfo: {
      type: Object
    }
  },
  components: {
    Navigator,
    Toolbar,
    ContextMenu,
    Page
  },
  extends: Editor,
  data() {
    return {
      filter: "",
      temp: "base-flow-editor",
      tempInputingLabel: "",
      tempColor: "",
      jobs: [],
      jobsList: []
    };
  },
  computed: {
    inputingLabel: {
      get() {
        return this.tempInputingLabel !== null
          ? this.tempInputingLabel
          : this.selectedModel.label;
      },
      set(value) {
        this.updateGraph("label", value);
        this.tempInputingLabel = null;
      }
    },
    color: {
      get() {
        return this.tempColor !== null
          ? this.tempColor
          : this.selectedModel.color;
      },
      set(value) {
        this.updateGraph("color", value);
        this.tempColor = null;
      }
    }
  },
  mounted() {
    const page = this.page;

    page.changeAddEdgeModel({
      shape: "line"
    });

    // 输入锚点不可以连出边
    page.on("hoveranchor:beforeaddedge", ev => {
      if (ev.anchor.type === "input") {
        ev.cancel = true;
      }
    });
    page.on("dragedge:beforeshowanchor", ev => {
      // 只允许目标锚点是输入，源锚点是输出，才能连接
      if (
        !(ev.targetAnchor.type === "input" && ev.sourceAnchor.type === "output")
      ) {
        ev.cancel = true;
      }
      // 如果拖动的是目标方向，则取消显示目标节点中已被连过的锚点
      if (
        ev.dragEndPointType === "target" &&
        page.anchorHasBeenLinked(ev.target, ev.targetAnchor)
      ) {
        // ev.cancel = true;
      }
      // 如果拖动的是源方向，则取消显示源节点中已被连过的锚点
      if (
        ev.dragEndPointType === "source" &&
        page.anchorHasBeenLinked(ev.source, ev.sourceAnchor)
      ) {
        // ev.cancel = true;
      }
    });

    getAllJobsByUser({
      pageNum: 1,
      pageSize: 10000
    }).then(data => {
      this.jobs = data.list;
      this.jobs.forEach(job => {
        JobRegister.registerJob(job.id, job.name);
      });

      this.jobsList = this.jobs;
      if (this.flowEditorInfo != null) {
        page.read(this.flowEditorInfo);
      }
    });
  },
  methods: {
    submit() {
      const vueThis = this;
      if ("" !== vueThis.filter) {
        vueThis.jobsList = null;
        getAllJobsByUser({
          pageNum: 1,
          pageSize: 10000
        }).then(data => {
          vueThis.jobsList = [];
          vueThis.jobs = [];
          let list = data.list;
          let j = 0;
          for (let i = 0; i < list.length; i++) {
            if (list[i].group == vueThis.filter) {
              vueThis.jobs[j++] = list[i];
              JobRegister.registerJob(list[i].id, list[i].name);
            }
          }
          vueThis.jobsList = vueThis.jobs;
        });
      }
    },
    saveData() {
      console.log(this.page.save());
      console.log(this.page.save().nodes);
      var nodes = this.page.save().nodes;
      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          if (nodes[i].shape === nodes[j].shape) {
            alert("添加的任务有重复的，请删除后保存！");
            return;
          }
        }
      }
      this.$emit("save", this.page.save());
    },
    exit() {
      history.back();
    },
    changeEage(type) {
      this.page.changeAddEdgeModel({
        shape: type
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.md-app {
  max-height: 400px;
  border: 1px solid rgba(#000, 0.12);
}

// Demo purposes only
.md-drawer {
  width: 230px;
  max-width: calc(100vw - 125px);
}
</style>

<style lang="scss" scoped>
#itempannel {
  height: 100%;
  position: absolute;
  left: 0px;
  z-index: 2;
  background: #f7f9fb;
  width: 300px;
  padding-top: 8px;
  border-right: 1px solid #e6e9ed;
  text-align: left;
}
#itempannel ul {
  padding: 0px;
  padding-left: 16px;
}
#itempannel li {
  color: rgba(0, 0, 0, 0.65);
  border-radius: 4px;
  width: 280px;
  height: 28px;
  line-height: 26px;
  padding-left: 8px;
  border: 1px solid rgba(0, 0, 0, 0);
  list-style-type: none;
}
#itempannel .pannel-type-icon {
  width: 16px;
  height: 16px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
  background: url(https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg);
}
#itempannel li:hover {
  background: white;
  border: 1px solid #ced4d9;
  cursor: move;
}
#detailpannel {
  height: 100%;
  position: absolute;
  right: 0px;
  z-index: 2;
  background: #f7f9fb;
  width: 200px;
  border-left: 1px solid #e6e9ed;
}
#detailpannel .pannel {
  display: none;
}
#detailpannel .block-containe {
  padding-top: 20px;
}
#detailpannel .input {
  margin-left: 16px;
}
#detailpannel .name-input {
  width: 120px;
}
#detailpannel .width-input {
  width: 52px;
}
#detailpannel .height-input {
  width: 52px;
}
#detailpannel .block-container {
  padding: 16px 8px;
  text-align: left;
}
.bottom-container {
  position: relative;
}
.pannel-title {
  height: 32px;
  border-top: 1px solid #dce3e8;
  border-bottom: 1px solid #dce3e8;
  background: #ebeef2;
  color: #000;
  line-height: 28px;
  padding-left: 12px;
}
.color-picker {
  vertical-align: middle;
  margin-left: 16px;
}
.p {
  margin-bottom: 12px;
}
</style>

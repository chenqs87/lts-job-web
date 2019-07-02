<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-container grid-list-xl fluid>
      <div style="float: right">
        <v-btn color="primary" dark class="mb-2" v-on:click="switchUF">{{
          switchUFBtn
        }}</v-btn>
        <v-btn
          color="primary"
          dark
          class="mb-2"
          v-on:click="dialog = true"
          v-if="switchUFBtn === '切换用户组工作流'"
        >
          新建工作流
        </v-btn>
        <v-btn color="primary" dark class="mb-2" @click.stop="openImportData"
          >新建数据导入工作流</v-btn
        >
      </div>

      <v-data-table
        :headers="headers"
        :items="desserts"
        class="elevation-1"
        :pagination.sync="pagination"
        :total-items="totalDesserts"
        :rows-per-page-items="[10, 15, 20, 25, 30]"
      >
        <template v-slot:items="props">
          <tr @dblclick="props.expanded = !props.expanded">
            <td>{{ props.item.id }}</td>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.cron }}</td>
            <td>{{ props.item.postFlow }}</td>
            <td>{{ props.item.createUser }}</td>
            <td>{{ props.item.isSchedule === 0 ? "否" : "是" }}</td>
            <td>{{ props.item.startTime  }}</td>
            <td>{{ props.item.createTime }}</td>

            <td class="justify-center layout px-0">
              <v-tooltip
                v-if="(permitRule['FlowAuthorized'] & props.item['permit']) > 0"
                top
              >
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" small class="mr-2" @click="auth(props.item)"
                    >lock_open</v-icon
                  >
                </template>
                <span>授权</span>
              </v-tooltip>

              <v-tooltip
                top
                v-if="(permitRule['FlowExec'] & props.item['permit']) > 0"
              >
                <template v-slot:activator="{ on }">
                  <v-icon
                    v-on="on"
                    small
                    class="mr-2"
                    @click="trigger(props.item)"
                  >
                    play_circle_outline
                  </v-icon>
                </template>
                <span>执行工作流</span>
              </v-tooltip>

              <v-tooltip
                top
                v-if="(permitRule['FlowCron'] & props.item['permit']) > 0"
              >
                <template v-slot:activator="{ on }">
                  <v-icon
                    v-if="props.item.isSchedule === 0"
                    v-on="on"
                    small
                    class="mr-2"
                    v-on:click="openCron(props.item)"
                    >play_arrow
                  </v-icon>
                  <v-icon
                    v-on="on"
                    v-else
                    small
                    class="mr-2"
                    v-on:click="openCron(props.item)"
                    >stop
                  </v-icon>
                </template>
                <span>{{
                  props.item.isSchedule === 0 ? "启动定时任务" : "终止定时任务"
                }}</span>
              </v-tooltip>

              <v-tooltip
                top
                v-if="(permitRule['FlowEdit'] & props.item['permit']) > 0"
              >
                <template v-slot:activator="{ on }">
                  <v-icon
                    v-on="on"
                    small
                    class="mr-2"
                    @click="editFlow(props.item)"
                    >share</v-icon
                  >
                </template>
                <span>编辑工作流</span>
              </v-tooltip>

              <v-tooltip
                top
                v-if="(permitRule['FlowEdit'] & props.item['permit']) > 0"
              >
                <template v-slot:activator="{ on }">
                  <v-icon
                    v-on="on"
                    small
                    class="mr-2"
                    @click="editItem(props.item)"
                    >edit</v-icon
                  >
                </template>
                <span>编辑</span>
              </v-tooltip>

              <v-tooltip
                top
                v-if="(permitRule['FlowDelete'] & props.item['permit']) > 0"
              >
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" small @click="delFlow(props.item)"
                    >delete</v-icon
                  >
                </template>
                <span>删除</span>
              </v-tooltip>

              <v-tooltip
                top
                v-if="(permitRule['FlowView'] & props.item['permit']) > 0"
              >
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" small @click="history(props.item.id)"
                    >history</v-icon
                  >
                </template>
                <span>执行历史</span>
              </v-tooltip>
            </td>
          </tr>
        </template>

        <template v-slot:expand="props">
          <v-card flat>
            <v-card-text>
              工作流参数：<br />
              {{ props.item.params }}
            </v-card-text>
          </v-card>
        </template>
      </v-data-table>
      <!-- 授权对话框 -->
      <v-dialog v-model="permitAuthDialog" persistent max-width="1000">
        <select-auth
          authType="flow"
          :resource="editedItem.id"
          :permit="editedItem.permit"
          @close="cancelAuthDialog"
          @save="queryTasks"
        ></select-auth>
      </v-dialog>

      <!-- 确认对话框 -->
      <v-dialog v-model="zDialog" persistent max-width="500">
        <z-dialog
          :message="zMessage"
          @close="cancelZDialog"
          @agree="doCron"
        ></z-dialog>
      </v-dialog>
      <!-- 添加导入数据流 -->
      <v-dialog v-model="importDataDialog" persistent maxWidth="1000">
        <v-stepper v-model="e1">
          <v-stepper-header>
            <v-stepper-step :complete="e1 > 1" step="1">配置组</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="e1 > 2" step="2"
              >校验数据大小</v-stepper-step
            >
            <v-divider></v-divider>
            <v-stepper-step :complete="e1 > 3" step="3"
              >校验数据内容</v-stepper-step
            >
            <v-divider></v-divider>
            <v-stepper-step step="4">配工作流参数</v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <div>
                <v-flex xs12 sm6 md12>
                  <v-text-field
                    v-model="ipData.group"
                    label="分组"
                    :rules="[() => !!ipData.group || 'group is required']"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md12>
                  <input-cron
                    type="text"
                    v-model="ipData.cron"
                    placeholder="请输入cron表达式"
                  />
                </v-flex>
              </div>
              <v-btn
                color="primary"
                @click="e1 = 2"
                :disabled="ipData.group === '' || ipData.cron === ''"
                >下一步</v-btn
              >
              <v-btn flat @click="e1 = 1">上一步</v-btn>
            </v-stepper-content>
            <v-stepper-content step="2">
              <div width="100%" height="100%">
                <v-select
                  :items="handlerList"
                  label="Handler"
                  v-model="ipData.sizeHandler"
                ></v-select>
                <editor
                  v-model="ipData.size"
                  :options="{ fontSize: 18 }"
                  @init="editorInit"
                  lang="sh"
                  theme="pastel_on_dark"
                  width="100%"
                  height="300"
                ></editor>
              </div>
              <v-btn
                color="primary"
                @click="e1 = 3"
                :disabled="ipData.size === '' || ipData.sizeHandler === ''"
                >下一步</v-btn
              >
              <v-btn flat @click="e1 = 1">上一步</v-btn>
            </v-stepper-content>
            <v-stepper-content step="3">
              <div width="100%">
                <v-select
                  :items="handlerList"
                  label="Handler"
                  v-model="ipData.contentHandler"
                ></v-select>
                <editor
                  v-model="ipData.content"
                  :options="{ fontSize: 18 }"
                  @init="editorInit"
                  lang="sh"
                  theme="pastel_on_dark"
                  width="100%"
                  height="300"
                ></editor>
              </div>

              <v-btn
                color="primary"
                @click="e1 = 4"
                :disabled="
                  ipData.content === '' || ipData.contentHandler === ''
                "
                >下一步</v-btn
              >
              <v-btn flat @click="e1 = 2">上一步</v-btn>
            </v-stepper-content>

            <v-stepper-content step="4">
              <div
                v-if="displaySample"
                style="float: left;width: 100%;height:100%"
              >
                <editor
                  v-model="cardText"
                  :options="{ fontSize: 18 }"
                  @init="editorInit"
                  lang="sh"
                  theme="pastel_on_dark"
                  width="100%"
                  height="300"
                ></editor>
              </div>
              <div v-else style="float: left;width: 100%;height:100%">
                <v-select
                  :items="handlerList"
                  label="Handler"
                  v-model="ipData.importDataHandler"
                ></v-select>
                <editor
                  v-model="ipData.config"
                  :options="{ fontSize: 18 }"
                  @init="editorInit"
                  lang="sh"
                  theme="pastel_on_dark"
                  width="100%"
                  height="300"
                ></editor>
              </div>
              <div style="width: 100%">
                <v-btn color="primary" @click="displaySample = !displaySample"
                  >样例配置</v-btn
                >
                <v-btn
                  color="primary"
                  @click="saveImportData"
                  :disabled="
                    ipData.config === '' || ipData.importDataHandler === ''
                  "
                  >提交</v-btn
                >
                <v-btn flat @click="e1 = 3">上一步</v-btn>
              </div>
            </v-stepper-content>
          </v-stepper-items>

          <v-btn style="float:right" flat @click="importDataDialog = false"
            >取消</v-btn
          >
        </v-stepper>
      </v-dialog>
    </v-container>

    <v-dialog v-model="dialog" max-width="800px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md12>
                <v-text-field
                  v-model="editedItem.name"
                  label="工作流名称"
                  :validate-on-blur="true"
                  :rules="[
                    () => !!editedItem.name || 'name is required',
                    () =>
                      (!!editedItem.name && editedItem.name.length <= 45) ||
                      'name must be less than 45 characters'
                  ]"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md12>
                <input-cron
                  type="text"
                  v-model="editedItem.cron"
                  placeholder="请输入cron表达式"
                />
              </v-flex>
              <v-flex xs12 sm6 md12>
                <v-textarea
                  v-model="editedItem.params"
                  label="工作流参数"
                ></v-textarea>
              </v-flex>
              <v-flex xs12 sm6 md12>
                <v-text-field
                  v-model="editedItem.postFlow"
                  label="子工作流（多个id使用逗号分隔）"
                ></v-text-field>
              </v-flex>

              <v-flex xs12 sm6 md12>
                <v-textarea
                  v-model="editedItem.phoneList"
                  label="手机号（失败告警，多个使用逗号分隔）"
                ></v-textarea>
              </v-flex>

              <!--<v-flex xs12 sm6 md12>
                                <v-textarea v-model="editedItem.emailList"
                                            label="电子邮件（失败告警，多个使用逗号分隔）"></v-textarea>
                            </v-flex>-->
            </v-layout>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="triggerAlertDialog" persistent max-width="1000">
      <v-card>
        <v-card-title class="headline">参数</v-card-title>
        <v-card-text>
          <editor
            v-model="triggerParams"
            :options="{ fontSize: 18 }"
            @init="editorInit"
            lang="sh"
            theme="pastel_on_dark"
            width="100%"
            height="300"
          ></editor>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click="closeTriggerDialog"
            >取消</v-btn
          >
          <v-btn color="green darken-1" flat @click="doTrigger">提交</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import ZDialog from "@/components/Dialog";
import SelectAuth from "@/components/workflow/SelectAuth";
import ModelFlowEditor from "@/components/flow-editor/model-flow-editor";
import InputCron from "@/components//easy-cron/lts-cron";
import CronValidator from "@/components//easy-cron/validator";

import {
  getAllFlowsByUser,
  newFlow,
  updateFlow,
  deleteFlow,
  dataFormat,
  triggerFlow,
  startCronFlow,
  stopCronFlow,
  getFlowPermit,
  getAlertConfig,
  getAllFlowsByGroup,
  getActiveHandlers,
  importDataFlow,
  importConfig
} from "@/api/workFlow";

export default {
  components: {
    ModelFlowEditor,
    SelectAuth,
    ZDialog,
    editor: require("vue2-ace-editor"),
    InputCron,
    CronValidator
  },
  data: () => ({
    triggerAlertDialog: false,
    triggerParams: "",
    triggerFlowId: -1,

    displaySample: false,

    //zDialog默认为关闭
    zDialog: false,
    //存储点击start 或者stop 的 item值
    cronItem: "",
    //需要显示的message
    zMessage: "",
    //需要删除的索引值  默认为-1
    delIndex: -1,

    importDataDialog: false,

    switchUFBtn: "切换用户组工作流",
    permitAuthDialog: false,
    permitRule: {},
    totalDesserts: 0,
    pagination: {
      sortBy: "id",
      descending: true,
      rowsPerPage: 10
    },
    flowEditorInfo: "",
    dialog: false,
    handlerList: [],
    jobTypes: ["shell", "python"],
    currentUser: true,
    headers: [
      { text: "ID", value: "id", sortable: false },
      { text: "工作流名称", sortable: false, value: "name" },
      { text: "Cron表达式", value: "cron", sortable: false },
      { text: "子任务", value: "postFlow", sortable: false },
      /* {text: '参数', value: 'shardType', sortable: false},*/
      { text: "创建人", value: "createUser", sortable: false },
      { text: "是否调度", value: "isSchedule", sortable: false },
      { text: "下次执行", value: "startTime" },
      { text: "创建时间", value: "createTime" },
      { text: "操作", sortable: false }
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      id: -1,
      name: "",
      flowConfig: "",
      cron: "",
      flowStatus: 1,
      params: "",
      createUser: "",
      isSchedule: 0,
      startTime: "",
      createTime: "",
      postFlow: "",
      emailList: "",
      phoneList: ""
    },
    defaultItem: {
      id: -1,
      name: "",
      flowConfig: "",
      cron: "",
      flowStatus: 1,
      params: "",
      createUser: "",
      isSchedule: 0,
      startTime: "",
      createTime: "",
      postFlow: "",
      emailList: "",
      phoneList: ""
    },

    ipData: {
      group: "",
      cron: "",
      size: "echo $1",
      sizeHandler: "",
      content: "import sys\n" + "for line in sys.stdin:\n" + "\tprint(line)\n",
      contentHandler: "",
      config: "",
      importDataHandler: ""
    },

    defaultIpData: {
      group: "",
      cron: "",
      size: "echo $1",
      sizeHandler: "",
      content: "import sys\n" + "for line in sys.stdin:\n" + "\tprint(line)\n",
      contentHandler: "",

      config: "",
      importDataHandler: ""
    },

    cardText: importConfig,
    e1: 0
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "新建" : "编辑";
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    pagination: {
      deep: true,
      handler() {
        this.queryTasks();
      }
    }
  },
  created() {
    this.getPermitRule();
    this.getHandlers();
  },
  methods: {
    editorInit: function() {
      require("brace/ext/language_tools"); //language extension prerequsite...
      require("brace/mode/sh");
      require("brace/mode/javascript"); //language
      require("brace/mode/less");
      require("brace/theme/monokai");
      require("brace/theme/pastel_on_dark");
      require("brace/snippets/javascript"); //snippet
    },
    test(data) {
      console.log(data);
      this.fullscreen.dialog = false;
    },
    editFlow(item) {
      this.$router.push({
        path: "/workflow/flow-editor",
        query: { id: item.id, flowEditorInfo: item.flowEditorInfo }
      });
    },
    queryTasks() {
      let pageNum =
        this.pagination.page === null || this.pagination.page === undefined
          ? 1
          : this.pagination.page;
      let pageSize =
        this.pagination.rowsPerPage === null ||
        this.pagination.rowsPerPage === undefined
          ? 10
          : this.pagination.rowsPerPage;

      if (this.switchUFBtn === "切换用户个人工作流") {
        getAllFlowsByGroup(pageNum, pageSize).then(data => {
          this.desserts = data.list;
          this.totalDesserts = data.total;
          this.pagination.page = data["pageNum"];
          this.pagination.totalItems = data.total;
        });
      } else {
        getAllFlowsByUser(pageNum, pageSize).then(data => {
          this.desserts = data.list;
          this.totalDesserts = data.total;
          this.pagination.page = data["pageNum"];
          this.pagination.totalItems = data.total;
        });
      }
    },
    editItem(item) {
      getAlertConfig(item.id).then(data => {
        this.editedIndex = this.desserts.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.editedItem["emailList"] = data.emailList;
        this.editedItem["phoneList"] = data.phoneList;
        this.dialog = true;
      });
    },
    deleteItem(item) {
      const index = this.desserts.indexOf(item);
      if (confirm("Are you sure you want to delete this item?")) {
        deleteFlow(item.id).then(() => {
          this.desserts.splice(index, 1);
        });
      }
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    save() {
      const l = this;
      if (l.editedItem.postFlow !== null && l.editedItem.postFlow !== "") {
        let split = l.editedItem.postFlow.split(",");

        console.log(split);
        let numReg = /^[0-9]+$/;
        let numRe = new RegExp(numReg);

        for (let i = 0; i < split.length; i++) {
          if (!numRe.test(split[i])) {
            alert("子工作流需要都为数字！");
            return;
          }
        }
      }
      if (l.editedIndex > -1) {
        updateFlow(l.editedItem).then(data => {
          l.queryTasks();
        });
      } else {
        newFlow(l.editedItem).then(data => {
          l.queryTasks();
        });
      }
      l.close();
    },
    trigger(item) {
      this.triggerParams = item.params;
      this.triggerFlowId = item.id;
      this.triggerAlertDialog = true;
    },
    closeTriggerDialog() {
      this.triggerParams = "";
      this.triggerFlowId = -1;
      this.triggerAlertDialog = false;
    },
    doTrigger() {
      let flowId = this.triggerFlowId;
      triggerFlow(flowId, this.triggerParams).then(data => {
        this.closeTriggerDialog();
        this.$router.push({
          path: "/workflow/flow-tasks",
          query: { flowId: flowId }
        });
      });
    },
    history(flowId) {
      this.$router.push({
        path: "/workflow/flow-tasks",
        query: { flowId: flowId }
      });
    },
    delFlow(item) {
      this.cronItem = item;
      this.zMessage = "Are you sure you want to delete this flow?？";
      this.zDialog = true;
      this.delIndex = this.desserts.indexOf(item);
    },
    openCron(item) {
      this.cronItem = item;
      console.log(item.isSchedule);
      this.zMessage =
        "Are you sure you want" +
        (item.isSchedule === 0 ? "start" : "stop") +
        "this flow ？";
      this.zDialog = true;
    },
    doCron() {
      if (this.delIndex !== -1) {
        deleteFlow(this.cronItem.id).then(() => {
          this.desserts.splice(this.delIndex, 1);
        });
        this.delIndex = -1;
        this.cancelZDialog();
        return;
      }
      //启动定时任务
      if (this.cronItem.isSchedule === 0) {
        this.editedIndex = this.desserts.indexOf(this.cronItem);
        this.editedItem = Object.assign({}, this.cronItem);
        startCronFlow(this.cronItem.id).then(data => {
          //Object.assign(this.desserts[this.editedIndex], data);
          this.queryTasks();
        });
      }
      //停止定时任务
      if (this.cronItem.isSchedule === 1) {
        this.editedIndex = this.desserts.indexOf(this.cronItem);
        this.editedItem = Object.assign({}, this.cronItem);
        stopCronFlow(this.cronItem.id).then(data => {
          //Object.assign(this.desserts[this.editedIndex], data);
          this.queryTasks();
        });
      }
      this.cancelZDialog();
    },
    cancelAuthDialog() {
      this.permitAuthDialog = false;
    },
    cancelZDialog() {
      this.zDialog = false;
    },
    getPermitRule() {
      getFlowPermit().then(data => {
        this.permitRule = data;
      });
    },
    auth(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editedItem["permitSelected"] = [];
      let permit = this.editedItem.permit;
      for (let permitRuleKey in this.permitRule) {
        let cur = this.permitRule[permitRuleKey];
        if ((permit & cur) > 0) {
          this.editedItem["permitSelected"].push(cur);
        }
      }

      this.permitAuthDialog = true;
    },
    //点击按钮转换用户 组的Flow
    switchUF() {
      if (this.switchUFBtn === "切换用户组工作流") {
        this.switchUFBtn = "切换用户个人工作流";
      } else {
        this.switchUFBtn = "切换用户组工作流";
      }
      this.queryTasks();
    },
    saveImportData() {
      importDataFlow(this.ipData).then(data => {
        this.importDataDialog = false;
        this.queryTasks();
      });
    },
    getHandlers() {
      getActiveHandlers().then(data => {
        let hs = [];
        for (let handler in data) {
          hs.push(handler);
        }
        this.handlerList = hs;
      });
    },
    openImportData() {
      this.ipData = Object.assign({}, this.defaultIpData);
      this.e1 = 1;
      this.importDataDialog = true;
    }
  },
  filters: {
    formatDate: function(value) {
      //由于vue自带的时区为美国时区 需要转换为本地时区
      return new Date(dataFormat(value) + "Z").toLocaleString();
    }
  }
};
</script>

<style scoped>
.CodeMirror {
  font-family: monospace;
  height: 500px;
  color: black;
  direction: ltr;
}
table.v-table {
  border-radius: 2px;
  border-collapse: collapse;
  border-spacing: 0;
  width: 96%;
  max-width: 100%;
}
</style>

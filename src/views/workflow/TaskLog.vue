<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-container grid-list-xl fluid>
      <v-toolbar flat color="white">
        <!--
                <v-breadcrumbs :items="items" divider=">"></v-breadcrumbs>
-->
        <v-spacer></v-spacer>
        <v-icon small class="mr-2" v-on:click="getLog">refresh</v-icon>
      </v-toolbar>
      <v-card-text>
        <v-textarea
          :rows="rows"
          solo
          :readonly="true"
          :value="log"
          box
        ></v-textarea>
      </v-card-text>
    </v-container>
  </div>
</template>

<script>
import { queryLog } from "@/api/workFlow";
import Toolbar from "../layout/Toolbar";
import Icon from "../ui/Icon";
export default {
  components: { Icon, Toolbar },
  data: () => ({
    log: "",
    items: [],
    host: "",
    flowTaskId: -1,
    taskId: -1,
    shardStatus: -1,
    logName: ""
  }),
  created() {
    this.queryTasks();
  },
  computed: {
    rows() {
      return (window.innerHeight - 100) / 24;
    }
  },
  methods: {
    queryTasks() {
      let item = this.$route.query["item"];
      this.host = item["host"];
      this.flowTaskId = item["flowTaskId"];
      this.taskId = item["taskId"];
      this.shardStatus = item["shardStatus"];
      this.logName = item["logName"];
      this.items = [
        {
          text: "工作流",
          disabled: false,
          to: "/workflow/workflow"
        },
        {
          text: `工作流日志 ${item.flowId}`,
          disabled: false,
          to: `/workflow/flow-tasks?flowId=${item.flowId}`
        }
      ];

      this.getLog();
    },
    getLog() {
      queryLog(this.host, this.flowTaskId, this.taskId, 0, this.logName).then(
        data => {
          this.log = data;
        }
      );
    }
  }
};
</script>

<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-container grid-list-xl fluid>
      <v-toolbar flat color="white">
        <v-spacer></v-spacer>
        <v-btn color="primary" dark class="mb-2" v-on:click="queryTasks"
          >刷新</v-btn
        >
        <v-btn
          color="primary"
          dark
          class="mb-2"
          v-on:click="$router.push({ path: '/workflow/flow-tasks' })"
          >返回</v-btn
        >
      </v-toolbar>

      <v-data-table
        :headers="headers"
        :items="desserts"
        class="elevation-1"
        :pagination.sync="pagination"
        :total-items="totalDesserts"
        :rows-per-page-items="[10, 15, 20, 25, 30]"
      >
        <template v-slot:items="props">
          <td>{{ props.item.flowTaskId }}</td>
          <td>{{ props.item.taskId }}</td>
          <td>{{ props.item.jobId }}</td>
          <td>{{ props.item.flowId }}</td>
          <td>{{ props.item.postTask | parsePostTask }}</td>
          <!--
                                                        <td>{{ props.item.shardStatus }}</td>
                    -->
          <td>{{ props.item.handler }}</td>
          <td>{{ props.item.host }}</td>
          <td>{{ props.item.beginTime  }}</td>
          <td v-if="props.item.taskStatus >= 5">
            {{ props.item.endTime  }}
          </td>
          <td v-else></td>
          <td>
            <v-btn small v-if="props.item.taskStatus === 0" color="info"
              >New</v-btn
            >
            <v-btn small v-else-if="props.item.taskStatus === 1" color="info"
              >Ready</v-btn
            >
            <v-btn small v-else-if="props.item.taskStatus === 2" color="info"
              >Pending</v-btn
            >
            <v-btn small v-else-if="props.item.taskStatus === 3" color="info"
              >Submitted</v-btn
            >
            <v-btn small v-else-if="props.item.taskStatus === 4" color="info"
              >Running</v-btn
            >
            <v-btn small v-else-if="props.item.taskStatus === 5" color="error"
              >Failed</v-btn
            >
            <v-btn
              small
              v-else-if="props.item.taskStatus === 6"
              color="success"
            >
              {{ props.item.host === "" ? "Skipped" : "Finished" }}</v-btn
            >
            <v-btn small v-else="props.item.taskStatus === 7" color="error"
              >Killed</v-btn
            >
          </td>
          <td>
            <a
              v-if="props.item.host !== ''"
              v-on:click="query(props.item, 'syslog')"
              >日志</a
            >
          </td>
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>

<script>
import { getTasks, dataFormat } from "@/api/workFlow";
export default {
  data: () => ({
    totalDesserts: 10,
    pagination: {
      sortBy: "flowTaskId",
      descending: true,
      rowsPerPage: 10
    },
    items: [],
    flowTaskId: -1,
    flowData: {},
    headers: [
      {
        text: "FlowTaskID",
        align: "left",
        sortable: false,
        value: "flowTaskId"
      },
      { text: "TaskID", value: "taskId", sortable: false },
      { text: "JobID", value: "jobId", sortable: false },
      { text: "FlowID", value: "flowId", sortable: false },
      { text: "后置任务", value: "postTask", sortable: false },
      { text: "Handler", value: "handler", sortable: false },
      { text: "执行位置", value: "host", sortable: false },
      { text: "开始时间", value: "beginTime", sortable: false },
      { text: "结束时间", value: "endTime", sortable: false },
      { text: "作业状态", value: "taskStatus", sortable: false },
      { text: "执行日志", sortable: false }
    ],
    desserts: [],
    editedItem: {
      flowTaskId: "",
      taskId: 0,
      jobId: 0,
      flowId: 0,
      postTask: 0,
      taskStatus: 0,
      shardStatus: 0,
      beginTime: "",
      handler: "",
      host: "",
      endTime: ""
    },
    defaultItem: {
      flowTaskId: "",
      taskId: 0,
      jobId: 0,
      flowId: 0,
      postTask: 0,
      taskStatus: 0,
      shardStatus: 0,
      beginTime: "",
      handler: "",
      host: "",
      endTime: ""
    }
  }),
  created() {
    this.queryTasks();
  },
  methods: {
    queryTasks() {
      this.flowTaskId = this.$route.query["id"];
      let pageNum =
        this.pagination.page === null || this.pagination.page === undefined
          ? 1
          : this.pagination.page;
      let pageSize =
        this.pagination.rowsPerPage === null ||
        this.pagination.rowsPerPage === undefined
          ? 10
          : this.pagination.rowsPerPage;
      getTasks(this.flowTaskId, pageNum, pageSize).then(data => {
        this.desserts = data.list;
        this.totalDesserts = data.total;
        this.pagination.page = data["pageNum"];
        this.pagination.totalItems = data.total;
      });

      this.items = [
        {
          text: "历史任务",
          disabled: false,
          to: "/workflow/flow-tasks"
        }
      ];
    },
    query(item, logName) {
      let params = Object.assign({}, item);
      params["logName"] = logName;
      this.$router.push({
        path: "/workflow/task/log",
        query: { item: params }
      });
    }
  },
  watch: {
    pagination: {
      deep: true,
      handler() {
        this.queryTasks();
      }
    }
  },
  filters: {
    formatDate: function(value) {
      //由于vue自带的时区为美国时区 需要转换为本地时区
      return new Date(dataFormat(value) + "Z").toLocaleString();
    },
    parsePostTask: function(postTask) {
      let post = postTask;
      let ret = [];
      for (let i = 0; post > 0; i++, post = post >> 1) {
        if ((post & 1) > 0) {
          ret.push(i);
        }
      }

      return ret;
    }
  }
};
</script>
<style>
table.v-table {
  border-radius: 2px;
  border-collapse: collapse;
  border-spacing: 0;
  width: 96%;
  max-width: 100%;
}
</style>

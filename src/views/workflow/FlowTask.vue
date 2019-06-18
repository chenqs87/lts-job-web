<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div>
        <v-container grid-list-xl fluid>
            <div style="float: right; display: flex;flex: 1 1 auto;flex-wrap: nowrap;min-width: 0;">
                <v-flex xs12 sm6 md12>
                    <v-select :items="statusList"
                              :rules="[rules.required]"
                              label="状态"
                              v-model="searchStatus"
                    ></v-select>
                </v-flex>
                <v-btn color="primary" dark class="mb-2" v-on:click="queryTasks">搜索</v-btn>
                <v-btn color="primary" dark class="mb-2" v-on:click="queryTasks">刷新</v-btn>
            </div>
            <v-data-table :headers="headers" :items="desserts" class="elevation-1" :pagination.sync="pagination"
                          :total-items="totalDesserts" :rows-per-page-items="[10,15,20,25,30]">
                <template v-slot:items="props">
                    <tr @click="props.expanded = !props.expanded">
                    <td><a v-on:click="query(props.item)">{{ props.item.id }}</a></td>
                    <td>{{ props.item.flowId }}</td>
                    <td>{{ props.item.triggerMode | formatTriggerMode }}</td>
                    <td>{{ props.item.beginTime | formatDate}}</td>
                    <td>{{ props.item.endTime | formatDate}}</td>
                    <td>
                        <v-btn small v-if="props.item.status === 0" color="#85ff98">New</v-btn>
                        <v-btn small v-else-if="props.item.status === 1" color="#f7e155">Pending</v-btn>
                        <v-btn small v-else-if="props.item.status === 2" color="info">Running</v-btn>
                        <v-btn small v-else-if="props.item.status === 3" color="#bbb7b7">Killed</v-btn>
                        <v-btn small v-else-if="props.item.status === 4" color="success">Finished</v-btn>
                        <v-btn small v-else="props.item.status === 5" color="error">Failed</v-btn>
                    </td>
                    <td class="justify-center layout px-0">

                        <v-tooltip top >
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on" small class="mr-2" v-on:click="queryScheduleLog(props.item)">list</v-icon>
                            </template>
                            <span>作业调度流程</span>
                        </v-tooltip>

                        <v-tooltip top v-if="props.item.status === 3 || props.item.status === 5">
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on" small class="mr-2" v-on:click="reTrigger(props.item)">loop</v-icon>
                            </template>
                            <span>重新执行</span>
                        </v-tooltip>

                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on" small class="mr-2" v-on:click="query(props.item)">search</v-icon>
                            </template>
                            <span>查看执行日志</span>
                        </v-tooltip>

                        <v-tooltip v-if="props.item.status < 3" top>
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on" small class="mr-2" v-on:click="killTask(props.item)">close</v-icon>
                            </template>
                            <span>Kill工作流</span>
                        </v-tooltip>
                    </td>
                    </tr>
                </template>
                <template v-slot:expand="props">
                    <v-card flat>
                        <v-card-text>
                            工作流参数：<br/>
                            {{props.item.params}}
                        </v-card-text>
                    </v-card>
                </template>
            </v-data-table>
            <v-dialog v-model="dialog" width="800">
                <v-card>
                    <v-card-title class="headline grey lighten-2" primary-title>
                        作业调度流程
                    </v-card-title>

                    <v-card-text>
                        <v-timeline>
                            <v-timeline-item v-for="(log, i) in schedule_log" :key="i" :color="`${i % 2 === 0 ? 'green' : 'cyan'}`" small>
                                <template v-slot:opposite>
                                    <span :class="`font-weight-bold`">
                                        {{log['createTime'] | formatDate}}
                                    </span>
                                </template>
                                <div class="py-3">
                                    <div>
                                        {{log.content}}
                                    </div>
                                </div>
                            </v-timeline-item>
                        </v-timeline>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" flat @click="dialog = false">
                            关闭
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-container>

        <v-dialog v-model="triggerAlertDialog" persistent max-width="1000">
            <v-card>
                <v-card-title class="headline">参数</v-card-title>
                <v-card-text>
                    <editor v-model="triggerParams" :options="{fontSize:18}"  @init="editorInit" lang="sh" theme="pastel_on_dark" width="100%" height="300"></editor>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" flat @click="closeTriggerFlowDialog">取消</v-btn>
                    <v-btn color="green darken-1" flat @click="doReTrigger">提交</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </div>

</template>

<script>
    import {
        getFlowTasks,
        getTasks,
        getFlowScheduleLog,
        dataFormat,
        killFlowTask,
        reTriggerFlow,
        getFlowTaskStatus
    } from '@/api/workFlow';

    export default {
        components: { editor: require('vue2-ace-editor')},
        data: () => ({

            triggerAlertDialog: false,
            triggerParams:"",
            triggerFlowId: -1,
            triggerFlowTaskId: -1,

            dialog: false,
            schedule_log:[],
            totalDesserts: 0,
            pagination: {
                descending: true,
                sortBy: 'id',
                totalItems: 0,
                rowsPerPage: 10,
            },
            rules: {
                required: value => !!value || 'Required.',
                counter: value => value.length <= 45 || 'Max 45 characters',
            },
            statusList: [],
            searchStatus: null,
            flowId: -1,
            headers: [
                {text: 'ID', align: 'left', sortable: false, value: 'id'},
                {text: '工作流ID', value: 'flowId', sortable: false},
                {text: '触发方式', value: 'triggerMode', sortable: false},
                {text: '开始时间', value: 'beginTime', sortable: false},
                {text: '结束时间', value: 'endTime', sortable: false},
                {text: '状态', value: 'status', sortable: false},
                {text: '操作', sortable: false}
            ],
            desserts: [],
            editedItem: {
                id: '',
                flowId: 0,
                status: 0,
                beginTime: '',
                endTime: '',
                triggerMode: '',
                params:''
            },
            defaultItem: {
                id: '',
                flowId: 0,
                status: 0,
                beginTime: '',
                endTime: '',
                triggerMode: '',
                params:''
            }
        }),
        computed: {},
        created() {
            this.flowId = -1;
            this.queryTasks()
        },
        watch: {
            pagination: {
                deep: true,
                handler() {
                    this.queryTasks();
                }
            }
        },
        methods: {
            editorInit: function () {
                require('brace/ext/language_tools') //language extension prerequsite...
                require('brace/mode/sh')
                require('brace/mode/javascript')    //language
                require('brace/mode/less')
                require('brace/theme/monokai')
                require('brace/theme/pastel_on_dark')
                require('brace/snippets/javascript') //snippet
            },
            queryTasks() {
                let status = -1;
                console.log(this.$route.query["flowId"]);
                this.flowId = this.$route.query["flowId"] === undefined ? -1:this.$route.query["flowId"];
                let pageNum = this.pagination.page === null || this.pagination.page === undefined
                    ? 1 : this.pagination.page;
                let pageSize = this.pagination.rowsPerPage === null || this.pagination.rowsPerPage === undefined
                    ? 10 : this.pagination.rowsPerPage;


                getFlowTaskStatus().then(
                    data=>{
                        this.statusList = data;
                    }
                );

                for (let i = 0;i<this.statusList.length;i++){
                    if (this.statusList[i]===this.searchStatus){
                        status = i;
                    }
                }
                getFlowTasks(this.flowId, status, pageNum, pageSize).then(data => {
                    this.desserts = data.list;
                    this.totalDesserts = data.total;
                    this.pagination.page = data['pageNum'];
                    this.pagination.totalItems = data.total;
                });

            },
            query(item) {
                this.$router.push({
                    path: '/workflow/tasks',
                    query: {id: item.id, flowId: item.flowId}
                });
            },
            killTask(item) {
                killFlowTask(item.flowId, item.id).then(data => {
                    this.queryTasks();
                })
            },
            reTrigger(item) {

                this.triggerParams=item.params;
                this.triggerFlowId=item.flowId;
                this.triggerFlowTaskId=item.id;
                this.triggerAlertDialog = true;

            },
            closeTriggerFlowDialog() {
                this.triggerParams='';
                this.triggerFlowId=-1;
                this.triggerFlowTaskId=-1;
                this.triggerAlertDialog = false;
            },
            doReTrigger() {
                reTriggerFlow(this.triggerFlowId, this.triggerFlowTaskId, this.triggerParams).then(data => {
                    this.closeTriggerFlowDialog();
                    this.queryTasks();
                });
            },
            queryScheduleLog(item) {
                this.schedule_log = [];
                getFlowScheduleLog(item.id).then(data => {
                    this.schedule_log = data;
                    this.dialog = true;

                })
            }
        },
        filters: {
            formatDate: function (value) {
                //由于vue自带的时区为美国时区 需要转换为本地时区
                return (new Date(dataFormat(value) + 'Z')).toLocaleString();
            },
            formatTriggerMode: function (value) {
                switch (value) {
                    case 0:
                        return "手动触发";
                    case 1:
                        return "前置任务触发";
                    case 2:
                        return "定时任务触发";
                    default:
                        return "UnKnown";
                }
            }
        }
    }
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

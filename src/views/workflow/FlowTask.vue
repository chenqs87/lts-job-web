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
                </template>
            </v-data-table>
        </v-container>
    </div>

</template>

<script>
    import {
        getFlowTasks,
        getTasks,
        dataFormat,
        queryLog,
        killFlowTask,
        reTriggerFlow,
        getFlowTaskStatus
    } from '@/api/workFlow';

    export default {
        data: () => ({
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
            },
            defaultItem: {
                id: '',
                flowId: 0,
                status: 0,
                beginTime: '',
                endTime: '',
                triggerMode: ''
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
                reTriggerFlow(item.flowId, item.id, "").then(data => {
                    this.queryTasks();
                });
            },
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
        width: 99%;
        max-width: 100%;
    }
</style>
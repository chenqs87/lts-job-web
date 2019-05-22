<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div>
        <v-container grid-list-xl fluid>
            <v-toolbar flat color="white">
                <v-toolbar-title>执行日志</v-toolbar-title>
                <v-spacer></v-spacer>

            </v-toolbar>
            <v-data-table :headers="headers" :items="desserts" class="elevation-1" :pagination.sync="pagination"
                :total-items="totalDesserts" :rows-per-page-items="[10,15,20,25,30]">
                <template v-slot:items="props">
                    <td><a v-on:click="query(props.item)">{{ props.item.id }}</a></td>
                    <td>{{ props.item.flowId }}</td>
                    <td>{{ props.item.triggerMode | formatTriggerMode }}</td>
                    <td>{{ props.item.createUser }}</td>
                    <td>{{ props.item.beginTime | formatDate}}</td>
                    <td>{{ props.item.endTime | formatDate}}</td>
                    <td>
                        <v-btn small v-if="props.item.status === 0" color="info">New</v-btn>
                        <v-btn small v-else-if="props.item.status === 1" color="info">Pending</v-btn>
                        <v-btn small v-else-if="props.item.status === 2" color="info">Running</v-btn>
                        <v-btn small v-else-if="props.item.status === 3" color="error">Killed</v-btn>
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
    import {getAllFlowTasks, getFlowTasksByFlowId, getTasks, dataFormat, queryLog, killFlowTask, reTriggerFlow} from '@/api/workFlow';
    export default {
        data: () => ({
            totalDesserts: 0,
            pagination: {
                descending: true,
                sortBy: 'id',
                totalItems: 0,
                rowsPerPage: 10,
            },
            flowId: -1,
            headers: [
                { text: 'ID', align: 'left', sortable: false, value: 'id'},
                { text: '工作流ID', value: 'flowId', sortable: false },
                { text: '触发方式', value: 'triggerMode', sortable: false },
                { text: '创建者', value: 'createUser', sortable: false },
                { text: '开始时间', value: 'beginTime',sortable: false },
                { text: '结束时间', value: 'endTime', sortable: false },
                { text: '状态', value: 'status', sortable: false },
                { text: '操作', sortable: false }
            ],
            desserts: [],
            editedItem: {
                id: '',
                flowId: 0,
                createUser: 0,
                status: 0,
                beginTime: '',
                endTime: '',
                triggerMode:'',
            },
            defaultItem: {
                id: '',
                flowId: 0,
                createUser: 0,
                status: 0,
                beginTime: '',
                endTime: '',
                triggerMode:''
            }
        }),
        computed: {

        },
        created () {
            //this.queryTasks()
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
            queryTasks () {
                let flowId = this.$route.query["flowId"]
                let pageNum = this.pagination.page === null || this.pagination.page === undefined
                    ? 1 : this.pagination.page;
                let pageSize = this.pagination.rowsPerPage === null || this.pagination.rowsPerPage === undefined
                    ? 10 : this.pagination.rowsPerPage;

                let response = flowId > 0 ? getFlowTasksByFlowId(flowId, pageNum, pageSize) : getAllFlowTasks(pageNum, pageSize);

                response.then(data => {
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
                killFlowTask(item.id).then(data => {
                    this.query(item);
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
                return dataFormat(value);
            },
            formatTriggerMode: function (value) {
                switch (value) {
                    case 0: return "手动触发";
                    case 1: return "前置任务触发";
                    case 2: return "定时任务触发";
                    default: return "UnKnown";
                }
            }
        }
    }
</script>

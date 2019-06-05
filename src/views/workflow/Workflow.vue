<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div>
        <v-container grid-list-xl fluid>
            <div style="float: right">
                <v-btn color="primary" dark class="mb-2" v-on:click="switchUF">{{ switchUFBtn }}</v-btn>
                <v-btn color="primary" dark class="mb-2" v-on:click="dialog =true" v-if=" switchUFBtn === '切换用户组工作流' ">
                    新建工作流
                </v-btn>
                <v-btn color="primary" dark class="mb-2" v-on:click="importData = true">新建数据导入工作流</v-btn>
            </div>

            <v-data-table :headers="headers"
                          :items="desserts"
                          class="elevation-1"
                          :pagination.sync="pagination"
                          :total-items="totalDesserts"
                          :rows-per-page-items="[10,15,20,25,30]">
                <template v-slot:items="props">
                    <td>{{ props.item.id }}</td>
                    <td>{{ props.item.name }}</td>
                    <td>{{ props.item.cron }}</td>
                    <td>{{ props.item.postFlow }}</td>
                    <!--
                       <td>{{ props.item.params }}</td>
                    -->
                    <td>{{ props.item.createUser }}</td>
                    <td>{{ props.item.isSchedule === 0 ? "否" : "是" }}</td>
                    <td>{{ props.item.startTime | formatDate }}</td>
                    <td>{{ props.item.createTime | formatDate }}</td>

                    <td class="justify-center layout px-0">

                        <v-tooltip v-if="(permitRule['FlowAuthorized'] & props.item['permit']) > 0" top>
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on" small class="mr-2" @click="auth(props.item)">lock_open</v-icon>
                            </template>
                            <span>授权</span>
                        </v-tooltip>

                        <v-tooltip top v-if="(permitRule['FlowExec'] & props.item['permit']) > 0">
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on" small class="mr-2" @click="trigger(props.item.id)">
                                    play_circle_outline
                                </v-icon>
                            </template>
                            <span>执行工作流</span>
                        </v-tooltip>

                        <v-tooltip top v-if="(permitRule['FlowCron'] & props.item['permit']) > 0">
                            <template v-slot:activator="{ on }">
                                <v-icon v-if="props.item.isSchedule === 0" v-on="on" small class="mr-2"
                                        v-on:click="openCron(props.item)">play_arrow
                                </v-icon>
                                <v-icon v-on="on" v-else small class="mr-2" v-on:click="openCron(props.item)">stop
                                </v-icon>
                            </template>
                            <span>{{props.item.isSchedule === 0 ? "启动定时任务" : "终止定时任务"}}</span>
                        </v-tooltip>

                        <v-tooltip top v-if="(permitRule['FlowEdit'] & props.item['permit']) > 0">
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on" small class="mr-2" @click="editFlow(props.item)">share</v-icon>
                            </template>
                            <span>编辑工作流</span>
                        </v-tooltip>

                        <v-tooltip top v-if="(permitRule['FlowEdit'] & props.item['permit']) > 0 ">
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on" small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                            </template>
                            <span>编辑</span>
                        </v-tooltip>

                        <v-tooltip top v-if="(permitRule['FlowDelete'] & props.item['permit']) > 0">
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on" small @click="delFlow(props.item)">delete</v-icon>
                            </template>
                            <span>删除</span>
                        </v-tooltip>

                        <v-tooltip top v-if="(permitRule['FlowView'] & props.item['permit']) > 0">
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on" small @click="history(props.item.id)">history</v-icon>
                            </template>
                            <span>执行历史</span>
                        </v-tooltip>
                    </td>
                </template>
            </v-data-table>
            <!-- 授权对话框 -->
            <v-dialog v-model="permitAuthDialog" persistent max-width="1000">
                <select-auth authType="flow" :resource="editedItem.id" :permit="editedItem.permit"
                             @close="cancelAuthDialog" @save="queryTasks"></select-auth>
            </v-dialog>

            <!-- 确认对话框 -->
            <v-dialog v-model="zDialog" persistent max-width="500">
                <z-dialog :message="zMessage"
                        @close="cancelZDialog" @agree="doCron"></z-dialog>
            </v-dialog>
            <!-- 添加导入数据流 -->
            <v-dialog v-model="importData" persistent maxWidth="1000" >
                <import-data
                        @close="closeImportData" @save="queryTasks"></import-data>
            </v-dialog>
        </v-container>

        <v-dialog v-model="dialog" max-width="500px" >
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
                                        :validate-on-blur=true
                                        :rules="[
                                                   () => !!editedItem.name || 'name is required',
                                                   () => !!editedItem.name && editedItem.name.length <= 45 || 'name must be less than 45 characters'
                                                ]"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md12>
                                <el-popover v-model="cronPopover">
                                    <cron @change="changeCron" @close="cronPopover=false" i18n="cn"></cron>
                                    <!--<el-input class="cron-input" slot="reference" @click="cronPopover=true" v-model="editedItem.cron" placeholder="请输入定时策略"></el-input>-->
                                    <v-text-field label="Cron表达式" slot="reference" :readonly=true
                                                  @click="changeCron"
                                                  :rules="[
                                                               () => !!editedItem.cron || 'cron is required'
                                                            ]"
                                                  v-model="editedItem.cron"

                                    ></v-text-field>
                                </el-popover>

                            </v-flex>
                            <v-flex xs12 sm6 md12>
                                <v-textarea v-model="editedItem.params" label="工作流参数"></v-textarea>
                            </v-flex>
                            <v-flex xs12 sm6 md12>
                                <v-text-field v-model="editedItem.postFlow"
                                              label="子工作流（多个id使用逗号分隔）"></v-text-field>
                            </v-flex>

                            <v-flex xs12 sm6 md12>
                                <v-textarea v-model="editedItem.phoneList"
                                            label="手机号（失败告警，多个使用逗号分隔）"></v-textarea>
                            </v-flex>

                            <v-flex xs12 sm6 md12>
                                <v-textarea v-model="editedItem.emailList"
                                            label="电子邮件（失败告警，多个使用逗号分隔）"></v-textarea>
                            </v-flex>

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
    </div>
</template>

<script>
    import ZDialog from '@/components/Dialog';
    import SelectAuth from '@/components/workflow/SelectAuth';
    import ModelFlowEditor from '@/components/flow-editor/model-flow-editor';
    import ImportData from '@/components/workflow/ImportData';
    import {cron} from 'vue-cron';
    import {
        getAllFlowsByUser, newFlow, updateFlow, deleteFlow, dataFormat, triggerFlow,
        startCronFlow, stopCronFlow, getFlowPermit, reTriggerFlow, getAlertConfig,
        getAllFlowsByGroup
    } from '@/api/workFlow';

    export default {
        components: {cron, ModelFlowEditor, SelectAuth, ZDialog, ImportData},
        data: () => ({
            template: '<cron/>',
            cronPopover: false,

            //zDialog默认为关闭
            zDialog: false,
            //存储点击start 或者stop 的 item值
            cronItem: "",
            //需要显示的message
            zMessage: "",
            //需要删除的索引值  默认为-1
            delIndex: -1,

            importData: false,

            switchUFBtn: "切换用户组工作流",
            permitAuthDialog: false,
            permitRule: {},
            totalDesserts: 0,
            pagination: {
                sortBy: 'id',
                descending: true,
                rowsPerPage: 10,
            },
            flowEditorInfo: "",
            dialog: false,
            handlerList: ["test", "test1", "test2"],
            jobTypes: ["shell", "python", "zip"],
            currentUser: true,
            headers: [
                {text: 'ID', value: 'id', sortable: false},
                {text: '工作流名称', sortable: false, value: 'name'},
                {text: 'Cron表达式', value: 'cron', sortable: false},
                {text: '子任务', value: 'postFlow', sortable: false},
                /* {text: '参数', value: 'shardType', sortable: false},*/
                {text: '创建人', value: 'createUser', sortable: false},
                {text: '是否调度', value: 'isSchedule', sortable: false},
                {text: '启动时间', value: 'startTime'},
                {text: '创建时间', value: 'createTime'},
                {text: '操作', sortable: false}
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
                phoneList: "",
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
                phoneList: "",
            }
        }),
        computed: {
            formTitle() {
                return this.editedIndex === -1 ? '新建' : '编辑'
            }
        },
        watch: {
            dialog(val) {
                val || this.close()
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
        },
        methods: {
            test(data) {
                console.log(data)
                this.fullscreen.dialog = false;
            },
            editFlow(item) {
                this.$router.push({
                    path: '/workflow/flow-editor',
                    query: {id: item.id, flowEditorInfo: item.flowEditorInfo}
                });

            },
            queryTasks() {
                let pageNum = this.pagination.page === null || this.pagination.page === undefined
                    ? 1 : this.pagination.page;
                let pageSize = this.pagination.rowsPerPage === null || this.pagination.rowsPerPage === undefined
                    ? 10 : this.pagination.rowsPerPage;


                if (this.switchUFBtn === "切换用户个人工作流") {
                    getAllFlowsByGroup(pageNum, pageSize).then(data => {
                        this.desserts = data.list;
                        this.totalDesserts = data.total;
                        this.pagination.page = data['pageNum'];
                        this.pagination.totalItems = data.total;
                    });
                } else {
                    getAllFlowsByUser(pageNum, pageSize).then(data => {
                        this.desserts = data.list;
                        this.totalDesserts = data.total;
                        this.pagination.page = data['pageNum'];
                        this.pagination.totalItems = data.total;
                    });
                }
            },
            editItem(item) {
                getAlertConfig(item.id).then(data => {
                    this.editedIndex = this.desserts.indexOf(item);
                    this.editedItem = Object.assign({}, item);
                    this.editedItem['emailList'] = data.emailList;
                    this.editedItem['phoneList'] = data.phoneList;
                    this.dialog = true
                })
            },
            deleteItem(item) {
                const index = this.desserts.indexOf(item);
                if (confirm('Are you sure you want to delete this item?')) {
                    deleteFlow(item.id).then(() => {
                        this.desserts.splice(index, 1)
                    })
                }
            },
            close() {
                this.dialog = false
                setTimeout(() => {
                    this.editedItem = Object.assign({}, this.defaultItem);
                    this.editedIndex = -1
                }, 300)
            },
            save() {
                const l = this;
                if (l.editedItem.postFlow!==null && l.editedItem.postFlow !== "") {
                    let split = l.editedItem.postFlow.split(",");

                    console.log(split)
                    var numReg = /^[0-9]+$/
                    var numRe = new RegExp(numReg)

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
                    })
                }
                l.close()
            },
            trigger(flowId) {
                triggerFlow(flowId, "").then(data => {
                    this.$router.push({
                        path: '/workflow/flow-tasks',
                        query: {flowId: flowId}
                    });
                });
            },
            history(flowId) {
                this.$router.push({
                    path: '/workflow/flow-tasks',
                    query: {flowId: flowId}
                });
            },
            delFlow(item){
                this.cronItem = item;
                this.zMessage = 'Are you sure you want to delete this flow?？';
                this.zDialog = true;
                this.delIndex = this.desserts.indexOf(item);
            },
            openCron(item){
                this.cronItem = item;
                console.log(item.isSchedule);
                this.zMessage = 'Are you sure you want' + (item.isSchedule === 0 ? 'start' : 'stop')  +'this flow ？';
                this.zDialog = true;
            },
            doCron(){

                if (this.delIndex !== -1){
                        deleteFlow(this.cronItem.id).then(() => {
                            this.desserts.splice(this.delIndex, 1)
                        });
                    this.delIndex = -1;
                    this.cancelZDialog();
                    return;
                }
                //启动定时任务
                if(this.cronItem.isSchedule === 0){
                    this.editedIndex = this.desserts.indexOf(this.cronItem);
                    this.editedItem = Object.assign({}, this.cronItem)
                    startCronFlow(this.cronItem.id).then(data => {
                        //Object.assign(this.desserts[this.editedIndex], data);
                        this.queryTasks();
                    });
                }
                //停止定时任务
                if(this.cronItem.isSchedule === 1){
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
                })
            },
            auth(item) {
                this.editedIndex = this.desserts.indexOf(item);
                this.editedItem = Object.assign({}, item);
                this.editedItem['permitSelected'] = [];
                let permit = this.editedItem.permit;
                for (let permitRuleKey in this.permitRule) {
                    let cur = this.permitRule[permitRuleKey];
                    if ((permit & cur) > 0) {
                        this.editedItem['permitSelected'].push(cur);
                    }
                }

                this.permitAuthDialog = true;
            },
            //改变Cron表达式
            changeCron(val) {
                this.editedItem['cron'] = val
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
            closeImportData() {
                this.importData = false;
            },

        },
        filters: {
            formatDate: function (value) {
                //由于vue自带的时区为美国时区 需要转换为本地时区
                return (new Date(dataFormat(value) + 'Z')).toLocaleString();
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

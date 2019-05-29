<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div>
        <v-container grid-list-xl fluid>
            <v-toolbar flat color="white">
                <v-toolbar-title>工作流配置</v-toolbar-title>
                <v-divider></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on }">
                        <v-layout>


                            <v-flex xs12 md4>
                                <v-btn color="primary" dark class="mb-2" v-on:click="switchUF">{{ switchUFBtn }}</v-btn>
                            </v-flex>
                            <v-flex xs12 md4>
                                <v-btn color="primary" dark class="mb-2" v-on="on" v-if=" switchUFBtn === '切换用户组工作流' ">
                                    新建工作流
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </template>
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
                                            <v-text-field label="Cron表达式" slot="reference"
                                                          @blur.native.capture="leaveCron"
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
                                                      label="子工作流（多个使用逗号分隔）"></v-text-field>
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
            </v-toolbar>
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
                                        v-on:click="startCron(props.item)">play_arrow
                                </v-icon>
                                <v-icon v-on="on" v-else small class="mr-2" v-on:click="stopCron(props.item)">stop
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
                                <v-icon v-on="on" small @click="deleteItem(props.item)">delete</v-icon>
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
        </v-container>
    </div>
</template>

<script>
    import SelectAuth from '@/components/workflow/SelectAuth';
    import ModelFlowEditor from '@/components/flow-editor/model-flow-editor';
    import {cron} from 'vue-cron';
    import {
        getAllFlowsByUser, newFlow, updateFlow, deleteFlow, dataFormat, triggerFlow,
        startCronFlow, stopCronFlow, getFlowPermit, reTriggerFlow, getAlertConfig,
        getAllFlowsByGroup
    } from '@/api/workFlow';

    export default {
        components: {cron, ModelFlowEditor, SelectAuth},
        data: () => ({
            template: '<cron/>',
            cronPopover: false,

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
            leaveCron() {
                this.cronPopover = false;
            },
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
                    this.editedItem = Object.assign({}, this.defaultItem)
                    this.editedIndex = -1
                }, 300)
            },
            save() {
                if (this.editedIndex > -1) {
                    updateFlow(this.editedItem).then(data => {
                        Object.assign(this.desserts[this.editedIndex], data);

                    });
                } else {
                    newFlow(this.editedItem).then(data => {
                        this.desserts.push(data)
                    })
                }
                this.close()
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
            startCron(item) {
                if (confirm('确定要启动定时任务吗？')) {
                    this.editedIndex = this.desserts.indexOf(item);
                    this.editedItem = Object.assign({}, item)
                    startCronFlow(item.id).then(data => {
                        //Object.assign(this.desserts[this.editedIndex], data);
                        this.queryTasks();
                    });
                }
            },
            stopCron(item) {
                if (confirm('确定要终止定时任务吗？')) {
                    this.editedIndex = this.desserts.indexOf(item);
                    this.editedItem = Object.assign({}, item);
                    stopCronFlow(item.id).then(data => {
                        //Object.assign(this.desserts[this.editedIndex], data);
                        this.queryTasks();
                    });
                }
            },
            cancelAuthDialog() {
                this.permitAuthDialog = false;
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
            }

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
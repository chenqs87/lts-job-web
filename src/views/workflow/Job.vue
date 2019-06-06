<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform" xmlns:v="http://www.w3.org/1999/XSL/Transform">
    <div>
        <v-container grid-list-xl fluid>
            <div style="float: right; display: flex;flex: 1 1 auto;flex-wrap: nowrap;min-width: 0;">
                <v-text-field append-icon="search" v-model="search.group" label="分组"></v-text-field>
                <v-text-field append-icon="search" v-model="search.name" label="作业名称"></v-text-field>
                <v-btn color="primary" dark class="mb-2" v-on:click="queryTasks">搜索</v-btn>
                <v-btn color="primary" dark class="mb-2" v-on:click="dialog = true" v-if=" switchUFBtn === '切换用户组任务' ">新建任务
                </v-btn>
                <v-btn color="primary" dark class="mb-2" v-on:click="switchUF">{{ switchUFBtn }}</v-btn>

            </div>

            <v-data-table :headers="headers" :items="desserts" class="elevation-1" :pagination.sync="pagination"
                          :total-items="totalDesserts" :rows-per-page-items="[10,15,20,25,30]">
                <template v-slot:items="props">
                    <td>{{ props.item.id }}</td>
                    <td>{{ props.item.name }}</td>
                    <td>{{ props.item.handler }}</td>
                    <td>{{ props.item.jobType }}</td>
                    <td>{{ props.item.shardType === 0 ? "否" : "是" }}</td>
                    <td>{{ props.item.group }}</td>
                    <td>{{ props.item.createUser }}</td>
                    <td>{{ props.item.createTime | formatDate}}</td>

                    <td class="justify-center layout px-0">

                        <v-tooltip v-if="(permitRule['JobAuthorized'] & props.item['permit']) > 0" top>
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on" small class="mr-2" @click="auth(props.item)">lock_open</v-icon>
                            </template>
                            <span>授权</span>
                        </v-tooltip>

                        <v-tooltip v-if="(permitRule['JobEdit'] & props.item['permit']) > 0" top>
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on" small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                            </template>
                            <span>编辑</span>
                        </v-tooltip>

                        <v-tooltip v-if="(permitRule['JobEdit'] & props.item['permit']) > 0" top>
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on" small class="mr-2" @click="editCode(props.item)">code</v-icon>
                            </template>
                            <span>编辑代码</span>
                        </v-tooltip>

                        <v-tooltip v-if="(permitRule['JobDelete'] & props.item['permit']) > 0" top>
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on" small @click="delFlow(props.item)">delete</v-icon>
                            </template>
                            <span>删除</span>
                        </v-tooltip>
                    </td>
                </template>
            </v-data-table>

            <!-- 授权对话框 -->
            <v-dialog v-model="permitAuthDialog" persistent max-width="1000">
                <select-auth authType="job" :resource="editedItem.id" :permit="editedItem.permit"
                             @close="cancelAuthDialog"
                             @save="queryTasks"></select-auth>
            </v-dialog>

            <!-- 删除确认对话框 -->
            <v-dialog v-model="zDialog" persistent max-width="500">
                <z-dialog :message="zMessage"
                          @close="cancelZDialog" @agree="doDialog"></z-dialog>
            </v-dialog>

            <v-dialog v-model="dialog" max-width="500px">
                <v-card>
                    <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12 sm6 md12>
                                    <v-text-field
                                            :autofocus=true
                                            v-model="editedItem.name"
                                            :rules="[rules.required,rules.counter]"
                                            label="作业名称"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md12>
                                    <v-select :items="handlerList"
                                              :rules="[rules.required]"
                                              label="Handler"
                                              v-model="editedItem.handler"
                                    ></v-select>
                                </v-flex>
                                <v-flex xs12 sm6 md12>
                                    <v-combobox :items="jobTypes" label="作业类型"
                                                :validate-on-blur=true
                                                :rules="[rules.required]"
                                                v-model="editedItem.jobType"></v-combobox>
                                </v-flex>

                                <v-flex xs12 sm6 md12>
                                    <v-text-field v-model="editedItem.group" label="分组"></v-text-field>
                                </v-flex>

                                <v-flex xs12 sm6 md12>
                                    <v-textarea v-model="editedItem.config" label="配置"></v-textarea>
                                </v-flex>
                                <!--<v-flex xs12 sm6 md12>-->
                                <!--<v-switch v-model="editedItem.shardType" true-value="1" false-value="0"-->
                                <!--label="是否分片"></v-switch>-->
                                <!--</v-flex>-->
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
            <v-dialog v-model="fullscreen.dialog" fullscreen transition="dialog-bottom-transition" :overlay="true">
                <v-card>
                    <v-toolbar dark color="primary">
                        <v-btn icon @click.native="fullscreen.dialog = false" dark>
                            <v-icon>close</v-icon>
                        </v-btn>
                        <v-toolbar-title>Settings</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items>
                            <v-btn dark flat v-on:click="saveCode">Save</v-btn>
                        </v-toolbar-items>
                    </v-toolbar>
                    <v-card-text>
                        <v-form>
                            <codemirror v-model="editedItem.content" :options="cmOptions"></codemirror>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-dialog>

        </v-container>
    </div>
</template>

<script>
    import ZDialog from '@/components/Dialog';
    import 'codemirror/lib/codemirror.css'
    // mode: text/javascript
    import 'codemirror/mode/javascript/javascript.js'
    //mode: text/x-python
    import 'codemirror/mode/python/python.js'
    import 'codemirror/theme/base16-dark.css'

    import {
        getAllJobsByUser,
        getAllJobsByGroup,
        newJob,
        updateJob,
        deleteJob,
        dataFormat,
        getJobPermit,
        getActiveHandlers
    } from '@/api/workFlow';
    import SelectAuth from '@/components/workflow/SelectAuth';

    export default {
        components: {SelectAuth, ZDialog},
        data: () => ({

            //zDialog默认为关闭
            zDialog: false,
            //存储点击start 或者stop 的 item值
            cronItem: "",
            //需要显示的message
            zMessage: "",
            //需要删除的索引值  默认为-1
            delIndex: -1,


            switchUFBtn: "切换用户组任务",
            rules: {
                required: value => !!value || 'Required.',
                counter: value => value.length <= 45 || 'Max 45 characters',
            },
            permitRule: {},
            permitAuthDialog: false,
            search: {
                group: null,
                name: null
            },
            totalDesserts: 0,
            pagination: {
                sortBy: 'id',
                descending: true,
                rowsPerPage: 10,
            },
            cmOptions: {
                tabSize: 4,
                mode: 'text/x-python',
                theme: 'base16-dark',
                lineNumbers: true,
                line: true,
                lines: 20
            },
            dialog: false,
            handlerList: [],
            jobTypes: ['shell', 'python'],
            currentUser: true,
            headers: [
                {text: 'ID', value: 'id', sortable: false},
                {text: '作业名称', align: 'left', sortable: false, value: 'name'},
                {text: 'Handler', value: 'handler', sortable: false},
                {text: '作业类型', value: 'jobType', sortable: false},
                {text: '是否分片', value: 'shardType', sortable: false},
                {text: '分组', value: 'group', sortable: false},
                {text: '创建人', value: 'createUser', sortable: false},
                {text: '创建时间', value: 'createTime'},
                {text: '操作', sortable: false}
            ],
            desserts: [],
            editedIndex: -1,
            editedItem: {
                id: -1,
                name: "",
                handler: "",
                jobType: "",
                //脚本内容
                content: "\n\n\n",
                shardType: 0,
                //作业参数配置，json格式
                config: "",
                createUser: "",
                createTime: "",
                group: "",
                permit: 0,
                permitSelected: []
            },
            defaultItem: {
                id: -1,
                name: "",
                handler: "",
                jobType: "",
                //脚本内容
                content: "",
                shardType: 0,
                //作业参数配置，json格式
                config: "",
                createUser: "",
                createTime: "",
                group: ""
            },
            fullscreen: {
                dialog: false,
                notifications: false,
                sound: true,
                widgets: false
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
            this.getHandlers();
        },
        methods: {
            editCode(item) {

                this.editedIndex = this.desserts.indexOf(item)
                this.editedItem = item;

                if (this.editedItem.jobType == null || this.editedItem.jobType === '') {
                    this.editedItem.jobType = 'shell';
                }

                this.fullscreen.dialog = true

            },
            queryTasks() {
                let pageNum = this.pagination.page === null || this.pagination.page === undefined
                    ? 1 : this.pagination.page;
                let pageSize = this.pagination.rowsPerPage === null || this.pagination.rowsPerPage === undefined
                    ? 10 : this.pagination.rowsPerPage;
                if (this.switchUFBtn === "切换用户个人任务") {
                    getAllJobsByGroup({
                        pageNum: pageNum,
                        pageSize: pageSize,
                        name: this.search.name === "" ? null : this.search.name,
                        group: this.search.group === "" ? null : this.search.group
                    }).then(data => {
                        this.desserts = data.list;
                        this.totalDesserts = data.total;
                        this.pagination.page = data['pageNum'];
                        this.pagination.totalItems = data.total;
                    });
                } else {
                    getAllJobsByUser({
                        pageNum: pageNum,
                        pageSize: pageSize,
                        name: this.search.name === "" ? null : this.search.name,
                        group: this.search.group === "" ? null : this.search.group
                    }).then(data => {
                        this.desserts = data.list;
                        this.totalDesserts = data.total;
                        this.pagination.page = data['pageNum'];
                        this.pagination.totalItems = data.total;
                    });
                }
            },
            editItem(item) {
                this.editedIndex = this.desserts.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialog = true
            },
            deleteItem(item) {
                const index = this.desserts.indexOf(item)
                if (confirm('Are you sure you want to delete this item?')) {
                    deleteJob(item.id).then(() => {
                        this.desserts.splice(index, 1)
                    })
                }
            },
            close() {
                this.dialog = false;
                setTimeout(() => {
                    this.editedItem = Object.assign({}, this.defaultItem)
                    this.editedIndex = -1
                }, 300)
            },
            save() {
                if (this.editedIndex > -1) {
                    updateJob(this.editedItem).then(data => {
                        Object.assign(this.desserts[this.editedIndex], data);
                    })
                } else {
                    newJob(this.editedItem).then(data => {
                        this.desserts.push(data)
                    })
                }
                this.close()
            },
            saveCode() {
                updateJob(this.editedItem).then(data => {
                    Object.assign(this.desserts[this.editedIndex], data);
                })
            },
            getPermitRule() {
                getJobPermit().then(data => {
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
            cancelAuthDialog() {
                this.permitAuthDialog = false;
            },
            getHandlers() {
                getActiveHandlers().then(data => {
                    let hs = [];
                    for (let handler in data) {
                        hs.push(handler)
                    }
                    this.handlerList = hs;
                })
            },
            //点击按钮转换用户 组的Job
            switchUF() {
                if (this.switchUFBtn === "切换用户组任务") {
                    this.switchUFBtn = "切换用户个人任务";
                } else {
                    this.switchUFBtn = "切换用户组任务";
                }
                this.queryTasks();
            },
            delFlow(item) {
                this.cronItem = item;
                this.zMessage = 'Are you sure you want to delete this job?？';
                this.zDialog = true;
                this.delIndex = this.desserts.indexOf(item);
            },
            doDialog() {
                if (this.delIndex !== -1) {
                        deleteJob(this.cronItem.id).then(() => {
                            this.desserts.splice(this.delIndex, 1)
                        });
                    this.delIndex = -1;
                    this.cancelZDialog();
                }
            },
            cancelZDialog() {
                this.zDialog = false;
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
    .CodeMirror {
        font-family: monospace;
        height: 100%;
        color: black;
        direction: ltr;
    }

    table.v-table {
        border-radius: 2px;
        border-collapse: collapse;
        border-spacing: 0;
        width: 99%;
        max-width: 100%;
    }
</style>


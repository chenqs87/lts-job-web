<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">

    <v-container grid-list-xl fluid>
        <v-toolbar flat color="white">
            <v-toolbar-title>用户管理</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-dialog v-model="usersDialog" max-width="500px">
                <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark class="mb-2" v-on="on" v-on:click="users.editedIndex=-1">新建用户</v-btn>
                </template>
                <v-card>
                    <v-card-title>
                        <span class="headline">{{ usersFormTitle }}</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12 sm6 md12>
                                    <v-text-field v-if="users.editedIndex !== -1 "
                                                  disabled v-model="users.editedItem.username"
                                                  :rules="[() => !!users.editedItem.username || 'username is required']"
                                                  label="用户名称"
                                    ></v-text-field>
                                    <v-text-field v-else v-model="users.editedItem.username"
                                                  :rules="[() => !!users.editedItem.username || 'username is required']"
                                                  label="用户名称"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md12>
                                    <v-select :items="roles"
                                              label="角色"
                                              v-model="users.editedItem.role"
                                              :rules="[() => !!users.editedItem.role || 'role is required']"
                                    ></v-select>

                                </v-flex>
                                <v-flex xs12 sm6 md12>
                                    <v-text-field v-model="users.editedItem.iphone" label="手机号"></v-text-field>
                                </v-flex>

                                <v-flex xs12 sm6 md12>
                                    <v-text-field v-model="users.editedItem.email" label="邮箱"></v-text-field>
                                </v-flex>

                                <v-flex xs12 sm6 md12>

                                    <v-select :items="groupNames"
                                              label="用户组"
                                              v-model="users.editedItem.groupName"
                                              :rules="[() => !!users.editedItem.groupName || 'groupName is required']"
                                    ></v-select>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" flat v-on:click="usersDialogClose">Cancel</v-btn>
                        <v-btn color="blue darken-1" flat v-on:click="saveUsers">Save</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-dialog v-model="groupDialog" max-width="500px">
                <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark class="mb-2" v-on="on">新建用户组</v-btn>
                </template>
                <v-card>
                    <v-card-title>
                        <span class="headline">{{ groupFormTitle }}</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12 sm6 md12>
                                    <v-text-field v-if="groups.editedIndex !==-1 "
                                                  disabled v-model="groups.editedItem.groupName"
                                                  :rules="[() => !!groups.editedItem.groupName || 'groupName is required']"
                                                  label="用户组名称"
                                    ></v-text-field>
                                    <v-text-field v-else v-model="groups.editedItem.groupName"
                                                  :rules="[() => !!groups.editedItem.groupName || 'groupName is required']"
                                                  label="用户组名称"></v-text-field>

                                </v-flex>
                                <v-flex xs12 sm6 md12>
                                    <v-text-field v-model="groups.editedItem.remark" label="描述"></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" flat v-on:click="groupDialogClose">Cancel</v-btn>
                        <v-btn color="blue darken-1" flat v-on:click="saveGroups">Save</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-toolbar>

        <v-tabs fixed-tabs>
            <v-tab key="1" href="#users">用户</v-tab>
            <v-tab key="2" href="#groups">用户组</v-tab>

            <v-tabs-items>
                <v-tab-item key="1" value="users">
                    <v-card flat>
                        <v-data-table :headers="users.headers" :items="users.desserts" class="elevation-1"
                                      :pagination.sync="users.pagination"
                                      :total-items="users.totalDesserts" :rows-per-page-items="[10,15,20,25,30]">
                            <template v-slot:items="props">
                                <td>{{ props.item.username }}</td>
                                <td>{{ props.item.role }}</td>
                                <td>{{ props.item.iphone }}</td>
                                <td>{{ props.item.email }}</td>
                                <td>{{ props.item.groupName }}</td>
                                <td>{{ props.item.createTime | formatDate }}</td>
                                <td class="justify-center layout px-0">
                                    <v-icon small class="mr-2" v-on:click="usersEditItem(props.item)">edit</v-icon>
                                    <v-icon small class="mr-2" v-on:click="delUser(props.item)">delete</v-icon>
                                </td>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-tab-item>
                <v-tab-item key="2" value="groups">
                    <v-card flat>
                        <v-data-table :headers="groups.headers" :items="groups.desserts" class="elevation-1"
                                      :pagination.sync="groups.pagination"
                                      :total-items="groups.totalDesserts" :rows-per-page-items="[10,15,20,25,30]">
                            <template v-slot:items="props">
                                <td>{{ props.item.groupName }}</td>
                                <td>{{ props.item.remark }}</td>
                                <td>{{ props.item.createTime | formatDate }}</td>
                                <td class="justify-center layout px-0">
                                    <v-icon small class="mr-2" v-on:click="groupEditItem(props.item)">edit</v-icon>
                                    <v-icon small class="mr-2" v-on:click="delGroup(props.item)">delete</v-icon>
                                </td>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-tab-item>
            </v-tabs-items>

        </v-tabs>

        <!-- 确认对话框 -->
        <v-dialog v-model="zDialog" persistent max-width="500">
            <z-dialog :message="zMessage"
                      @close="cancelZDialog" @agree="doDel"></z-dialog>
        </v-dialog>
    </v-container>

</template>

<script>
    import ZDialog from '@/components/Dialog';
    import {
        getUsers,
        getGroups,
        updateUser,
        updateGroup,
        deleteUser,
        deleteGroup,
        newUser,
        newGroup,
        dataFormat,
        getAllGroups
    } from '@/api/workFlow';

    export default {
        components: {ZDialog},
        data: () => ({

            //zDialog默认为关闭
            zDialog: false,
            //存储点击start 或者stop 的 item值
            cronItem: "",
            //需要显示的message
            zMessage: "",
            //区分用户 用户组
            delType: -1,


            roles: ['ROLE_ADMIN', 'ROLE_USER'],
            groupNames: [],
            usersDialog: false,
            groupDialog: false,
            users: {
                editedIndex: -1,
                totalDesserts: 10,
                pagination: {
                    descending: true,
                    rowsPerPage: 10,
                },

                headers: [
                    {text: '用户名', align: 'left', sortable: false, value: 'username'},
                    {text: '角色', value: 'role', sortable: false},
                    {text: '手机号', value: 'iphone', sortable: false},
                    {text: '邮箱', value: 'email', sortable: false},
                    {text: '用户组', value: 'groupName', sortable: false},
                    {text: '创建时间', value: 'createTime', sortable: false},
                    {text: '操作', sortable: false}
                ],
                desserts: [],
                editedItem: {
                    id: -1,
                    username: '',
                    role: '',
                    iphone: '',
                    email: '',
                    groupName: '',
                    createTime: '',

                },
                defaultItem: {
                    id: -1,
                    username: '',
                    role: '',
                    iphone: '',
                    email: '',
                    groupName: '',
                    createTime: '',
                }
            },
            groups: {
                editedIndex: -1,
                totalDesserts: 10,
                pagination: {
                    descending: true,
                    rowsPerPage: 10,
                },
                headers: [
                    {text: '用户组名称', align: 'left', sortable: false, value: 'groupName'},
                    {text: '备注', value: 'remark', sortable: false},
                    {text: '创建时间', value: 'createTime', sortable: false},
                    {text: '操作', sortable: false}
                ],
                desserts: [],
                editedItem: {
                    id: -1,
                    groupName: '',
                    remark: '',
                    createTime: ''
                },
                defaultItem: {
                    id: -1,
                    groupName: '',
                    remark: '',
                    createTime: ''
                }
            }
        }),
        created() {
            this.getAllGroups();
        },
        methods: {
            getAllGroups() {
                getAllGroups().then(data => {
                    let items = [];
                    for (let i = 0; i < data.length; i++) {
                        items[i] = data[i]['groupName'];
                    }
                    this.groupNames = items;
                });
            },
            queryUsers() {
                let pageNum = this.users.pagination.page === null || this.users.pagination.page === undefined
                    ? 1 : this.users.pagination.page;
                let pageSize = this.users.pagination.rowsPerPage === null || this.users.pagination.rowsPerPage === undefined
                    ? 10 : this.users.pagination.rowsPerPage;
                getUsers(pageNum, pageSize).then(data => {
                    for (let i = 0; i < data.list.length; i++) {
                        data.list[i]['id'] = i;
                    }
                    this.users.desserts = data.list;
                    this.users.totalDesserts = data.total;
                    this.users.pagination.page = data['pageNum'];
                    this.users.pagination.totalItems = data.total;
                })
            },
            queryGroups() {
                let pageNum = this.groups.pagination.page === null || this.groups.pagination.page === undefined
                    ? 1 : this.groups.pagination.page;
                let pageSize = this.groups.pagination.rowsPerPage === null || this.groups.pagination.rowsPerPage === undefined
                    ? 10 : this.groups.pagination.rowsPerPage;
                getGroups(pageNum, pageSize).then(data => {
                    for (let i = 0; i < data.list.length; i++) {
                        data.list[i]['id'] = i;
                    }
                    this.groups.desserts = data.list;
                    this.groups.totalDesserts = data.total;
                    this.groups.pagination.page = data['pageNum'];
                    this.groups.pagination.totalItems = data.total;
                })
            },
            usersEditItem(item) {
                this.users.editedIndex = this.users.desserts.indexOf(item);
                this.users.editedItem = Object.assign({}, item);
                this.usersDialog = true
            },
            usersDialogClose() {

                this.usersDialog = false;
                setTimeout(() => {
                    this.users.editedItem = Object.assign({}, this.users.defaultItem)
                    this.users.editedIndex = -1
                }, 300)
            },

            saveUsers() {
                if (this.users.editedIndex > -1) {
                    updateUser(this.users.editedItem).then(data => {
                        this.queryUsers()
                    })
                } else {
                    newUser(this.users.editedItem).then(data => {
                        this.queryUsers()
                    })
                }
                this.usersDialogClose()
            },
            usersDeleteItem(item) {
                if (confirm('Are you sure you want to delete this item?')) {
                    deleteUser(item.username).then(data => {
                        this.queryUsers();
                    })
                }
            },

            groupEditItem(item) {
                this.groups.editedIndex = this.groups.desserts.indexOf(item);
                this.groups.editedItem = Object.assign({}, item);
                this.groupDialog = true
            },
            groupDialogClose() {
                this.groupDialog = false;
                setTimeout(() => {
                    this.groups.editedItem = Object.assign({}, this.groups.defaultItem)
                    this.groups.editedIndex = -1
                }, 300);
                this.getAllGroups();
            },
            groupDeleteItem(item) {
                if (confirm('Are you sure you want to delete this item?')) {
                    deleteGroup(item.groupName).then(data => {
                        this.queryGroups()
                    })
                }

            },
            saveGroups() {
                if (this.groups.editedIndex > -1) {
                    updateGroup(this.groups.editedItem).then(data => {
                        this.queryGroups();
                    })
                } else {
                    newGroup(this.groups.editedItem).then(data => {
                        this.queryGroups();
                    })
                }
                this.groupDialogClose();
            },
            cancelZDialog() {
                this.zDialog = false;
            },
            delUser(item) {
                this.cronItem = item;
                this.zMessage = 'Are you sure you want to delete this user?？';
                this.zDialog = true;
                this.delType = 1;
            },
            delGroup(item) {
                this.cronItem = item;
                this.zMessage = 'Are you sure you want to delete this group?？';
                this.zDialog = true;
                this.delType = 2;
            },
            doDel() {
                if (this.delType === 1) {
                    deleteUser(this.cronItem.username).then(data => {
                        this.queryUsers();
                    });
                }
                if (this.delType === 2) {
                    deleteGroup(this.cronItem.groupName).then(data => {
                        this.queryGroups()
                    });
                }
                this.cronItem = "";
                this.delType = -1;
                this.zDialog = false;
            },
        },
        computed: {
            userPage() {
                return this.users.pagination;
            },
            groupPage() {
                return this.groups.pagination;
            },
            usersFormTitle() {
                return this.users.editedIndex === -1 ? '新建' : '编辑'
            },
            groupFormTitle() {
                return this.groups.editedIndex === -1 ? '新建' : '编辑'
            }
        },
        watch: {
            userPage() {
                this.queryUsers();
            },
            groupPage() {
                this.queryGroups();
            },
            usersDialog(val) {
                val || this.usersDialogClose()
            },
            groupDialog(val) {
                val || this.groupDialogClose()
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
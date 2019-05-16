<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div>


        <v-container grid-list-xl fluid>
            <v-toolbar flat color="white">
                <v-toolbar-title>用户管理</v-toolbar-title>
                <v-spacer></v-spacer>

            </v-toolbar>

            <v-tabs fixed-tabs>
                <v-tab key="1" href="#users">用户</v-tab>
                <v-tab key="2" href="#groups">用户组</v-tab>

                <v-tabs-items>
                    <v-tab-item key="1" value="users">
                        <v-card flat>
                            <v-data-table :headers="users.headers" :items="users.desserts" class="elevation-1" :pagination.sync="users.pagination"
                                          :total-items="users.totalDesserts" :rows-per-page-items="[10,15,20,25,30]" >
                                <template v-slot:items="props">
                                    <td>{{ props.item.username }}</td>
                                    <td>{{ props.item.role }}</td>
                                    <td>{{ props.item.iphone }}</td>
                                    <td>{{ props.item.email }}</td>
                                    <td>{{ props.item.groupName }}</td>
                                    <td>{{ props.item.createTime | formatDate }}</td>
                                    <td class="justify-center layout px-0">
                                        <v-icon small class="mr-2">search</v-icon>
                                    </td>
                                </template>
                            </v-data-table>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item key="2" value="groups">
                        <v-card flat>
                            <v-data-table :headers="groups.headers" :items="groups.desserts" class="elevation-1" :pagination.sync="groups.pagination"
                                          :total-items="groups.totalDesserts" :rows-per-page-items="[10,15,20,25,30]" >
                                <template v-slot:items="props">
                                    <td>{{ props.item.groupName }}</td>
                                    <td>{{ props.item.remark }}</td>
                                    <td>{{ props.item.createTime | formatDate }}</td>
                                    <td class="justify-center layout px-0">
                                        <v-icon small class="mr-2">search</v-icon>
                                    </td>
                                </template>
                            </v-data-table>
                        </v-card>
                    </v-tab-item>
                </v-tabs-items>

            </v-tabs>

        </v-container>
    </div>

</template>

<script>
    import {getUsers,getGroups,updateUser,updateGroup,deleteUser,deleteGroup,newUser,newGroup, dataFormat} from '@/api/workFlow';
    export default {
        data: () => ({
            users: {
                totalDesserts: 10,

                pagination: {
                    descending: true,
                    rowsPerPage: 10,
                },

                headers: [
                    { text: '用户名', align: 'left', sortable: false, value: 'username'},
                    { text: '角色', value: 'role', sortable: false },
                    { text: '手机号', value: 'iphone', sortable: false },
                    { text: '邮箱', value: 'email', sortable: false },
                    { text: '用户组', value: 'groupName', sortable: false },
                    { text: '创建时间', value: 'createTime', sortable: false },
                    { text: '操作', sortable: false }
                ],
                desserts: [],
                editedItem: {
                    userName: '',
                    role: '',
                    iphone: '',
                    email: '',
                    groupName:'',
                    createTime: '',

                },
                defaultItem: {
                    userName: '',
                    role: '',
                    iphone: '',
                    email: '',
                    groupName:'',
                    createTime: '',
                }
            },
            groups: {
                totalDesserts: 10,
                pagination: {
                    descending: true,
                    rowsPerPage: 10,
                },
                headers: [
                    { text: '用户组名称', align: 'left', sortable: false, value: 'groupName'},
                    { text: '备注', value: 'remark', sortable: false },
                    { text: '创建时间', value: 'createTime', sortable: false },
                    { text: '操作', sortable: false }
                ],
                desserts: [],
                editedItem: {
                    groupName: '',
                    remark: '',
                    createTime: ''
                },
                defaultItem: {
                    groupName: '',
                    remark: '',
                    createTime: ''
                }
            }
        }),
        created () {
            //this.queryTasks()
        },
        methods: {
            queryUsers () {
                let pageNum = this.users.pagination.page === null || this.users.pagination.page === undefined
                    ? 1 : this.users.pagination.page;
                let pageSize = this.users.pagination.rowsPerPage === null || this.users.pagination.rowsPerPage === undefined
                    ? 10 : this.users.pagination.rowsPerPage;
                getUsers(pageNum, pageSize).then(data => {
                    this.users.desserts = data.list;
                    this.users.totalDesserts = data.total;
                    this.users.pagination.page = data['pageNum'];
                    this.users.pagination.totalItems = data.total;
                })
            },
            queryGroups () {
                let pageNum = this.groups.pagination.page === null || this.groups.pagination.page === undefined
                    ? 1 : this.groups.pagination.page;
                let pageSize = this.groups.pagination.rowsPerPage === null || this.groups.pagination.rowsPerPage === undefined
                    ? 10 : this.groups.pagination.rowsPerPage;
                getGroups(pageNum, pageSize).then(data => {
                    this.groups.desserts = data.list;
                    this.groups.totalDesserts = data.total;
                    this.groups.pagination.page = data['pageNum'];
                    this.groups.pagination.totalItems = data.total;
                })
            }
        },
        computed: {
            userPage() {
                return this.users.pagination;
            },
            groupPage() {
                return this.groups.pagination;
            }
        },
        watch: {
            userPage() {
                this.queryUsers();
            },
            groupPage() {
                this.queryGroups();
            }
        },
        filters: {
            formatDate: function (value) {
                return dataFormat(value);
            }
        }
    }
</script>

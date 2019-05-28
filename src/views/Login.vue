<template>
    <v-app id="login" class="primary">
        <v-content>
            <v-container fluid fill-height>
                <v-layout align-center justify-center>
                    <v-flex xs12 sm8 md4 lg4>
                        <v-card class="elevation-1 pa-3">
                            <v-card-text>
                                <div class="layout column align-center">
                                    <img src="/static/m.png" alt="Vue Material Admin" width="120" height="120">
                                    <h1 class="flex my-4 primary--text">任务调度系统</h1>
                                </div>
                                <v-form>
                                    <v-text-field append-icon="person" name="login" label="Login" type="text"
                                                  :validate-on-blur = true
                                                  :autofocus=true
                                                  :rules="[() => !!model.username || 'username is required']"
                                                  v-model="model.username"></v-text-field>
                                    <v-text-field append-icon="lock" name="password" label="Password" id="password"
                                                  :validate-on-blur = true
                                                  :rules="[() => !!model.password || 'password is required']"
                                                  type="password" v-model="model.password"></v-text-field>
                                </v-form>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn block color="primary" @click="login" :loading="loading">Login</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
    import auth from '@/router/auth';
    import drawerMenu from '@/api/menu';

    export default {
        data: () => ({
            loading: false,
            drawerMenus: drawerMenu,
            model: {
                username: '',
                password: ''
            }
        }),

        methods: {
            login() {
                this.loading = true;
                const Muenus = this.drawerMenus;
                auth.login(this.model.username, this.model.password).then(data => {
                    auth.setAuth(data);
                    this.loading = false;
                    this.$router.push('/workflow/jobs');
                    //解决第一次登录时，admin用户加载不出管理页面的bug
                    if (data.role === 'ROLE_ADMIN' && Muenus.length < 3) {
                        Muenus.push({
                            title: '管理',
                            group: 'manager',
                            component: 'manager',
                            icon: 'cast_connected',
                            items: [
                                {name: 'Handlers', title: 'Handlers', component: 'Handlers'},
                                {name: 'Users', title: 'Users', component: 'Users'}
                            ]
                        });
                    }
                }).catch(error => {
                    this.loading = false;
                });

                setTimeout(() => {
                    this.$router.push('/workflow/jobs');
                }, 1000);
            }
        }

    };
</script>
<style scoped lang="css">
    #login {
        height: 50%;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        content: "";
        z-index: 0;
    }
</style>

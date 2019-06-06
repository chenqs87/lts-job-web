<template>
    <v-stepper v-model="e1">
        <v-stepper-header>
            <v-stepper-step :complete="e1 > 1" step="1">配置组</v-stepper-step>

            <v-divider></v-divider>
            <v-stepper-step :complete="e1 > 2" step="2">校验数据大小</v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="e1 > 3" step="3">校验数据内容</v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="4">配工作流参数</v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
            <v-stepper-content step="1">
                <div>

                    <v-flex xs12 sm6 md12>
                        <v-text-field v-model="checkGroupName" label="分组"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md12>
                        <el-popover v-model="cronPopover">
                            <cron @change="changeCron" @close="cronPopover=false" i18n="cn"></cron>
                            <v-text-field label="Cron表达式" slot="reference" :readonly=true
                                          @click="changeCron"
                                          :rules="[
                                                               () => !!checkCron || 'cron is required'
                                                            ]"
                                          v-model="checkCron"

                            ></v-text-field>
                        </el-popover>

                    </v-flex>
                </div>
                <v-btn
                        color="primary"
                        @click="e1 = 2"
                >
                    下一步
                </v-btn>

                <v-btn flat @click="e1 = 1">上一步</v-btn>
            </v-stepper-content>
            <v-stepper-content step="2">
                <div>
                    <codemirror
                            v-model="checkSize" :options="cmOptions"></codemirror>
                </div>
                <v-btn
                        color="primary"
                        @click="e1 = 3"
                >
                    下一步
                </v-btn>

                <v-btn flat @click="e1 = 1">上一步</v-btn>
            </v-stepper-content>

            <v-stepper-content step="3">

                <codemirror
                            v-model="checkContent" :options="cmOptions"></codemirror>

                <v-btn
                        color="primary"
                        @click="e1 = 4"
                >
                    下一步
                </v-btn>

                <v-btn flat @click="e1 = 2">上一步</v-btn>
            </v-stepper-content>

            <v-stepper-content step="4">
                <div style="float: left;width: 50%;height:100%">
                    <v-card>
                        <v-card-title primary-title>
                            <div>
                                <h3 class="headline mb-0">数据导入配置参数举例</h3>
                                <div> {{ cardText }} </div>
                            </div>
                        </v-card-title>
                    </v-card>
                </div>
                <div style="float: left;width: 50%;height:100%">
                    <codemirror
                            v-model="ipDataConfig" :options="cmOptions"></codemirror>

                </div>
                <div style="width: 100%">
                    <v-btn color="primary" @click="save">
                        提交
                    </v-btn>
                    <v-btn flat @click="e1 = 3">上一步</v-btn>
                </div>
            </v-stepper-content>
        </v-stepper-items>

        <v-btn style="float:right" flat @click="$emit('close')">取消</v-btn>
    </v-stepper>
</template>

<script>
    // require st先yles
    import 'codemirror/lib/codemirror.css'
    // mode: text/javascript
    import 'codemirror/mode/javascript/javascript.js'

    //mode: text/x-python
    import 'codemirror/mode/python/python.js'

    // theme css
    import 'codemirror/theme/base16-dark.css'
    import {cron} from 'vue-cron';
    import {
        importDataFlow,
        importConfig,
    } from '@/api/workFlow';

    export default {
        data: () => ({
            //cron表达式
            components: {cron},
            template: '<cron/>',
            cronPopover: false,
            checkCron:"",

            cardText: importConfig[0],
            cmOptions: {
                tabSize: 4,
                mode: 'text/x-python',
                theme: 'base16-dark',
                lineNumbers: true,
                line: true,
                lines: 20,
                lineWrapping: false,
                autoRefresh: true,
            },
            e1: 0,
        }),
        props:{
            checkGroupName:{
                type: String,
            },
            checkSize: {
                type: String,
            },
            checkContent: {
                type: String,
            },
            ipDataConfig: {
                type: String,
            },
        },
        created() {
            this.checkGroupName = "123"
        },
        methods: {
            save() {
                importDataFlow (this.checkGroupName,this.checkSize,this.checkContent,this.ipDataConfig,this.checkCron).then(data => {
                    this.$emit('close`');
                });
            },
            //改变Cron表达式
            changeCron(val) {
                this.checkCron = val
            },
        }
    }
</script>

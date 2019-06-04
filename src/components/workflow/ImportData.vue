<template>
    <v-stepper v-model="e1">
        <v-stepper-header>
            <v-stepper-step :complete="e1 > 1" step="1">校验数据大小</v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="e1 > 2" step="2">校验数据内容</v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="3">配工作流参数</v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
            <v-stepper-content step="1">
                <div>
                    <codemirror
                                v-model="checkSize" :options="cmOptions"></codemirror>
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

                <codemirror
                            v-model="checkContent" :options="cmOptions"></codemirror>

                <v-btn
                        color="primary"
                        @click="e1 = 3"
                >
                    下一步
                </v-btn>

                <v-btn flat @click="e1 = 1">上一步</v-btn>
            </v-stepper-content>

            <v-stepper-content step="3">
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
                    <v-btn
                            color="primary"
                            @click="e1 = 1"
                    >
                        下一步
                    </v-btn>
                    <v-btn flat @click="e1 = 2">上一步</v-btn>
                    <v-btn style="float:right" flat @click="e1 = 1;$emit('close')">取消</v-btn>
                </div>
            </v-stepper-content>
        </v-stepper-items>
    </v-stepper>
</template>

<script>
    import {
        importDataFlow,
        importConfig,
    } from '@/api/workFlow';

    export default {
        data: () => ({
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
            checkSize: "",
            checkContent: "",
            ipDataConfig: "",
        }),
        methods: {
            save() {
                importDataFlow (this.editedItem).then(data => {
                    this.desserts.push(data)
                });
            },
        }
    }
</script>

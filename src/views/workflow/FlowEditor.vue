

<template>
    <v-container grid-list-xl fluid>
        <model-flow-editor :flowEditorInfo="flowEditorInfo" @save="saveData" />
    </v-container>
</template>

<script>
    import ModelFlowEditor from '@/components/flow-editor/model-flow-editor';
    import {updateFlow} from '@/api/workFlow';

    export default {
        data: () => ({
            flowId: -1,
            flowEditorInfo: null
        }),
        components: {ModelFlowEditor},
        methods: {
            saveData(data) {
              updateFlow({
                  id: this.flowId,
                  flowEditorInfo : JSON.stringify(data),
                  flowConfig: this.parseData(data)
              }).then(data => {
                  alert("保存成功！");
              })
            },
            parseData(data) {
                if(data == null) {
                    return null;
                }

                let edges = data["edges"];
                let nodes = data["nodes"];

                if(nodes == null && typeof(nodes)!=="object") {
                    return null;
                }

                if(nodes.length === 1) {
                    return nodes[0]["shape"];
                }

                if(edges == null && typeof(edges)!=="object") {
                    return null;
                }



                let nodesMap = {};

                nodes.forEach(node => {
                    let id = node["id"];
                    if(id == null) {
                        return null;
                    }

                    nodesMap[id] = node;

                });

                let config = [];
                edges.forEach(edge => {
                    let sourceId = edge["source"];
                    let targetId = edge["target"];
                    if(sourceId == null || targetId == null) {
                        return null;
                    }

                    config.push(nodesMap[sourceId]["shape"] + ":" + nodesMap[targetId]["shape"]);
                });

                return config.join("\n");


            }
        },
        created() {
            this.flowId = this.$route.query["id"]
            this.flowEditorInfo = JSON.parse(this.$route.query["flowEditorInfo"])
        }
    };
</script>

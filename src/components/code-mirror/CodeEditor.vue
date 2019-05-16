<template>
    <v-container grid-list-xl fluid>
        <codemirror v-model="code" :options="cmOptions"></codemirror>
    </v-container>
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

    export default {
        name: "code-editor",
        data () {
            return {
                cmOptions: {
                    tabSize: 4,
                    mode: 'text/x-python',
                    theme: 'base16-dark',
                    lineNumbers: true,
                    line: true,
                    lines: 20
                }
            }
        },
        props: {
            code: String,
            value: String
        },
        methods: {
        },
        computed: {
        },
        mounted() {
        }
    }
</script>
<style>
    .CodeMirror {
        /* Set height, width, borders, and global font properties here */
        font-family: monospace;
        height: 100%;
        color: black;
        direction: ltr;
    }
</style>

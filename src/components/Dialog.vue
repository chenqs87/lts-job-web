<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-card>
        <v-card-title class="headline">{{ message }}</v-card-title>
        <v-card-actions>
            <v-spacer></v-spacer>
        <v-btn color="green darken-1" flat @click="$emit('close')">取消</v-btn>
        <v-btn color="green darken-1" flat v-on:click="$emit('agree')">确认</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    export default {
        data: () => ({
        }),
        props: {
            message: {
                type: String
            },
            value: {
                type: Object
            }
        },
        methods: {}
    }
</script>

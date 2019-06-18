<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-container grid-list-md text-xs-center>
      <v-toolbar flat color="white">
        <v-toolbar-title>Handlers</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-expansion-panel>
        <v-expansion-panel-content
          v-for="(list, handler) in handlers"
          :key="handler"
        >
          <template v-slot:header>
            <v-list-tile-action>
              <v-icon>cast</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title
                v-text="handler + '( active: ' + list.length + ')'"
              ></v-list-tile-title>
            </v-list-tile-content>
          </template>
          <v-card>
            <v-list>
              <v-list-tile v-for="host in list" :key="host" @click="">
                <v-list-tile-action>
                  <v-icon>computer</v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                  <v-list-tile-title v-text="host"></v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-container>
  </div>
</template>

<script>
import { getActiveHandlers } from "@/api/workFlow";
export default {
  data: () => ({
    handlers: {}
  }),
  created() {
    getActiveHandlers().then(data => {
      this.handlers = data;
    });
  },
  methods: {},
  filters: {}
};
</script>

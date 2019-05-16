<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card>
    <v-toolbar
            card
            color="grey lighten-3"
    >
      <v-icon>mdi-silverware</v-icon>
      <v-toolbar-title>授权</v-toolbar-title>
    </v-toolbar>

    <v-layout>
      <v-flex>
        <v-card-text>
          <v-card
                  class="mx-auto"
                  max-width="500"
          >
            <v-sheet class="pa-3 primary lighten-2">
              <v-text-field v-model="search" label="搜索用户" dark flat
                      solo-inverted hide-details clearable clear-icon="mdi-close-circle-outline"></v-text-field>
              <v-checkbox v-model="caseSensitive" dark hide-details label="大小写敏感"></v-checkbox>
            </v-sheet>
            <v-card-text>
              <v-treeview
                      :active.sync="active"
                      :items="items"
                      :search="search"
                      :filter="filter"
                      activatable
                      active-class="grey lighten-4 indigo--text"
                      selected-color="indigo"
                      open-on-click
                      :open.sync="open"
                      transition
              >
                <template v-slot:prepend="{ item }">
                  <v-icon
                          v-if="item.children"
                          v-text="`mdi-${item.id === 1 ? 'home-variant' : 'folder-network'}`"
                  ></v-icon>
                </template>
              </v-treeview>
            </v-card-text>
          </v-card>
        </v-card-text>
      </v-flex>

      <v-divider vertical></v-divider>

      <v-flex xs12 md6>
        <div v-if="!selections"
                class="title grey--text text--lighten-1 font-weight-light"
                style="align-self: center;">
          Select a User
        </div>
        <v-card
                v-else
                :key="selections.id"
                class="pt-4 mx-auto"
                flat
                max-width="400"
        >
          <v-card-text>
            {{selections.id}}
          </v-card-text>

        </v-card>
      </v-flex>
    </v-layout>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn
              flat

      >
        Reset
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn class="white--text" color="green darken-1" depressed v-on:click="$emit('save')">
        Save
        <v-icon right>mdi-content-save</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
    import {getAllUsers} from '@/api/workFlow';
    export default {
        data: () => ({
            items: [

            ],
            open: [],
            search: null,
            caseSensitive: false,
            active:[],
            tree: [],
            types: []
        }),
        computed: {
            filter () {
                return this.caseSensitive
                    ? (item, search, textKey) => item[textKey].indexOf(search) > -1
                    : undefined
            },
            selections () {
                if (!this.active.length)
                    return undefined;

                const id = this.active[0];

                return {
                    id: id,
                    name: 'test'
                }
            }
        },
        methods: {
           getAllUsers() {
               getAllUsers().then(data => {
                   let map = {};

                   for (let i=0; i< data.length; i++) {
                       let group = data[i]['groupName'];
                       let users = map[group]
                       if(users == null) {
                           users = [];
                           map[group] = users;
                       }
                       users.push({id: data[i]['username'], name: data[i]['username']});
                   }

                   let items = [];
                   for(let g in map) {
                       items.push({id:g, name: g, children: map[g]})
                   }
                   this.items = items;

               })
           }
        },
        created() {
            this.getAllUsers();
        }
    }
</script>

<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card>
    <v-toolbar card color="grey lighten-3">
      <v-icon>mdi-silverware</v-icon>
      <v-toolbar-title>授权</v-toolbar-title>
    </v-toolbar>

    <v-layout>
      <v-flex>
        <v-card-text>
          <v-card class="mx-auto" max-width="500">
            <v-sheet class="pa-3  lighten-2">
              <v-checkbox v-model="authUser"  hide-details :label="authUser?'用户授权':'用户组授权'"></v-checkbox>

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
                      transition>
                <template v-slot:prepend="{ item }">
                  <v-icon v-if="item.children" v-text="`mdi-${item.id === 1 ? 'home-variant' : 'folder-network'}`"></v-icon>
                </template>
              </v-treeview>
            </v-card-text>
          </v-card>
        </v-card-text>
      </v-flex>

      <v-divider vertical></v-divider>

      <v-flex xs12 md6>
        <v-card>
            <v-card-title>
                {{authType==='job'?"JobId":"FlowId"}}:{{resource}}
            </v-card-title>
          <v-card-text v-if="!selections">
            Select a {{authUser ? 'User' : 'Group'}}
          </v-card-text>

          <v-card-text v-else :key="selections.id">
<!--
            {{selections.id}}
-->
            <v-checkbox v-model="authSelected" v-for="(v,i) in permits" :label="i" :value="v"></v-checkbox>
          </v-card-text>
        </v-card>

      </v-flex>
    </v-layout>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn flat v-on:click="$emit('close')">
        Close
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn class="white--text" color="green darken-1" depressed v-on:click="savePermit">
        Save
        <v-icon right>mdi-content-save</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
    import {getAllUsers, getAllGroups, getResourcePermit, getJobPermit, getFlowPermit, updatePermit} from '@/api/workFlow';
    export default {
        data: () => ({
            items: [],
            open: [],
            search: null,
            caseSensitive: false,
            active:[],
            tree: [],
            permits: [],
            authUser: true,
            authSelected:[]
        }),
        props: {
            userOrGroup: {
              type: String
            },
            authType : {
                type: String
            },
            resource: {
                type: Number
            },
            permit: {
                type: Number
            }
        },
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
                //getResourcePermit(this.userOrGroup, id, this.resource, this.authType);
                this.getResourcePermit( id, this.resource, this.authType);
                return {
                    id: id,
                    name: id
                }
            }
        },
        watch: {
          authUser(val) {
              if(val) {
                  this.getAllUsers();
              } else {
                  this.getAllGroups();
              }
          }
        },
        methods: {
           getAllUsers() {
               getAllUsers().then(data => {
                   let map = {};

                   for (let i=0; i< data.length; i++) {
                       let group = data[i]['groupName'];
                       let users = map[group];
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
           },
            getAllGroups() {
                getAllGroups().then(data => {
                    let items = [];
                    for (let i=0; i< data.length; i++) {
                        let group = data[i]['groupName'];
                        items.push({id: group, name: group})
                    }
                    this.items = items;
                });
            },
            getResourcePermit( name, resource, resourceType) {
                getResourcePermit(this.authUser? 'User' : 'Group', name, resource, resourceType).then(permit => {
                    let selected = [];
                    for (let permitRuleKey in this.permits) {
                        let cur = this.permits[permitRuleKey];
                        if((permit & cur) > 0) {
                            selected.push(cur);
                        }
                    }
                    this.authSelected = selected;
                });
            },
            getJobPermit() {
                getJobPermit().then(data=> {
                    this.permits = data;
                });
            },
            getFlowPermit() {
                getFlowPermit().then(data=> {
                    this.permits = data;
                });
            },
            savePermit() {
                if (!this.active.length)
                    return undefined;
                const id = this.active[0];
                let permit = 0;
                for(let i = 0; i < this.authSelected.length; i++) {
                    permit |= this.authSelected[i];
                }

                updatePermit(this.authUser? 'User' : 'Group', id, this.resource, this.authType, permit).then(data => {

                })
            }
        },
        created() {
            this.getAllUsers();
            if(this.authType === 'job') {
                this.getJobPermit();
            } else {
               this.getFlowPermit();
            }
        }
    }
</script>

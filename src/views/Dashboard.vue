<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div id="pageDashboard">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg3 sm6 xs12>
          <mini-statistic
                  icon="fa fa-home"
                  :title="masters"
                  sub-title="Masters"
                  color="indigo"
          >
          </mini-statistic>
        </v-flex>

        <v-flex lg3 sm6 xs12>
          <mini-statistic
            icon="fa fa-sitemap"
            :title="handlerSize"
            sub-title="Handlers"
            color="teal"
          >
          </mini-statistic>
        </v-flex>
        <v-flex lg3 sm6 xs12>
          <mini-statistic
            icon="fa fa-server"
            :title="executors"
            sub-title="Executors"
            color="green"
          >
          </mini-statistic>
        </v-flex>
        <v-flex lg3 sm6 xs12>
          <mini-statistic
            icon="fa fa-tasks"
            :title="runningTasks"
            sub-title="Running Tasks"
            color="light-blue"
          >
          </mini-statistic>
        </v-flex>

        <!-- mini statistic  end -->
        <v-flex lg12 sm12 xs12>
          <v-widget title="任务统计" content-bg="white">
            <v-btn icon slot="widget-header-action">
              <v-icon class="text&#45;&#45;secondary" @click="refresh">refresh</v-icon>
            </v-btn>
            <div slot="widget-content">
              <e-chart v-if="countTasks.length > 0"
                :path-option="[
                  ['dataset.source', countTasks],
                  ['color', [color.green.lighten1,color.red.base]],
                  ['legend.show', true],
                  ['xAxis.axisLabel.show', true],
                  ['yAxis.axisLabel.show', true],
                  ['grid.left', '2%'],
                  ['grid.bottom', '5%'],
                  ['grid.right', '3%'],
                  ['series[0].type', 'bar'],
                  ['series[0].areaStyle', {}],
                  ['series[0].smooth', true],
                  ['series[1].smooth', true],
                  ['series[1].type', 'bar'],
                  ['series[1].areaStyle', {}]
                ]"
                height="400px"
                width="100%"
              >
              </e-chart>
            </div>
          </v-widget>
        </v-flex>

        <v-flex lg12 sm12 xs12>
          <v-widget title="Handlers" contentBg="white">
            <div slot="widget-content">
              <v-expansion-panel>
                <v-expansion-panel-content
                        v-for="(list, handler) in handlers"
                        :key="handler"
                >
                  <template v-slot:header>
                    <v-list-tile-action>
                      <v-icon>fa fa-sitemap</v-icon>
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
                          <v-icon>fa fa-server</v-icon>
                        </v-list-tile-action>

                        <v-list-tile-content>
                          <v-list-tile-title v-text="host"></v-list-tile-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </v-list>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </div>
          </v-widget>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import API from "@/api";
import EChart from "@/components/chart/echart";
import MiniStatistic from "@/components/widgets/statistic/MiniStatistic";
import PostListCard from "@/components/widgets/card/PostListCard";
import ProfileCard from "@/components/widgets/card/ProfileCard";
import PostSingleCard from "@/components/widgets/card/PostSingleCard";
import WeatherCard from "@/components/widgets/card/WeatherCard";
import PlainTable from "@/components/widgets/list/PlainTable";
import PlainTableOrder from "@/components/widgets/list/PlainTableOrder";
import VWidget from "@/components/VWidget";
import Material from "vuetify/es5/util/colors";
import VCircle from "@/components/circle/VCircle";
import BoxChart from "@/components/widgets/chart/BoxChart";
import ChatWindow from "@/components/chat/ChatWindow";
import CircleStatistic from "@/components/widgets/statistic/CircleStatistic";
import LinearStatistic from "@/components/widgets/statistic/LinearStatistic";
import { getActiveHandlers, getTaskInfo } from "@/api/workFlow";
export default {
  components: {
    VWidget,
    MiniStatistic,
    ChatWindow,
    VCircle,
    WeatherCard,
    PostSingleCard,
    PostListCard,
    ProfileCard,
    EChart,
    BoxChart,
    CircleStatistic,
    LinearStatistic,
    PlainTable,
    PlainTableOrder
  },
  data: () => ({
    handlers:[],
    handlerSize: "0",
    executors: "0",
    masters: "0",
    runningTasks: "0",
    color: Material,
    countTasks: []
  }),
  computed: {

  },
  created() {
    getActiveHandlers().then(data => {
      this.handlers = data;
      this.handlerSize = "" + Object.keys(data).length;
      let size = 0;

      for(let i in data) {
        size += data[i].length;
      }
      this.executors = "" + size;
    });


  },
  methods: {
    refresh() {
      this.countTasks=[];
      this.getTaskInfo();
    },

    getTaskInfo() {
      getTaskInfo().then(data => {
        this.masters = "" + data["masters"];
        this.runningTasks = "" + data["runningTasks"];
        let ts = data["countTasksByDay"];
        this.countTasks = ts.map(m => {
          return {
            day: m['day'],
            "Success": m['success'],
            "Failed": m['failed']
          };
        })
      });
    }
  },

  mounted() {
    this.getTaskInfo();
  }
};
</script>

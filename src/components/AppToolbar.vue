<template>
  <v-toolbar color="primary" fixed dark app>
    <v-toolbar-title class="ml-0 pl-3"> </v-toolbar-title>
    <v-toolbar-side-icon @click.stop="handleDrawerToggle"></v-toolbar-side-icon>


    <v-btn icon @click="go('/dashboard')">
      <v-icon>dashboard</v-icon>
    </v-btn>

    <v-btn icon @click="go('/workflow/jobs')">
      <v-icon>fa fa-tasks</v-icon>
    </v-btn>

    <v-btn icon @click="go('/workflow/workflow')">
      <v-icon>share</v-icon>
    </v-btn>

    <v-btn icon @click="go('/workflow/flow-tasks')">
      <v-icon>fa fa-history</v-icon>
    </v-btn>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn flat>
        {{ userName }}
      </v-btn>
    </v-toolbar-items>

    <v-btn icon @click="handleFullScreen()">
      <v-icon>fullscreen</v-icon>
    </v-btn>
    <v-menu
      offset-y
      origin="center center"
      :nudge-bottom="10"
      transition="scale-transition"
    >
      <v-btn icon large flat slot="activator">
        <v-icon>fa fa-user-o</v-icon>
      </v-btn>
      <v-list class="pa-0">
        <v-list-tile
          v-for="(item, index) in items"
          :to="!item.href ? { name: item.name } : null"
          :href="item.href"
          @click="item.click"
          ripple="ripple"
          :disabled="item.disabled"
          :target="item.target"
          rel="noopener"
          :key="index"
        >
          <v-list-tile-action v-if="item.icon">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>
<script>
import NotificationList from "@/components/widgets/list/NotificationList";
import Util from "@/util";

export default {
  name: "app-toolbar",
  components: {
    NotificationList
  },
  data: () => ({
    userName: sessionStorage.getItem("userName"),
    items: [
/*      {
        icon: "account_circle",
        href: "#",
        title: "Profile",
        click: e => {
          console.log(e);
        }
      },
      {
        icon: "settings",
        href: "#",
        title: "Settings",
        click: e => {
          console.log(e);
        }
      },*/
      {
        icon: "fullscreen_exit",
        href: "#",
        title: "Logout",
        click: e => {
          window.getApp.$emit("APP_LOGOUT");
        }
      }
    ]
  }),
  computed: {
    toolbarColor() {
      return this.$vuetify.options.extra.mainNav;
    }
  },
  methods: {
    handleDrawerToggle() {
      window.getApp.$emit("APP_DRAWER_TOGGLED");
    },
    handleFullScreen() {
      Util.toggleFullScreen();
    },
    go(url){
      this.$router.push({
        path: url
      });
    }
  }
};
</script>

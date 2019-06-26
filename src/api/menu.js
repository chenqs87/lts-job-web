import auth from "../router/auth";
const Menu = [
  {
    title: 'Dashboard',
    group: 'apps',
    icon: 'dashboard',
    name: 'Dashboard',
  },

  {
    title: "任务调度",
    group: "workflow",
    component: "work-flow",
    icon: "share",
    items: [
      { name: "Jobs", title: "任务配置", component: "Jobs" },
      { name: "Workflow", title: "工作流", component: "Workflow" },
      { name: "FlowTask", title: "历史任务", component: "FlowTask" }
    ]
  }
];

if (auth.getRole() === "ROLE_ADMIN") {
  Menu.push({
    title: "管理",
    group: "manager",
    component: "manager",
    icon: "settings",
    items: [
      //{ name: "Handlers", title: "Handlers", component: "Handlers" },
      { name: "Users", title: "Users", component: "Users" }
    ]
  });
}

export default Menu;

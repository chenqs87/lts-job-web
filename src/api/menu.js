const Menu =  [
  { header: 'Apps' },
  {
      title: '任务调度',
      group: 'workflow',
      component: 'work-flow',
      icon: 'share',
      items: [
          { name: 'Jobs', title: '任务配置', component: 'Jobs'},
          { name: 'Workflow', title: '工作流', component: 'Workflow' },
          { name: 'FlowTask', title: '历史任务', component: 'FlowTask' },
      ]
  },
    {
        title: '管理',
        group: 'manager',
        component: 'manager',
        icon: 'cast_connected',
        items: [
            { name: 'Handlers', title: 'Handlers', component: 'Handlers'},
            { name: 'Users', title: 'Users', component: 'Users'}
        ]
    }
];

export default Menu;

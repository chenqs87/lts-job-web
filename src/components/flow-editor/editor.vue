<template>
  <div />
</template>

<script>
export default {
  data() {
    return {
      selectedModel: {}, // 当前选中项数据模型
      curZoom: 1, // 当前缩放比率
      minZoom: 0.5, // 最小缩放比率
      maxZoom: 2 // 最大缩放比率
    };
  },
  mounted() {
    // 生成 G6 Editor 编辑器
    const height = window.innerHeight - 300;
    const editor = new G6Editor();
    const minimap = new G6Editor.Minimap({
      container: "minimap",
      height: 120,
      width: 200
    });
    const toolbar = new G6Editor.Toolbar({
      container: "toolbar"
    });
    const contextmenu = new G6Editor.Contextmenu({
      container: "contextmenu"
    });
    const itempannel = new G6Editor.Itempannel({
      container: "itempannel",
    });
    const detailpannel = new G6Editor.Detailpannel({
      container: "detailpannel"
    });
    const page = new G6Editor.Flow({
      graph: {
        container: "page",
        height
      },
      align: {
        grid: true
      }
      // noEndEdge: false,
      // edgeResizeable: false
    });
    page.on("afteritemselected", ev => {
      this.selectedModel = ev.item.getModel();
    });

    page.on("afterzoom", ev => {
      this.curZoom = ev.updateMatrix[0];
    });
    editor.add(minimap);
    editor.add(toolbar);
    editor.add(contextmenu);
    editor.add(itempannel);
    editor.add(detailpannel);
    editor.add(page);
    this.page = page;
    this.editor = editor;
  },
  methods: {
    changeZoom(zoom) {
      const page = this.page;
      page.zoom(zoom);
    },
    toggleGrid(checked) {
      const page = this.page;
      if (checked) {
        page.showGrid();
      } else {
        page.hideGrid();
      }
    },
    updateGraph(key, value) {
      const editor = this.editor;
      editor.executeCommand(() => {
        const page = this.page;
        const selectedItems = page.getSelected();
        selectedItems.forEach(item => {
          const updateModel = {};
          updateModel[key] = value;
          page.update(item, updateModel);
        });
      });
    }
  }
};
</script>
<style lang="scss">
*,
*::before,
*::after {
  box-sizing: border-box;
}
input {
  font-size: 12px;
}
#editor canvas {
  display: block;
}
#editor {
  position: relative;
  width: 100%;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}

</style>

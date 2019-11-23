<template>
  <main id="root">
    <Offset v-if="plan" @startShift="isShiftingPlan = true" @endShift="isShiftingPlan = false">
      <Zoom @toggled="this.onZoomToggled">
        <div class="container" ref="containerEl">
          <img
            class="plan"
            :src="plan.image"
            @mousedown="event => event.preventDefault()"
            @load="onPlanLoaded"
            alt
          />
          <Nodes
            v-if="isPlanLoaded"
            :tmpNode="tmpNode"
            :getContainerEl="() => $refs.containerEl"
            :isShiftingPlan="isShiftingPlan"
            :nodes="nodes"
            :zoom="zoom"
            @nodes="onNodes"
            @showNodeSettings="showNodeSettings"
          />
          <ImageExport
            v-if="isPlanLoaded && renderImageExport"
            :getContainerEl="() => $refs.containerEl"
            :nodes="nodes"
            :background="plan.image"
            :zoom="zoom"
            :planName="planName"
            @finished="renderImageExport = false"
          />
        </div>
      </Zoom>
    </Offset>
    <Navigation v-if="plan && isPlanLoaded" @navigate="navigate" />
    <NodePicker v-if="plan && isPlanLoaded" @picked="onNodePicked" :tmpNode="tmpNode" />
    <PlanManager v-if="!plan || isPlanManagerOpened" @selectedPlan="setPlan" />
    <NodeSettings
      v-if="settingsNode"
      :node="settingsNode"
      @discard="discardNodeSettings"
      @save="saveNodeSettings"
      @removeNode="removeNode"
    />
  </main>
</template>

<script>
import ImageExport from './components/image-export.vue';
import Navigation from './components/navigation.vue';
import NodePicker from './components/node-picker.vue';
import Nodes from './components/nodes.vue';
import NodeSettings from './components/node-settings.vue';
import Offset from './components/offset.vue';
import PlanManager from './components/plan-manager.vue';
import Zoom from './components/zoom.vue';

export default {
  data() {
    return {
      plan: null,
      planName: 'plan',
      isShiftingPlan: false,
      isPlanLoaded: false,
      isPlanManagerOpened: true,
      renderImageExport: false,
      nodes: [],
      tmpNode: null,
      settingsNode: null,
      zoom: 1
    };
  },
  created() {
    this._originalData = { ...this._data };
  },
  methods: {
    onNodePicked(node) {
      this.tmpNode = node;
    },
    onNodes(nodes) {
      nodes = nodes.map(node => ({ ...node, type: undefined }));

      this.tmpNode = null;
      this.nodes = nodes;
      localStorage.setItem(
        `nodes_${this.plan.fileName}`,
        JSON.stringify(nodes)
      );
    },
    onPlanLoaded() {
      this.isPlanLoaded = true;
    },
    onZoomToggled(zoom) {
      this.zoom = zoom;
    },
    setPlan(plan) {
      this.isPlanManagerOpened = false;
      this.nodes = JSON.parse(
        localStorage.getItem(`nodes_${plan.fileName}`) || '[]'
      );
      this.planName = plan.fileName.split('.').shift() || 'plan';
      this.plan = plan;
    },
    showNodeSettings(node) {
      this.settingsNode = node;
    },
    discardNodeSettings() {
      this.settingsNode = null;
    },
    saveNodeSettings(node) {
      const target = this.nodes.find(({ key }) => key === node.key);
      if (!target) {
        return;
      }

      this.settingsNode = null;
      Object.assign(target, node);
      this.onNodes(this.nodes);
    },
    removeNode(keyToRemove) {
      this.discardNodeSettings();
      this.onNodes(this.nodes.filter(({ key }) => key !== keyToRemove));
    },
    downloadConfig() {
      const config = { nodes: this.nodes };
      const json = JSON.stringify(config, null, 2);
      const link = document.createElement('a');
      link.setAttribute('download', `${this.planName}.config.json`);
      link.setAttribute(
        'href',
        `data:text/json;charset=utf-8,${encodeURIComponent(json)}`
      );
      link.click();
    },
    reset() {
      Object.assign(this, this._originalData);
    },
    navigate(target) {
      switch (target) {
        case 'plans':
          this.reset();
          break;
        case 'downloadImage':
          this.renderImageExport = true;
          break;
        case 'downloadConfig':
          this.downloadConfig();
          break;
        case 'uploadConfig':
          alert('Sorry, not implemented, yet');
          break;
      }
    }
  },
  components: {
    ImageExport,
    Navigation,
    NodePicker,
    Nodes,
    NodeSettings,
    Offset,
    PlanManager,
    Zoom
  }
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}

html {
  font-size: calc(12px + 0.5vw);
}

body {
  font-family: monospace;
  color: #000;
}

::-moz-focus-inner {
  border: 0;
}

#root {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.container {
  position: relative;
  flex: 0 1 auto;
}

.plan {
  display: block;
  width: auto;
  height: auto;
  max-width: calc(95vw - 6rem - 48px);
  min-width: 800px;
}

.icon {
  display: block;
  width: 2rem;
  height: 2rem;
}

@media screen and (min-width: 1000px) {
  .plan {
    min-width: 0;
    max-width: calc(95vw - 6rem - 48px); /* 4rem + 2rem */
    max-height: calc(100vh - 2vw - 112px - 2rem); /* 64px + 48px */
  }
}
</style>

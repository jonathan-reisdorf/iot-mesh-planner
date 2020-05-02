<template>
  <main id="root">
    <div v-if="showClickGuard" @click="showClickGuard = false" class="clickGuard"></div>
    <Offset v-if="plan" @startShift="isShiftingPlan = true" @endShift="isShiftingPlan = false">
      <Zoom @toggled="this.onZoomToggled" ref="zoomEl">
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
            :showLines="showLines"
            :zoom="zoom"
            @nodes="onNodes"
            @showNodeSettings="showNodeSettings"
          />
        </div>
      </Zoom>
    </Offset>
    <Navigation
      v-if="plan && isPlanLoaded"
      @navigate="navigate"
      :items="['plans', 'downloadImage', 'exportConfig', 'importConfig']"
      :alignment="'left'"
    />
    <Navigation
      v-if="plan && isPlanLoaded"
      @navigate="navigate"
      :items="['toggleZoom', 'toggleLines']"
      :alignment="'top'"
      :zoom="zoom"
      :showLines="showLines"
    />
    <NodePicker v-if="plan && isPlanLoaded" @picked="onNodePicked" :tmpNode="tmpNode" />
    <PlanManager v-if="!plan || isPlanManagerOpened" @selectedPlan="setPlan" />
    <ImageExport
      v-if="isPlanLoaded && renderImageExport"
      :getContainerEl="() => $refs.containerEl"
      :nodes="nodes"
      :background="plan.image"
      :planName="planName"
      @finished="renderImageExport = false"
    />
    <NodeSettings
      v-if="settingsNode"
      :node="settingsNode"
      @discard="discardNodeSettings"
      @save="saveNodeSettings"
      @removeNode="removeNode"
    />
    <ConfigImportPreview
      v-if="configToImport"
      :nodes="nodes"
      :config="configToImport"
      :getContainerEl="() => $refs.containerEl"
      :background="plan.image"
      @discard="discardConfigImport"
      @proceed="importConfig"
    />
  </main>
</template>

<script>
import ConfigImportPreview from './components/config-import-preview.vue';
import ImageExport from './components/image-export.vue';
import Navigation from './components/navigation.vue';
import NodePicker from './components/node-picker.vue';
import Nodes from './components/nodes.vue';
import NodeSettings from './components/node-settings.vue';
import Offset from './components/offset.vue';
import PlanManager from './components/plan-manager.vue';
import Zoom from './components/zoom.vue';

import { APPLICATION_VERSION } from './config';

export default {
  data() {
    return {
      plan: null,
      planName: 'plan',
      isShiftingPlan: false,
      isPlanLoaded: false,
      isPlanManagerOpened: true,
      renderImageExport: false,
      showLines: true,
      nodes: [],
      tmpNode: null,
      settingsNode: null,
      configToImport: null,
      showClickGuard: false,
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
    showNodeSettings(node, event) {
      event.type === 'touchend' && (this.showClickGuard = true);
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
    exportConfig() {
      const config = {
        nodes: this.nodes,
        applicationVersion: APPLICATION_VERSION,
        date: new Date().toUTCString()
      };
      const json = JSON.stringify(config, null, 2);
      const link = document.createElement('a');
      link.setAttribute('download', `${this.planName}.config.json`);
      link.setAttribute(
        'href',
        `data:text/json;charset=utf-8,${encodeURIComponent(json)}`
      );
      link.click();
    },
    discardConfigImport() {
      this.configToImport = null;
    },
    importConfig() {
      this.onNodes(this.configToImport.nodes || []);
      this.configToImport = null;
    },
    showConfigImportPreview(file) {
      if (!file || file.type !== 'application/json') {
        file && alert('Only json files are supported!');
        return;
      }

      const reader = new FileReader();
      reader.onload = ({ target: { result } }) => {
        try {
          this.configToImport = JSON.parse(result);
        } catch (e) {
          alert('Error reading the config file');
        }
      };
      reader.readAsText(file);
    },
    reset() {
      Object.assign(this, this._originalData);
    },
    navigate(target, arg = null) {
      switch (target) {
        case 'plans':
          this.reset();
          break;
        case 'downloadImage':
          this.renderImageExport = true;
          break;
        case 'exportConfig':
          this.exportConfig();
          break;
        case 'importConfig':
          this.showConfigImportPreview(arg);
          break;
        case 'toggleZoom':
          this.$refs.zoomEl.$emit('toggle');
          break;
        case 'toggleLines':
          this.showLines = !this.showLines;
          break;
      }
    }
  },
  components: {
    ConfigImportPreview,
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

.clickGuard {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 9;
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
  /* min-width: 800px; TODO re-enable after fixing chromium bug */
}

.icon {
  display: block;
  width: 2rem;
  height: 2rem;
}

.button {
  display: block;
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  background: #777;
  color: #fff;
  font-size: inherit;
  font-family: inherit;
  font-weight: inherit;
  border: 0 none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button:hover,
.button:focus {
  background-color: #444;
}

.button--primary {
  margin-left: auto;
  margin-right: 0;
  background-color: #004e85;
}

.button--primary:hover,
.button--primary:focus {
  background-color: #003153;
}

.button--negative {
  background-color: #bb2a29;
}

.button--negative:hover,
.button--negative:focus {
  background-color: #922b2b;
}

@media screen and (min-width: 1000px) {
  .plan {
    min-width: 0;
    max-width: calc(95vw - 6rem - 48px); /* 4rem + 2rem */
    max-height: calc(100vh - 2vw - 112px - 2rem); /* 64px + 48px */
  }
}
</style>

<template>
  <main id="root">
    <Offset v-if="plan" @startShift="isShiftingPlan = true" @endShift="isShiftingPlan = false">
      <Zoom>
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
            @nodes="onNodes"
            @showNodeSettings="showNodeSettings"
          />
        </div>
      </Zoom>
    </Offset>
    <NodePicker v-if="plan && isPlanLoaded" @picked="onNodePicked" :tmpNode="tmpNode" />
    <PlanManager v-if="!plan || isPlanManagerOpened" @selectedPlan="setPlan" />
    <NodeSettings
      v-if="settingsNode"
      :node="settingsNode"
      @discard="discardNodeSettings"
      @save="saveNodeSettings"
    />
  </main>
</template>

<script>
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
      isShiftingPlan: false,
      isPlanLoaded: false,
      isPlanManagerOpened: true,
      nodes: [],
      tmpNode: null,
      settingsNode: null
    };
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
    setPlan(plan) {
      this.isPlanManagerOpened = false;
      this.nodes = JSON.parse(
        localStorage.getItem(`nodes_${plan.fileName}`) || '[]'
      );
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
    }
  },
  components: {
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
  max-width: calc(100vw - 4rem);
  max-height: calc(100vh - 4rem);
}

.icon {
  display: block;
  width: 2rem;
  height: 2rem;
}
</style>

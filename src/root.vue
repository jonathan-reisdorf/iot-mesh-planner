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
          />
        </div>
      </Zoom>
    </Offset>
    <NodePicker v-if="plan && isPlanLoaded" @picked="onNodePicked" :tmpNode="tmpNode" />
    <PlanManager v-if="!plan || isPlanManagerOpened" @selectedPlan="setPlan" />
  </main>
</template>

<script>
import NodePicker from './components/node-picker.vue';
import Nodes from './components/nodes.vue';
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
      tmpNode: null
    };
  },
  methods: {
    onNodePicked(node) {
      this.tmpNode = node;
    },
    onNodes(nodes) {
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
    }
  },
  components: {
    NodePicker,
    Nodes,
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
  fill: #4b413f;
}

.icon.iot {
  fill: #004e85;
}

.icon.extension {
  display: block;
  position: absolute;
  right: 0.25rem;
  top: 0.25rem;
  width: 1.5rem;
  height: 1.5rem;
  z-index: 1;
  background: #fff;
  border-radius: 50%;
}
</style>

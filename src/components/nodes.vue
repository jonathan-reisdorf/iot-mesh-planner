<template>
  <div class="nodes" @mousemove="shift" v-touch:moving="shift" v-touch:end="place">
    <Node
      v-if="tmpNode && tmpX !== null && tmpY !== null"
      class="tmp"
      :class="{smart: tmpNode.smart}"
      :title="tmpNode.title"
      :icon="tmpNode.icon"
      :smart="tmpNode.smart"
      :extension="tmpNode.extension"
      :style="{left: tmpX + '%', top: tmpY + '%' }"
    />
    <Node
      v-for="node in nodes"
      v-bind:key="node.key"
      :class="{smart: node.smart, tmp: node.key === activeKey}"
      :title="node.title"
      :icon="node.icon"
      :smart="node.smart"
      :extension="node.extension"
      :note="node.note"
      :style="getNodeStyle(node)"
      v-touch:start="event => setActiveKey(node.key, event)"
      v-touch:end="event => showNodeSettings(node, event)"
    />
    <Lines
      :getContainerEl="getContainerEl"
      :nodes="nodes"
      :tmpNode="tmpNode"
      :movingNode="movingNode"
    />
  </div>
</template>

<script>
import Node from './node.vue';
import Lines from './lines.vue';

import { NODES_START_MOVING_TIMEOUT } from '../config';

export default {
  props: ['getContainerEl', 'nodes', 'isShiftingPlan', 'tmpNode'],
  data() {
    return {
      containerEl: null,
      activeKey: null,
      movingNode: null,
      tmpX: null,
      tmpY: null,
      startMovingTimeout: null
    };
  },
  mounted() {
    this.containerEl = this.getContainerEl();
  },
  methods: {
    getNodeStyle(node) {
      const { activeKey, tmpX, tmpY } = this;
      const x = activeKey === node.key && tmpX !== null ? tmpX : node.x;
      const y = activeKey === node.key && tmpY !== null ? tmpY : node.y;

      return {
        left: x + '%',
        top: y + '%'
      };
    },
    getCoords(event) {
      const { clientX: x, clientY: y } = event.changedTouches
        ? event.changedTouches[0]
        : event;
      return { x, y };
    },
    shift(event) {
      const { tmpNode, activeKey, containerEl } = this;
      if ((!tmpNode && !activeKey) || !containerEl) {
        return;
      }

      event.preventDefault();
      const { x: pointerX, y: pointerY } = this.getCoords(event);
      const {
        x: containerX,
        y: containerY,
        width,
        height
      } = containerEl.getBoundingClientRect();

      const x = ((pointerX - containerX) / width) * 100;
      const y = ((pointerY - containerY) / height) * 100;
      this.tmpX = Math.max(Math.min(x, 100), 0);
      this.tmpY = Math.max(Math.min(y, 100), 0);
      this.movingNode = {
        x: this.tmpX,
        y: this.tmpY,
        key: activeKey || 'tmp'
      };
    },
    place(event) {
      clearTimeout(this.startMovingTimeout);

      if (this.isShiftingPlan) {
        return;
      }

      const { activeKey, tmpNode, tmpX, tmpY } = this;
      this.activeKey = null;
      this.tmpX = null;
      this.tmpY = null;

      if (!tmpX || !tmpY) {
        return;
      }

      tmpNode &&
        this.$emit(
          'nodes',
          this.nodes.concat({
            ...tmpNode,
            x: tmpX,
            y: tmpY,
            key: new Date().getTime()
          })
        );

      activeKey &&
        this.$emit(
          'nodes',
          this.nodes.map(node =>
            node.key !== activeKey ? node : { ...node, x: tmpX, y: tmpY }
          )
        );
    },
    removeNode(key, event = null) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      this.$emit('nodes', this.nodes.filter(node => node.key !== key));
    },
    setActiveKey(key, event = null) {
      if (event && event.buttons === 4) {
        this.activeKey = null;
        return this.removeNode(key, event);
      }

      event && event.stopPropagation();
      this.startMovingTimeout = setTimeout(
        () => (this.activeKey = key),
        NODES_START_MOVING_TIMEOUT
      );
    },
    showNodeSettings(node, event = null) {
      if (node.key === this.activeKey) {
        return;
      }

      this.$emit('showNodeSettings', node);
    }
  },
  components: {
    Node,
    Lines
  }
};
</script>

<style scoped>
.nodes {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.node {
  position: absolute;
  cursor: pointer;
  border-radius: 50%;
  background-color: #ddd;
  border: 2px solid #4b413f;
  width: auto;
  height: auto;
  margin-left: calc(-2px - 1rem - 0.5vw);
  margin-top: calc(-2px - 1rem - 0.5vw);
  will-change: left, top, opacity;
  transition: opacity 0.3s;
  z-index: 0;
}

.node:hover {
  opacity: 0.7;
  z-index: 2;
}

.node.smart {
  border-color: #004e85;
  z-index: 1;
}
.node.tmp {
  cursor: none;
  opacity: 1;
  z-index: 2;
}
</style>
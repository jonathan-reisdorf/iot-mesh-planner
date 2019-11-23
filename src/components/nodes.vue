<template>
  <div
    class="nodes"
    :class="{'nodes--zoomed': zoom !== 1}"
    @mousemove="shift"
    v-touch:moving="shift"
    v-touch:end="place"
  >
    <Node
      v-if="tmpNode && tmpX !== null && tmpY !== null"
      class="tmp"
      :class="{smart: tmpNode.smart}"
      :icon="tmpNode.icon"
      :smart="tmpNode.smart"
      :extension="tmpNode.extension"
      :style="{left: tmpX + '%', top: tmpY + '%' }"
    />
    <Node
      v-for="node in nodes"
      v-bind:key="node.key"
      :class="{smart: node.smart, tmp: node.key === activeKey}"
      :title="node.key !== activeKey ? node.title : undefined"
      :icon="node.icon"
      :smart="node.smart"
      :extension="node.extension"
      :note="node.note"
      :background="node.background"
      :style="getNodeStyle(node)"
      v-touch:start="event => setActiveKey(node.key, event)"
      v-touch:end="event => showNodeSettings(node.key, event)"
    />
    <div
      class="crosshair"
      v-if="(tmpNode || activeKey) && tmpX !== null && tmpY !== null"
      :style="{left: tmpX + '%', top: tmpY + '%' }"
    />
    <Lines
      :getContainerEl="getContainerEl"
      :nodes="nodes"
      :tmpNode="tmpNode"
      :movingNode="movingNode"
      :zoom="zoom"
    />
  </div>
</template>

<script>
import Node from './node.vue';
import Lines from './lines.vue';

import { NODES_START_MOVING_TIMEOUT } from '../config';

export default {
  props: ['getContainerEl', 'nodes', 'isShiftingPlan', 'tmpNode', 'zoom'],
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
    showNodeSettings(key, event = null) {
      if (key === this.activeKey) {
        return;
      }

      const target = this.nodes.find(node => node.key === key);
      if (!target) {
        return;
      }

      this.$emit('showNodeSettings', target);
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

.nodes--zoomed .node {
  transform: scale(0.5);
}

.node {
  position: absolute;
  cursor: pointer;
  border-radius: 50%;
  background-color: #ddd;
  border: 2px solid #4b413f;
  width: auto;
  height: auto;
  margin-left: -24px; /* -(1/2 icon width + padding + border) */
  margin-top: -24px;
  will-change: left, top, opacity, transform;
  transition: opacity 0.3s, transform 0.3s ease-in-out 0.4s;
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
  z-index: 3;
}

.crosshair {
  position: absolute;
  z-index: 2;
  mix-blend-mode: difference;
}
.crosshair::before,
.crosshair::after {
  display: block;
  content: '';
  position: absolute;
  background: #fff;
  z-index: -1;
}
.crosshair::before {
  left: -100vw;
  right: -100vw;
  top: 0;
  margin-top: -1px;
  height: 2px;
}
.crosshair::after {
  top: -100vh;
  bottom: -100vh;
  left: 0;
  margin-left: -1px;
  width: 2px;
}
</style>
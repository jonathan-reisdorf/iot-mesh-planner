<template>
  <div class="nodes" @mousemove="shift" v-touch:moving="shift" v-touch:end="place">
    <Node
      v-if="tmpNode && tmpX !== null && tmpY !== null"
      class="tmp"
      :class="{smart: tmpNode.smart}"
      :id="tmpNode.id"
      :title="tmpNode.title"
      :icon="tmpNode.icon"
      :smart="tmpNode.smart"
      :extension="tmpNode.extension"
      :style="{left: tmpX + '%', top: tmpY + '%' }"
    />
    <Node
      v-for="(node, index) in nodes"
      v-bind:key="index"
      :class="{smart: node.smart, tmp: node.key === activeKey}"
      :id="node.id"
      :title="node.title"
      :icon="node.icon"
      :smart="node.smart"
      :extension="node.extension"
      :style="getNodeStyle(node)"
      v-touch:start="event => setActiveKey(node.key, event)"
    />
  </div>
</template>

<script>
import Node from './node.vue';

export default {
  props: ['getContainerEl', 'nodes', 'shiftingPlan', 'tmpNode'],
  data() {
    return {
      containerEl: null,
      activeKey: null,
      tmpX: null,
      tmpY: null
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
    },
    place(event) {
      if (this.shiftingPlan) {
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
            node.key !== activeKey ? { ...node } : { ...node, x: tmpX, y: tmpY }
          )
        );
    },
    setActiveKey(key, event = null) {
      event && event.stopPropagation();
      this.activeKey = key;
    }
  },
  components: {
    Node
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
  transform: translateX(-50%) translateY(-50%);
  will-change: left, top;
  z-index: 0;
}

.node.smart {
  border-color: #004e85;
  z-index: 1;
}
.node.tmp {
  cursor: none;
  z-index: 2;
}
</style>
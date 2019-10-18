<template>
  <div class="nodes" @mousemove="shift" v-touch:moving="shift" v-touch:end="place">
    <Node
      v-if="tmpNode && tmpX !== null && tmpY !== null"
      class="node tmp"
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
      class="node"
      :class="{smart: node.smart}"
      :id="node.id"
      :title="node.title"
      :icon="node.icon"
      :smart="node.smart"
      :extension="node.extension"
      :style="{left: node.x + '%', top: node.y + '%' }"
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
      tmpX: null,
      tmpY: null
    };
  },
  mounted() {
    this.containerEl = this.getContainerEl();
  },
  methods: {
    getCoords(event) {
      const { clientX: x, clientY: y } = event.changedTouches
        ? event.changedTouches[0]
        : event;
      return { x, y };
    },
    shift(event) {
      const { tmpNode, containerEl } = this;
      if (!tmpNode || !containerEl) {
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

      if (this.tmpNode) {
        this.$emit(
          'nodes',
          this.nodes.concat({ ...this.tmpNode, x: this.tmpX, y: this.tmpY })
        );
      }
      // TODO this.activeNodes

      this.tmpX = null;
      this.tmpY = null;
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
}

.node.smart {
  border-color: #004e85;
}
.node.tmp {
  cursor: none;
}
</style>
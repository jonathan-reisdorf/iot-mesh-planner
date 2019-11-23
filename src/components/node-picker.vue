<template>
  <div class="node-picker">
    <Node
      v-for="node in nodes"
      class="node-picker__node"
      :class="{'active': tmpNode && tmpNode.type === node.type}"
      :key="node.type"
      :title="node.title"
      :icon="node.icon"
      :smart="node.smart"
      :extension="node.extension"
      @click="$emit('picked', tmpNode && tmpNode.type === node.type ? null : {...node, key: 'tmp'})"
    />
  </div>
</template>

<script>
import { NODES } from '../config';
import Node from './node.vue';

export default {
  props: ['tmpNode'],
  data() {
    return {
      nodes: NODES
    };
  },
  components: {
    Node
  }
};
</script>

<style scoped>
.node-picker {
  display: flex;
  flex-flow: row nowrap;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background: #eee;
  border-radius: 0.5vw 0.5vw 0 0;
}

.node-picker__node.node {
  position: relative;
  padding: 0.5vw 0.75vw;
  margin: 0.5vw;
  cursor: pointer;
  border-radius: 0.5vw;
  transition: background-color 0.3s;
}
.node-picker__node.node + .node {
  margin-left: 0;
}
.node-picker__node.node:hover {
  background-color: #ccc;
}

.node-picker__node.node.active {
  background-color: #bbb;
}
</style>
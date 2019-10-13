<template>
  <div class="node-picker">
    <Node
      class="node-picker__node"
      v-for="node in nodes"
      v-bind:key="node.id"
      :id="node.id"
      :title="node.title"
      :icon="node.icon"
      :smart="node.smart"
      :extension="node.extension"
    />
  </div>
</template>

<script>
import { NODES } from '../config';
import Node from './node.vue';

export default {
  data() {
    return {
      nodes: NODES
    };
  },
  mounted() {
    //
  },
  methods: {
    //
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
</style>
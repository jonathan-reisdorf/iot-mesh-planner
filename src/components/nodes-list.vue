<template>
  <div class="nodesList">
    <Node
      v-for="node in nodes"
      :key="node.key"
      :icon="node.icon"
      :smart="node.smart"
      :extension="node.extension"
      :note="node.note"
      :title="node.title"
      :class="{smart: node.smart}"
      :style="{backgroundColor: node.background}"
    />
  </div>
</template>

<script>
import Node from './node.vue';

export default {
  props: ['nodes'],
  components: {
    Node
  }
};
</script>

<style scoped>
.nodesList {
  display: flex;
  flex-flow: row nowrap;
  overflow-x: auto;
  padding: 0.5rem;
}

.nodesList .node {
  position: relative;
  flex: none;
  background-color: #ddd;
  border-radius: 50%;
}

.nodesList .node + .node {
  margin-left: 0.5rem;
}
</style>
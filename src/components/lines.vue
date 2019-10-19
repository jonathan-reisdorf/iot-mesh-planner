<template>
  <canvas v-if="ratio" ref="canvas" :width="width" :height="height" />
</template>

<script>
export default {
  props: ['getContainerEl', 'nodes'],
  data() {
    const containerEl = this.getContainerEl();
    const { width, height } = containerEl.getBoundingClientRect();
    const ratio = height / width;

    const smartDevices = this.nodes
      .map(node => ({ ...node }))
      .filter(({ smart }) => smart);
    const activeDevices = smartDevices.filter(
      ({ smart }) => smart === 'active' || smart === 'hub'
    );
    const hubDevice = activeDevices.find(({ smart }) => smart === 'hub');

    return {
      ctx: null,
      width,
      height,
      containerEl,
      ratio,
      smartDevices,
      activeDevices,
      hubDevice,
      cachedDistances: {},
      cachedNeighbors: [],
      renderedLines: []
    };
  },
  mounted() {
    window.addEventListener('resize', this.onCanvasResize);
    const { canvas } = this.$refs;
    this.ctx = canvas.getContext('2d');
    this.draw();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onCanvasResize);
  },
  methods: {
    onCanvasResize() {
      const { width, height } = this.containerEl.getBoundingClientRect();
      const { canvas } = this.$refs;
      this.ratio = height / width;
      this.width = width;
      this.height = height;
      requestAnimationFrame(() => this.draw());
    },
    getNeighbors(node, nodes) {
      const nodesWithDistances = this.getNodesWithDistances(node, nodes);

      const wDist = Math.max(
        (
          nodesWithDistances
            .filter(({ dist }) => dist <= 25)
            .slice(0, 2)
            .pop() || {}
        ).dist || 25,
        20
      );

      const neighbors = nodesWithDistances
        .filter(({ dist }) => dist <= wDist * 1.5)
        .concat(
          this.cachedNeighbors
            .filter(identifier =>
              identifier.split(':').includes(String(node.key))
            )
            .map(identifier =>
              parseInt(
                identifier.split(':').find(part => part !== String(node.key)),
                10
              )
            )
            .map(key => nodesWithDistances.find(({ key: k }) => key === k))
            .filter(({ dist }) => dist > wDist * 1.5)
        );
      this.cachedNeighbors = this.cachedNeighbors
        .concat(neighbors.map(({ key }) => `${node.key}:${key}`))
        .filter((item, index, arr) => arr.indexOf(item) === index);

      return neighbors;
    },
    getNodesWithDistances(node, nodes) {
      const { key: nodeKey, x: nodeX } = node;
      const nodeY = node.y * this.ratio;

      const { cachedDistances: dists } = this;
      return nodes
        .filter(({ key }) => key !== nodeKey)
        .map(node => {
          const cachedDist =
            dists[`${node.key}:${nodeKey}`] || dists[`${nodeKey}:${node.key}`];
          if (cachedDist) {
            return { ...node, dist: cachedDist };
          }

          const x = node.x;
          const y = node.y * this.ratio;
          const dist = Math.sqrt(
            Math.pow(x - nodeX, 2) + Math.pow(y - nodeY, 2)
          );
          dists[`${nodeKey}:${node.key}`] = dist;
          return { ...node, dist };
        })
        .sort((prev, next) => prev.dist - next.dist);
    },
    getNodesWithNeighbors(nodes) {
      this.cachedDistances = {};
      this.cachedNeighbors = [];

      return nodes.map(node => ({
        ...node,
        neighbors: this.getNeighbors(node, nodes)
      }));
    },
    draw() {
      const { activeDevices, ctx } = this;
      this.renderedLines = [];
      ctx.strokeStyle = '#004e85';

      const nodesWithNeighbors = this.getNodesWithNeighbors(activeDevices);
      nodesWithNeighbors.forEach(node => {
        const { neighbors } = node;
        neighbors.forEach(neighbor => {
          if (this.renderedLines[`${neighbor.key}:${node.key}`]) {
            return;
          }

          ctx.beginPath();
          ctx.lineWidth = Math.max(
            Math.min(3.5 - (neighbor.dist - 10) * 0.1, 3.5),
            0.5
          );
          ctx.moveTo((node.x / 100) * this.width, (node.y / 100) * this.height);
          ctx.lineTo(
            (neighbor.x / 100) * this.width,
            (neighbor.y / 100) * this.height
          );
          ctx.stroke();
          this.renderedLines[`${node.key}:${neighbor.key}`] = true;
        });
      });
      console.log(nodesWithNeighbors);
    }
  }
};
</script>

<style scoped>
canvas {
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  pointer-events: none;
  z-index: 0;
}
</style>
<template>
  <canvas v-if="ratio" ref="canvas" :width="width" :height="height" />
</template>

<script>
export default {
  props: ['getContainerEl', 'nodes', 'tmpNode', 'movingNode'],
  data() {
    const containerEl = this.getContainerEl();
    const { width, height } = containerEl.getBoundingClientRect();
    const ratio = height / width;

    return {
      ctx: null,
      width,
      height,
      containerEl,
      ratio,
      cachedDistances: {},
      cachedNeighbors: [],
      renderedLines: [],
      ...this.getDevices()
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
  watch: {
    nodes() {
      requestAnimationFrame(() => {
        Object.assign(this, this.getDevices());
        this.draw();
      });
    },
    tmpNode() {
      Object.assign(this, this.getDevices());
    },
    movingNode({ key, x, y } = {}) {
      const node = this.smartDevices.find(
        ({ key: nodeKey }) => nodeKey === key
      );
      if (!node) {
        return;
      }

      node.x = x;
      node.y = y;
      Object.keys(this.cachedDistances)
        .filter(k => k.split(':').includes(String(key)))
        .forEach(k => delete this.cachedDistances[k]);
      this.draw(false);
    }
  },
  methods: {
    getDevices() {
      const smartDevices = this.nodes
        .concat(this.tmpNode)
        .filter(node => node)
        .map(node => ({ ...node }))
        .filter(({ smart }) => smart);
      const activeDevices = smartDevices.filter(
        ({ smart }) => smart === 'active' || smart === 'hub'
      );
      const passiveDevices = smartDevices.filter(
        ({ smart }) => smart === 'passive'
      ); // TODO RENDER
      const hubDevices = activeDevices.filter(({ smart }) => smart === 'hub'); // TODO USE

      return { smartDevices, activeDevices, passiveDevices, hubDevices };
    },
    onCanvasResize() {
      const { width, height } = this.containerEl.getBoundingClientRect();
      const { canvas } = this.$refs;
      this.ratio = height / width;
      this.width = width;
      this.height = height;
      this.draw(false);
    },
    getNeighbors(node, nodes) {
      const nodesWithDistances = this.getNodesWithDistances(node, nodes);

      /* const wDist = Math.max(
        (
          nodesWithDistances
            .filter(({ dist }) => dist <= 25)
            .slice(0, 2)
            .pop() || {}
        ).dist || 25,
        20
      ); */
      const wDist = 25;

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
    getNodesWithNeighbors(nodes, deleteCachedDists = true) {
      this.cachedNeighbors = [];
      deleteCachedDists && (this.cachedDistances = {});

      return nodes.map(node => ({
        ...node,
        neighbors: this.getNeighbors(node, nodes)
      }));
    },
    draw(deleteCachedDists = true) {
      requestAnimationFrame(() => {
        const { canvas } = this.$refs;
        const { activeDevices, ctx } = this;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.renderedLines = [];
        ctx.strokeStyle = '#004e85';

        const nodesWithNeighbors = this.getNodesWithNeighbors(
          activeDevices,
          deleteCachedDists
        );

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
            ctx.moveTo(
              (node.x / 100) * this.width,
              (node.y / 100) * this.height
            );
            ctx.lineTo(
              (neighbor.x / 100) * this.width,
              (neighbor.y / 100) * this.height
            );
            ctx.stroke();
            this.renderedLines[`${node.key}:${neighbor.key}`] = true;
          });
        });
      });
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
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
      hubDevice
    };
  },
  mounted() {
    window.addEventListener('resize', this.onCanvasResize);
    const { canvas } = this.$refs;
    this.ctx = canvas.getContext('2d');

    const { hubDevice, activeDevices, smartDevices } = this;
    if (!hubDevice) {
      return;
    }

    let { x: hubX, y: hubY } = hubDevice;
    hubY = hubY * this.ratio;
    const hubDeviceNeighbors = activeDevices
      .filter(({ key }) => key !== hubDevice.key)
      .map(node => {
        let { x, y } = node;
        y = y * this.ratio;
        const dist = Math.sqrt(Math.pow(x - hubX, 2) + Math.pow(y - hubY, 2));
        return { ...node, dist };
      })
      .sort((prev, next) => prev.dist - next.dist);
    let wDist =
      (
        hubDeviceNeighbors
          .filter(({ dist }) => dist <= 25)
          .slice(0, 2)
          .pop() || {}
      ).dist || 25;
    wDist = wDist < 20 ? 20 : wDist;
    console.log(
      this.ratio,
      smartDevices,
      activeDevices,
      hubDevice,
      hubDeviceNeighbors,
      wDist * 1.5
    );
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onCanvasResize);
  },
  methods: {
    onCanvasResize() {
      const { width, height } = this.containerEl.getBoundingClientRect();
      this.ratio = height / width;
      this.width = width;
      this.height = height;
      console.log(width, height);
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
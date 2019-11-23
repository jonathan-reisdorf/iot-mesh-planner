<template>
  <canvas v-if="ratio" ref="canvas" :width="width + (offset * 2)" :height="height + (offset * 2)">
    <div class="icons" v-if="renderNodeList">
      <DoorWindowSensor ref="icon_door_window_sensor" />
      <EthernetSocket ref="icon_ethernet_socket" />
      <EthernetSwitch ref="icon_ethernet_switch" />
      <Generic ref="icon_generic" />
      <Hub ref="icon_hub" />
      <Light ref="icon_light" />
      <MotionSensor ref="icon_motion_sensor" />
      <PlugSocket ref="icon_plug_socket" />
      <SmokeDetector ref="icon_smoke_detector" />
      <SwitchIcon ref="icon_switch" />
      <TemperatureSensor ref="icon_temperature_sensor" />
      <Wireless ref="icon_wireless" />
      <Note ref="icon_note" />
    </div>
  </canvas>
</template>

<script>
import {
  DEFAULT_SIGNAL_STRENGTH_PASSIVE,
  DEFAULT_SIGNAL_STRENGTH_ACTIVE
} from '../config';

import DoorWindowSensor from '../icons/door-window-sensor.vue';
import EthernetSocket from '../icons/ethernet-socket.vue';
import EthernetSwitch from '../icons/ethernet-switch.vue';
import Generic from '../icons/generic.vue';
import Hub from '../icons/hub.vue';
import Light from '../icons/light.vue';
import MotionSensor from '../icons/motion-sensor.vue';
import Note from '../icons/note.vue';
import PlugSocket from '../icons/plug-socket.vue';
import SmokeDetector from '../icons/smoke-detector.vue';
import SwitchIcon from '../icons/switch.vue';
import TemperatureSensor from '../icons/temperature-sensor.vue';
import Wireless from '../icons/wireless.vue';

import imageExportMethods from '../helpers/image-export-methods';

export const DRAW_LEVELS = {
  lines: 1,
  nodes: 2,
  background: 4
};

export default {
  props: [
    'getContainerEl',
    'nodes',
    'tmpNode',
    'movingNode',
    'drawLevel',
    'background',
    'zoom'
  ],
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
      offset: this.drawLevel > DRAW_LEVELS.lines ? 30 : 0,
      renderNodeList: this.drawLevel > DRAW_LEVELS.lines,
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
    },
    zoom() {
      setTimeout(() => this.onCanvasResize(), 400); // wait for 300ms zoom transition
    }
  },
  methods: Object.assign(
    {
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
      getNeighbors(node, nodes, refNodes = null) {
        refNodes = refNodes || nodes;
        const nodesWithDistances = this.getNodesWithDistances(node, refNodes);
        const wDist =
          node.smart === 'passive'
            ? DEFAULT_SIGNAL_STRENGTH_PASSIVE
            : DEFAULT_SIGNAL_STRENGTH_ACTIVE;
        const neighbors = nodesWithDistances
          .filter(({ dist }) => dist <= wDist)
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
              .filter(({ dist }) => dist > wDist)
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
              dists[`${node.key}:${nodeKey}`] ||
              dists[`${nodeKey}:${node.key}`];
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
      getNodesWithNeighbors(nodes, refNodes, deleteCachedDists = true) {
        this.cachedNeighbors = [];
        deleteCachedDists && (this.cachedDistances = {});

        return nodes.map(node => ({
          ...node,
          neighbors: this.getNeighbors(node, nodes, refNodes)
        }));
      },
      drawLines(nodesWithNeighbors) {
        const { ctx } = this;

        nodesWithNeighbors.forEach(node => {
          const { neighbors } = node;
          const { width, height, offset } = this;

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
              (node.x / 100) * width + offset,
              (node.y / 100) * height + offset
            );
            ctx.lineTo(
              (neighbor.x / 100) * width + offset,
              (neighbor.y / 100) * height + offset
            );
            ctx.stroke();
            this.renderedLines[`${node.key}:${neighbor.key}`] = true;
          });
        });
      },
      draw(deleteCachedDists = true) {
        const { drawLevel = DRAW_LEVELS.lines } = this;

        requestAnimationFrame(async () => {
          const { canvas } = this.$refs;
          const { activeDevices, passiveDevices, ctx } = this;

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          drawLevel >= DRAW_LEVELS.background && (await this.drawBackground());

          this.renderedLines = [];
          ctx.strokeStyle = '#004e85';
          ctx.setLineDash([]);
          this.drawLines(
            this.getNodesWithNeighbors(activeDevices, null, deleteCachedDists)
          );
          ctx.setLineDash([5, 3]);
          this.drawLines(
            this.getNodesWithNeighbors(
              passiveDevices,
              activeDevices,
              deleteCachedDists
            )
          );

          drawLevel >= DRAW_LEVELS.nodes && (await this.drawNodes());
          this.$emit('rendered');
        });
      }
    },
    imageExportMethods
  ),
  components: {
    DoorWindowSensor,
    EthernetSocket,
    EthernetSwitch,
    Generic,
    Hub,
    Light,
    MotionSensor,
    Note,
    PlugSocket,
    SmokeDetector,
    SwitchIcon,
    TemperatureSensor,
    Wireless
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
.icons {
  display: none;
}
</style>
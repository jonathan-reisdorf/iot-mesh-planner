<template>
  <div
    class="imageExport"
    :class="{'imageExport--zoomed': zoom !== 1}"
    :style="{width, height}"
    ref="imageExportContainerEl"
  >
    <Lines
      v-if="containerEl"
      :getContainerEl="() => containerEl"
      :nodes="nodes"
      :tmpNode="null"
      :movingNode="null"
      :drawLevel="drawLevel"
      :background="background"
      @rendered="onRendered"
    />
  </div>
</template>

<script>
import Lines, { DRAW_LEVELS } from './lines.vue';

export default {
  props: ['getContainerEl', 'nodes', 'background', 'zoom', 'planName'],
  mounted() {
    const { imageExportContainerEl } = this.$refs;
    this.containerEl = imageExportContainerEl;
  },
  data() {
    const drawLevel =
      DRAW_LEVELS.lines + DRAW_LEVELS.nodes + DRAW_LEVELS.background;

    const containerEl = this.getContainerEl();
    const { width, height } = containerEl.getBoundingClientRect();
    const ratio = height / width;
    if (ratio <= 1) {
      return {
        width: 1800 + 'px',
        height: 1800 * ratio + 'px',
        containerEl: null,
        drawLevel
      };
    }

    return {
      width: 1800 / ratio + 'px',
      height: 1800 + 'px',
      containerEl: null,
      drawLevel
    };
  },
  methods: {
    onRendered() {
      const canvas = this.$refs.imageExportContainerEl.querySelector('canvas');
      const link = document.createElement('a');
      link.setAttribute('download', `${this.planName}.image-export.png`);
      link.setAttribute(
        'href',
        canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
      );
      link.click();
      this.$emit('finished');
    }
  },
  components: {
    Lines
  }
};
</script>

<style scoped>
.imageExport {
  position: absolute;
  left: 0;
  top: 0;
  visibility: hidden;
  pointer-events: none;
}
.imageExport--zoomed {
  transform: scale(0.5);
}
</style>
<template>
  <div class="container" @click="discard">
    <form class="configImport" @click="event => event.stopPropagation()" @submit="proceed">
      <div class="configImport__header">
        <span class="configImport__title">Import preview</span>
      </div>
      <div class="row" :style="{height}">
        <div class="configImport__imageContainer" ref="imageContainerEl">
          <div class="configImport__imageContainerInner" ref="imageContainerInnerEl">
            <Lines
              class="configImport__previewImage"
              v-if="containerInnerEl && height"
              :getContainerEl="() => containerInnerEl"
              :nodes="config.nodes || []"
              :tmpNode="null"
              :movingNode="null"
              :drawLevel="drawLevel"
              :background="background"
              @rendered="onRendered"
            />
          </div>
        </div>
      </div>
      <div class="row" v-if="diff.added.length">
        <div class="label">Added nodes</div>
        <NodesList :nodes="diff.added" />
      </div>
      <div class="row" v-if="diff.removed.length">
        <div class="label">Removed nodes</div>
        <NodesList :nodes="diff.removed" />
      </div>
      <div class="row" v-if="diff.modified.length">
        <div class="label">Modified nodes</div>
        <NodesList :nodes="diff.modified" />
      </div>
      <div class="configImport__footer">
        <button class="button" type="button" @click="discard">Cancel</button>
        <button class="button button--primary" type="submit">Proceed</button>
      </div>
    </form>
  </div>
</template>

<script>
import Lines, { DRAW_LEVELS } from './lines.vue';
import NodesList from './nodes-list.vue';

export default {
  props: ['getContainerEl', 'nodes', 'config', 'background'],
  mounted() {
    window.addEventListener('resize', this.onResize);
    const { imageContainerEl, imageContainerInnerEl } = this.$refs;
    this.containerEl = imageContainerEl;
    this.containerInnerEl = imageContainerInnerEl;
    this.updateHeight();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },
  data() {
    const containerEl = this.getContainerEl();
    const { width, height } = containerEl.getBoundingClientRect();
    const ratio = height / width;

    return {
      diff: this.generateDiff(),
      containerEl: null,
      containerInnerEl: null,
      height: null,
      hasRendered: false,
      drawLevel: DRAW_LEVELS.lines + DRAW_LEVELS.nodes + DRAW_LEVELS.background,
      ratio
    };
  },
  methods: {
    async onResize() {
      clearTimeout(this.onResizeTimeout);
      if (!this.hasRendered) {
        return (this.onResizeTimeout = setTimeout(() => this.onResize(), 50));
      }

      this.hasRendered = false;
      this.height = null;
      requestAnimationFrame(() => this.updateHeight());
    },
    onRendered() {
      this.hasRendered = true;
    },
    updateHeight() {
      const { width } = this.containerEl.getBoundingClientRect();
      this.height = `${width * this.ratio}px`;
    },
    generateDiff() {
      const { nodes: newNodes = [] } = this.config;
      const oldNodes = this.nodes;
      const removed = oldNodes.filter(
        oldNode => !newNodes.some(({ key }) => key === oldNode.key)
      );
      const added = newNodes.filter(
        newNode => !oldNodes.some(({ key }) => key === newNode.key)
      );
      const modified = newNodes.filter(newNode => {
        const oldNode = oldNodes.find(({ key }) => key === newNode.key);
        return oldNode && JSON.stringify(newNode) !== JSON.stringify(oldNode);
      });
      return { removed, added, modified };
    },
    discard() {
      this.$emit('discard');
    },
    proceed(event) {
      event.preventDefault();
      this.$emit('proceed');
    }
  },
  components: {
    Lines,
    NodesList
  }
};
</script>

<style scoped>
.container {
  position: fixed;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.75);
  z-index: 1;
}
.configImport {
  flex: none;
  background: #fff;
  color: #333;
  font-size: 0.8rem;
  width: 30rem;
  min-width: 300px;
  max-width: 100%;
  box-sizing: border-box;
  border-radius: 4px;
  overflow: hidden;
  border: 2px solid #4b413f;
}

.configImport__header {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.5rem;
  background-color: #eee;
}

.configImport__footer {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 0.5rem 0.75rem;
  margin-top: 0.5rem;
  background-color: #eee;
}

.configImport__title {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 0 1 auto;
}

.configImport__imageContainer {
  position: relative;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.configImport__imageContainerInner {
  transform: scale(2);
  height: 100%;
}

.configImport__previewImage {
  transform: scale(0.5);
}

.row {
  display: flex;
  flex-flow: row nowrap;
  padding: 0.5rem 0.75rem;
  align-items: center;
  box-sizing: content-box;
  overflow: hidden;
}

.row + .row {
  border-top: 1px solid #ddd;
}

.label {
  flex: 1;
  font-weight: 600;
  white-space: nowrap;
  margin-right: 2rem;
}
</style>
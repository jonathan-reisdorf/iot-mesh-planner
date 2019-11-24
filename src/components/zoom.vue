<template>
  <div class="zoom" :style="{transform: `scale(${zoom})`}" @dblclick="toggleZoom">
    <slot />
  </div>
</template>

<script>
export default {
  mounted() {
    this.$on('toggle', this.toggleZoom);
  },
  data() {
    return {
      zoom: 1
    };
  },
  methods: {
    toggleZoom() {
      this.zoom = this.zoom === 1 ? 2 : 1;
      this.$emit('toggled', this.zoom);
    }
  }
};
</script>

<style scoped>
.zoom {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 2rem;
  box-sizing: border-box;
  transition: transform 0.3s;
  will-change: transform;
  z-index: 0;
}
</style>

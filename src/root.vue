<template>
  <main id="root">
    <div class="shift" :style="{transform: `translateX(${shiftX}px) translateY(${shiftY}px)`}">
      <div class="zoom" :style="{transform: `scale(${zoom})`}" @dblclick="toggleZoom">
        <div class="container">
          <img
            class="plan"
            v-if="plan"
            :src="`plans/${plan}`"
            @mousedown="event => event.preventDefault()"
            alt
          />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      plan: 'eg.png',
      zoom: 1,
      shiftX: 0,
      shiftY: 0
    };
  },
  mounted() {
    //
  },
  methods: {
    toggleZoom() {
      this.zoom = this.zoom === 1 ? 1.5 : 1;
    }
  },
  components: {
    //
  }
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}

html {
  font-size: calc(12px + 0.5vw);
}

body {
  font-family: monospace;
  color: #000;
}

#root {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.shift {
  width: 100%;
  height: 100%;
  user-select: none;
  will-change: transform;
}

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

.container {
  position: relative;
  flex: 0 1 auto;
}

.plan {
  display: block;
  width: auto;
  height: auto;
  max-width: calc(100vw - 4rem);
  max-height: calc(100vh - 4rem);
}
</style>
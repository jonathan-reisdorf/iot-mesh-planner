<template>
  <main id="root">
    <Offset>
      <Zoom>
        <div class="container">
          <img
            class="plan"
            v-if="plan"
            :src="`plans/${plan}`"
            @mousedown="event => event.preventDefault()"
            alt
          />
        </div>
      </Zoom>
    </Offset>
    <NodePicker />
  </main>
</template>

<script>
import Offset from './components/offset.vue';
import Zoom from './components/zoom.vue';
import NodePicker from './components/node-picker.vue';

export default {
  data() {
    return {
      plan: 'eg.png'
    };
  },
  mounted() {
    //
  },
  methods: {
    //
  },
  components: {
    Offset,
    Zoom,
    NodePicker
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

.icon {
  display: block;
  width: 2rem;
  height: 2rem;
  fill: #4b413f;
}

.icon.iot {
  fill: #004e85;
}

.icon.extension {
  display: block;
  position: absolute;
  right: 0.25rem;
  top: 0.25rem;
  width: 1.5rem;
  height: 1.5rem;
  z-index: 1;
  background: #fff;
  border-radius: 50%;
}
</style>

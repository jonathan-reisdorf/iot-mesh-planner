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
  </main>
</template>

<script>
import Offset from './components/offset.vue';
import Zoom from './components/zoom.vue';

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
    Zoom
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
</style>

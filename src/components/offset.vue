<template>
  <div
    class="offset"
    :style="{transform: `translateX(${offsetX}px) translateY(${offsetY}px)`}"
    v-touch:start="startShift"
    @mousemove="shift"
    v-touch:moving="shift"
    v-touch:end="endShift"
  >
    <slot />
  </div>
</template>

<script>
export default {
  data() {
    return {
      startX: null,
      startY: null,
      pendingOffsetX: 0,
      pendingOffsetY: 0,
      storedOffsetX: 0,
      storedOffsetY: 0
    };
  },
  computed: {
    offsetX() {
      return this.pendingOffsetX + this.storedOffsetX;
    },
    offsetY() {
      return this.pendingOffsetY + this.storedOffsetY;
    }
  },
  methods: {
    getCoords(event) {
      const { clientX: x, clientY: y } = event.changedTouches
        ? event.changedTouches[0]
        : event;
      return { x, y };
    },
    startShift(event) {
      event.preventDefault();

      const coords = this.getCoords(event);
      this.startX = coords.x;
      this.startY = coords.y;
    },
    shift(event) {
      const { startX = null, startY = null } = this;
      if (startX === null || startY === null) {
        return;
      }

      event.preventDefault();

      const coords = this.getCoords(event);
      const deltaX = coords.x - startX;
      const deltaY = coords.y - startY;

      this.pendingOffsetX = deltaX;
      this.pendingOffsetY = deltaY;
    },
    endShift(event) {
      event.preventDefault();

      const coords = this.getCoords(event);
      const deltaX = coords.x - this.startX;
      const deltaY = coords.y - this.startY;

      Object.assign(this, {
        startX: null,
        startY: null,
        pendingOffsetX: 0,
        pendingOffsetY: 0,
        storedOffsetX: this.storedOffsetX + deltaX,
        storedOffsetY: this.storedOffsetY + deltaY
      });
    }
  }
};
</script>

<style scoped>
.offset {
  width: 100%;
  height: 100%;
  user-select: none;
  will-change: transform;
}
</style>

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
import { PLAN_MOVE_THRESHOLD, PLAN_MOVE_TIMEOUT } from '../config';

export default {
  data() {
    return {
      startX: null,
      startY: null,
      moveX: null,
      moveY: null,
      pendingOffsetX: 0,
      pendingOffsetY: 0,
      storedOffsetX: 0,
      storedOffsetY: 0,
      startedShifting: false,
      startShiftTimeout: null
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
      const coords = event.changedTouches ? event.changedTouches[0] : event;
      const { clientX: x = this.moveX, clientY: y = this.moveY } = coords || {};
      return { x, y };
    },
    startShift(event) {
      event.type === 'mousedown' && event.preventDefault();

      if (event.buttons === 2) {
        return;
      }

      const coords = this.getCoords(event);
      this.startX = coords.x;
      this.startY = coords.y;

      this.moveX = coords.x;
      this.moveY = coords.y;

      this.startShiftTimeout = setTimeout(
        () => delete this.startShiftTimeout,
        PLAN_MOVE_TIMEOUT
      );
    },
    shift(event) {
      const { startX = null, startY = null } = this;
      if (startX === null || startY === null) {
        return;
      }

      event.type === 'mousemove' && event.preventDefault();

      const coords = this.getCoords(event);
      const deltaX = coords.x - startX;
      const deltaY = coords.y - startY;

      this.moveX = coords.x;
      this.moveY = coords.y;

      if (
        Math.abs(deltaX) + Math.abs(deltaY) < PLAN_MOVE_THRESHOLD &&
        this.startShiftTimeout
      ) {
        return;
      }

      if (this.startShiftTimeout) {
        clearTimeout(this.startShiftTimeout);
        delete this.startShiftTimeout;
      }

      this.pendingOffsetX = deltaX;
      this.pendingOffsetY = deltaY;

      if (!this.startedShifting) {
        this.startedShifting = true;
        this.$emit('startShift');
      }
    },
    endShift(event) {
      if (this.startShiftTimeout && !this.startedShifting) {
        Object.assign(this, {
          startX: null,
          startY: null
        });
      }

      clearTimeout(this.startShiftTimeout);
      delete this.startShiftTimeout;

      const { startX = null, startY = null } = this;
      if (startX === null || startY === null) {
        return;
      }

      event.preventDefault();

      const coords = this.getCoords(event);
      const deltaX = coords.x - this.startX;
      const deltaY = coords.y - this.startY;

      this.moveX = null;
      this.moveY = null;

      Object.assign(this, {
        startX: null,
        startY: null,
        pendingOffsetX: 0,
        pendingOffsetY: 0,
        storedOffsetX: this.storedOffsetX + deltaX,
        storedOffsetY: this.storedOffsetY + deltaY
      });

      if (this.startedShifting) {
        this.startedShifting = false;
        this.$emit('endShift');
      }
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

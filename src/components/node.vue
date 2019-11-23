<template>
  <div class="node" :title="title" @click="$emit('click')" :style="{backgroundColor: background}">
    <DoorWindowSensor v-if="icon === 'door_window_sensor'" :class="iconClass" />
    <EthernetSocket v-if="icon === 'ethernet_socket'" :class="iconClass" />
    <EthernetSwitch v-if="icon === 'ethernet_switch'" :class="iconClass" />
    <Generic v-if="icon === 'generic'" :class="iconClass" />
    <Hub v-if="icon === 'hub'" :class="iconClass" />
    <Light v-if="icon === 'light'" :class="iconClass" />
    <MotionSensor v-if="icon === 'motion_sensor'" :class="iconClass" />
    <PlugSocket v-if="icon === 'plug_socket'" :class="iconClass" />
    <SmokeDetector v-if="icon === 'smoke_detector'" :class="iconClass" />
    <SwitchIcon v-if="icon === 'switch'" :class="iconClass" />
    <TemperatureSensor v-if="icon === 'temperature_sensor'" :class="iconClass" />
    <Wireless v-if="smart && extension" />
    <Note class="note" :title="note" v-if="note" />
  </div>
</template>

<script>
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

export default {
  props: {
    title: String,
    icon: String,
    smart: Boolean | String,
    extension: Boolean,
    note: String,
    background: String
  },
  computed: {
    iconClass() {
      return {
        iot: this.smart && !this.extension
      };
    }
  },
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
.node {
  flex: none;
  padding: 6px;
}

.icon {
  width: 32px;
  height: 32px;
  fill: #4b413f;
}

.icon.iot {
  fill: #004e85;
}

.icon.extension {
  display: block;
  position: absolute;
  right: -2px;
  top: -2px;
  width: 22px;
  height: 22px;
  z-index: 1;
  background: #fff;
  border-radius: 50%;
}

.icon.note {
  display: block;
  position: absolute;
  left: 50%;
  top: -4px;
  width: 16px;
  height: 16px;
  margin-left: -8px;
  fill: #e8a87c;
  stroke: #fff;
  stroke-width: 8px;
  z-index: 1;
}

.node-picker__node .icon.icon.extension {
  right: 6px;
  top: 6px;
}
</style>
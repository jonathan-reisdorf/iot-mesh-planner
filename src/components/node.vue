<template>
  <div class="node" :title="title" @click="$emit('click')">
    <DoorWindowSensor v-if="icon === 'door_window_sensor'" />
    <EthernetSocket v-if="icon === 'ethernet_socket'" />
    <EthernetSwitch v-if="icon === 'ethernet_switch'" />
    <Generic v-if="icon === 'generic'" />
    <Hub v-if="icon === 'hub'" />
    <Light v-if="icon === 'light'" />
    <MotionSensor v-if="icon === 'motion_sensor'" />
    <PlugSocket v-if="icon === 'plug_socket'" />
    <SmokeDetector v-if="icon === 'smoke_detector'" />
    <SwitchIcon v-if="icon === 'switch'" />
    <TemperatureSensor v-if="icon === 'temperature_sensor'" />
    <Wireless v-if="extension" />
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
import PlugSocket from '../icons/plug-socket.vue';
import SmokeDetector from '../icons/smoke-detector.vue';
import SwitchIcon from '../icons/switch.vue';
import TemperatureSensor from '../icons/temperature-sensor.vue';
import Wireless from '../icons/wireless.vue';

export default {
  props: {
    id: String,
    title: String,
    icon: String,
    smart: Boolean | String,
    extension: Boolean
  },
  components: {
    DoorWindowSensor,
    EthernetSocket,
    EthernetSwitch,
    Generic,
    Hub,
    Light,
    MotionSensor,
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
  padding: 0.5vw;
}
</style>
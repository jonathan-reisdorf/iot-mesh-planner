<template>
  <div class="container" @click="discard">
    <form class="nodeSettings" @click="event => event.stopPropagation()" @submit="save">
      <div class="nodeSettings__header">
        <Node :icon="icon" :smart="smart" :extension="extension" :note="note" />
        <span class="nodeSettings__title">{{ title }}</span>
      </div>
      <div class="row">
        <label class="label" for="settings_title">Name</label>
        <input class="input" id="settings_title" autocomplete="off" v-model="title" />
      </div>
      <div class="row">
        <label class="label" for="settings_icon">Icon</label>
        <select class="input" id="settings_icon" v-model="icon">
          <option
            v-for="(iconName, iconKey) in icons"
            v-bind:key="iconKey"
            :value="iconKey"
          >{{iconName}}</option>
        </select>
      </div>
      <div class="row">
        <label class="label" for="settings_smart">Role</label>
        <select class="input" id="settings_smart" v-model="smart" @change="onChangeRole">
          <option :value="false">Not smart</option>
          <option :value="'passive'">Passive device</option>
          <option :value="'active'">Active device</option>
          <option :value="'hub'">Smart hub</option>
        </select>
      </div>
      <div class="row">
        <label class="label" for="settings_extension">Extension</label>
        <select class="input" id="settings_extension" v-model="extension" :disabled="!smart">
          <option :value="false">Not upgraded</option>
          <option :value="true">Upgraded</option>
        </select>
      </div>
      <div class="row">
        <label class="label" for="settings_note">Note</label>
        <input class="input" id="settings_note" autocomplete="off" v-model="note" />
      </div>
      <div class="nodeSettings__footer">
        <button class="button" type="button" @click="discard">Cancel</button>
        <button class="button button--primary" type="submit">Save</button>
      </div>
    </form>
  </div>
</template>

<script>
import { ICONS } from '../config';

import Node from './node.vue';

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
    node: Object
  },
  data() {
    const { note = '' } = this.node;
    return {
      ...this.node,
      note,
      icons: ICONS
    };
  },
  methods: {
    onChangeRole() {
      !this.smart && (this.extension = false);
    },
    discard() {
      this.$emit('discard');
    },
    save(event) {
      event.preventDefault();
      const { title, icon, smart, extension, note } = this;
      this.$emit('save', {
        ...this.node,
        title,
        icon,
        smart,
        extension,
        note: note ? note : undefined
      });
    }
  },
  components: {
    Node,
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
.nodeSettings {
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

.nodeSettings__header {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.5rem;
  background-color: #eee;
}

.nodeSettings__footer {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  margin-top: 0.5rem;
  background-color: #eee;
}

.nodeSettings__title {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 0 1 auto;
}

.nodeSettings__title:empty {
  margin-left: -0.5rem;
}

.node {
  position: relative;
  margin-right: 0.5rem;
}

.row {
  display: flex;
  flex-flow: row nowrap;
  padding: 0.5rem 0.75rem;
  align-items: center;
}

.label {
  flex: 1;
  font-weight: 600;
}

.input {
  display: block;
  flex: 2;
  background: #fff;
  border: 2px solid #bbb;
  border-radius: 4px;
  color: inherit;
  padding: 0.5rem;
  font-size: inherit;
  font-family: inherit;
  font-weight: 300;
  transition: border-color 0.3s, background-color 0.3s, color 0.3s, opacity 0.3s;
}

.input:focus {
  outline: none;
  background-color: #eee;
  border-color: #004e85;
  color: #000;
}

select.input {
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 44 44'%3E%3Cpath fill='%23777' d='M20.7 26.5c.7.8 1.9.8 2.6 0l6.4-7c.7-.8.4-1.5-.7-1.5H15c-1.1 0-1.4.7-.7 1.5l6.4 7z'/%3E%3C/svg%3E");
  background-position: center right;
  background-size: auto 1.5rem;
  background-repeat: no-repeat;
}

.input[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.button {
  display: block;
  padding: 0.5rem 1rem;
  background: #777;
  color: #fff;
  font-size: inherit;
  font-family: inherit;
  font-weight: inherit;
  border: 0 none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.button:hover {
  background-color: #444;
}

.button--primary {
  background-color: #004e85;
}

.button--primary:hover {
  background-color: #003153;
}
</style>
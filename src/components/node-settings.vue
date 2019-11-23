<template>
  <div class="container" @click="discard">
    <form class="nodeSettings" @click="event => event.stopPropagation()" @submit="save">
      <div class="nodeSettings__header">
        <Node
          :icon="icon"
          :smart="smart"
          :extension="extension"
          :note="note"
          :class="{smart}"
          :style="{backgroundColor: background}"
        />
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
      <div class="row">
        <label class="label" for="settings_background">Background</label>
        <div class="inputs">
          <button
            v-for="(color, index) in colors"
            v-bind:key="color"
            class="color"
            type="button"
            :class="{transparent: color === 'transparent', active: background === color || (!background && !index)}"
            :style="{backgroundColor: color}"
            @click="() => setBackground(color)"
          ></button>
        </div>
      </div>
      <div class="nodeSettings__footer">
        <button class="button" type="button" @click="discard">Cancel</button>
        <button class="button button--negative" type="button" @click="remove">Delete</button>
        <button class="button button--primary" type="submit">Save</button>
      </div>
    </form>
  </div>
</template>

<script>
import { ICONS } from '../config';

import Node from './node.vue';

export default {
  props: {
    node: Object
  },
  data() {
    const { note = '', background = null } = this.node;
    return {
      ...this.node,
      note,
      background,
      icons: ICONS,
      colors: [
        '#ddd',
        '#fddfdf',
        '#fcf7de',
        '#defde0',
        '#def3fd',
        'transparent'
      ]
    };
  },
  methods: {
    onChangeRole() {
      !this.smart && (this.extension = false);
    },
    discard() {
      this.$emit('discard');
    },
    remove() {
      this.$emit('removeNode', this.key);
    },
    save(event) {
      event.preventDefault();
      const { title, icon, smart, extension, note, background } = this;
      const isDefaultBg = !background || this.colors[0] === background;
      this.$emit('save', {
        ...this.node,
        title,
        icon,
        smart,
        extension,
        note: note ? note : undefined,
        background: isDefaultBg ? undefined : background
      });
    },
    setBackground(color) {
      this.background = color;
    }
  },
  components: {
    Node
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
  margin-left: -0.75rem;
}

.node {
  position: relative;
  margin-right: 0.75rem;
  background: #ddd;
  border: 2px solid #4b413f;
  border-radius: 50%;
}

.node.smart {
  border-color: #004e85;
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

.inputs {
  display: flex;
  flex-flow: row nowrap;
  flex: 2;
  margin-left: calc(-0.5rem - 2px);
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

.color {
  position: relative;
  flex: 1;
  height: 2rem;
  max-width: 2rem;
  border: 2px solid #bbb;
  border-radius: 4px;
  padding: 0.5rem;
  margin: 0;
  background-color: transparent;
  box-sizing: border-box;
  cursor: pointer;
  transition: border-color 0.3s;
}

.color.active,
.color:focus {
  border-color: #004e85;
  outline: none;
}

.color.transparent {
  background: url('data:image/gif;base64,R0lGODdhEAAQAPAAAJSUlLe3tywAAAAAEAAQAAACH4xvoKuIzNyBSyYKbMDZcv15HAaSIlWiJ5Sya/RWVgEAOw==')
    center center repeat;
}

.color + .color {
  margin-left: 0.5rem;
}

.button {
  display: block;
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
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

.button:hover,
.button:focus {
  background-color: #444;
}

.button--primary {
  margin-left: auto;
  margin-right: 0;
  background-color: #004e85;
}

.button--primary:hover,
.button--primary:focus {
  background-color: #003153;
}

.button--negative {
  background-color: #bb2a29;
}

.button--negative:hover,
.button--negative:focus {
  background-color: #922b2b;
}
</style>
<template>
  <nav class="navigation" :class="`navigation--${alignment}`">
    <button
      v-if="show.plans"
      type="button"
      class="navigation__item"
      title="Plans"
      @click="event => navigate('plans', event)"
    >
      <StoriesIcon />
    </button>
    <button
      v-if="show.downloadImage"
      type="button"
      class="navigation__item"
      title="Download as image"
      @click="event => navigate('downloadImage', event)"
    >
      <DownloadImageIcon />
    </button>
    <button
      v-if="show.exportConfig"
      type="button"
      class="navigation__item"
      title="Export config (nodes and settings)"
      @click="event => navigate('exportConfig', event)"
    >
      <DownloadSettingsIcon />
    </button>
    <button
      v-if="show.importConfig"
      type="button"
      class="navigation__item"
      title="Import config (nodes and settings)"
      @click="initiateConfigImport"
    >
      <input
        class="navigation__fileInput"
        type="file"
        ref="importConfigInput"
        accept="application/json"
        @change="importConfig"
      />
      <UploadSettingsIcon />
    </button>
    <button
      v-if="show.toggleZoom"
      :class="{active: zoom !== 1}"
      type="button"
      class="navigation__item"
      title="Toggle zoom"
      @click="event => navigate('toggleZoom', event)"
    >
      <ZoomIcon />
    </button>
    <button
      v-if="show.toggleLines"
      :class="{active: showLines}"
      type="button"
      class="navigation__item"
      title="Toggle lines"
      @click="event => navigate('toggleLines', event)"
    >
      <NodesIcon />
    </button>
  </nav>
</template>

<script>
import DownloadImageIcon from '../icons/download-image.vue';
import DownloadSettingsIcon from '../icons/settings-download.vue';
import NodesIcon from '../icons/nodes.vue';
import StoriesIcon from '../icons/stories.vue';
import UploadSettingsIcon from '../icons/settings-upload.vue';
import ZoomIcon from '../icons/zoom.vue';

export default {
  props: {
    alignment: String,
    items: Array,
    showLines: Boolean,
    zoom: Number
  },
  data() {
    return {
      show: this.items.reduce(
        (show, item) => Object.assign(show, { [item]: true }),
        {}
      )
    };
  },
  methods: {
    navigate(target, event = null, arg = null) {
      event && event.currentTarget.blur();
      this.$emit('navigate', target, arg);
    },
    initiateConfigImport(event) {
      event.currentTarget.blur();
      this.$refs.importConfigInput.click();
    },
    importConfig({ target, target: { files = [] } }) {
      this.navigate('importConfig', null, [...files].shift());
      target.value = null;
    }
  },
  components: {
    DownloadImageIcon,
    DownloadSettingsIcon,
    NodesIcon,
    StoriesIcon,
    UploadSettingsIcon,
    ZoomIcon
  }
};
</script>

<style scoped>
.navigation {
  position: fixed;
  background: #eee;
}

.navigation--left {
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  border-radius: 0 0.5vw 0.5vw 0;
}
.navigation--top {
  display: flex;
  flex-flow: row nowrap;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 0 0 0.5vw 0.5vw;
}
.navigation--right {
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 0.5vw 0 0 0.5vw;
}

.icon {
  transition: fill 0.3s;
}

.navigation--top .icon {
  width: 32px;
  height: 32px;
}

.navigation__item {
  display: block;
  position: relative;
  padding: 0.5vw 0.75vw;
  margin: 0.5vw;
  cursor: pointer;
  border: 0 none;
  border-radius: 0.5vw;
  background: #eee;
  fill: #4b413f;
  transition: background-color 0.3s, fill 0.3s;
}

.navigation--left .navigation__item + .navigation__item,
.navigation--right .navigation__item + .navigation__item {
  margin-top: 0;
}
.navigation--top .navigation__item + .navigation__item {
  margin-left: 0;
}

.navigation__item:hover {
  background-color: #ccc;
}
.navigation__item:focus,
.navigation__item:active,
.navigation__item.active {
  fill: #004e85;
}

.navigation__item.active {
  background-color: #ccc;
}

.navigation__fileInput {
  display: none;
}
</style>
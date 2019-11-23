<template>
  <nav class="navigation">
    <button
      type="button"
      class="navigation__item"
      title="Plans"
      @click="event => navigate(event, 'plans')"
    >
      <StoriesIcon />
    </button>
    <button
      type="button"
      class="navigation__item"
      title="Download as image"
      @click="event => navigate(event, 'downloadImage')"
    >
      <DownloadImageIcon />
    </button>
    <button
      type="button"
      class="navigation__item"
      title="Download config (nodes and settings)"
      @click="event => navigate(event, 'downloadConfig')"
    >
      <DownloadSettingsIcon />
    </button>
    <button
      type="button"
      class="navigation__item"
      title="Upload config (nodes and settings)"
      @click="event => navigate(event, 'uploadConfig')"
    >
      <UploadSettingsIcon />
    </button>
  </nav>
</template>

<script>
import StoriesIcon from '../icons/stories.vue';
import DownloadImageIcon from '../icons/download-image.vue';
import DownloadSettingsIcon from '../icons/settings-download.vue';
import UploadSettingsIcon from '../icons/settings-upload.vue';

export default {
  methods: {
    navigate(event, target) {
      event.currentTarget.blur();
      this.$emit('navigate', target);
    }
  },
  components: {
    StoriesIcon,
    DownloadImageIcon,
    DownloadSettingsIcon,
    UploadSettingsIcon
  }
};
</script>

<style scoped>
.navigation {
  position: fixed;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  background: #eee;
  border-radius: 0 0.5vw 0.5vw 0;
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
.navigation__item + .navigation__item {
  margin-top: 0;
}
.navigation__item:hover {
  background-color: #ccc;
}
.navigation__item:focus,
.navigation__item:active {
  fill: #004e85;
}
</style>
<template>
  <div
    class="planManager"
    :class="{'planManager--empty': !plans.length, hover: isDragging}"
    v-if="!isLoading"
    @click="!plans.length && $refs.fileInput.click()"
    @drop="onFileDrop"
    @dragover="event => {event.preventDefault(); isDragging = true;}"
    @dragleave="isDragging = false"
  >
    <div class="planManager__upload" v-if="!plans.length">
      <AddIcon />
      <div>
        Add your first floor plan
        <div class="planManager__hint">(image, ideally high-resolution)</div>
      </div>
    </div>
    <input
      class="planManager__fileInput"
      type="file"
      ref="fileInput"
      @change="uploadPlan"
      accept="image/*"
    />

    <div class="planManager__container" v-if="plans.length">
      <div class="planManager__plans">
        <div
          class="planManager__plan"
          v-for="plan in plans"
          :key="plan.fileName"
          :title="plan.fileName"
        >
          <button class="planManager__handle" @click="() => selectPlan(plan)">
            <img
              class="planManager__image"
              :src="plan.image"
              @mousedown="event => event.preventDefault()"
              alt
            />
          </button>
          <button class="planManager__remove" tabindex="0" @click="() => deletePlan(plan)">
            <RemoveIcon />
          </button>
        </div>
      </div>
    </div>

    <div class="planManager__actions" v-if="plans.length">
      <button class="planManager__action" @click="$refs.fileInput.click()">
        <AddIcon />
      </button>
    </div>
  </div>
</template>

<script>
import AddIcon from '../icons/add.vue';
import RemoveIcon from '../icons/remove.vue';

export default {
  data() {
    return {
      plans: [],
      isLoading: true,
      isDragging: false
    };
  },
  mounted() {
    const req = indexedDB.open('IotMeshPlanner');
    req.onsuccess = () => {
      this.db = req.result;
      const transaction = this.db.transaction('plans', 'readwrite');
      transaction.objectStore('plans').add({ fileName: '_' });
      this.loadPlans();
    };
    req.onupgradeneeded = event => {
      const db = event.target.result;
      const objectStore = db.createObjectStore('plans', {
        keyPath: 'fileName',
        autoIncrement: true
      });
    };
  },
  methods: {
    loadPlans() {
      const store = this.db
        .transaction('plans', 'readonly')
        .objectStore('plans');
      const query = store.openCursor();

      this.plans = [];
      query.onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
          const { fileName, image } = cursor.value;
          fileName !== '_' &&
            (this.plans = this.plans.concat({ fileName, image }));
          cursor.continue();
        } else {
          this.isLoading = false;
        }
      };
    },
    uploadPlan({ target: { files = [] } }) {
      const file = [...files]
        .filter(({ name }) => !this.plans.includes(escape(name)))
        .shift();
      if (!file) {
        return;
      }

      if (file.type.split('/').shift() !== 'image') {
        return alert(`File type ${file.type.split('/').pop()} not supported!`);
      }

      const reader = new FileReader();
      reader.onload = ({ target: { result } }) =>
        this.savePlan(escape(file.name), result);
      reader.readAsDataURL(file);
    },
    savePlan(fileName, image) {
      const transaction = this.db.transaction('plans', 'readwrite');
      transaction.objectStore('plans').add({ fileName, image });
      transaction.oncomplete = () =>
        (this.plans = this.plans.concat({ fileName, image }));
    },
    deletePlan({ fileName }) {
      const transaction = this.db.transaction('plans', 'readwrite');
      transaction.objectStore('plans').delete(fileName);
      transaction.oncomplete = () =>
        (this.plans = this.plans.filter(plan => plan.fileName !== fileName));
    },
    selectPlan(plan) {
      this.$emit('selectedPlan', plan);
    },
    onFileDrop(event) {
      event.preventDefault();
      this.isDragging = false;
      const files = [...event.dataTransfer.items]
        .filter(({ kind }) => kind === 'file')
        .map(item => item.getAsFile());

      this.uploadPlan({
        target: {
          files
        }
      });
    }
  },
  components: { AddIcon, RemoveIcon }
};
</script>

<style scoped>
.planManager {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  height: 100%;
  user-select: none;
}
.planManager--empty {
  cursor: pointer;
  transition: background-color 0.3s;
}
.planManager--empty:hover,
.planManager.hover {
  background-color: #eee;
}

.planManager--empty .icon {
  width: 5rem;
  height: 5rem;
  margin: 0 auto 2rem;
}

.planManager__upload {
  color: #444;
  padding: 2rem;
  text-align: center;
  line-height: 1.5;
}

.planManager__container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  width: 100%;
  flex: none;
}
.planManager__plans {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-start;
  overflow-x: auto;
  height: 100vh;
  flex: 0 1 auto;
}

.planManager__plans::before,
.planManager__plans::after {
  display: block;
  content: '';
  width: 1rem;
  height: 100%;
  flex: none;
}
.planManager__plan {
  position: relative;
  flex: none;
}
.planManager__handle {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  width: 40vw;
  min-width: 250px;
  min-height: 150px;
  padding: 1rem;
  box-sizing: border-box;
  background-color: #fff;
  transition: background-color 0.3s;
  border: 0 none;
  border-radius: 0.25rem;
  cursor: pointer;
}
.planManager__handle:hover,
.planManager__handle:focus {
  background-color: #004e85;
  outline: none;
}
.planManager__plan + .planManager__plan {
  margin-left: 1rem;
}

.planManager__image {
  display: block;
  max-width: 100%;
  max-height: 100%;
  box-sizing: border-box;
  background-color: #fff;
}

.planManager__hint {
  font-size: 0.7em;
  margin-top: 0.7em;
  color: #777;
}

.planManager__fileInput {
  display: none;
}

.planManager__actions {
  display: flex;
  flex-flow: row nowrap;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background: #eee;
  border: 0.25rem solid #004e85;
  border-bottom-width: 0;
  border-radius: 0.5vw 0.5vw 0 0;
  overflow: hidden;
}

.planManager__action {
  position: relative;
  cursor: pointer;
  border: 0 none;
  padding: 0;
  margin: 0;
  transition: background-color 0.3s, color 0.3s;
  background-color: #eee;
  color: #004e85;
}
.planManager__action:hover,
.planManager__action:focus {
  background-color: #004e85;
  outline: none;
  color: #fff;
}
.planManager__action .icon {
  fill: currentColor;
  width: 4rem;
  height: 3rem;
  padding: 1rem;
}
.planManager__remove {
  position: absolute;
  right: -0.5rem;
  top: -0.5rem;
  color: #bb2a29;
  background-color: #fff;
  border: 0.15rem solid #333;
  border-radius: 50%;
  padding: 0;
  margin: 0;
  transition: color 0.3s, background-color 0.3s, border-color 0.3s;
  cursor: pointer;
}
.planManager__remove:hover,
.planManager__remove:focus {
  background-color: #bb2a29;
  color: #fff;
  border-color: #fff;
  outline: none;
}
.planManager__remove .icon {
  fill: currentColor;
  padding: 0.5rem;
  width: 1.5rem;
  height: 1.5rem;
}
</style>

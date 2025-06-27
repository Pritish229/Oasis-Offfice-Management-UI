<template>
  <div class="document-upload">
    <div class="mb-3">
      <label class="form-label">Document Type <span class="text-danger">*</span></label>
      <select v-model="selectedType" class="form-select">
        <option disabled value="">Select Document Type</option>
        <option v-for="option in docTypeOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>
    <div v-if="existingFileUrl" class="mb-3">
      <label class="form-label">Current File:</label>
      <div>
        <a :href="existingFileUrl" target="_blank" rel="noopener">View Current File</a>
        <button type="button" class="btn btn-sm btn-danger ms-2" @click="removeExistingFile">Remove</button>
      </div>
    </div>
    <div class="mb-3">
      <label class="form-label">Upload PDF <span class="text-danger">*</span></label>
      <input type="file" class="form-control" accept="application/pdf" @change="onFileChange" :disabled="!!existingFileUrl" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
const props = defineProps({
  docTypeOptions: { type: Array, required: true },
  docType: { type: String, default: '' },
  existingFileUrl: { type: String, default: '' }
});
const emit = defineEmits(['change']);
const selectedType = ref(props.docType || '');
const selectedFile = ref(null);

watch(() => props.docType, (val) => {
  selectedType.value = val;
});

watch(selectedType, (val) => {
  emit('change', { file: selectedFile.value, docType: val });
});

function onFileChange(e) {
  const file = e.target.files[0];
  selectedFile.value = file;
  emit('change', { file, docType: selectedType.value });
}

function removeExistingFile() {
  emit('change', { file: null, docType: selectedType.value, removeExisting: true });
}
</script> 
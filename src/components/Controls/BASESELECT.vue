// BaseSelect.vue
<template>
  <div class="mb-3">
    <label :for="name" class="form-label">
      {{ label }}
      <span v-if="is_required" class="text-danger">*</span>
    </label>

    <select
      v-model="value"
      :id="name"
      class="form-select"
      @blur="handleBlur"
      :class="{
        'is-invalid': errorMessage,
        'is-valid': meta.valid && meta.touched
      }"
    >
      <option disabled value="">Select {{ label }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>

    <div class="invalid-feedback" v-if="errorMessage">{{ errorMessage }}</div>
  </div>
</template>

<script setup>
import { useField } from 'vee-validate'

const props = defineProps({
  name: { type: String, required: true },
  label: { type: String, required: true },
  options: { type: Array, required: true },
  is_required: { type: Boolean, default: false },
  rules: { type: [String, Object], default: '' }
})

const { value, errorMessage, meta, handleBlur } = useField(props.name, props.rules)
</script>

<style scoped>
.dark .form-select.is-invalid {
  border-color: #c03221 !important;
}
</style>

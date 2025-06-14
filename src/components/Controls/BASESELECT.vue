<script setup>
import { Field } from 'vee-validate'
const props = defineProps({
  name: String,
  label: String,
  options: Array,
  is_required: Boolean
})
</script>

<template>
  <div class="mb-3">
    <label :for="name" class="form-label">
      {{ label }}
      <span v-if="is_required" class="text-danger">*</span>
    </label>
    <Field :name="name" v-slot="{ field, errors, meta }">
      <select v-bind="field" :id="name" class="form-select"
        :class="{ 'is-invalid': errors.length, 'is-valid': meta.valid && meta.touched }">
        <option disabled value="">Select {{ label }}</option>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <div class="invalid-feedback" v-if="errors.length">{{ errors[0] }}</div>
    </Field>
  </div>
</template>

<style scoped>
.is-invalid {
  border-color: #dc3545;
}

.is-valid {
  border-color: #1aa053;
}
</style>

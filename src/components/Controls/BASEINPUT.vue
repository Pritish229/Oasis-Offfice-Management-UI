<template>
  <div class="mb-3">
    <label :for="name" class="form-label">
      {{ label }}
      <small v-if="is_required" class="text-danger">*</small>
    </label>

    <input
      v-model="value"
      :id="name"
      :type="type"
      :placeholder="placeholder"
      @blur="handleBlur"
      class="form-control"
      :class="{
        'is-invalid': errorMessage,
        'is-valid': meta.valid && meta.touched
      }"
    />

    <div v-if="errorMessage" class="invalid-feedback">{{ errorMessage }}</div>
  </div>
</template>

<script setup>
import { useField } from 'vee-validate'

const props = defineProps({
  name: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  is_required: { type: Boolean, default: false },
  rules: { type: [String, Object], default: '' }
})

const { value, errorMessage, meta, handleBlur } = useField(props.name, props.rules)
</script>

<style scoped>

</style>

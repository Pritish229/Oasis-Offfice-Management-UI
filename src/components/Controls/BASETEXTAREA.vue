<template>
  <div class="mb-3">
    <label :for="name" class="form-label">
      {{ label }}
      <small v-if="is_required" class="text-danger">*</small>
    </label>

    <textarea v-model="value" :id="name" :rows="rows" :placeholder="placeholder" class="form-control" @blur="handleBlur"
      :class="{
        'is-invalid': errorMessage,
        'is-valid': meta.valid && meta.touched
      }"></textarea>

    <div v-if="errorMessage" class="invalid-feedback">{{ errorMessage }}</div>
  </div>
</template>

<script setup>
import { useField } from 'vee-validate'

const props = defineProps({
  name: { type: String, required: true },
  label: { type: String, required: true },
  rules: { type: [String, Object], default: '' },
  is_required: { type: Boolean, default: false },
  rows: { type: Number, default: 3 },
  placeholder: { type: String, default: '' }
})

const { value, errorMessage, meta, handleBlur } = useField(props.name, props.rules)
</script>

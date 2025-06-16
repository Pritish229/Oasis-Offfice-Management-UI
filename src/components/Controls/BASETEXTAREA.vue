<template>
  <div class="mb-3">
    <label :for="name" class="form-label">
      {{ label }}
      <small v-if="is_required" class="text-danger">*</small>
    </label>

    <Field :name="name" :rules="rules" v-slot="{ field, errors, meta }">
      <textarea
        v-bind="field"
        :id="name"
        :rows="rows"
        :placeholder="placeholder"
        class="form-control"
        :class="{
          'is-invalid': errors.length,
          'is-valid': meta.valid && meta.touched
        }"
      ></textarea>
    </Field>

    <ErrorMessage :name="name" class="invalid-feedback" />
  </div>
</template>

<script setup>
import { Field, ErrorMessage } from 'vee-validate'

defineProps({
  name: { type: String, required: true },
  label: { type: String, required: true },
  rules: { type: String, default: '' },
  is_required: { type: Boolean, default: false },
  rows: { type: Number, default: 3 },
  placeholder: { type: String, default: '' },
})
</script>

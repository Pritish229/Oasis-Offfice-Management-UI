<template>
  <div class="mb-3">
    <label :for="name" class="form-label">
      {{ label }}
      <small v-if="is_required" class="text-danger">*</small>
    </label>
    <Field :name="name" :rules="rules" v-slot="{ field, errors, meta }" >
      {{ meta.touched }}
      <input v-bind="field" :type="type" :id="name"
        :class="['form-control', { 'is-invalid': errors.length, 'is-valid': meta.valid && meta.touched }]" :placeholder="placeholder"  />
    </Field>
    <ErrorMessage :name="name" class="invalid-feedback" />
  </div>
</template>

<script setup>
import { Field, ErrorMessage } from 'vee-validate'

defineProps({
  name: { type: String, required: true },
  placeholder:{type:String , default:'Enter place holder'},
  label: { type: String, required: true },
  rules: { type: String, default: '' },
  type: { type: String, default: 'text' },
  is_required: { type: Boolean, default: false }
})
</script>


<style>
.form-control {
  border: 1px solid #cacaca;
}

.dark .form-control {
  border: 1px solid #8a8787;
}
</style>
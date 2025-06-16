<!-- components/Controls/BaseDatePicker.vue -->
<template>
  <div class="mb-3">
    <Field :name="name" v-slot="{ field, errorMessage, meta }">
      <label :for="name" class="form-label">
        {{ label }}
        <small v-if="is_required" class="text-danger">*</small>
      </label>

      <VueDatePicker
        :model-value="field.value"
        @update:model-value="val => {
          field.onChange(val)
          field.onBlur()
        }"
        :enable-time-picker="false"
        :placeholder="placeholder"
        :auto-apply="true"
        :hide-input-icon="true"
        :from-input="true"
        :input-class="[
          'form-control',
          meta.touched && errorMessage ? 'is-invalid' : '',
          meta.touched && !errorMessage ? 'is-valid' : ''
        ]"
      />

      <div v-if="meta.touched && errorMessage" class="invalid-feedback">
        {{ errorMessage }}
      </div>
    </Field>
  </div>
</template>

<script setup>
import { Field } from 'vee-validate'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

defineProps({
  name: String,
  placeholder: String,
  label: String,
  is_required: Boolean
})
</script>

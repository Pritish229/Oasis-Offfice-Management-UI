<template>
  <div class="mb-3 position-relative">
    <Field :name="name" v-slot="{ field, errorMessage, meta }">
      <label :for="name" class="form-label">
        {{ label }}
        <small v-if="is_required" class="text-danger">*</small>
      </label>

      <VueDatePicker :model-value="field.value" @update:model-value="val => {
        field.onChange(val)
        field.onBlur()
      }" :enable-time-picker="false" :placeholder="placeholder" :auto-apply="true" :hide-input-icon="true"
        :from-input="true" :state="(meta.touched || meta.validated) ? !errorMessage : null"
        input-class="form-control pe-5" />

      <!-- Error icon -->
      <span v-if="(meta.touched || meta.validated) && errorMessage" class="position-absolute validation-icon">
        <div class="validation-icon-outline">
          <font-awesome-icon icon="exclamation" />
        </div>
      </span>

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

<style scoped>
.dark .dp__input {
  background: transparent;
}

.dp__input_invalid {
  box-shadow: none !important;
  border-color: #c03221 !important;
}

.validation-icon {
  top: 52%;
  right: 0.8rem;
  transform: translateY(30%);
  position: absolute;
  pointer-events: none;
}

.validation-icon-outline {
  width: 15px;
  height: 15px;
  border: 1.9px solid #c03221;
  border-radius: 50%;
  color: #c03221;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  background-color: transparent;
}
</style>

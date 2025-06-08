<script setup>
const props = defineProps({
  label: String,
  placeholder: String,
  name: String,
  id: String,
  type: {
    type: String,
    default: "text"
  },
  modelValue: [String, Number],
  helper: String,
})

const emit = defineEmits(["update:modelValue"])

const updateValue = (e) => {
  emit("update:modelValue", e.target.value)
}
</script>

<template>
  <div class="mb-3">
    <label :for="id" class="form-label">{{ label }}</label>
    <input
      :type="type"
      class="form-control"
      :id="id"
      :name="name"
      :placeholder="placeholder"
      :value="modelValue"
      @input="updateValue"
      v-bind="$attrs"
    />
    <div v-if="helper" class="form-text">{{ helper }}</div>
  </div>
</template>

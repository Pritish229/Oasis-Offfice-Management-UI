<template>
    <div class="flex flex-col gap-1">
        <label v-if="label" :for="name" class="text-sm font-medium text-gray-700">
            {{ label }}
        </label>
        <input :type="type" :id="name" :placeholder="placeholder" :value="modelValue" :disabled="disabled"
            @input="$emit('update:modelValue', $event.target.value)" @blur="$emit('blur', $event)"
            class="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" :class="[
                error ? 'border-red-500' : 'border-gray-300',
                disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
                className
            ]" />
        <span v-if="error" class="text-sm text-red-500">{{ error }}</span>
    </div>
</template>

<script setup lang="ts">
defineProps({
    modelValue: {
        type: [String, Number],
        default: ''
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'text'
    },
    label: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: ''
    },
    error: {
        type: String,
        default: ''
    },
    disabled: {
        type: Boolean,
        default: false
    },
    className: {
        type: String,
        default: ''
    }
})

defineEmits(['update:modelValue', 'blur'])
</script>
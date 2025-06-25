<template>
  <div class="dropdown" ref="dropdownRef">
    <!-- Trigger -->
    <slot name="trigger">
      <button
        type="button"
        class="btn p-0 border-0 bg-transparent"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <font-awesome-icon :icon="icon" />
      </button>
    </slot>

    <!-- Dropdown Menu -->
    <ul class="dropdown-menu">
      <li v-if="header">
        <h6 class="dropdown-header">{{ header }}</h6>
      </li>
      <li
        v-for="(option, index) in options"
        :key="index"
      >
        <a
          href="#"
          class="dropdown-item"
          @click.prevent="handleSelect(option)"
        >
          {{ option.label }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { Dropdown } from 'bootstrap'
import { onMounted, nextTick, ref } from 'vue'

const props = defineProps({
  icon: { type: Array, default: () => ['fas', 'ellipsis-vertical'] },
  options: {
    type: Array,
   
  },
  header: { type: String, default: 'Options' }
})

const emit = defineEmits(['select'])

const dropdownRef = ref(null)

const handleSelect = (option) => {
  emit('select', option)
}

onMounted(async () => {
  await nextTick()
  const el = dropdownRef.value?.querySelector('[data-bs-toggle="dropdown"]')
  if (el) new Dropdown(el)
})
</script>

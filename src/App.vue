<script setup>
import { RouterLink, RouterView } from 'vue-router'
import APPLayout from '@/components/LAYOUT/APPLayout.vue'
</script>

<template>
  <APPLayout>
    <template #content>
      <div class="card p-4">
        <RouterView />
      </div>
    </template>
  </APPLayout>
</template>

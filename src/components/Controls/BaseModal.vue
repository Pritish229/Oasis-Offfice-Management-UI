<!-- src/components/Controls/BaseModal.vue -->
<template>
  <div class="modal fade" :id="modalId" tabindex="-1" ref="modalRef" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button v-if="showClose" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="handleCancel"></button>
        </div>

        <div class="modal-body">
          <slot />
        </div>

        <div class="modal-footer">
          <button v-if="showClose" type="button" class="btn btn-secondary" @click="handleCancel">
            Cancel
          </button>
          <button :class="submitButtonClass" @click="onSubmit">
            {{ submitButtonText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Modal } from 'bootstrap'

const props = defineProps({
  modalId: String,
  title: String,
  showClose: { type: Boolean, default: true },
  submitButtonText: { type: String, default: 'Submit' },
  submitButtonClass: { type: String, default: 'btn btn-primary' },
  onSubmit: { type: Function, required: true },
  onCancel: { type: Function, default: null }
})

const modalRef = ref(null)
let modalInstance = null

onMounted(() => {
  if (modalRef.value) {
    modalInstance = Modal.getOrCreateInstance(modalRef.value)
  }
})

onBeforeUnmount(() => {
  if (modalInstance) {
    modalInstance.dispose()
    modalInstance = null
  }
})

const show = () => modalInstance?.show()
const hide = () => modalInstance?.hide()

const handleCancel = () => {
  props.onCancel?.()
  hide()
}

defineExpose({ show, hide, modalRef })
</script>

<style scoped>
.dark .modal-content{
  background-color: #151824;
}

.dark .modal-footer{
  border-top: none !important;
  border-bottom: solid #5a5a5e54;
}
.dark .modal-header{
  border-top: solid #5a5a5e54;
  border-bottom: none !important;
}
</style>
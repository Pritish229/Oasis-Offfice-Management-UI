<template>
  <div class="card p-4">
    <!-- Tabs -->
    <div class="bd-example">
      <nav>
        <div class="nav nav-tabs mb-3" id="nav-tab" role="tablist">
          <button class="nav-link active" id="nav-role-tab" data-bs-toggle="tab" data-bs-target="#nav-role" type="button">
            Manage Role
          </button>
          <button class="nav-link" id="nav-permission-tab" data-bs-toggle="tab" data-bs-target="#nav-permission" type="button">
            Permission
          </button>
        </div>
      </nav>

      <!-- Tab Content -->
      <div class="tab-content" id="nav-tabContent">
        <!-- Role Tab -->
        <div class="tab-pane fade show active" id="nav-role">
          <!-- Search & Add -->
          <div class="row mb-3">
            <div class="col-12 col-lg-4">
              <div class="d-flex align-items-center">
                <input class="form-control me-2" type="text" placeholder="Search Here" />
                <button class="btn btn-primary rounded-circle me-2 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                  <font-awesome-icon :icon="['fas', 'search']" />
                </button>
                <button
                  type="button"
                  @click="openModal"
                  class="btn border border-primary rounded-circle d-flex align-items-center justify-content-center"
                  style="width: 40px; height: 40px;"
                >
                  <font-awesome-icon :icon="['fas', 'plus']" class="text-primary" />
                </button>
              </div>
            </div>
          </div>

          <!-- Role Card -->
          <div class="row">
            <div class="col-lg-4">
              <div class="border border-2 rounded-2 p-3">
                <div class="d-flex justify-content-between align-items-center">
                  <h5 class="mb-1">Admin</h5>
                  <div class="dropdown">
                    <a href="#" data-bs-toggle="dropdown">
                      <font-awesome-icon :icon="['fas', 'ellipsis-vertical']" />
                    </a>
                    <ul class="dropdown-menu">
                      <li><h6 class="dropdown-header">Options</h6></li>
                      <li><a class="dropdown-item" href="#">Manage Users</a></li>
                      <li><a class="dropdown-item" href="#">Edit</a></li>
                      <li><a class="dropdown-item" href="#">Delete</a></li>
                    </ul>
                  </div>
                </div>
                <p class="mb-1">Can Manage Employee and Reports</p>
                <small>Created at : 3 Mar 2025</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Permissions Tab -->
        <div class="tab-pane fade" id="nav-permission">
          <p><strong>This is some placeholder content for permissions tab.</strong></p>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal with validation -->
  <BaseModal
    ref="customModal"
    modalId="customModal"
    title="Add Role"
    :showClose="true"
    submitButtonText="Add New"
    submitButtonClass="btn btn-primary"
    :onSubmit="triggerSubmit"
    :onCancel="handleCancel"
  >
    <Form ref="formRef" :validation-schema="schema" @submit="handleSubmit">
      <BaseInput
        name="rolename"
        label="Role Name"
        :is_required="true"
        placeholder="Enter Role Name"
      />
      <BaseTextArea
        name="description"
        label="Description"
        placeholder="Enter Description"
      />
      <button ref="internalSubmit" type="submit" class="d-none" />
    </Form>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import { Form } from 'vee-validate'
import * as yup from 'yup'

import BaseModal from '@/components/Controls/BaseModal.vue'
import BaseInput from '@/components/Controls/BASEINPUT.vue'
import BaseTextArea from '@/components/Controls/BASETEXTAREA.vue'

const customModal = ref(null)
const formRef = ref(null)
const internalSubmit = ref(null)

const openModal = () => {
  customModal.value?.show()
}

const triggerSubmit = () => {
  internalSubmit.value?.click()
}

const handleCancel = () => {
  formRef.value?.resetForm()
}

const schema = yup.object({
  rolename: yup.string().required('Role name is required'),
  description: yup
    .string()
    .optional()
    .test('min-if-present', 'Minimum 6 characters required', val => !val || val.length >= 6)
})

const handleSubmit = (values) => {
  console.log('Submitted Role:', values)
  customModal.value?.hide()
  formRef.value?.resetForm()
}
</script>

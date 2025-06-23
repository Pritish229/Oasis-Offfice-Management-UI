<template>
    <div class="card p-4">
        <div class="bd-example">
            <nav>
                <div class="nav nav-tabs mb-3">
                    <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#nav-role" type="button">
                        Manage Role
                    </button>
                    <button class="nav-link" data-bs-toggle="tab" data-bs-target="#nav-permission" type="button">
                        Permission
                    </button>
                </div>
            </nav>

            <div class="tab-content">
                <div class="tab-pane fade show active" id="nav-role">
                    <section v-if="!permissionview">
                        <div class="row mb-3">
                            <div class="col-12 col-lg-4">
                                <div class="d-flex align-items-center">
                                    <input class="form-control me-2" type="text" placeholder="Search by Role Name"
                                        v-model="searchTerm" @keyup.enter="applySearch" />
                                    <button class="btn btn-primary rounded-circle me-2 d-flex align-items-center justify-content-center p-0"
                                        style="width: 35px; height: 30px;" @click="applySearch">
                                        <font-awesome-icon :icon="['fas', 'search']" class="fs-6" />
                                    </button>
                                    <button type="button" @click="openModal"
                                        class="btn border border-1 border-primary rounded-circle d-flex align-items-center justify-content-center p-0"
                                        style="width: 35px; height: 30px;">
                                        <font-awesome-icon :icon="['fas', 'plus']" class="text-primary fs-6" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="row g-4">
                            <div class="col-12 col-md-6 col-lg-4" v-for="role in filteredRoles" :key="role._id">
                                <div class="border border-2 rounded-2 p-3 h-100 d-flex flex-column justify-content-between">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <h6 class="mb-0 fs-5">{{ role.name }}</h6>
                                        <DropdownMenu :options="menuOptions(role._id)" header="Options" @select="handleSelect">
                                            <template #trigger>
                                                <a href="javascript:;" class="text-muted" data-bs-toggle="dropdown">
                                                    <font-awesome-icon :icon="['fas', 'ellipsis-vertical']" />
                                                </a>
                                            </template>
                                        </DropdownMenu>
                                    </div>
                                    <p class="fs-6 mb-2">{{ role.description }}</p>
                                    <small class="text-muted">Created at: {{ formatDate(role.createdAt) }}</small>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section v-else>
                        <div class="row mb-3">
                            <h4 class="col-lg-6 d-flex align-self-center">Role: {{ currentRole }}</h4>
                            <div class="col-lg-6 d-flex justify-content-end">
                                <button class="btn btn-success" @click="permissionview = false">Back to list</button>
                            </div>
                        </div>

                        <div v-for="group in allPermissions" :key="group._id" class="mb-4">
                            <h5 class="fw-bold text-muted mb-3">{{ group.groupName }}</h5>
                            <div class="row">
                                <div class="col-lg-4 col-md-6 mb-3" v-for="perm in group.permissions" :key="perm._id">
                                    <div class="border border-2 rounded-2 p-3 h-100 d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 class="text-muted mb-1">{{ perm.name }}</h6>
                                            <p class="mb-0">{{ perm.description || 'No description available' }}</p>
                                        </div>
                                        <div class="form-check form-switch ms-3">
                                            <input class="form-check-input" type="checkbox" :id="'perm-' + perm._id"
                                                :checked="assignedPermissions.includes(perm._id)"
                                                @change="togglePermission(perm._id, $event.target.checked)" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <div class="tab-pane fade" id="nav-permission">
                    <p><strong>This is some placeholder content for permissions tab.</strong></p>
                </div>
            </div>
        </div>
    </div>

    <!-- Create Role Modal -->
    <BaseModal ref="customModal" modalId="customModal" title="Add Role" :showClose="true" submitButtonText="Add New"
        submitButtonClass="btn btn-primary" :onSubmit="triggerSubmit" :onCancel="handleCancel">
        <Form ref="formRef" :validation-schema="schema" @submit="handleSubmit">
            <BaseInput name="name" label="Role Name" :is_required="true" placeholder="Enter Role Name" helper="Minimum 5 characters." />
            <BaseTextArea name="description" label="Description" placeholder="Enter Description" />
            <button ref="internalSubmit" type="submit" class="d-none" />
        </Form>
    </BaseModal>

    <!-- Edit Role Modal -->
    <BaseModal ref="editModal" modalId="editModal" title="Edit Role" :showClose="true" submitButtonText="Update"
        submitButtonClass="btn btn-primary" :onSubmit="triggerUpdateSubmit" :onCancel="handleCancelEdit">
        <Form ref="editFormRef" :validation-schema="schema" @submit="handleUpdate">
            <BaseInput name="name" label="Role Name" :is_required="true" placeholder="Enter Role Name" helper="Minimum 5 characters." />
            <BaseTextArea name="description" label="Description" placeholder="Enter Description" />
            <button ref="internalEditSubmit" type="submit" class="d-none" />
        </Form>
    </BaseModal>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { Form } from 'vee-validate'
import * as yup from 'yup'
import axios from 'axios'
import Swal from 'sweetalert2'
import dayjs from 'dayjs'
import { API_URL } from '@/config/path'
import BaseModal from '@/components/Controls/BaseModal.vue'
import BaseInput from '@/components/Controls/BASEINPUT.vue'
import BaseTextArea from '@/components/Controls/BASETEXTAREA.vue'
import DropdownMenu from '@/components/Controls/DropdownMenu.vue'

const customModal = ref(null)
const formRef = ref(null)
const internalSubmit = ref(null)
const permissionview = ref(false)
const editModal = ref(null)
const editFormRef = ref(null)
const internalEditSubmit = ref(null)
const selectedRole = ref(null)
const currentRole = ref(null)
const allPermissions = ref([])
const assignedPermissions = ref([])
const allroles = ref([])
const searchTerm = ref('')
const filteredRoles = ref([])

const schema = yup.object({
    name: yup.string().required('Role name is required').min(5, 'Minimum 5 characters required'),
    description: yup.string().optional().test('min-if-present', 'Minimum 6 characters required', val => !val || val.length >= 6)
})

const fatchRoles = async () => {
    const res = await axios.get(`${API_URL}/roles/list`)
    if (res.status === 200) {
        allroles.value = res.data
        filteredRoles.value = res.data
    }
}

const applySearch = () => {
    const term = searchTerm.value.trim().toLowerCase()
    filteredRoles.value = !term ? allroles.value : allroles.value.filter(r => r.name.toLowerCase().includes(term))
}

const openModal = () => customModal.value?.show()
const openEditModal = (role) => {
    nextTick(() => {
        editFormRef.value?.resetForm({ values: { name: role.name || '', description: role.description || '' } })
        editModal.value?.show()
    })
}

const handleCancel = () => formRef.value?.resetForm()
const handleCancelEdit = () => editFormRef.value?.resetForm()
const triggerSubmit = () => internalSubmit.value?.click()
const triggerUpdateSubmit = () => internalEditSubmit.value?.click()

const fetchPermissions = async () => {
    const res = await axios.get(`${API_URL}/permissions/grouped`)
    if (res.status === 200) allPermissions.value = res.data
}

const fetchRolePermissions = async (roleId) => {
    const res = await axios.get(`${API_URL}/roles/${roleId}/permissions`)
    if (res.status === 200) assignedPermissions.value = res.data
}

const togglePermission = async (permissionId, allow) => {
    if (!selectedRole.value?._id) return Swal.fire('Error', 'No role selected', 'error')
    try {
        await axios.post(`${API_URL}/roles/${selectedRole.value._id}/permissions`, { permissionId, allow })
        if (allow) assignedPermissions.value.push(permissionId)
        else assignedPermissions.value = assignedPermissions.value.filter(p => p !== permissionId)
    } catch (err) {
        Swal.fire('Error', err.response?.data?.message || 'Failed to update permission', 'error')
    }
}

const handleSubmit = async (values) => {
    try {
        const res = await axios.post(`${API_URL}/roles/Create`, values)
        if (res.status === 201) {
            Swal.fire('Success', 'Role Created Successfully', 'success')
            fatchRoles()
            customModal.value?.hide()
            formRef.value?.resetForm()
        }
    } catch (err) {
        Swal.fire('Error', err.response?.data?.message || 'Something went wrong', 'error')
    }
}

const handleUpdate = async (values) => {
    try {
        const response = await axios.put(`${API_URL}/roles/${selectedRole.value._id}/update`, values)
        if (response.status === 200) {
            Swal.fire('Success', 'Role Updated Successfully', 'success')
            fatchRoles()
            editModal.value?.hide()
        }
    } catch (err) {
        Swal.fire('Error', err.response?.data?.message || 'Something went wrong', 'error')
    }
}

const menuOptions = (id) => [
    { label: 'Manage Permission', value: 'permission', id },
    { label: 'Edit', value: 'edit', id },
    { label: 'Delete', value: 'delete', id }
]

const handleSelect = (option) => {
    const role = allroles.value.find(r => r._id === option.id)
    if (!role) return
    if (option.value === 'edit') {
        selectedRole.value = role
        openEditModal(role)
    } else if (option.value === 'delete') {
        Swal.fire({ title: 'Are you sure?', text: 'This action cannot be undone', icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes, delete it!' })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await axios.delete(`${API_URL}/roles/${option.id}`)
                        Swal.fire('Deleted!', 'Role has been deleted.', 'success')
                        fatchRoles()
                    } catch {
                        Swal.fire('Error', 'Failed to delete role', 'error')
                    }
                }
            })
    } else if (option.value === 'permission') {
        selectedRole.value = role
        currentRole.value = role.name
        permissionview.value = true
        fetchPermissions()
        fetchRolePermissions(option.id)
    }
}

const formatDate = (date) => date ? dayjs(date).format('DD MMM YYYY') : '-'

onMounted(fatchRoles)
</script>

<style scoped>
.form-check-input {
    width: 2.5em;
    height: 1.4em;
}
</style>

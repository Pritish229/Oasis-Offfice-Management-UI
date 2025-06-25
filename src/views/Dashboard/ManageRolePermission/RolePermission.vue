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
                    <button class="nav-link" data-bs-toggle="tab" data-bs-target="#nav-users" type="button">
                        Manage Users
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
                                    <button
                                        class="btn btn-primary rounded-circle me-2 d-flex align-items-center justify-content-center p-0"
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
                                <div
                                    class="border border-2 rounded-2 p-3 h-100 d-flex flex-column justify-content-between">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <h6 class="mb-0 fs-5">{{ role.name }}</h6>
                                        <DropdownMenu :options="menuOptions(role._id)" header="Options"
                                            @select="handleSelect">
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
                                    <div
                                        class="border border-2 rounded-2 p-3 h-100 d-flex justify-content-between align-items-center">
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
                    <div class="d-flex justify-content-end mb-3">
                        <button class="btn btn-primary" @click="openAddPermissionModal">
                            <font-awesome-icon icon="plus" class="me-2" />Add Permission
                        </button>
                    </div>
                    <div v-for="group in allPermissions" :key="group._id" class="mb-5">
                        <h4 class="fw-bold text-muted my-4 d-flex align-items-center">
                            <!-- Inline editing for group name -->
                            <div v-if="editingGroupId === group._id" class=" row">
                                <div class="col-lg-12 d-flex">
                                    <input type="text" class="form-control p-1 me-2 w-full" v-model="editingGroupName"
                                        @keyup.enter="saveEditGroup" @keyup.esc="cancelEditGroup"
                                        ref="groupNameInput" />
                                    <div class="d-flex ">
                                        <button class="btn btn-success btn-sm me-1" @click="saveEditGroup" title="Save">
                                            Save
                                        </button>
                                        <button class="btn btn-secondary btn-sm" @click="cancelEditGroup"
                                            title="Cancle">
                                            Cancle
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <span v-else class="group-name-display" style="cursor: pointer;"
                                @click="startEditGroup(group)" title="Click to edit group name">
                                {{ group.groupName }}
                            </span>
                            <span v-if="group.permissions.length === 0" class="ms-2" style="cursor:pointer;"
                                @click="deleteGroup(group)">
                                <font-awesome-icon icon="trash" style="color: #e3342f; font-size: 1.1em;" />
                            </span>
                        </h4>
                        <div class="row g-3">
                            <div v-for="perm in group.permissions" :key="perm._id" class="col-12 col-md-6 col-lg-4">
                                <div
                                    class="border border-2 rounded p-3 h-100 d-flex flex-column justify-content-between">
                                    <div>
                                        <div class="d-flex justify-content-between">
                                            <div class="permission-name">{{ perm.name }}</div>
                                            <DropdownMenu :options="permissionMenuOptions(perm._id)" header="Options"
                                                @select="handlePermissionSelect">
                                                <template #trigger>
                                                    <a href="javascript:;" class="text-muted" data-bs-toggle="dropdown">
                                                        <font-awesome-icon :icon="['fas', 'ellipsis-vertical']" />
                                                    </a>
                                                </template>
                                            </DropdownMenu>
                                        </div>
                                        <div class="permission-description text-muted">
                                            {{ perm.description || 'No description available' }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div class="tab-pane fade" id="nav-users">
                    <div class="row mb-3 justify-content-end">
                        <div class="col-12 col-md-4">
                            <div class="input-group ">
                                <input class="form-control" type="text" v-model="userParams.search"
                                    placeholder="Search Users..." @input="debouncedSearch" />
                            </div>
                        </div>
                    </div>
                    <vue3-datatable height="500px" :stickyHeader="true" :rows="userRows" :columns="userCols"
                        :loading="userLoading" :totalRows="user_total_rows" :isServerMode="true"
                        :pageSize="userParams.pagesize" skin="bh-table-hover" :sortable="true"
                        :sortColumn="userParams.sort_column" :sortDirection="userParams.sort_direction"
                        @change="changeServer">

                        <template #status="rows">
                            <span :class="['badge badge-pill', rows.value.status === 1 ? 'bg-success' : 'bg-danger']">
                                {{ rows.value.status === 1 ? 'Active' : 'Inactive' }}
                            </span>
                        </template>
                        <template #roles="rows">

                            <v-select class="w-full" :options="allroles" :reduce="item => item._id" label="name"
                                multiple v-model="rows.value.roles"
                                @update:modelValue="roleChanged(rows.value, $event)"></v-select>

                        </template>
                    </vue3-datatable>
                </div>
            </div>
        </div>
    </div>

    <!-- Create Role Modal -->
    <BaseModal ref="customModal" modalId="customModal" title="Add Role" :showClose="true" submitButtonText="Add New"
        submitButtonClass="btn btn-primary" :onSubmit="triggerSubmit" :onCancel="handleCancel">
        <Form ref="formRef" :validation-schema="schema" @submit="handleSubmit">
            <BaseInput name="name" label="Role Name" :is_required="true" placeholder="Enter Role Name"
                helper="Minimum 5 characters." />
            <BaseTextArea name="description" label="Description" placeholder="Enter Description" />
            <button ref="internalSubmit" type="submit" class="d-none" />
        </Form>
    </BaseModal>

    <!-- Edit Role Modal -->
    <BaseModal ref="editModal" modalId="editModal" title="Edit Role" :showClose="true" submitButtonText="Update"
        submitButtonClass="btn btn-primary" :onSubmit="triggerUpdateSubmit" :onCancel="handleCancelEdit">
        <Form ref="editFormRef" :validation-schema="schema" @submit="handleUpdate">
            <BaseInput name="name" label="Role Name" :is_required="true" placeholder="Enter Role Name"
                helper="Minimum 5 characters." />
            <BaseTextArea name="description" label="Description" placeholder="Enter Description" />
            <button ref="internalEditSubmit" type="submit" class="d-none" />
        </Form>
    </BaseModal>

    <!-- Edit Permission Modal -->
    <BaseModal ref="editPermissionModal" modalId="editPermissionModal" title="Edit Permission" :showClose="true"
        submitButtonText="Update" submitButtonClass="btn btn-primary" :onSubmit="triggerUpdatePermissionSubmit"
        :onCancel="handleCancelEditPermission">
        <Form ref="editPermissionFormRef" :validation-schema="permissionSchema" @submit="handleUpdatePermission"
            v-slot="{ errors }">
            <div class="mb-3">
                <BaseSelect name="groupName" label="Group Name" :options="permissionGroupOptions" :is_required="true"
                    placeholder="Select a group" />
                <div v-if="errors.groupName" class="text-danger mt-1">{{ errors.groupName }}</div>
            </div>
            <BaseInput name="name" label="Permission Name" :is_required="true" placeholder="Enter Permission Name" />
            <BaseTextArea name="description" label="Description" placeholder="Enter Description" />
            <button ref="internalEditPermissionSubmit" type="submit" class="d-none" />
        </Form>
    </BaseModal>

    <!-- Add Permission Modal -->
    <BaseModal ref="addPermissionModal" modalId="addPermissionModal" title="Add Permission" :showClose="true"
        submitButtonText="Add" submitButtonClass="btn btn-primary" :onSubmit="triggerAddPermissionSubmit"
        :onCancel="handleCancelAddPermission">
        <Form ref="addPermissionFormRef" :validation-schema="permissionSchema" @submit="handleAddPermission"
            v-slot="{ errors }">
            <div class="mb-3">
                <BaseSelect name="groupName" label="Group Name" :options="permissionGroupOptions" :is_required="true"
                    placeholder="Select a group" />
                <div v-if="errors.groupName" class="text-danger mt-1">{{ errors.groupName }}</div>
            </div>
            <BaseInput name="name" label="Permission Name" :is_required="true" placeholder="Enter Permission Name" />
            <BaseTextArea name="description" label="Description" placeholder="Enter Description" />
            <button ref="internalAddPermissionSubmit" type="submit" class="d-none" />
        </Form>
    </BaseModal>
</template>

<script setup>
import { ref, nextTick, onMounted, reactive, computed } from 'vue'
import { Form } from 'vee-validate'
import * as yup from 'yup'
import axios from 'axios'
import Swal from 'sweetalert2'
import dayjs from 'dayjs'
import { useAuthStore } from '@/stores/auth'
import Vue3Datatable from '@bhplugin/vue3-datatable'
import '@bhplugin/vue3-datatable/dist/style.css'
import { API_URL } from '@/config/path'
import BaseModal from '@/components/Controls/BaseModal.vue'
import BaseInput from '@/components/Controls/BASEINPUT.vue'
import BaseTextArea from '@/components/Controls/BASETEXTAREA.vue'
import DropdownMenu from '@/components/Controls/DropdownMenu.vue'
import BaseSelect from '@/components/Controls/BASESELECT.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const auth = useAuthStore()
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
const tabNav = ref(null)

const editPermissionModal = ref(null)
const editPermissionFormRef = ref(null)
const internalEditPermissionSubmit = ref(null)
const selectedPermission = ref(null)
const permissionGroupNames = ref([])

const permissionGroupOptions = computed(() =>
    permissionGroupNames.value.map(name => ({ value: name, label: name }))
)

const userLoading = ref(true)
const userRows = ref([])
const user_total_rows = ref(0)
const userParams = reactive({
    current_page: 1,
    pagesize: 10,
    search: '',
    sort_column: 'username',
    sort_direction: 'asc'
})

const userCols = ref([
    { field: 'index', title: 'SL No', isUnique: true, sort: false },
    { field: 'username', title: 'Username', cellClass: 'w-auto' },
    { field: 'fullName', title: 'Full Name', cellClass: 'w-auto' },
    { field: 'contactNo', title: 'Contact Number', sortable: true, cellClass: 'w-auto' },
    { field: 'status', title: 'Status', sort: false, cellClass: 'w-auto' },
    { field: 'roles', title: 'Roles', sort: false, cellClass: 'w-25' }
])

const schema = yup.object({
    name: yup.string().required('Role name is required').min(5, 'Minimum 5 characters required'),
    description: yup.string().optional().test('min-if-present', 'Minimum 6 characters required', val => !val || val.length >= 6)
})

const permissionSchema = yup.object({
    groupName: yup.string().required('Group name is required'),
    name: yup.string().required('Permission name is required'),
    description: yup.string().optional()
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

const fetchPermissionGroupNames = async () => {
    try {
        const res = await axios.get(`${API_URL}/permissions/group-names`)
        if (res.status === 200) {
            permissionGroupNames.value = res.data
        }
    } catch (error) {
        console.error('Failed to fetch permission group names:', error)
    }
}

const fetchRolePermissions = async (roleId) => {
    const res = await axios.get(`${API_URL}/roles/${roleId}/permissions`)
    if (res.status === 200) assignedPermissions.value = res.data
}

const togglePermission = async (permissionId, allow) => {
    if (!selectedRole.value?._id) return Swal.fire('Error', 'No role selected', 'error')
    try {
        const response = await axios.post(`${API_URL}/roles/${selectedRole.value._id}/permissions`, { permissionId, allow })

        console.log();
        if (response.status === 200) {
            await auth.fetchProfile()
        }
        
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

const permissionMenuOptions = (id) => [
    { label: 'Edit', value: 'edit', id }
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

const getUsers = async () => {
    userLoading.value = true
    try {
        const response = await axios.get(`${API_URL}/users/profile/list-with-roles`, {
            params: {
                page: userParams.current_page,
                limit: userParams.pagesize,
                search: userParams.search,
                sort_column: userParams.sort_column,
                sort_direction: userParams.sort_direction
            }
        })
        const { data, pagination } = response.data
        userRows.value = data.map((user, idx) => ({
            ...user,
            index: (userParams.current_page - 1) * userParams.pagesize + idx + 1,
            selectedRoles: (user.roles || []).map(role => role._id)
        }))
        user_total_rows.value = pagination?.total || 0
    } catch (error) {
        console.error('Failed to fetch users:', error)
    } finally {
        userLoading.value = false
    }
}

const changeServer = (data) => {
    userParams.current_page = data.current_page
    userParams.pagesize = data.pagesize
    userParams.sort_column = data.sort_column
    userParams.sort_direction = data.sort_direction
    getUsers()
}

let searchTimer = null
const debouncedSearch = () => {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => {
        userParams.current_page = 1
        getUsers()
    }, 300)
}

const updateUserRoles = async (user) => {
    try {
        await axios.post(`${API_URL}/users/${user._id}/roles`, { roles: user.selectedRoles })
        Swal.fire('Success', 'User roles updated', 'success')
    } catch (err) {
        Swal.fire('Error', err.response?.data?.message || 'Failed to update roles', 'error')
    }
}

const openEditPermissionModal = (permission) => {
    nextTick(() => {
        const groupName = allPermissions.value.find(g => g.permissions.some(p => p._id === permission._id))?.groupName || ''
        editPermissionFormRef.value?.resetForm({
            values: {
                groupName: groupName,
                name: permission.name || '',
                description: permission.description || ''
            }
        })
        editPermissionModal.value?.show()
    })
}

const handlePermissionSelect = (option) => {
    let permission
    for (const group of allPermissions.value) {
        const found = group.permissions.find(p => p._id === option.id)
        if (found) {
            permission = found
            break
        }
    }
    if (!permission) return

    if (option.value === 'edit') {
        selectedPermission.value = permission
        openEditPermissionModal(permission)
    }
}

const triggerUpdatePermissionSubmit = () => internalEditPermissionSubmit.value?.click()

const handleCancelEditPermission = () => {
    editPermissionFormRef.value?.resetForm()
    selectedPermission.value = null
}

const handleUpdatePermission = async (values) => {
    if (!selectedPermission.value?._id) return
    try {
        const response = await axios.put(`${API_URL}/permissions/${selectedPermission.value._id}`, values)
        if (response.status === 200) {
            Swal.fire('Success', 'Permission Updated Successfully', 'success')
            fetchPermissions()
            editPermissionModal.value?.hide()
            handleCancelEditPermission()
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

const deleteGroup = async (group) => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'This action cannot be undone',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        confirmButtonColor: '#e3342f',
        cancelButtonColor: '#6c757d',
    })
    if (result.isConfirmed) {
        try {
            await axios.delete(`${API_URL}/permissions/group/${group._id}`)
            Swal.fire('Deleted!', 'Group has been deleted.', 'success')
            fetchPermissions()
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || 'Failed to delete group', 'error')
        }
    }
}

const addPermissionModal = ref(null)
const addPermissionFormRef = ref(null)
const internalAddPermissionSubmit = ref(null)

// Inline editing for group names
const editingGroupId = ref(null)
const editingGroupName = ref('')
const originalGroupName = ref('')

const openAddPermissionModal = () => {
    nextTick(() => {
        addPermissionFormRef.value?.resetForm({ values: { groupName: '', name: '', description: '' } })
        addPermissionModal.value?.show()
    })
}
const triggerAddPermissionSubmit = () => internalAddPermissionSubmit.value?.click()
const handleCancelAddPermission = () => addPermissionFormRef.value?.resetForm()

const handleAddPermission = async (values) => {
    try {
        const res = await axios.post(`${API_URL}/permissions/`, values)
        if (res.status === 201) {
            Swal.fire('Success', 'New permission added', 'success')
            fetchPermissions()
            addPermissionModal.value?.hide()
            addPermissionFormRef.value?.resetForm()
        }
    } catch (err) {
        Swal.fire('Error', err.response?.data?.message || 'Something went wrong', 'error')
    }
}

// Group name editing functions
const startEditGroup = (group) => {
    editingGroupId.value = group._id
    editingGroupName.value = group.groupName
    originalGroupName.value = group.groupName

    // Focus the input field after DOM update
    nextTick(() => {
        const input = document.querySelector('input[ref="groupNameInput"]')
        if (input) {
            input.focus()
            input.select()
        }
    })
}

const cancelEditGroup = () => {
    editingGroupId.value = null
    editingGroupName.value = ''
    originalGroupName.value = ''
}

const saveEditGroup = async () => {
    if (!editingGroupName.value.trim()) {
        Swal.fire('Error', 'Group name cannot be empty', 'error')
        return
    }

    try {
        const response = await axios.put(`${API_URL}/permissions/group/${editingGroupId.value}`, {
            name: editingGroupName.value.trim()
        })

        if (response.status === 200) {
            Swal.fire('Success', 'Group name updated successfully', 'success')
            fetchPermissions()
            fetchPermissionGroupNames()
            cancelEditGroup()
        }
    } catch (err) {
        Swal.fire('Error', err.response?.data?.message || 'Failed to update group name', 'error')
    }
}

onMounted(() => {
    fatchRoles()
    fetchPermissionGroupNames()
    nextTick(() => {
        const navRole = document.querySelector('[data-bs-target="#nav-role"]')
        if (navRole) {
            navRole.addEventListener('click', () => {
                fatchRoles()
            })
        }
        const navPermission = document.querySelector('[data-bs-target="#nav-permission"]')
        if (navPermission) {
            navPermission.addEventListener('click', () => {
                fetchPermissions()
                fetchPermissionGroupNames()
            })
        }
        const navUsers = document.querySelector('[data-bs-target="#nav-users"]')
        if (navUsers) {
            navUsers.addEventListener('click', () => {
                getUsers()
            })
        }
    })
})

const roleChanged = async (row, selectedRoleIds) => {
  const auth = useAuthStore()

  try {
    Swal.fire({
      title: 'Updating roles...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    })

    const payload = { roleIds: selectedRoleIds }
    const response = await axios.patch(`${API_URL}/roles/${row._id}/roles`, payload)
    
    if (response.status === 200) {
        // This triggers sidebar re-render now
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'User roles updated successfully',
        timer: 1500,
        showConfirmButton: false
      })
    } else {
      throw new Error('Failed to update user roles')
    }
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.response?.data?.message || err.message || 'Role update failed'
    })
  }
}

</script>

<style scoped>
.form-check-input {
    width: 2.5em;
    height: 1.4em;
}

.text-primary {
    color: #2563eb !important;
}

.text-secondary {
    color: #6c757d !important;
}

.vs__dropdown-toggle {
    border: 3px solid rgb(7, 5, 5);
}

.permission-name {
    font-weight: 500;
    margin-bottom: 0.25rem;
}

.permission-description {
    font-size: 0.875rem;
}

.group-name-display {
    transition: color 0.2s ease;
}

.group-name-display:hover {
    color: #2563eb !important;
    text-decoration: underline;
}

.bh-table-hover td {
    overflow: hidden;
    position: relative;
}
</style>
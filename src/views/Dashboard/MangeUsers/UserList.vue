<template>
    <div class="container">
        <div class="card p-4">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-3xl">User Management</h2>
            </div>

            <div class="mb-3">
                <input 
                    v-model="params.search" 
                    type="text" 
                    class="form-control w-25" 
                    placeholder="Search users..." 
                />
            </div>

            <vue3-datatable 
                :rows="rows" 
                :columns="cols" 
                :loading="loading" 
                :totalRows="total_rows" 
                :isServerMode="true" 
                :pageSize="params.pagesize" 
                :search="params.search" 
                @change="changeServer"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import Vue3Datatable from '@bhplugin/vue3-datatable';
import '@bhplugin/vue3-datatable/dist/style.css';
import axios from 'axios';
import { API_URL } from '@/config/path.js';

const loading = ref(true);
const total_rows = ref(0);
const rows = ref([]);

const params = reactive({
    current_page: 1,
    pagesize: 10,
    search: '',
    column_filters: [],
});

const cols = ref([
    { field: 'index', title: 'S.No', isUnique: true },
    { field: 'username', title: 'Username' },
    { field: 'email', title: 'Email' },
    { field: 'fullName', title: 'Full Name' },
    { field: 'gender', title: 'Gender' },
    { field: 'dob', title: 'Date of Birth', type: 'date' },
    { field: 'maritalStatus', title: 'Marital Status' },
    { field: 'contactNo', title: 'Contact Number' },
    { field: 'altNo', title: 'Alternate Number' },
    { field: 'presentAddress', title: 'Present Address' },
    { field: 'permanentAddress', title: 'Permanent Address' },
]);

let controller: AbortController | null = null;
let timer: number | null = null;

const filterUsers = () => {
    if (timer) clearTimeout(timer);
    timer = window.setTimeout(() => {
        getUsers();
    }, 300);
};

const getUsers = async () => {
    try {
        if (controller) {
            controller.abort();
        }
        controller = new AbortController();
        
        loading.value = true;
        const response = await axios.get(`${API_URL}/users/profile/list`, {
            params: {
                page: params.current_page,
                limit: params.pagesize,
                search: params.search,
                fields: 'username email fullName gender dob maritalStatus contactNo altNo presentAddress permanentAddress'
            },
            signal: controller.signal
        });

        const { data, pagination } = response.data;
        rows.value = (data || []).map((user, idx) => ({
            ...user,
            index: ((params.current_page - 1) * params.pagesize) + idx + 1
        }));
        total_rows.value = pagination?.total || 0;
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error('Error fetching users:', error);
        }
    } finally {
        loading.value = false;
    }
};

const changeServer = (data: any) => {
    params.current_page = data.current_page;
    params.pagesize = data.pagesize;
    params.column_filters = data.column_filters;
    params.search = data.search;

    if (data.change_type === 'search') {
        filterUsers();
    } else {
        getUsers();
    }
};

onMounted(() => {
    getUsers();
});
</script>

<template>
    <div class="card p-4">
        <!-- Search and Add Button -->
        <div class="row pt-3">
            <span class="col-lg-4 mb-3">
                <router-link to="/app/users/add">
                    <button class="btn btn-primary">
                        <FontAwesomeIcon :icon="['fas', 'fa-circle-plus']" class="me-2" />
                        Add New
                    </button>
                </router-link>
            </span>

            <span class="col-lg-8">
                <div class="d-flex justify-content-end mb-2">
                    <div class="input-group" style="max-width: 350px">
                        <input class="form-control" type="text" v-model="params.search"
                            placeholder="Search Something..." @input="debouncedSearch" />
                    </div>
                </div>
            </span>
        </div>

        <!-- Data Table -->
        <vue3-datatable
            :rows="rows"
            :columns="cols"
            :loading="loading"
            :sortable="true"
            :totalRows="total_rows"
            :isServerMode="true"
            :pageSize="params.pagesize"
            :sortColumn="params.sort_column"
            :sortDirection="params.sort_direction"
            skin="bh-table-hover"
            @change="changeServer"
        >
            <!-- Status Column -->
            <template #item-status="{ row }">
                <span :class="['badge', row.status === '1' ? 'bg-success' : 'bg-secondary']">
                    {{ row.status === '1' ? 'Active' : 'Inactive' }}
                </span>
            </template>

            <!-- Actions Column -->
            <template #actions="{ row }">
                <div class="d-flex justify-content-start gap-3">
                    <router-link :to="`/app`" title="View">
                        <FontAwesomeIcon :icon="['fas', 'fa-eye']" class="text-success"/>
                    </router-link>
                    <router-link :to="`/app`" title="Edit">
                        <FontAwesomeIcon :icon="['fas', 'fa-pen-to-square']" />
                    </router-link>
                </div>
            </template>
        </vue3-datatable>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import Vue3Datatable from '@bhplugin/vue3-datatable';
import '@bhplugin/vue3-datatable/dist/style.css';
import axios from 'axios';
import { API_URL } from '@/config/path.js';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const loading = ref(true);
const rows = ref([]);
const total_rows = ref(0);

const params = reactive({
    current_page: 1,
    pagesize: 10,
    search: '',
    sort_column: 'username',
    sort_direction: 'asc',
});

const cols = ref([
    { field: 'index', title: 'SL No', isUnique: true },
    { field: 'username', title: 'Username', sortable: true },
    { field: 'fullName', title: 'Full Name', sortable: true },
    { field: 'email', title: 'Email', sortable: true },
    { field: 'contactNo', title: 'Contact Number', sortable: true },
    { field: 'status', title: 'Status', sortable: true },
    { field: 'actions', title: 'Actions', sortable: false },
]);

const getUsers = async () => {
    loading.value = true;
    try {
        const response = await axios.get(`${API_URL}/users/profile/list`, {
            params: {
                page: params.current_page,
                limit: params.pagesize,
                search: params.search,
                sort_column: params.sort_column,
                sort_direction: params.sort_direction,
            },
        });

        const { data, pagination } = response.data;
        rows.value = data.map((user, idx) => ({
            ...user,
            index: (params.current_page - 1) * params.pagesize + idx + 1,
        }));
        total_rows.value = pagination?.total || 0;
    } catch (error) {
        console.error('Failed to fetch users:', error);
    } finally {
        loading.value = false;
    }
};

const changeServer = (data) => {
    params.current_page = data.current_page;
    params.pagesize = data.pagesize;
    params.sort_column = data.sort_column;
    params.sort_direction = data.sort_direction;
    getUsers();
};

let searchTimer = null;
const debouncedSearch = () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        params.current_page = 1;
        getUsers();
    }, 300);
};

onMounted(() => {
    getUsers();
});
</script>

<style scoped>
th.sortable {
    position: relative;
    cursor: pointer;
}

th.sortable::after {
    font-family: "Font Awesome 5 Free";
    font-weight: 900;
    content: "\f0dc";
    position: absolute;
    right: 8px;
    color: #5266ec;
}

th.sortable.asc::after {
    content: "\f0d8";
}

th.sortable.desc::after {
    content: "\f0d7";
}

th.sortable:hover::after {
    color: #5266ec;
}

.icon-hv {
    font-size: 20px;
    transition: font-size 0.3s ease;
}

.icon-hv:hover {
    font-size: 25px;
}
</style>

<template>
    <div class="card p-4">
        <!-- Search Input -->
        <div class="row  pt-3">
            <span class="col-lg-4 mb-3">
                <router-link to="/app/users/add">
                    <button class="btn btn-primary">
                        <FontAwesomeIcon :icon="['fas', 'fa-circle-plus']" class="me-2" /> Add New
                    </button></router-link>
            </span>
            <span class="col-lg-8">
                <div class="d-flex justify-content-end mb-2">
                    <div class="input-group" style="max-width: 350px">
                        <input class="form-control" type="text" v-model="params.search"
                            placeholder="Search Something.." @input="debouncedSearch" />
                      
                    </div>
                </div>
            </span>
        </div>

        <!-- Data Table -->
        <vue3-datatable :rows="rows" :columns="cols" :loading="loading" :sortable="true" :totalRows="total_rows"
            :isServerMode="true" :pageSize="params.pagesize" :sortColumn="params.sort_column"
            :sortDirection="params.sort_direction" @change="changeServer" />
    </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue';
import Vue3Datatable from '@bhplugin/vue3-datatable';
import '@bhplugin/vue3-datatable/dist/style.css';
import axios from 'axios';
import { API_URL } from '@/config/path.js';


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
]);

// Fetch data from server
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

// Handle datatable changes (pagination, sort)
const changeServer = (data) => {
    params.current_page = data.current_page;
    params.pagesize = data.pagesize;
    params.sort_column = data.sort_column;
    params.sort_direction = data.sort_direction;
    getUsers();
};

// Debounced search (300ms)
let searchTimer = null;
const debouncedSearch = () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        params.current_page = 1; // Reset to page 1 on new search
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
    /* Use the Font Awesome font family */
    font-weight: 900;
    /* Set the font weight for solid icons */
    content: "\f0dc";
    position: absolute;
    right: 8px;
    color: #5266ec;
}

th.sortable.asc::after {
    content: "\f0d8";
    /* Upward pointing arrow for ascending order */
}

th.sortable.desc::after {
    content: "\f0d7";
    /* Downward pointing arrow for descending order */
}

th.sortable:hover::after {
    color: #5266ec;
}

.responsive-text {
    white-space: nowrap;
    /* Prevent text from wrapping to the next line */
    overflow: hidden;
    /* Hide overflowing content */
    text-overflow: ellipsis;
    /* Display an ellipsis for overflowed text */
    max-width: 150px;
}

.scroll {
    max-height: 200px;
    overflow-y: auto;
}

.action-column {
    position: relative;
    /* Set position to relative */
}

.icon-hv {
    font-size: 20px;
    transition: font-size 0.3s ease;
    /* Smooth transition animation */

    transform: translate(-50%, -50%);
    /* Center the icon */
}

.icon-hv:hover {
    font-size: 25px;
}
</style>
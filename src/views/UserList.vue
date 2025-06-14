<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useForm } from 'vee-validate';
import BaseInput from '@/components/common/BaseInput.vue';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const { users, loading, error } = storeToRefs(userStore);

// Form validation setup
const { handleSubmit, resetForm, errors } = useForm({
    validationSchema: {
        name: 'required|min:3',
        email: 'required|email',
        role: 'required'
    }
});

const formData = ref({
    name: '',
    email: '',
    role: ''
});

const onSubmit = handleSubmit(async (values) => {
    try {
        // Log the validated form data
        console.log('Form Validation Successful!');
        console.log('Form Payload:', {
            name: values.name,
            email: values.email,
            role: values.role
        });

        // Uncomment the following lines when ready to actually create the user
        // await userStore.createUser(values);
        // resetForm();
        // formData.value = {
        //   name: '',
        //   email: '',
        //   role: ''
        // };
    } catch (err) {
        console.error('Error creating user:', err);
    }
});

onMounted(() => {
    userStore.fetchUsers();
});
</script>

<template>
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold mb-6">User Management</h1>

        <!-- Add User Form -->
        <form @submit.prevent="onSubmit" class="mb-8 bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-semibold mb-4">Add New User</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <BaseInput v-model="formData.name" name="name" label="Name" placeholder="Enter user name"
                    :error="errors.name" />

                <BaseInput v-model="formData.email" name="email" label="Email" type="email"
                    placeholder="Enter email address" :error="errors.email" />

                <BaseInput v-model="formData.role" name="role" label="Role" placeholder="Enter user role"
                    :error="errors.role" />
            </div>

            <div class="mt-4">
                <button type="submit"
                    class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    :disabled="loading">
                    {{ loading ? 'Adding...' : 'Add User' }}
                </button>
            </div>
        </form>

        <!-- Users List -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-6">
                <h2 class="text-xl font-semibold mb-4">Users List</h2>

                <div v-if="loading" class="text-center py-4">
                    Loading...
                </div>

                <div v-else-if="error" class="text-red-500 text-center py-4">
                    {{ error }}
                </div>

                <div v-else-if="users.length === 0" class="text-center py-4 text-gray-500">
                    No users found
                </div>

                <div v-else class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="user in users" :key="user.id">
                                <td class="px-6 py-4 whitespace-nowrap">{{ user.name }}</td>
                                <td class="px-6 py-4 whitespace-nowrap">{{ user.email }}</td>
                                <td class="px-6 py-4 whitespace-nowrap">{{ user.role }}</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <button @click="userStore.deleteUser(user.id)"
                                        class="text-red-500 hover:text-red-700">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<template>
  <div>
    <!-- Skeleton Loader -->
    <div v-if="loading" class="card p-4">
      <div class="d-flex align-items-center mb-4">
        <div class="placeholder rounded-circle me-3" style="width: 80px; height: 80px;"></div>
        <div class="w-100">
          <div class="placeholder col-6 mb-2"></div>
          <div class="placeholder col-4"></div>
        </div>
      </div>
      <div class="placeholder-glow">
        <div class="placeholder col-12 mb-2"></div>
        <div class="placeholder col-10 mb-2"></div>
        <div class="placeholder col-8 mb-2"></div>
        <div class="placeholder col-6"></div>
      </div>
    </div>

    <!-- Main Profile Content -->
    <div v-else>
      <!-- Profile Card -->
      <div class="row">
        <div class="col-lg-12">
          <div class="card position-relative">
            <!-- Status Badge -->
            <span class="position-absolute top-0 end-0 m-3 badge rounded-pill"
              :class="userdata.status === 1 ? 'bg-success' : 'bg-danger'">
              {{ userdata.status === 1 ? 'Active' : 'Inactive' }}
            </span>

            <div class="card-body">
              <div class="d-flex flex-wrap align-items-center">
                <!-- Avatar -->
                <div class="profile-img position-relative me-3 mb-3 mb-lg-0 profile-logo profile-logo1">
                  <img src="/assets/images/avatars/01.png" alt="User-Profile"
                    class="theme-color-default-img img-fluid rounded-pill avatar-100">
                    <img src="/assets/images/avatars/avtar_1.png" alt="User-Profile"
                      class="theme-color-purple-img img-fluid rounded-pill avatar-100">
                  <img src="/assets/images/avatars/avtar_2.png" alt="User-Profile"
                    class="theme-color-blue-img img-fluid rounded-pill avatar-100">
                    <img src="/assets/images/avatars/avtar_3.png" alt="User-Profile"
                      class="theme-color-pink-img img-fluid rounded-pill avatar-100">
                  <img src="/assets/images/avatars/avtar_4.png" alt="User-Profile"
                    class="theme-color-green-img img-fluid rounded-pill avatar-100">
                  <img src="/assets/images/avatars/avtar_5.png" alt="User-Profile"
                  class="theme-color-yellow-img img-fluid rounded-pill avatar-100">
                </div>
                <!-- User Info -->
                <div class="mb-3 mb-sm-0">
                  <h4 class="me-2">{{ userdata.fullName }}</h4>
                  <span v-for="role in roles" :key="role" class="me-1">{{ role }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs Section -->
      <div class="card p-3 mt-2">
        <div class="bd-example">
          <nav>
            <div class="nav nav-tabs mb-3" id="nav-tab" role="tablist">
              <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home"
                type="button" role="tab" aria-controls="nav-home" aria-selected="true">Personal Info</button>
              <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile"
                type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Contact Info</button>
              <button class="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact"
                type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Permissions</button>
            </div>
          </nav>

          <div class="tab-content" id="nav-tabContent">
            <!-- Personal Info Tab -->
            <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
              <div class="row">
                <div class="col-md-6 mb-3"><strong>Full Name:</strong>
                  <div>{{ userdata.fullName }}</div>
                </div>
                <div class="col-md-6 mb-3"><strong>Age:</strong>
                  <div>{{ age }} years</div>
                </div>
                <div class="col-md-6 mb-3"><strong>Gender:</strong>
                  <div>{{ userdata.gender }}</div>
                </div>
                <div class="col-md-6 mb-3"><strong>Marital Status:</strong>
                  <div>{{ userdata.maritalStatus }}</div>
                </div>
                <div class="col-md-6 mb-3"><strong>Aadhar Card:</strong>
                  <div>{{ userdata.aadharNo }}</div>
                </div>
                <div class="col-md-6 mb-3"><strong>Date of Birth:</strong>
                  <div>{{ formatDate(userdata.dobRaw) }}</div>
                </div>
              </div>
            </div>

            <!-- Contact Info Tab -->
            <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
              <div class="row">
                <div class="col-md-6 mb-3"><strong>Email:</strong>
                  <div>{{ userdata.email }}</div>
                </div>
                <div class="col-md-6 mb-3"><strong>Auth Status:</strong>
                  <div class="text-success">Verified</div>
                </div>
                <div class="col-md-6 mb-3"><strong>Contact No:</strong>
                  <div>{{ userdata.contactNo }}</div>
                </div>
                <div class="col-md-6 mb-3"><strong>Alternate No:</strong>
                  <div>{{ userdata.altNo }}</div>
                </div>
                <div class="col-md-6 mb-3"><strong>Present Address:</strong>
                  <div>{{ userdata.presentAddress }}</div>
                </div>
                <div class="col-md-6 mb-3"><strong>Permanent Address:</strong>
                  <div>{{ userdata.permanentAddress }}</div>
                </div>
              </div>
            </div>

            <!-- Permissions Tab -->
            <div class="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">
              <div class="row">
                <div class="col-12 mb-3">
                  <h5 class="mb-3">Permissions</h5>
                  <div class="d-flex flex-wrap gap-3">
                    <span v-for="(perm, index) in permissions" :key="index"
                      class="badge bg-primary text-capitalize px-3 py-2">
                      {{ formatPermission(perm) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs';
import axios from 'axios';
import { API_URL } from '@/config/path.js';
import { ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const userid = route.params.id;

const loading = ref(true);
const roles = ref([]);
const permissions = ref([]);
const age = ref(null);

const userdata = reactive({
  username: '',
  email: '',
  fullName: '',
  gender: '',
  dob: '',
  dobRaw: '',
  maritalStatus: '',
  profilePic: '',
  aadharNo: '',
  contactNo: '',
  altNo: '',
  presentAddress: '',
  permanentAddress: '',
  status: ''
});

const formatDate = (dob) => {
  return dob ? dayjs(dob).format('DD MMMM YYYY') : '-';
};

const formatPermission = (perm) => {
  if (!perm || !perm.name) return '-';
  return perm.name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const fatchUser = async () => {
  loading.value = true;
  try {
    if (userid) {
      const response = await axios.get(`${API_URL}/users/Details/${userid}`);
      if (response.status === 200) {
        const data = response.data;
        userdata.username = data.username;
        userdata.email = data.email;
        userdata.fullName = data.fullName;
        userdata.gender = data.gender;
        userdata.dobRaw = data.dob;
        userdata.maritalStatus = data.maritalStatus;
        userdata.aadharNo = data.aadharNo;
        userdata.contactNo = data.contactNo;
        userdata.altNo = data.altNo;
        userdata.presentAddress = data.presentAddress;
        userdata.permanentAddress = data.permanentAddress;
        userdata.status = data.status;
        roles.value = data.roleNames;
        permissions.value = data.permissions;
        age.value = calculateAge(data.dob);
      }
    }
  } catch (error) {
    console.error('Fetch error:', error);
  } finally {
    loading.value = false;
  }
};

const calculateAge = (dob) => {
  if (!dob) return '-';
  const birthDate = dayjs(dob);
  const today = dayjs();
  return today.diff(birthDate, 'year');
};

onMounted(() => {
  fatchUser();
});
</script>

<style scoped>
.placeholder {
  background-color: #dee2e6;
}
</style>

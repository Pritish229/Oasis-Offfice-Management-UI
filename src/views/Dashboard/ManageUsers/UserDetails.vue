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


            <div class="card-body">
              <div class="">
                <!-- Avatar -->
                <div class="d-flex flex-wrap align-items-center">
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
                    <small class="position-absolute  responsive-badge  badge rounded-pill"
                      style="top: 7.5rem; right: 2rem;" :class="userdata.status === 1 ? 'bg-success' : 'bg-danger'">
                      {{ userdata.status === 1 ? 'Active' : 'Inactive' }}
                  </small>
                  </div>


                  <!-- User Info -->
                  <div class=" mt-mb-5 pt-6 ">
                    <h4 class="me-2">{{ userdata.fullName }}</h4>
                    <span v-for="role in roles" :key="role" class="me-1">{{ role }}</span>
                  </div>
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
                type="button" role="tab" aria-controls="nav-home" aria-selected="true">User Details</button>
              <button v-if="auth.hasPermission('manage-user-document')" class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile"
                type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Documents</button>
              <button class="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact"
                type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Attendance</button>
            </div>
          </nav>

          <div class="tab-content" id="nav-tabContent">
            <!-- Personal Info Tab -->
            <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
              <h4>Personal Details</h4>
              <hr style="border-top: 1px solid black;">
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
              <h4>Contact Details</h4>
              <hr style="border-top: 1px solid black;">
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

            <!-- Documents Tab -->
            <div v-if="auth.hasPermission('manage-user-document')" class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
              <h5>Documents</h5>
              <div v-if="docLoading" class="text-center my-4">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
              <div v-else>
                <div v-if="documents && documents.length > 0">
                  <div class="table-responsive">
                    <table class="table table-bordered align-middle">
                      <thead>
                        <tr>
                          <th style="width: 80px;">SL NO.</th>
                          <th>Document Name</th>
                          <th style="width: 140px;">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(doc, idx) in documents" :key="doc._id">
                          <td>{{ idx + 1 }}</td>
                          <td>{{ doc.docType }}</td>
                          <td>
                            <a :href="getDocumentUrl(doc.docUrl)" target="_blank" rel="noopener noreferrer" title="View" class="me-2">
                              <FontAwesomeIcon :icon="['fas', 'eye']" />
                            </a>
                            <button @click="openUpdateModal(doc)" title="Edit" class="btn p-0 me-2">
                              <FontAwesomeIcon :icon="['fas', 'pen-to-square']" />
                            </button>
                            <button @click="deleteDocument(doc._id)" title="Delete" class="btn p-0">
                              <FontAwesomeIcon :icon="['fas', 'trash']" />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div v-else class="text-center text-muted my-4">
                  <div>No documents available</div>
                </div>
                <div class="text-center mt-3" v-if="documents.length < 5">
                  <button class="btn btn-primary" @click="openUploadModal">Upload Document</button>
                </div>
              </div>
            </div>

            <!-- Permissions Tab -->
            <div class="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">
              <div class="row">
                <div class="col-12 mb-3">
                  <h5 class="mb-3">Attendance</h5>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Always render the upload modal so the ref is set -->
      <BaseModal ref="uploadModalRef" title="Upload Document" :onSubmit="handleUpload" @close="closeUploadModal">
        <DocumentUpload
          :docTypeOptions="docTypeOptions"
          :docType="selectedDocType"
          :existingFileUrl="existingFileUrl"
          @change="onDocumentUploadChange"
        />
      </BaseModal>
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs';
import axios from 'axios';
import { API_URL } from '@/config/path.js';
import { ref, reactive, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import BaseModal from '@/components/CONTROLS/BaseModal.vue';
import DocumentUpload from '@/components/CONTROLS/DocumentUpload.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Swal from 'sweetalert2';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const userid = route.params.id;

const loading = ref(true);
const roles = ref([]);
const permissions = ref([]);
const age = ref(null);
const docLoading = ref(false);
const documents = ref([]);
const showUploadModal = ref(false);
const uploadModalRef = ref(null);
const isUpdateMode = ref(false);
const selectedDocType = ref('');
const fileToUpload = ref(null);
const existingFileUrl = ref('');
const fileRemoved = ref(false);
let updateDocId = null;

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

const auth = useAuthStore();

const formatDate = (dob) => {
  return dob ? dayjs(dob).format('DD MMMM YYYY') : '-';
};

const docTypeOptions = [
  { value: "Aadhar Card", label: "Aadhar Card" },
  { value: "PAN Card", label: "PAN Card" },
  { value: "Driving Licence", label: "Driving Licence" },
  { value: "Bank Account Details", label: "Bank Account Details" },
  { value: "Other Document", label: "Other Document" }
];

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

const fetchDocuments = async () => {
  docLoading.value = true;
  try {
    const { data } = await axios.get(`${API_URL}/documents`, {
      params: { userId: userid }
    });
    documents.value = data;
  } catch (err) {
    documents.value = [];
  } finally {
    docLoading.value = false;
  }
};

const openUploadModal = () => {
  isUpdateMode.value = false;
  selectedDocType.value = '';
  fileToUpload.value = null;
  existingFileUrl.value = '';
  showUploadModal.value = true;
  fileRemoved.value = false;
  nextTick(() => {
    uploadModalRef.value?.show();
  });
};

const closeUploadModal = () => {
  uploadModalRef.value?.hide();
  showUploadModal.value = false;
  isUpdateMode.value = false;
  selectedDocType.value = '';
  fileToUpload.value = null;
  existingFileUrl.value = '';
  updateDocId = null;
};

const onDocumentUploadChange = ({ file, docType, removeExisting }) => {
  fileToUpload.value = file;
  selectedDocType.value = docType;
  if (removeExisting) {
    existingFileUrl.value = '';
    fileRemoved.value = true;
  }
};

const handleUpload = async () => {
  if (!selectedDocType.value || !fileToUpload.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Missing Information',
      text: 'Please select a document type and upload a PDF file.',
    });
    return;
  }
  const formData = new FormData();
  formData.append('userId', userid);
  formData.append('docType', selectedDocType.value);
  formData.append('docUrl', fileToUpload.value);
  if (fileRemoved.value) {
    formData.append('removeExisting', 'true');
  }

  try {
    if (isUpdateMode.value && updateDocId) {
      // Update existing document
      await axios.put(`${API_URL}/documents/${updateDocId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      Swal.fire({
        icon: 'success',
        title: 'Document Updated',
        text: 'Document updated successfully.',
      });
    } else {
      // Upload new document
      await axios.post(`${API_URL}/documents/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      Swal.fire({
        icon: 'success',
        title: 'Document Uploaded',
        text: 'Document uploaded successfully.',
      });
    }
    closeUploadModal();
    fetchDocuments();
    fileRemoved.value = false;
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: isUpdateMode.value ? 'Update Failed' : 'Upload Failed',
      text: 'Failed to ' + (isUpdateMode.value ? 'update' : 'upload') + ' document.',
    });
  }
};

const getDocumentUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads') || url.startsWith('uploads')) {
    const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
    return `${API_URL}/${cleanUrl}`;
  }
  return `${API_URL}/${url.replace(/^\//, '')}`;
};

const openUpdateModal = (doc) => {
  isUpdateMode.value = true;
  selectedDocType.value = doc.docType;
  existingFileUrl.value = doc.docUrl;
  fileToUpload.value = null;
  updateDocId = doc._id;
  fileRemoved.value = false;
  nextTick(() => {
    uploadModalRef.value?.show();
  });
};

const deleteDocument = async (docId) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'Are you sure you want to delete this document?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  });
  if (!result.isConfirmed) return;
  try {
    await axios.delete(`${API_URL}/documents/${docId}`);
    fetchDocuments();
    Swal.fire({
      icon: 'success',
      title: 'Deleted!',
      text: 'Document deleted successfully.',
    });
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Delete Failed',
      text: 'Failed to delete document.',
    });
  }
};

onMounted(() => {
  fatchUser();
  fetchDocuments();
});
</script>

<style scoped>

.responsive-badge {
    top: 7.7rem;
    right: 2rem;
  }
@media (max-width: 767px) {

  .responsive-badge {
    top: 6.9rem !important;
    right: 1.6rem !important;
  }

}
</style>

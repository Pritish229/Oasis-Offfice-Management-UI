<template>
  <Form
    :initial-values="auth.user"
    @submit="onSubmit"
    enctype="multipart/form-data"
  >
        <div class="card p-4">
            <div class="row">
                <div class="col-lg-6">
                    <h5>Personal info</h5>
                    <hr style="border-top: 1px solid black" />
          <BASEINPUT name="fullName" label="Full Name" :is_required="true" placeholder="Enter Fullname" />
          <BASESELECT name="gender" label="Gender" :is_required="true" :options="genderOptions" />
          <BaseDatePicker name="dob" label="Date of Birth" placeholder="Select your date of birth" />
          <BASESELECT name="maritalStatus" label="Marital Status" :is_required="true" :options="maritalOptions" />
          <BASEINPUT name="aadharNo" label="Aadhar Number" :is_required="true" placeholder="Enter Aadhaar Number" />
          <BASEINPUT name="contactNo" label="Contact Number" :is_required="true" placeholder="Enter Contact No" />
          <BASEINPUT name="altNo" label="Alternate Number" placeholder="Enter Alternate No" />
                </div>
                <div class="col-lg-6">
                    <h5>Address info</h5>
                    <hr style="border-top: 1px solid black" />
                    <CropUpload v-model="imageFile" cropType="round" label="Profile image"
                        halpertext="Maximum upload size 2MB" :customAspectRatio="1.5" :width="'100%'" :height="'255px'"
                        :imageUrl="imagePreview" @update:imageUrl="imagePreview = $event" />
          <BaseTextArea name="presentAddress" placeholder="Enter Address" label="Present Address" :is_required="true" />
          <BaseTextArea name="permanentAddress" placeholder="Enter Address" label="Permanent Address" />
                </div>
                <div class="col-lg-12">
                     <button class="btn btn-primary mt-3" type="submit" :disabled="isSubmitting">
                        {{ isSubmitting ? 'Saving...' : 'Save' }}
                    </button>
                </div>
      </div>
    </div>
  </Form>

  <!-- User Details & Documents Tabs -->
  <div class="card p-3 mt-2">
    <div class="bd-example">
      <nav>
        <div class="nav nav-tabs mb-3" id="nav-tab" role="tablist">
          <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">User Details</button>
          <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Documents</button>
        </div>
      </nav>
      <div class="tab-content" id="nav-tabContent">
        <!-- User Details Tab -->
        <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
          <h4>Personal Details</h4>
          <hr style="border-top: 1px solid black;">
          <div class="row">
            <div class="col-md-6 mb-3"><strong>Full Name:</strong>
              <div>{{ auth.user.fullName }}</div>
            </div>
            <div class="col-md-6 mb-3"><strong>Age:</strong>
              <div>{{ age }} years</div>
            </div>
            <div class="col-md-6 mb-3"><strong>Gender:</strong>
              <div>{{ auth.user.gender }}</div>
            </div>
            <div class="col-md-6 mb-3"><strong>Marital Status:</strong>
              <div>{{ auth.user.maritalStatus }}</div>
            </div>
            <div class="col-md-6 mb-3"><strong>Aadhar Card:</strong>
              <div>{{ auth.user.aadharNo }}</div>
            </div>
            <div class="col-md-6 mb-3"><strong>Date of Birth:</strong>
              <div>{{ formatDate(auth.user.dob) }}</div>
            </div>
        </div>
          <h4>Contact Details</h4>
          <hr style="border-top: 1px solid black;">
            <div class="row">
            <div class="col-md-6 mb-3"><strong>Email:</strong>
              <div>{{ auth.user.email }}</div>
            </div>
            <div class="col-md-6 mb-3"><strong>Auth Status:</strong>
              <div class="text-success">Verified</div>
            </div>
            <div class="col-md-6 mb-3"><strong>Contact No:</strong>
              <div>{{ auth.user.contactNo }}</div>
            </div>
            <div class="col-md-6 mb-3"><strong>Alternate No:</strong>
              <div>{{ auth.user.altNo }}</div>
            </div>
            <div class="col-md-6 mb-3"><strong>Present Address:</strong>
              <div>{{ auth.user.presentAddress }}</div>
            </div>
            <div class="col-md-6 mb-3"><strong>Permanent Address:</strong>
              <div>{{ auth.user.permanentAddress }}</div>
            </div>
          </div>
        </div>
        <!-- Documents Tab -->
        <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
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
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div v-else class="text-center text-muted my-4">
              <div>No documents available</div>
            </div>
            <div class="text-center mt-3" v-if="documents.length < 5 && auth.hasPermission('add-document')">
              <button class="btn btn-primary" @click="openUploadModal">Upload Document</button>
            </div>
          </div>
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
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { ref, onMounted, watch, nextTick } from "vue";
import { Form } from 'vee-validate'
import Swal from 'sweetalert2'
import axios from 'axios'
import dayjs from 'dayjs'
import { API_URL } from '@/config/path'
import BASEINPUT from "@/components/Controls/BASEINPUT.vue";
import BaseTextArea from '@/components/Controls/BASETEXTAREA.vue'
import BaseDatePicker from '@/components/Controls/BaseDatePicker.vue'
import CropUpload from "@/components/Controls/CropUpload.vue";
import BASESELECT from "@/components/Controls/BASESELECT.vue";
import BaseModal from '@/components/CONTROLS/BaseModal.vue';
import DocumentUpload from '@/components/CONTROLS/DocumentUpload.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const auth = useAuthStore();
const isSubmitting = ref(false);
const imageFile = ref(null);
const imagePreview = ref(auth.user?.profilePic || null);

const genderOptions = ["Male", "Female", "Other"].map(v => ({ value: v, label: v }));
const maritalOptions = ["Single", "Married", "Divorced", "Widowed"].map(v => ({ value: v, label: v }));

const age = ref('-');
const formatDate = (dob) => dob ? dayjs(dob).format('DD MMMM YYYY') : '-';
const calculateAge = (dob) => {
  if (!dob) return '-';
  const birthDate = dayjs(dob);
  const today = dayjs();
  return today.diff(birthDate, 'year');
};

const docTypeOptions = [
  { value: "Aadhar Card", label: "Aadhar Card" },
  { value: "PAN Card", label: "PAN Card" },
  { value: "Driving Licence", label: "Driving Licence" },
  { value: "Bank Account Details", label: "Bank Account Details" },
  { value: "Other Document", label: "Other Document" }
];

const docLoading = ref(false);
const documents = ref([]);
const showUploadModal = ref(false);
const uploadModalRef = ref(null);
const selectedDocType = ref('');
const fileToUpload = ref(null);
const existingFileUrl = ref('');

onMounted(async () => {
  await auth.fetchProfile(); // Always fetch the latest profile from the backend
  if (auth.user) {
    age.value = calculateAge(auth.user.dob);
    imagePreview.value = auth.user.profilePic || null;
  }
  fetchDocuments();
});

watch(() => auth.user, (newUser) => {
  if (newUser) {
    age.value = calculateAge(newUser.dob);
    imagePreview.value = newUser.profilePic || null;
  }
});

const onSubmit = async (values) => {
  isSubmitting.value = true;
  try {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        key !== 'roles' &&
        key !== 'permissions' &&
        key !== 'status' &&
        key !== 'createdAt' &&
        key !== 'updatedAt' &&
        key !== '__v' &&
        key !== '_id' &&
        key !== 'username' &&
        key !== 'email'
      ) {
        formData.append(key, value);
      }
    });
    if (imageFile.value instanceof File) {
      formData.append('profilePic', imageFile.value);
    }
    await axios.put(`${API_URL}/users/profile/update/${auth.user._id}`, formData, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    await auth.fetchProfile();
    Swal.fire('Success', 'Profile updated!', 'success');
  } catch (err) {
    console.error('Profile update error:', err, err?.response);
    Swal.fire('Error', err.response?.data?.message || 'Update failed', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const fetchDocuments = async () => {
  docLoading.value = true;
  try {
    const { data } = await axios.get(`${API_URL}/profile-documents/my-documents`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    documents.value = data;
  } catch (err) {
    documents.value = [];
  } finally {
    docLoading.value = false;
  }
};

const openUploadModal = () => {
  selectedDocType.value = '';
  fileToUpload.value = null;
  existingFileUrl.value = '';
  showUploadModal.value = true;
  nextTick(() => {
    uploadModalRef.value?.show();
  });
};

const closeUploadModal = () => {
  uploadModalRef.value?.hide();
  showUploadModal.value = false;
  selectedDocType.value = '';
  fileToUpload.value = null;
  existingFileUrl.value = '';
};

const onDocumentUploadChange = ({ file, docType }) => {
  fileToUpload.value = file;
  selectedDocType.value = docType;
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
  formData.append('docType', selectedDocType.value);
  formData.append('docUrl', fileToUpload.value);
  try {
    await axios.post(`${API_URL}/profile-documents/my-documents/upload`, formData, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    closeUploadModal();
    fetchDocuments();
    Swal.fire({
      icon: 'success',
      title: 'Document Uploaded',
      text: 'Document uploaded successfully.',
    });
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Upload Failed',
      text: 'Failed to upload document.',
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
</script>
<template>
  <form @submit="onSubmit" enctype="multipart/form-data">
    <div class="card p-4">
      <div class="row">
        <div class="col-lg-6">
          <h5>Personal info</h5>
          <hr style="border-top: 1px solid black" />
          <BASEINPUT name="fullName" label="Full Name" :component="BASEINPUT" :is_required="true"
            placeholder="Enter Fullname" />
          <BASESELECT name="gender" label="Gender" :component="BASESELECT" :is_required="true"
            :options="genderOptions" />
          <BaseDatePicker name="dob" label="Date of Birth" :component="BaseDatePicker"
            placeholder="Select your date of birth" />
          <BASESELECT name="maritalStatus" label="Marital Status" :component="BASESELECT" :is_required="true"
            :options="maritalOptions" />
          <BASEINPUT name="aadharNo" label="Aadhar Number" :component="BASEINPUT" :is_required="true"
            placeholder="Enter Aadhaar Number" />
        </div>
        <div class="col-lg-6">
          <h5>Address info</h5>
          <hr style="border-top: 1px solid black" />
          <BASEINPUT name="contactNo" label="Contact Number" :component="BASEINPUT" :is_required="true"
            placeholder="Enter Contact No" />
          <BASEINPUT name="altNo" label="Alternate Number" :component="BASEINPUT" placeholder="Enter Alternate No" />
          <BaseTextArea name="presentAddress" label="Present Address" :component="BaseTextArea" :is_required="true" />
          <BaseTextArea name="permanentAddress" label="Permanent Address" :component="BaseTextArea" />
        </div>
      </div>
    </div>

    <div class="card p-4">
      <h5>Auth info</h5>
      <hr style="border-top: 1px solid black" />
      <div class="row">
        <div class="col-lg-6" v-if="auth.hasPermission('manage-users') || auth.hasPermission('update-users')">
          <div class="mb-2">
            <label class="form-label">Username</label>
            <div class="form-control disabled">
              {{ username }}
            </div>
          </div>
          <BASEINPUT name="email" label="Email" :component="BASEINPUT" type="email" :is_required="true"
            placeholder="Enter Email" />
          <BASEINPUT name="password" label="Password" :component="BASEINPUT" type="text" :is_required="true"
            placeholder="Enter Password" />
          <BASESELECT name="status" label="Status" :component="BASESELECT" :is_required="true" :options="statusopion" />
          <button class="btn btn-primary mt-3" type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Saving...' : 'Save' }}
          </button>
        </div>
        <div class="col-lg-6 pt-1">
          <CropUpload v-model="imageFile" cropType="round" label="Profile image" halpertext="Maximum upload size 2MB"
            :customAspectRatio="1.5" :width="'100%'" :height="'265px'" :imageUrl="imagePreview"
            @update:imageUrl="imagePreview = $event" />
        </div>
      </div>
    </div>
  </form>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useForm } from "vee-validate";
import * as yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import { API_URL } from "@/config/path";
import { useAuthStore } from "@/stores/auth";

import BASEINPUT from "@/components/Controls/BASEINPUT.vue";
import BASESELECT from "@/components/Controls/BASESELECT.vue";
import BaseTextArea from "@/components/Controls/BASETEXTAREA.vue";
import BaseDatePicker from "@/components/Controls/BaseDatePicker.vue";
import CropUpload from "@/components/Controls/CropUpload.vue";

const auth = useAuthStore();
const route = useRoute();
const userid = route.params.id;

const imageFile = ref(null);
const imagePreview = ref(null);
const username = ref("");
const isSubmitting = ref(false);

const genderOptions = ["Male", "Female", "Other"].map(v => ({ value: v, label: v }));
const maritalOptions = ["Single", "Married", "Divorced", "Widowed"].map(v => ({ value: v, label: v }));
const statusopion = [{ value: 1, label: "Active" }, { value: 0, label: "Inactive" }];

const schema = yup.object({
  fullName: yup.string().required(),
  gender: yup.string().required(),
  dob: yup.date().required(),
  maritalStatus: yup.string().required(),
  aadharNo: yup.string().required().matches(/^\d{12}$/, "12 digits required."),
  contactNo: yup.string().required().matches(/^\d{10}$/, "10 digits required."),
  altNo: yup.string().nullable().matches(/^\d{10}$/, "10 digits required.").notRequired(),
  presentAddress: yup.string().required(),
  permanentAddress: yup.string().nullable(),
  username: yup.string().nullable(),
  email: yup.string().email().nullable(),
  password: yup.string().nullable(),
  status: yup.number().nullable(),
});

const { resetForm, handleSubmit } = useForm({ validationSchema: schema });

onMounted(async () => {
  if (!userid) return;

  try {
    const { data } = await axios.get(`${API_URL}/users/Details/${userid}`);
    if (!data) throw new Error("User not found");

    username.value = data.username;
    resetForm({
      values: {
        fullName: data.fullName || "",
        gender: data.gender || "",
        dob: data.dob ? new Date(data.dob) : "",
        maritalStatus: data.maritalStatus || "",
        aadharNo: data.aadharNo || "",
        contactNo: data.contactNo || "",
        altNo: data.altNo || "",
        presentAddress: data.presentAddress || "",
        permanentAddress: data.permanentAddress || "",
        username: data.username || "",
        email: data.email || "",
        status: data.status ?? "0",
        password: "",
      },
    });

    imagePreview.value = data.profilePic || null;

  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: err.response?.data?.message || err.message || "Failed to load user",
      confirmButtonColor: "#d33",
    });
  }
});

const onSubmit = handleSubmit(async (values) => {
  const formData = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  if (imageFile.value) {
    if (imageFile.value.size > 2 * 1024 * 1024) {
      return Swal.fire({
        icon: "error",
        title: "Image Too Large",
        text: "Maximum upload size is 2MB.",
        confirmButtonColor: "#d33",
      });
    }
    formData.append("profilePic", imageFile.value);
  }

  try {
    isSubmitting.value = true;
    const { status } = await axios.put(`${API_URL}/users/profile/update/${userid}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (status === 200) {
      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Profile details updated successfully",
      });
    }
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Update Failed",
      text: err.response?.data?.message || "Something went wrong.",
    });
  } finally {
    isSubmitting.value = false;
  }
});
</script>

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


                    <BASEINPUT name="contactNo" label="Contact Number" :component="BASEINPUT" :is_required="true"
                        placeholder="Enter Contact No" />
                    <BASEINPUT name="altNo" label="Alternate Number" :component="BASEINPUT"
                        placeholder="Enter Alternate No" />
                </div>
                <div class="col-lg-6">
                    <h5>Address info</h5>
                    <hr style="border-top: 1px solid black" />

                    <CropUpload v-model="imageFile" cropType="round" label="Profile image"
                        halpertext="Maximum upload size 2MB" :customAspectRatio="1.5" :width="'100%'" :height="'255px'"
                        :imageUrl="imagePreview" @update:imageUrl="imagePreview = $event" />
                    <BaseTextArea name="presentAddress" placeholder="Enter Address" label="Present Address" :component="BaseTextArea"
                        :is_required="true" />
                    <BaseTextArea name="permanentAddress" placeholder="Enter Address" label="Permanent Address" :component="BaseTextArea" />

                </div>
                <div class="col-lg-12">
                     <button class="btn btn-primary mt-3" type="submit" :disabled="isSubmitting">
                        {{ isSubmitting ? 'Saving...' : 'Save' }}
                    </button>
                </div>

            </div>
        </div>

        
    </form>
</template>


<script setup>
import { useAuthStore } from '@/stores/auth'
import { onMounted, ref } from "vue";
import Swal from 'sweetalert2'
import axios from 'axios'
import dayjs from 'dayjs'
import { API_URL } from '@/config/path'
import BASEINPUT from "@/components/Controls/BASEINPUT.vue";
import BaseTextArea from '@/components/Controls/BASETEXTAREA.vue'
import DropdownMenu from '@/components/Controls/DropdownMenu.vue'
import BaseDatePicker from '@/components/Controls/BaseDatePicker.vue'
import CropUpload from "@/components/Controls/CropUpload.vue";
import BASESELECT from "@/components/Controls/BASESELECT.vue";

const auth = useAuthStore();
const isSubmitting = ref(false);
const imageFile = ref(null);
const imagePreview = ref(null);

const genderOptions = ["Male", "Female", "Other"].map(v => ({ value: v, label: v }));
const maritalOptions = ["Single", "Married", "Divorced", "Widowed"].map(v => ({ value: v, label: v }));
const statusopion = [{ value: 1, label: "Active" }, { value: 0, label: "Inactive" }];




</script>
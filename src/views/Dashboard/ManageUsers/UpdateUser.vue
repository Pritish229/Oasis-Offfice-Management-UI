<template>
  <form @submit="onSubmit">
    <div class="card p-4">
      <div class="row">
        <div class="col-lg-6">
          <h5>Personal info</h5>
          <hr />
          <BASEINPUT name="fullName" label="Full Name" :component="BASEINPUT" :is_required="true" placeholder="Enter Fullname" />
          <BASEINPUT name="gender" label="Gender" :component="BaseSelect" :is_required="true" :options="genderOptions" />
          <BASEINPUT name="dob" label="Date of Birth" :component="BaseDatePicker" placeholder="Select your date of birth" />
          <BASEINPUT name="maritalStatus" label="Marital Status" :component="BaseSelect" :is_required="true" :options="maritalOptions" />
          <BASEINPUT name="aadharNo" label="Aadhar Number" :component="BASEINPUT" :is_required="true" placeholder="Enter Aadhaar Number" />
        </div>
        <div class="col-lg-6">
          <h5>Address info</h5>
          <hr />
          <BASEINPUT name="contactNo" label="Contact Number" :component="BASEINPUT" :is_required="true" placeholder="Enter Contact No" />
          <BASEINPUT name="altNo" label="Alternate Number" :component="BASEINPUT" placeholder="Enter Alternate No" />
          <BASEINPUT name="presentAddress" label="Present Address" :component="BaseTextArea" :is_required="true" />
          <BASEINPUT name="permanentAddress" label="Permanent Address" :component="BaseTextArea" />
        </div>
      </div>
    </div>

    <div class="card p-4">
      <h5>Auth info</h5>
      <hr />
      <div class="row">
        <div class="col-lg-6">
          <BASEINPUT name="username" label="Username" :component="BASEINPUT" :is_required="true" placeholder="Enter Username" />
          <BASEINPUT name="email" label="Email" :component="BASEINPUT" type="email" :is_required="true" placeholder="Enter Email" />
          <BASEINPUT name="password" label="Password" :component="BASEINPUT" type="text" :is_required="true" placeholder="Enter Password" />
          <button class="btn btn-primary mt-3" type="submit">Save</button>
        </div>
        <div class="col-lg-6 pt-1">
          <CropUpload
            v-model="imageFile"
            cropType="round"
            label="Profile Picture"
            :customAspectRatio="1.5"
            :width="'100%'"
            :height="'200px'"
            :imageUrl="imagePreview"
            @update:imageUrl="imagePreview = $event"
          />
        </div>
      </div>
    </div>
  </form>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import axios from 'axios'
import { API_URL } from '@/config/path'
import BASEINPUT from '@/components/Controls/BASEINPUT.vue'
import BaseSelect from '@/components/Controls/BASESELECT.vue'
import BaseTextArea from '@/components/Controls/BASETEXTAREA.vue'
import BaseDatePicker from '@/components/Controls/BaseDatePicker.vue'
import CropUpload from '@/components/Controls/CropUpload.vue'

const route = useRoute()
const userid = route.params.id

const imageFile = ref(null)
const imagePreview = ref(null)

const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' }
]

const maritalOptions = [
  { value: 'Single', label: 'Single' },
  { value: 'Married', label: 'Married' },
  { value: 'Divorced', label: 'Divorced' },
  { value: 'Widowed', label: 'Widowed' }
]

const schema = yup.object({
  fullName: yup.string().required(),
  gender: yup.string().required(),
  dob: yup.date().required(),
  maritalStatus: yup.string().required(),
  aadharNo: yup.string().required().matches(/^\d{12}$/, 'Must be 12 digits'),
  contactNo: yup.string().required().matches(/^\d{10}$/, 'Must be 10 digits'),
  altNo: yup.string().nullable().matches(/^\d{10}$/, 'Must be 10 digits').notRequired(),
  presentAddress: yup.string().required(),
  permanentAddress: yup.string().nullable(),
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().nullable()
})

const { resetForm, handleSubmit } = useForm({ validationSchema: schema })

onMounted(async () => {
  if (!userid) return
  const { data } = await axios.get(`${API_URL}/users/Details/${userid}`)

  resetForm({
    values: {
      fullName: data.fullName || '',
      gender: data.gender || '',
      dob: data.dob ? new Date(data.dob) : '',
      maritalStatus: data.maritalStatus || '',
      aadharNo: data.aadharNo || '',
      contactNo: data.contactNo || '',
      altNo: data.altNo || '',
      presentAddress: data.presentAddress || '',
      permanentAddress: data.permanentAddress || '',
      username: data.username || '',
      email: data.email || '',
      password: ''
    }
  })

  if (data.profilePic) imagePreview.value = data.profilePic
})

const onSubmit = handleSubmit(values => {
  const payload = { ...values }
  if (imageFile.value) {
    payload.profileImage = imageFile.value
  }
  console.log('Submitted payload:', payload)
})
</script>

<template>
  <div class="card p-4">
    <!-- Step Tracker -->
    <div class="d-flex justify-content-between align-items-center mb-4 step-tracker">
      <div v-for="(label, index) in stepLabels" :key="index" class="step-item"
        :class="{ completed: index < currentStep, active: index === currentStep }">
        <div class="rounded-circle d-flex align-items-center justify-content-center mb-2" :class="[
          'border border-primary',
          index < currentStep ? 'bg-success text-white border-success'
            : index === currentStep ? 'bg-primary text-white border-primary'
              : 'bg-light text-secondary border-secondary'
        ]" style="width: 40px; height: 40px;">
          <font-awesome-icon v-if="index < currentStep" icon="check" />
          <span v-else class="text-ico">{{ index + 1 }}</span>
        </div>
        <small class="text-center">{{ label }}</small>
      </div>
    </div>

    <!-- Form -->
    <Form :validation-schema="schemas[currentStep]" :initial-values="formValues" @submit="handleSubmit"
      v-slot="{ validate, values }">
      <div v-if="currentStep === 0">
        <div class="row">
          <div class="col-lg-6">
            <h4>Personal Details</h4>
            <BaseInput name="fullName" label="Full Name" :is_required="true" placeholder="Enter Fullname" />
            <BaseSelect name="gender" label="Gender" :options="genderOptions" :is_required="true" />

            <!-- Flatpickr with modelValue -->
            <Field name="dob" v-slot="{ field, errors, meta }">
              <label class="form-label">Date of Birth <small class="text-danger">*</small></label>
              <flat-pickr v-model="field.value" :config="{ dateFormat: 'Y-m-d', allowInput: true }"
                class="form-control mb-3"
                :class="{ 'is-invalid': errors.length, 'is-valid': meta.valid && meta.touched }"
                placeholder="Select Date of Birth"
                @change="date => field.value = date && date[0] ? date[0].toISOString().slice(0, 10) : ''" />
              <div v-if="errors.length" class="invalid-feedback">{{ errors[0] }}</div>
            </Field>

            <BaseSelect name="maritalStatus" label="Marital Status" :options="maritalOptions" :is_required="true" />
            <BaseInput name="aadharNo" label="Aadhar Number" :is_required="true" placeholder="Enter Aadhaar Number" />
          </div>

          <div class="col-lg-6">
            <h4>Address Information</h4>
            <BaseInput name="contactNo" label="Contact Number" :is_required="true" placeholder="Enter Contact No" />
            <BaseInput name="altNo" label="Alternate Number" placeholder="Enter Alternate No" />
            <BaseTextArea name="presentAddress" label="Present Address" :is_required="true" />
            <BaseTextArea name="permanentAddress" label="Permanent Address" />
          </div>
        </div>
      </div>

      <div v-if="currentStep === 1">
        <h4>Account Info</h4>
        <BaseInput name="username" label="Username" :is_required="true" placeholder="Enter Username" />
        <BaseInput name="email" label="Email" type="email" :is_required="true" placeholder="Enter Email" />
        <BaseInput name="password" label="Password" type="text" :is_required="true" placeholder="Enter Password" />
      </div>

      <div v-if="currentStep === 2">
        <h4>Enter OTP</h4>
        <BaseInput name="otp" label="OTP" type="text" :is_required="true" />
      </div>

      <div class="mt-4">
        <button v-if="currentStep < schemas.length - 1" type="button" class="btn btn-primary" :disabled="isSendingOtp"
          @click="() => validateStep(validate, values)">
          {{ currentStep === 1 && isSendingOtp ? 'Sending OTP...' : 'Next' }}
        </button>

        <button v-else type="submit" class="btn btn-success" :disabled="isSubmitting">
          {{ isSubmitting ? 'Submitting...' : 'Submit OTP' }}
        </button>
      </div>
    </Form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import axios from 'axios'
import Swal from 'sweetalert2'
import { API_URL } from '@/config/path.js'

import FlatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'

import BaseInput from '@/components/Controls/BASEINPUT.vue'
import BaseSelect from '@/components/Controls/BASESELECT.vue'
import BaseTextArea from '@/components/Controls/BASETEXTAREA.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const currentStep = ref(0)
const isSendingOtp = ref(false)
const isSubmitting = ref(false)

const stepLabels = ['Personal Details', 'Account Info', 'OTP Verification']

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

const formValues = ref({
  fullName: '',
  gender: '',
  dob: null,
  maritalStatus: '',
  aadharNo: '',
  contactNo: '',
  altNo: '',
  presentAddress: '',
  permanentAddress: '',
  username: '',
  email: '',
  password: '',
  otp: ''
})

const phoneRegex = /^\d{10}$/
const aadharRegex = /^\d{12}$/

const schemas = [
  yup.object({
    fullName: yup.string().required('Full name is required'),
    gender: yup.string().required('Gender is required'),
    dob: yup
      .date()
      .transform((value, originalValue) => {
        if (typeof originalValue === 'string' && originalValue !== '') {
          const parsed = new Date(originalValue)
          return isNaN(parsed) ? null : parsed
        }
        return value
      })
      .required('Date of birth is required'),
    maritalStatus: yup.string().required('Marital status is required'),
    aadharNo: yup
      .string()
      .required('Aadhar number is required')
      .matches(/^\d{12}$/, 'Aadhar must be 12 digits'),
    contactNo: yup
      .string()
      .required('Contact number is required')
      .matches(/^\d{10}$/, 'Must be 10 digits'),
    altNo: yup
      .string()
      .nullable()
      .transform((v) => (v === '' ? null : v))
      .matches(/^\d{10}$/, {
        message: 'Alternate must be 10 digits',
        excludeEmptyString: true,
      }),
    presentAddress: yup.string().required('Present address is required'),
    permanentAddress: yup.string().nullable(),
  }),
  yup.object({
    username: yup.string().required('Username is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'At least 6 characters').required('Password is required')
  }),
  yup.object({
    otp: yup.string().required('OTP is required').matches(/^\d{6}$/, 'OTP must be 6 digits')
  })
]

const validateStep = async (validateFn, values) => {
  const { valid } = await validateFn()
  if (!valid) return

  formValues.value = { ...formValues.value, ...values }

  if (currentStep.value === 1) {
    isSendingOtp.value = true
    try {
      const res = await axios.post(`${API_URL}/users/profile/sendotp`, { email: values.email })
      if (res.status === 200) {
        Swal.fire('Success', 'OTP sent to your email', 'success')
        currentStep.value++
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to send OTP', 'error')
    } finally {
      isSendingOtp.value = false
    }
  } else {
    currentStep.value++
  }
}

const handleSubmit = async (values) => {
  formValues.value = { ...formValues.value, ...values }
  isSubmitting.value = true

  try {
    const res = await axios.post(`${API_URL}/users/profile/verifyotp`, {
      email: formValues.value.email,
      otp: formValues.value.otp
    })

    if (res.status === 200) {
      const payload = { ...formValues.value }
      delete payload.otp

      const userRes = await axios.post(`${API_URL}/users/profile/Create`, payload)
      if (userRes.status === 201) {
        currentStep.value = 0
        isSubmitting.value = false
        Swal.fire('Success', 'User created successfully', 'success')
      } else {
        isSubmitting.value = false
        Swal.fire('Error', 'Failed to create user', 'error')
      }
    } else {
      isSubmitting.value = false
      Swal.fire('Error', 'OTP verification failed', 'error')
    }
  } catch (err) {
    isSubmitting.value = false
    Swal.fire('Error', err.response?.data?.message || 'OTP verification failed', 'error')
  }
}
</script>

<style scoped>
.step-tracker {
  gap: 10px;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  text-align: center;
}

.step-item.active .text-ico {
  color: #ffffff;
}

.step-item.completed .text-ico {
  color: #000000;
}

.text-ico {
  color: #000000;
}

.dark .text-ico {
  color: #ffffff;
}
</style>

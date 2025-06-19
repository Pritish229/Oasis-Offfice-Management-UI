<template>
    <Form :validation-schema="schema" @submit="handleSubmit">
        <div class="card p-4">
            <div class="row">
                <div class="col-lg-6">
                    <h5>Personal info</h5>
                    <hr style="border-top: 1px solid black;" />
                    <BaseInput name="fullName" label="Full Name" :is_required="true" placeholder="Enter Fullname" />
                    <BaseSelect name="gender" label="Gender" :options="genderOptions" :is_required="true" />
                    <BaseDatePicker name="dob" placeholder="Select your date of birth" label="Date of Birth" />
                    <BaseSelect name="maritalStatus" label="Marital Status" :options="maritalOptions"
                        :is_required="true" />
                    <BaseInput name="aadharNo" label="Aadhar Number" :is_required="true"
                        placeholder="Enter Aadhaar Number" />
                </div>

                <div class="col-lg-6">
                    <h5>Address info</h5>
                    <hr style="border-top: 1px solid black;" />
                    <BaseInput name="contactNo" label="Contact Number" :is_required="true"
                        placeholder="Enter Contact No" />
                    <BaseInput name="altNo" label="Alternate Number" placeholder="Enter Alternate No" />
                    <BaseTextArea name="presentAddress" label="Present Address" :is_required="true" />
                    <BaseTextArea name="permanentAddress" label="Permanent Address" />
                </div>
            </div>
        </div>

        <div class="card p-4">
            <h5>Auth info</h5>
            <hr style="border-top: 1px solid black;" />
            <div class="row">
                <div class="col-lg-6">
                    <BaseInput name="username" label="Username" :is_required="true" placeholder="Enter Username" />
                    <BaseInput name="email" label="Email" type="email" :is_required="true" placeholder="Enter Email" />
                    <BaseInput name="password" label="Password" type="text" :is_required="true"
                        placeholder="Enter Password" />
                    <button class="btn btn-primary mt-3" type="submit">Save</button>
                </div>

                <div class="col-lg-6 pt-1">
                    <CropUpload v-model="imageFile" cropType="round" label="Profile Picture" :customAspectRatio="1.5"
                        :width="'100%'" :height="'200px'" :imageUrl="imagePreview"
                        @update:imageUrl="imagePreview = $event" />
                </div>
            </div>
        </div>
    </Form>
</template>

<script setup>
import { Form } from 'vee-validate'
import * as yup from 'yup'
import { ref } from 'vue'

import BaseInput from '@/components/Controls/BASEINPUT.vue'
import BaseSelect from '@/components/Controls/BASESELECT.vue'
import BaseTextArea from '@/components/Controls/BASETEXTAREA.vue'
import BaseDatePicker from '@/components/Controls/BaseDatePicker.vue'
import CropUpload from '@/components/Controls/CropUpload.vue'

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

    aadharNo: yup
        .string()
        .required('Aadhar Number is required')
        .matches(/^\d{12}$/, 'Aadhar Number must be exactly 12 digits'),

    contactNo: yup
        .string()
        .required('Contact Number is required')
        .matches(/^\d{10}$/, 'Contact Number must be exactly 10 digits'),

    altNo: yup
        .string()
        .nullable()
        .matches(/^\d{10}$/, 'Alternate Number must be 10 digits')
        .notRequired(),

    presentAddress: yup.string().required(),
    permanentAddress: yup.string().nullable(),

    username: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required(),
})

const handleSubmit = (values) => {
    const payload = { ...values }

    if (imageFile.value) {
        payload.profileImage = imageFile.value
    }

    console.log('Final Payload:', payload)
}
</script>
